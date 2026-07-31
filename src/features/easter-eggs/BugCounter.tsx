import { useEffect, useRef } from 'react';
import { Bug } from 'lucide-react';
import { useEasterEggStore } from '@/store/easter-eggs';
import { isFeatureEnabled } from '@/config/features';

// Accumulator thresholds are measured in pointer-movement pixel-units summed
// across pointermove events (`Math.abs(movementX) + Math.abs(movementY)`), NOT
// in milliseconds despite the original `_MS` suffix — that naming was a
// code-clarity hazard that made the values look time-based. Renamed to
// `_UNITS` to reflect what they actually compare against.
const ACCUMULATOR_CAP_UNITS = 2000;
const ACTIVATION_THRESHOLD_UNITS = 1200;

export function BugCounter() {
  const enabled = isFeatureEnabled('bugCounter');
  const bugs = useEasterEggStore((s) => s.bugs);
  const incrementBugs = useEasterEggStore((s) => s.incrementBugs);
  const accumulatorRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      accumulatorRef.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    };

    const loop = () => {
      const now = performance.now();
      if (lastTickRef.current == null) lastTickRef.current = now;
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      accumulatorRef.current = Math.min(accumulatorRef.current, ACCUMULATOR_CAP_UNITS * 10);
      if (accumulatorRef.current >= ACTIVATION_THRESHOLD_UNITS) {
        accumulatorRef.current = 0;
        incrementBugs();
      } else {
        accumulatorRef.current = Math.max(0, accumulatorRef.current - delta * 0.5);
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, incrementBugs]);

  if (!enabled) return null;

  return (
    <span
      className="flex items-center gap-1.5 px-2 h-full"
      title="debug-flavoured bug counter (hover movement accumulator)"
      aria-label={`${bugs} bugs squashed`}
    >
      <Bug className="size-3.5 text-primary" aria-hidden="true" />
      <span className="tabular-nums">{bugs}</span>
      <span className="text-muted-foreground">bugs</span>
    </span>
  );
}
