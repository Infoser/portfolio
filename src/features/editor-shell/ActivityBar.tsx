import { SECTIONS_MANIFEST, SECTION_KEYS } from '@/config/sections-manifest';
import { cn } from '@/lib/utils';
import { useTabsStore } from '@/store/tabs';
import { motion } from 'framer-motion';
import type { ComponentType } from 'react';

const RailIcon = ({ Icon, active, onClick, label }: {
  Icon: ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
    title={label}
    className={cn(
      'relative flex size-11 shrink-0 items-center justify-center rounded-md transition-colors',
      active
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    )}
  >
    {active && (
      <motion.span
        layoutId="activity-active-bar"
        className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-primary"
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    )}
    <Icon className="size-5" />
  </button>
);

export function ActivityBar() {
  const openTab = useTabsStore((s) => s.open);
  const activeTab = useTabsStore((s) => s.activeTab);

  return (
    <aside
      aria-label="Section navigation"
      className="flex h-full w-14 shrink-0 flex-row items-center gap-1 overflow-x-auto overflow-y-hidden border-b border-border bg-surface px-1 py-2 no-scrollbar md:flex-col md:overflow-x-visible md:overflow-y-auto md:border-b-0 md:border-r md:py-3 md:px-0"
    >
      {SECTION_KEYS.map((key) => {
        const entry = SECTIONS_MANIFEST[key];
        const folderContainsActive =
          activeTab != null &&
          entry.isFolder === true &&
          activeTab === key;

        return (
          <RailIcon
            key={key}
            Icon={entry.icon}
            active={activeTab === key || folderContainsActive}
            onClick={() => openTab(key)}
            label={entry.label}
          />
        );
      })}
    </aside>
  );
}
