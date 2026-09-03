const contactTo = process.env.CONTACT_TO || 'verify@idmetagroup.com';
const contactFrom = process.env.CONTACT_FROM || 'IDmeta Website <support@idmetagroup.com>';
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMax = 5;
const requests = new Map();

function json(body, status = 200, headers = {}) {
  return Response.json(body, { status, headers });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function allowedRequest(ip) {
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter((time) => now - time < rateLimitWindowMs);
  if (recent.length >= rateLimitMax) return false;
  recent.push(now);
  requests.set(ip, recent);
  return true;
}

async function readJson(request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 32768) throw new Error('Request body too large');
  const raw = await request.text();
  if (raw.length > 32768) throw new Error('Request body too large');
  return JSON.parse(raw);
}

async function verifyTurnstile(token, ip) {
  const form = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (ip && ip !== 'unknown') form.set('remoteip', ip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: form,
    });
    if (!response.ok) return false;
    return (await response.json()).success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }
  if (!process.env.RESEND_API_KEY) return json({ error: 'Email is not configured.' }, 503);
  if (!process.env.TURNSTILE_SECRET_KEY) return json({ error: 'Verification is not configured.' }, 503);

  const ip = clientIp(request);
  if (!allowedRequest(ip)) return json({ error: 'Too many messages. Please try again later.' }, 429);

  let body;
  try {
    body = await readJson(request);
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const name = String(body.name || '').trim();
  const company = String(body.company || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();
  const turnstileToken = String(body.turnstileToken || '').trim();

  if (!name || !company || !email) return json({ error: 'Missing required fields.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email address.' }, 400);
  if (!turnstileToken) return json({ error: 'Please complete the verification challenge.' }, 400);
  if (!await verifyTurnstile(turnstileToken, ip)) return json({ error: 'Verification failed. Please try again.' }, 403);

  const text = [
    `Name: ${name}`, `Company: ${company}`, `Email: ${email}`, phone ? `Phone: ${phone}` : '', '',
    'Message:', message || '(no message provided)',
  ].filter(Boolean).join('\n');
  const html = `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Company:</strong> ${escapeHtml(company)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p>${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}<p><strong>Message:</strong><br>${escapeHtml(message || '(no message provided)').replace(/\n/g, '<br>')}</p>`;

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: contactFrom, to: contactTo, reply_to: email,
        subject: 'New Website Contact Form Submission', text, html,
      }),
    });
    if (!emailResponse.ok) {
      console.error('Resend error:', emailResponse.status, await emailResponse.text());
      return json({ error: 'Unable to send your message. Please try again later.' }, 502);
    }
  } catch (error) {
    console.error('Email delivery error:', error);
    return json({ error: 'Unable to send your message. Please try again later.' }, 502);
  }

  return json({ ok: true });
}
