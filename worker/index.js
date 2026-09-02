const CONTACT_TO = 'verify@idmetagroup.com';
const CONTACT_FROM = 'IDmeta Website <support@idmetagroup.com>';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

async function verifyTurnstile(token, ip, secret) {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  if (!resp.ok) return false;

  const data = await resp.json().catch(() => null);
  if (!data || !data.success) {
    console.error('Turnstile verification failed', data && data['error-codes']);
    return false;
  }
  return true;
}

async function handleContact(request, env) {
  if (!env.RESEND_API_KEY) {
    return Response.json({ error: 'Email is not configured.' }, { status: 500 });
  }
  if (!env.TURNSTILE_SECRET_KEY) {
    return Response.json({ error: 'Verification is not configured.' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const turnstileToken = (body.turnstileToken || body['cf-turnstile-response'] || '').trim();
  if (!turnstileToken) {
    return Response.json({ error: 'Please complete the verification challenge.' }, { status: 400 });
  }

  const passed = await verifyTurnstile(
    turnstileToken,
    request.headers.get('CF-Connecting-IP'),
    env.TURNSTILE_SECRET_KEY,
  );
  if (!passed) {
    return Response.json({ error: 'Verification failed. Please try again.' }, { status: 403 });
  }

  const name = (body.name || '').trim();
  const company = (body.company || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const message = (body.message || '').trim();

  if (!name || !company || !email) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const text = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    '',
    'Message:',
    message || '(no message provided)',
  ].filter(Boolean).join('\n');

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
    <p><strong>Message:</strong><br>${escapeHtml(message || '(no message provided)').replace(/\n/g, '<br>')}</p>
  `;

  const resendResp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      reply_to: email,
      subject: 'New Website Contact Form Submission',
      text,
      html,
    }),
  });

  if (!resendResp.ok) {
    const errText = await resendResp.text().catch(() => '');
    console.error('Resend error', resendResp.status, errText);
    return Response.json({ error: 'Failed to send message.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
