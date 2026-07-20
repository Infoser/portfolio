import { SECTIONS_MANIFEST } from '@/config/sections-manifest';
import { cn } from '@/lib/utils';
import { useTabsStore } from '@/store/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { SectionKey } from '@/config/sections-manifest';

const Tab = ({ tabKey, active, onClick, onClose }: {
  tabKey: SectionKey;
  active: boolean;
  onClick: () => void;
  onClose: () => void;
}) => {
  const entry = SECTIONS_MANIFEST[tabKey];
  const Icon = entry.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, width: 0, marginRight: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn(
        'group flex shrink-0 items-center gap-1.5 border-r border-border pl-3 pr-2',
        'h-9 max-w-[220px] cursor-pointer select-none',
        active ? 'bg-background text-foreground' : 'bg-surface text-muted-foreground hover:bg-muted/60',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className="flex flex-1 items-center gap-1.5 truncate focus-visible:outline-none"
      >
        <Icon className={cn('size-3.5 shrink-0', active ? 'text-primary' : '')} />
        <span className="truncate text-xs">{entry.label}</span>
        <span className="text-[10px] text-muted-foreground">.{entry.extension}</span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label={`Close ${entry.label}`}
        className="flex size-4 items-center justify-center rounded-sm text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
      >
        <X className="size-3" />
      </button>
    </motion.div>
  );
};

export function TabStrip() {
  const openTabs = useTabsStore((s) => s.openTabs);
  const activeTab = useTabsStore((s) => s.activeTab);
  const setActive = useTabsStore((s) => s.setActive);
  const close = useTabsStore((s) => s.close);

  return (
    <div
      role="tablist"
      aria-label="Open sections"
      className="flex h-9 w-full items-stretch overflow-x-auto overflow-y-hidden border-b border-border bg-surface no-scrollbar"
    >
      <AnimatePresence initial={false}>
        {openTabs.map((key) => (
          <Tab
            key={key}
            tabKey={key}
            active={activeTab === key}
            onClick={() => setActive(key)}
            onClose={() => close(key)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
