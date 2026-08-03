import { useEffect, useRef } from 'react';
import { utils } from 'animejs';
import { isFeatureEnabled } from '@/config/features';

// Custom pixel-art cursor: a black Windows 95-style arrow with a 1px white
// stroke (readable on both themes). The arrow is smoothed with anime.js
// `utils.damp` — frame-rate-independent exponential interpolation — so the
// lag feels identical on 60/120/144 Hz displays and the arrow never lags
// behind by more than ~80ms regardless of refresh rate.
//
// Gate: only mounts when `pointer: fine`. Touch devices keep their native
// cursor/touch input.
//
// While active the native cursor is hidden GLOBALLY — not just on <body>.
// Setting `cursor: none` only on <body> is insufficient because Tailwind
// `cursor-pointer` (and similar) classes set `cursor` on the element they're
// applied to, which overrides the inherited value. To make every element
// show no native cursor while our custom arrow is active, we inject a
// global `<style>` tag with a high-specificity universal selector. The tag
// is removed on unmount, restoring native cursor behaviour everywhere.
const ARROW_DAMP = 0.18; // 0..1 — higher = snappier, lower = more lag
const ARROW_SIZE_PX = 20;

// Windows 95 Standard arrow, single SVG path. Black fill, 1px white stroke
// — keeps the silhouette visible on any background without a separate
// outline layer. Coordinates are the canonical 32x32 Win95 arrow shape.
const ARROW_SVG = (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    stroke="#ffffff"
    strokeWidth={1}
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      d="M 1 1 L 1 23 L 6 18 L 9 25 L 13 23 L 10 16 L 17 16 Z"
      fill="#000000"
    />
  </svg>
);

export function PixelCursor() {
  const enabled = isFeatureEnabled('pixelCursor');
  const arrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Touch / no-mouse devices keep their native cursor and touch input.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const arrow = arrowRef.current;
    if (!arrow) return;

    // Inject a global rule that hides the native cursor on EVERY element,
    // including those with `cursor-pointer` / `cursor-text` Tailwind
    // classes (which set `cursor` directly and would otherwise override
    // the inherited `none` from <body>). Removed on unmount.
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-pixel-cursor', '');
    styleEl.textContent = 'html, body, * { cursor: none !important; }';
    document.head.appendChild(styleEl);

    const damp = utils.damp;

    // Latest pointer sample (raw, no smoothing).
    let px = -1;
    let py = -1;
    // Arrow's smoothed position (the one actually rendered).
    let ax = -1;
    let ay = -1;
    let hasMoved = false;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      hasMoved = true;
    };

    let raf = 0;
    let lastFrameTime = performance.now();

    const frame = (now: number) => {
      const dt = now - lastFrameTime;
      lastFrameTime = now;

      if (hasMoved) {
        // Snap on first sample so the arrow doesn't fly in from a sentinel
        // corner (-1, -1) and damp-catch-up across the whole page on entry.
        if (ax < 0 || ay < 0) {
          ax = px;
          ay = py;
        } else {
          ax = damp(ax, px, dt, ARROW_DAMP);
          ay = damp(ay, py, dt, ARROW_DAMP);
        }
        arrow.style.transform = `translate(${ax}px, ${ay}px)`;
      }

      raf = requestAnimationFrame(frame);
    };

    const onBlur = () => {
      arrow.style.opacity = '0';
    };
    const onFocus = () => {
      arrow.style.opacity = '1';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      styleEl.remove();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
      <div
        ref={arrowRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          width: ARROW_SIZE_PX,
          height: ARROW_SIZE_PX,
          pointerEvents: 'none',
          willChange: 'transform',
          left: 0,
          top: 0,
          transform: 'translate(-9999px, -9999px)',
        }}
      >
        {ARROW_SVG}
      </div>
    </div>
  );
}
