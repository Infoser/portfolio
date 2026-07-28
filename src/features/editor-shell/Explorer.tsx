import { SECTIONS_MANIFEST, SECTION_KEYS, type SectionKey } from '@/config/sections-manifest';
import type { ComponentType } from 'react';
import { useTabsStore } from '@/store/tabs';
import { cn } from '@/lib/utils';

type ExplorerProps = {
  /** Called after a section is opened. Used by the mobile Browse drawer to
   * auto-close itself once a selection is made. */
  onAfterOpen?: () => void;
};

const FileIcon = ({ Icon, className }: { Icon: ComponentType<{ className?: string }>; className?: string }) => (
  <Icon className={cn('size-3.5', className)} />
);

/**
 * Flat file-tree of every section. Sections that contain a structured-list
 * (experience, projects, achievements, education, leadership) are no
 * longer expandable accordions — they render as a single file row, just
 * like the markdown/json/toml sections. The per-entry breakdown lives on
 * the right-side OutlineRail instead, where it doesn't duplicate the left
 * tree.
 */
export function Explorer({ onAfterOpen }: ExplorerProps) {
  const openTab = useTabsStore((s) => s.open);
  const activeTab = useTabsStore((s) => s.activeTab);

  const handleClick = (key: SectionKey) => {
    openTab(key);
    onAfterOpen?.();
  };

  return (
    <nav aria-label="Sections" className="flex h-full flex-col gap-1 py-2 font-mono text-xs">
      <p className="px-3 pb-2 uppercase tracking-[0.18em] text-muted-foreground">
        Explorer
      </p>
      <ul role="tree" className="flex flex-col gap-0.5">
        {SECTION_KEYS.map((key) => {
          const entry = SECTIONS_MANIFEST[key];
          const Icon = entry.icon;
          const isActive = activeTab === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => handleClick(key)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-1.5 py-1 pl-7 pr-3 text-left',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                )}
              >
                <FileIcon Icon={Icon} className={isActive ? 'text-primary' : ''} />
                <span>{entry.label}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">.{entry.extension}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
