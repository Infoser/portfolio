import type { ComponentType, MouseEvent } from 'react';
import { SECTIONS_MANIFEST, type SectionKey } from '@/config/sections-manifest';
import type { StructuredListContent } from '@/types/sections';
import { useSection } from '@/lib/hooks/useSection';
import { useTabsStore } from '@/store/tabs';
import { ArrowDownRight } from 'lucide-react';

type Row = { id: string; label: string; sublabel?: string };

/**
 * Outline rail — fills the right gutter on wide screens.
 *
 * For sections backed by a structured-list (experience, education,
 * leadership, achievements, projects) the rail lists each entry's title.
 * For other section kinds (markdown/json/toml) it shows the section's
 * manifest label + extension as a single "file" entry.
 *
 * Clicking a row jumps the editor pane to the matching card. Each entry
 * in StructuredListRenderer / ProjectRenderer is rendered with
 * `id={entry.id}`, and this rail triggers
 * `document.getElementById(id).scrollIntoView(...)` on click.
 *
 * Implementation note: this is a thin wrapper around OutlineRailInner that
 * only mounts the inner (hook-using) component once a tab is active. This
 * avoids (a) a wasted `useSection('projects')` fetch on initial load when
 * no tab is open, and (b) one render of stale rows from the previous
 * section on tab switch — the inner component is keyed by `activeTab`, so
 * each tab switch produces a fresh hook state initialization.
 */
export function OutlineRail() {
  const activeTab = useTabsStore((s) => s.activeTab);
  if (!activeTab) return null;
  return <OutlineRailInner key={activeTab} activeTab={activeTab} />;
}

type InnerProps = { activeTab: SectionKey };

function OutlineRailInner({ activeTab }: InnerProps) {
  const { content } = useSection(activeTab);
  const entry = SECTIONS_MANIFEST[activeTab];
  const Icon = entry.icon as ComponentType<{ className?: string }>;

  let rows: Row[] = [];
  if (content && content.kind === 'structured-list') {
    rows = (content as StructuredListContent).entries.map((e) => ({
      id: e.id,
      label: e.title,
      sublabel: e.subtitle,
    }));
  } else {
    rows = [{ id: entry.label, label: entry.label, sublabel: `.${entry.extension}` }];
  }

  const handleJump = (id: string) => (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside
      aria-label={`${entry.label} outline`}
      className="hidden w-64 shrink-0 border-l border-border bg-surface/60 lg:block"
    >
      <div className="flex h-full flex-col gap-2 px-3 py-4">
        <p className="px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Outline
        </p>
        <div className="flex items-center gap-2 px-1 font-mono text-xs text-muted-foreground">
          <Icon className="size-3.5" />
          <span className="truncate">{entry.label}.{entry.extension}</span>
        </div>
        <ul role="list" className="flex flex-col gap-0.5">
          {rows.map((row, idx) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={handleJump(row.id)}
                title={`Jump to ${row.label}`}
                aria-label={`Jump to ${row.label}`}
                className="group flex w-full items-start gap-2 rounded px-1 py-1 text-left text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="mt-0.5 font-mono text-[10px] text-muted-foreground/60">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-foreground/80 group-hover:text-primary group-hover:underline group-hover:decoration-dotted group-hover:underline-offset-4">
                    {row.label}
                  </span>
                  {row.sublabel && (
                    <span className="truncate text-[10px] text-muted-foreground/70">
                      {row.sublabel}
                    </span>
                  )}
                </div>
                <ArrowDownRight
                  className="ml-auto mt-0.5 size-3 shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
