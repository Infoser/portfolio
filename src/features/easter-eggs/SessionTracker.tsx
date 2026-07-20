import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useEasterEggStore } from '@/store/easter-eggs';
import { isFeatureEnabled } from '@/config/features';

const format = (totalSeconds: number): string => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export function SessionTracker() {
  const enabled = isFeatureEnabled('sessionTracker');
  const sessionSeconds = useEasterEggStore((s) => s.sessionSeconds);
  const tickSession = useEasterEggStore((s) => s.tickSession);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(tickSession, 1000);
    return () => window.clearInterval(id);
  }, [enabled, tickSession]);

  if (!enabled) return null;

  return (
    <span
      className="flex items-center gap-1.5 px-2 h-full"
      title="session timer (visual nod to the debugging grind)"
      aria-label={`session time ${format(sessionSeconds)}`}
    >
      <Clock className="size-3.5 text-muted-foreground" aria-hidden="true" />
      <span className="tabular-nums">{format(sessionSeconds)}</span>
    </span>
  );
}
