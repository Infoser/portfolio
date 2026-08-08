import type { ComponentType, MouseEvent } from 'react';
import { animate } from 'animejs';
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

  // Tracks in-flight animations so consecutive outline clicks cancel the
  // previous ones rather than stacking/conflicting. The anime.js
  // `Animation` instances expose `.pause()` for this; we keep the latest
  // scroll + highlight ones here.
  let scrollAnim: { pause: () => void } | null = null;
  let highlightAnim: { pause: () => void } | null = null;

  const handleJump = (id: string) => (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    // Find the scroll container — the parent `.overflow-y-auto` motion.div
    // in EditorArea. Walk up from the rail until we find an element with
    // overflow. (Done at click-time rather than via a ref because the
    // container can change identity across framer-motion remounts.)
    let container: HTMLElement | null = target.parentElement;
    while (container && getComputedStyle(container).overflowY !== 'auto') {
      container = container.parentElement;
    }
    if (!container) return;

    // Target's offset within the scroll container = how far down we need
    // to scroll to bring it to the top of the viewport (with a small
    // top-padding so the heading isn't flush against the edge).
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const SCROLL_PADDING = 16;
    const targetTop =
      container.scrollTop + (targetRect.top - containerRect.top) - SCROLL_PADDING;

    // Note: we deliberately do NOT honour prefers-reduced-motion here.
    // Unlike the custom cursor (which is pure decoration), the outline
    // jump is functional navigation — the user clicked a link to get to
    // a specific entry, and a smooth scroll helps them track where they
    // ended up. Snap-jumping is disorienting regardless of motion
    // preference. The 600ms ease-out is short and informative, not
    // decorative.

    // Cancel any in-flight scroll + highlight, then start new ones.
    if (scrollAnim) scrollAnim.pause();
    if (highlightAnim) {
      highlightAnim.pause();
      // Inline opacity set by the prior highlight may be mid-flight at a
      // non-1 value; revert so the next target starts from full opacity.
      (target as HTMLElement).style.opacity = '';
    }
    // Scroll: anime.js animates the container's `scrollTop` directly —
    // bypassing the browser's native smooth-scroll entirely, so the feel
    // is identical across browsers and doesn't get swallowed by
    // framer-motion's entry transform race.
    scrollAnim = animate(container, {
      scrollTop: targetTop,
      duration: 600,
      ease: 'outCubic',
      autoplay: true,
      onComplete: () => {
        scrollAnim = null;
        // Fade-out then fade-in pulse on the target card — draws the eye
        // to the destination once the rolling scroll settles. Keyframes
        // [1 → 0.35 → 1] over ~520ms with an ease-in-out curve.
        highlightAnim = animate(target, {
          opacity: [1, 0.35, 1],
          duration: 520,
          ease: 'inOutQuad',
          autoplay: true,
          onComplete: () => {
            // Leave no inline style residue — framer-motion owns opacity
            // for the initial reveal; our pulse must not override it.
            (target as HTMLElement).style.opacity = '';
            highlightAnim = null;
          },
        }) as unknown as { pause: () => void };
      },
    }) as unknown as { pause: () => void };
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
