import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle, cn } from '@/design-system';
import { useFirstVisitToast } from '@/lib/hooks/useFirstVisitToast';

const accentSwatches = [
  { name: 'Primary (Builder)', className: 'bg-primary text-primary-foreground' },
  { name: 'Accent (Debugger)', className: 'bg-accent text-accent-foreground' },
  { name: 'Research', className: 'bg-research text-research-foreground' },
  { name: 'Muted', className: 'bg-muted text-muted-foreground' },
  { name: 'Surface', className: 'bg-surface text-surface-foreground' },
  { name: 'Border', className: 'bg-border text-foreground' },
] as const;

const radiusScale = ['sm', 'md', 'lg', 'xl'] as const;

export default function Home() {
  useFirstVisitToast();

  useEffect(() => {
    document.title = 'infoser_portfolio — Ishan Kumar Sahu';
  }, []);

  return (
    <main className="min-h-dvh bg-background/0 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              infoser_portfolio
            </p>
            <h1 className="font-display text-4xl font-medium tracking-tight">
              Design System
              <span className="ml-2 animate-blink text-primary font-mono">_</span>
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Step 1 acceptance demo. Theme tokens, motion presets, and the cursor
          blink keyframe are wired. Toggle a theme — it persists across reloads
          and respects the system preference on first visit.
        </p>

        <p className="text-sm text-muted-foreground">
          <Link to="/playground" className="text-primary underline decoration-dotted underline-offset-4 hover:opacity-80">
            View the component playground →
          </Link>
        </p>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Accent Palette
          </h2>
          <ul role="list" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {accentSwatches.map((swatch) => (
              <li
                key={swatch.name}
                className={cn(
                  'flex items-center justify-between rounded-md px-3 py-2 font-mono text-xs',
                  swatch.className,
                )}
              >
                <span>{swatch.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Radius Scale
          </h2>
          <div className="flex items-end gap-3">
            {radiusScale.map((r) => (
              <div key={r} className="flex flex-col items-center gap-1">
                <div
                  style={{ borderRadius: `var(--radius-${r})` }}
                  className="size-12 border border-primary bg-primary/10"
                />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {r}
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-4 font-mono text-xs text-muted-foreground">
          <span className="text-primary">●</span> design system online
        </footer>
      </div>
    </main>
  );
}
