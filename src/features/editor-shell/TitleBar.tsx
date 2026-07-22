import { useTabsStore } from '@/store/tabs';
import { SECTIONS_MANIFEST } from '@/config/sections-manifest';
import { cn } from '@/lib/utils';

const DOTS: Array<{ color: string; label: string }> = [
  { color: '#ff5f57', label: 'Close' },
  { color: '#febc2e', label: 'Minimize' },
  { color: '#28c840', label: 'Zoom' },
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
      {/* Left: macOS traffic lights */}
      <div className="flex items-center gap-2" data-tauri-drag-region>
        {DOTS.map(({ color, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            title={label}
            className={cn(
              'flex size-3 items-center justify-center rounded-full',
              'transition-opacity hover:opacity-90',
            )}
            style={{ backgroundColor: color }}
            onClick={onOpenMenu}
            tabIndex={-1}
          >
            <span className="opacity-0 text-[8px] leading-none text-black/70 group-hover:opacity-100">
              ×
            </span>
          </button>
        ))}
      </div>

      {/* Center: filename + brand */}
      <div className="pointer-events-none flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="hidden md:inline">ishan-portfolio</span>
        <span aria-hidden className="hidden md:inline text-muted-foreground/40">—</span>
        <span className="text-foreground/80 normal-case tracking-normal">{fileName}</span>
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
