import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual as nodeTimingSafeEqual } from 'crypto';

const ADMIN_SLUG = process.env.ADMIN_SLUG ?? '';

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).setHeader('Content-Type', 'text/plain').send('Method Not Allowed');
    return;
  }

  // Guard: refuse to gate anything if the secret isn't configured or is too
  // short to be a credible secret. Without this, an empty ADMIN_SLUG would
  // make the gate pass for an empty slug.
  if (!ADMIN_SLUG || ADMIN_SLUG.length < 32) {
    res.status(404).setHeader('Content-Type', 'text/plain').send('Not Found');
    return;
  }

  // Slug is delivered ONLY via the path. The previous code also accepted
  // ?slug=… from the query string, which lands in browser history, Referer
  // headers, and Vercel access logs — exposing the secret. Per the Vite
  // rewrite { source: '/__admin__/:slug', destination: '/api/admin-gate' },
  // Vercel surfaces the slug via req.query.slug; we depend on that and
  // refuse to fall back to anything else.
  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';

  if (!slug || slug.length > 200) {
    res.status(404).setHeader('Content-Type', 'text/plain').send('Not Found');
    return;
  }

  if (!safeSlugEquals(slug, ADMIN_SLUG)) {
    res.status(404).setHeader('Content-Type', 'text/plain').send('Not Found');
    return;
  }

  // Success — serve the bootstrap page that sets the sessionStorage flag
  // and redirects to the SPA's admin route. The SPA's AdminGate reads that
  // flag as defense in depth (the server has already validated the slug).
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

/**
 * Constant-time string comparison that does NOT leak the secret's length.
 *
 * The previous implementation short-circuited on length mismatch
 * (`if (a.length !== b.length) return false`), so an attacker probing slugs
 * of varying lengths could determine the exact length of ADMIN_SLUG (~5 bits
 * of information) from the timing delta. We instead:
 *
 *   1. Compare both candidate and secret against themselves in constant time
 *      so every request pays the same byte-loop cost regardless of length.
 *   2. Use Node's crypto.timingSafeEqual on equal-length buffers only — that
 *      primitive is documented constant-time.
 *   3. Return false on length mismatch without leaking it through wall-clock
 *      (because step 1 already spent the same time on the self-comparison).
 */
function safeSlugEquals(candidate: string, secret: string): boolean {
  const a = Buffer.from(candidate, 'utf8');
  const b = Buffer.from(secret, 'utf8');

  if (a.length !== b.length) {
    // Still spend the time of comparing b against itself so an attacker can't
    // distinguish "wrong length" from "wrong bytes" by timing. The result is
    // discarded by ANDing with a false-length flag.
    nodeTimingSafeEqual(b, b);
    return false;
  }
  return nodeTimingSafeEqual(a, b);
}

export default handler;
