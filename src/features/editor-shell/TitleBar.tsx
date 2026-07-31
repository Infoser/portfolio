import { useTabsStore } from '@/store/tabs';
import { SECTIONS_MANIFEST } from '@/config/sections-manifest';
import { cn } from '@/lib/utils';

const DOTS: Array<{ color: string }> = [
  { color: '#ff5f57' },
  { color: '#febc2e' },
  { color: '#28c840' },
];

type TitleBarProps = {
  onOpenMenu?: () => void;
};

export function TitleBar({ onOpenMenu }: TitleBarProps) {
  const activeTab = useTabsStore((s) => s.activeTab);
  const entry = activeTab ? SECTIONS_MANIFEST[activeTab] : null;
  const fileName = entry ? `${entry.label.toLowerCase()}.${entry.extension}` : 'workspace';

  return (
    <div
      role="banner"
      className="flex h-9 shrink-0 items-center justify-between border-b border-border bg-surface pl-3 pr-3 select-none [user-select:none]"
    >
      {/* Left: macOS traffic lights. The three dots are decorative chrome —
          they don't actually close/minimize/zoom anything. All three open
          the mobile Browse drawer (onOpenMenu). Previously each had a
          misleading aria-label/title of "Close","Minimize","Zoom", which
          lied to assistive tech. The wrapper now carries a single accurate
          label; the individual buttons are aria-hidden and unlabelled. */}
      <div
        className="flex items-center gap-2"
        data-tauri-drag-region
        role="group"
        aria-label="Browse sections (opens the file-tree drawer)"
      >
        {DOTS.map(({ color }, idx) => (
          <button
            key={idx}
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className={cn(
              'flex size-3 items-center justify-center rounded-full',
              'transition-opacity hover:opacity-90',
            )}
            style={{ backgroundColor: color }}
            onClick={onOpenMenu}
          />
        ))}
      </div>

      {/* Center: filename + brand */}
      <div className="pointer-events-none flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="hidden md:inline">ishan-portfolio</span>
        <span aria-hidden className="hidden md:inline text-muted-foreground/40">—</span>
        <span className="truncate text-foreground/80 normal-case tracking-normal">{fileName}</span>
      </div>

      {/* Right: pixel-art brand block */}
      <div className="flex items-center gap-1" aria-hidden>
        <span className="size-2 bg-primary" />
        <span className="size-2 bg-accent" />
        <span className="size-2 bg-research" />
      </div>
    </div>
  );
}
