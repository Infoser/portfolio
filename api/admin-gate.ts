import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_SLUG = process.env.ADMIN_SLUG ?? '';

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

  const adminPath = '/__admin__';
  const bootstrap = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Opening admin…</title>
</head>
<body>
<script>
(function () {
  try {
    sessionStorage.setItem('__ADMIN__', '1');
  } catch (e) {}
  window.location.replace(${JSON.stringify(adminPath)});
})();
</script>
<noscript>
  <meta http-equiv="refresh" content="0; url=${adminPath}" />
  <a href="${adminPath}">Continue to admin</a>.
</noscript>
</body>
</html>`;

  res
    .setHeader('Content-Type', 'text/html; charset=utf-8')
    .setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    .setHeader('X-Content-Type-Options', 'nosniff')
    .setHeader('Referrer-Policy', 'no-referrer')
    .status(200)
    .send(bootstrap);
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
