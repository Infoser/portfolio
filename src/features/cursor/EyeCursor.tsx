import { useEffect, useRef } from 'react';
import { EYE_CURSOR_DEFAULTS } from './config';
import { EyeCursorSprite } from './EyeCursorSprite';

type CursorState = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  velX: number;
  velY: number;
  lastMoveAt: number;
  blinkUntil: number;
  renderX: number;
  renderY: number;
};

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export function EyeCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorLayerRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const blinkGRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (isTouchDevice()) return;

    const state: CursorState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prevX: 0,
      prevY: 0,
      velX: 0,
      velY: 0,
      lastMoveAt: performance.now(),
      blinkUntil: 0,
      renderX: window.innerWidth / 2,
      renderY: window.innerHeight / 2,
    };

    const onMove = (e: PointerEvent) => {
      state.x = e.clientX;
      state.y = e.clientY;
      state.lastMoveAt = performance.now();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.body.style.cursor = 'none';

    let raf = 0;
    const loop = () => {
      const now = performance.now();

      state.velX = (state.x - state.prevX) * 0.35 + state.velX * EYE_CURSOR_DEFAULTS.velocityDecay;
      state.velY = (state.y - state.prevY) * 0.35 + state.velY * EYE_CURSOR_DEFAULTS.velocityDecay;
      state.velX = Math.max(-3, Math.min(3, state.velX));
      state.velY = Math.max(-3, Math.min(3, state.velY));
      state.prevX = state.x;
      state.prevY = state.y;

      state.renderX += (state.x - state.renderX) * 0.55;
      state.renderY += (state.y - state.renderY) * 0.55;

      const idleSince = now - state.lastMoveAt;
      let isBlinking = state.blinkUntil > now;
      if (idleSince > EYE_CURSOR_DEFAULTS.idleBlinkDelayMs && !isBlinking) {
        state.blinkUntil = now + EYE_CURSOR_DEFAULTS.blinkDurationMs;
        isBlinking = true;
      }

      const clampedDX = Math.max(
        -EYE_CURSOR_DEFAULTS.pupilMaxShift,
        Math.min(EYE_CURSOR_DEFAULTS.pupilMaxShift, state.velX * 0.45),
      );
      const clampedDY = Math.max(
        -EYE_CURSOR_DEFAULTS.pupilMaxShift,
        Math.min(EYE_CURSOR_DEFAULTS.pupilMaxShift, state.velY * 0.45),
      );

      const layer = cursorLayerRef.current;
      if (layer) {
        layer.style.transform = `translate3d(${state.renderX}px, ${state.renderY}px, 0)`;
      }
      const eyes = eyesRef.current;
      if (eyes) {
        eyes.style.transform = `translate(${(clampedDX * 2).toFixed(2)}px, ${(clampedDY * 2).toFixed(2)}px)`;
        eyes.style.opacity = isBlinking ? '0' : '1';
      }
      const blinkG = blinkGRef.current;
      if (blinkG) {
        blinkG.style.opacity = isBlinking ? '1' : '0';
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.body.style.cursor = '';
    };
  }, []);

  if (isTouchDevice()) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 2147483647,
      }}
    >
      <div ref={cursorLayerRef} style={{ position: 'absolute', top: 0, left: 0 }}>
        <EyeCursorSprite
          color="#0d0d12"
          eyesRef={eyesRef}
          blinkGRef={blinkGRef}
        />
      </div>
    </div>
  );
}
