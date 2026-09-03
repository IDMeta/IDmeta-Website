import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.env.PORT || 3000);
const contactTo = process.env.CONTACT_TO || 'verify@idmetagroup.com';
const contactFrom = process.env.CONTACT_FROM || 'IDmeta Website <support@idmetagroup.com>';
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMax = 5;
const requests = new Map();
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

function respond(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function allowedRequest(ip) {
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter((time) => now - time < rateLimitWindowMs);
  if (recent.length >= rateLimitMax) return false;
  recent.push(now);
  requests.set(ip, recent);
  return true;
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 32768) throw new Error('Request body too large');
  }
  return JSON.parse(raw);
}

async function verifyTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET_KEY) return null;
  const form = new FormData();
  form.append('secret', process.env.TURNSTILE_SECRET_KEY);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

async function handleContact(req, res) {
  if (!process.env.RESEND_API_KEY) return respond(res, 503, { error: 'Email is not configured.' });
  if (!process.env.TURNSTILE_SECRET_KEY) return respond(res, 503, { error: 'Verification is not configured.' });
  if (!allowedRequest(clientIp(req))) return respond(res, 429, { error: 'Too many messages. Please try again later.' });
  let body;
  try { body = await readJson(req); } catch { return respond(res, 400, { error: 'Invalid request body.' }); }
  const name = String(body.name || '').trim();
  const company = String(body.company || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();
  const turnstileToken = String(body.turnstileToken || '').trim();
  if (!name || !company || !email) return respond(res, 400, { error: 'Missing required fields.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond(res, 400, { error: 'Invalid email address.' });
  if (!turnstileToken) return respond(res, 400, { error: 'Please complete the verification challenge.' });
  if (!await verifyTurnstile(turnstileToken, clientIp(req))) return respond(res, 403, { error: 'Verification failed. Please try again.' });

  const text = [`Name: ${name}`, `Company: ${company}`, `Email: ${email}`, phone ? `Phone: ${phone}` : '', '', 'Message:', message || '(no message provided)'].filter(Boolean).join('\n');
  const html = `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Company:</strong> ${escapeHtml(company)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p>${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}<p><strong>Message:</strong><br>${escapeHtml(message || '(no message provided)').replace(/\n/g, '<br>')}</p>`;
  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: contactFrom, to: contactTo, reply_to: email, subject: 'New Website Contact Form Submission', text, html }),
    });
    if (!emailResponse.ok) {
      console.error('Resend error:', emailResponse.status, await emailResponse.text());
      return respond(res, 502, { error: 'Unable to send your message. Please try again later.' });
    }
  } catch (error) {
    console.error('Email delivery error:', error);
    return respond(res, 502, { error: 'Unable to send your message. Please try again later.' });
  }
  return respond(res, 200, { ok: true });
}

async function serveAsset(pathname, res) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  const candidate = resolve(root, decoded === '/' ? 'index.html' : `.${decoded}`);
  const extension = extname(candidate).toLowerCase();
  if (!candidate.startsWith(`${root}${sep}`) || !mime[extension]) { res.writeHead(404); return res.end('Not found'); }
  try {
    const content = await readFile(candidate);
    res.writeHead(200, { 'Content-Type': mime[extension], 'X-Content-Type-Options': 'nosniff' });
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/contact') {
    if (req.method !== 'POST') return respond(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
    return handleContact(req, res);
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return respond(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET, HEAD' });
  return serveAsset(url.pathname, res);
}).listen(port, '127.0.0.1', () => console.log(`IDmeta website listening on http://127.0.0.1:${port}`));
