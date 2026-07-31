import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Gmail SMTP credentials. Set these in Vercel Project Settings →
// Environment Variables (never commit them to git). The sender account
// must have 2FA enabled and a dedicated App Password (NOT the account's
// primary password) assigned.
//
//   GMAIL_USER          — sender address, e.g. "issuatresearch080@gmail.com"
//   GMAIL_APP_PASSWORD  — 16-char App Password from myaccount.google.com/apppasswords
//   CONTACT_RECIPIENT   — destination address, defaults to GMAIL_USER
//
// Response: 200 on success, 4xx for validation/rate-limit, 5xx for SMTP
// failure. The server never echoes the SMTP error back to the visitor
// (could leak internal state) — those details go to server logs only.

type ContactPayload = {
  name: string;
  email: string;
  purpose: string;
  message: string;
  // Honeypot: `company` is invisible to humans but typically filled by bots.
  // Any non-empty value ⇒ reject silently as 202 (looks accepted, dropped).
  company?: string;
};

const MAX_NAME = 100;
const MAX_PURPOSE = 120;
const MAX_MESSAGE = 4000;
const MAX_EMAIL = 254; // RFC 5321

// In-memory per-IP rate limit. Resets when the serverless instance is
// recycled. Vercel may run multiple instances in parallel, so this is a
// soft limit, not a hard cap — but it stops casual floods.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(req: VercelRequest): string {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf) return xf.split(',')[0]!.trim();
  if (Array.isArray(xf) && xf.length) return xf[0]!.trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

function bad(res: VercelResponse, status: number, message: string) {
  return res.status(status).setHeader('Content-Type', 'application/json').json({ error: message });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return bad(res, 405, 'Method Not Allowed');
  }

  const body = (req.body ?? {}) as Partial<ContactPayload>;
  const ip = clientIp(req);

  // Honeypot: silently drop bots. Respond 202 so they think it worked.
  if (body.company && body.company.trim().length > 0) {
    return res.status(202).json({ ok: true });
  }

  // Env guard
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const recipient = process.env.CONTACT_RECIPIENT || gmailUser;
  if (!gmailUser || !gmailAppPassword || !recipient) {
    console.error('[contact] Missing env: GMAIL_USER / GMAIL_APP_PASSWORD / CONTACT_RECIPIENT');
    return bad(res, 503, 'Contact form is not configured. Please try again later.');
  }

  // Soft rate limit
  if (rateLimited(ip)) {
    return bad(res, 429, 'Too many requests. Please wait a minute and try again.');
  }

  // Validate
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const purpose = typeof body.purpose === 'string' ? body.purpose.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || name.length > MAX_NAME) {
    return bad(res, 400, 'Please provide your name (up to 100 characters).');
  }
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return bad(res, 400, 'Please provide a valid email address.');
  }
  if (!purpose || purpose.length > MAX_PURPOSE) {
    return bad(res, 400, 'Please choose or write a purpose (up to 120 characters).');
  }
  if (!message || message.length > MAX_MESSAGE) {
    return bad(res, 400, 'Please write a message (up to 4000 characters).');
  }

  // Compose
  const subject = `[Portfolio Contact] ${purpose}${name ? ` — from ${name}` : ''}`;
  const textBody = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Purpose: ${purpose}`,
    '',
    'Message:',
    message,
    '',
    `— Sent from your portfolio contact form`,
  ].join('\n');
  const htmlBody = [
    `<div style="font-family:-apple-system,Segoe_UI,Roboto,sans-serif;font-size:14px;line-height:1.55;color:#1a1a1a">`,
    `<p><strong>New contact form submission</strong></p>`,
    `<table style="border-spacing:0 4px">`,
    `<tr><td style="color:#666;width:80px">Name</td><td>${escapeHtml(name)}</td></tr>`,
    `<tr><td style="color:#666">Email</td><td><a href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a></td></tr>`,
    `<tr><td style="color:#666">Purpose</td><td>${escapeHtml(purpose)}</td></tr>`,
    `</table>`,
    `<hr style="margin:12px 0;border:0;border-top:1px solid #eaeaea"/>`,
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    `<hr style="margin:12px 0;border:0;border-top:1px solid #eaeaea"/>`,
    `<p style="color:#999;font-size:12px">Sent from your portfolio contact form.</p>`,
    `</div>`,
  ].join('\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailAppPassword },
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: recipient,
      // Reply-To is the visitor's address so you can hit Reply in Gmail.
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    // Don't leak SMTP internals to the visitor — log them for you instead.
    console.error('[contact] sendMail failed:', err instanceof Error ? err.message : err);
    return bad(res, 502, 'Could not send your message right now. Please try again or email me directly.');
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&#38;')
    .replace(/</g, '&#60;')
    .replace(/>/g, '&#62;')
    .replace(/"/g, '&#34;')
    .replace(/'/g, '&#39;')
}
function escapeAttr(s: string): string {
  return s.replace(/"/g, '&#34;').replace(/'/g, '&#39;')
}
