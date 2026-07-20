import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ADMIN_SLUG = process.env.ADMIN_SLUG ?? '';
const SIZE_LIMIT = 4 * 1024 * 1024;

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).setHeader('Content-Type', 'text/plain').send('Method Not Allowed');
    return;
  }

  if (!ADMIN_SLUG || ADMIN_SLUG.length < 32) {
    res.status(404).setHeader('Content-Type', 'text/plain').send('Not Found');
    return;
  }

  const slugFromPath = (req.url ?? '').split('/__admin__/')[1]?.split('?')[0] ?? '';
  const slugFromQuery = (req.query.slug as string | undefined) ?? '';
  const slug = slugFromQuery || slugFromPath;

  if (!slug || typeof slug !== 'string' || slug.length > 200) {
    res.status(404).setHeader('Content-Type', 'text/plain').send('Not Found');
    return;
  }

  if (!timingSafeEqual(slug, ADMIN_SLUG)) {
    res.status(404).setHeader('Content-Type', 'text/plain').send('Not Found');
    return;
  }

  let html: string;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const publicDir = resolve(here, '..', 'public');
    html = readFileSync(resolve(publicDir, 'index.html'), 'utf8');
  } catch {
    res.status(500).setHeader('Content-Type', 'text/plain').send('Admin shell not available.');
    return;
  }

  if (html.length > SIZE_LIMIT) {
    res.status(500).setHeader('Content-Type', 'text/plain').send('Admin shell too large.');
    return;
  }

  const injected = html.replace(
    '</head>',
    `<script>window.__ADMIN__ = 1; window.__ADMIN_SLUG__ = ${JSON.stringify(slug)};</script>\n</head>`,
  );

  res
    .setHeader('Content-Type', 'text/html; charset=utf-8')
    .setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    .setHeader('X-Content-Type-Options', 'nosniff')
    .setHeader('Referrer-Policy', 'no-referrer')
    .status(200)
    .send(injected);
};

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export default handler;
