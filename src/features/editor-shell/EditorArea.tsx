import { SECTIONS_MANIFEST } from '@/config/sections-manifest';
import { cn } from '@/lib/utils';
import { useTabsStore } from '@/store/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { SectionKey } from '@/config/sections-manifest';

type EditorAreaProps = {
  children?: (key: SectionKey) => ReactNode;
  placeholder?: ReactNode;
};

export function EditorArea({ children, placeholder }: EditorAreaProps) {
  const activeTab = useTabsStore((s) => s.activeTab);

  return (
    <section className="relative flex h-full min-h-0 flex-1 flex-col">
      <AnimatePresence mode="wait">
        {activeTab ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full min-h-0 overflow-y-auto px-6 py-6"
          >
            {children ? children(activeTab) : <DefaultPlaceholder sectionKey={activeTab} />}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground"
          >
            {placeholder ?? (
              <>
                <span className="font-mono text-xs uppercase tracking-[0.2em]">
                  Ready
                </span>
                <p>Pick a section from the file tree on the left to open it here.</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const DefaultPlaceholder = ({ sectionKey }: { sectionKey: SectionKey }) => {
  const entry = SECTIONS_MANIFEST[sectionKey];
  return (
    <article className="flex max-w-2xl flex-col gap-4">
      <header className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {entry.label}.{entry.extension}
        </p>
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {entry.label}
        </h2>
      </header>
      <div className={cn('rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground')}>
        Content for <span className="font-mono text-primary">{entry.label}</span> will render here.
        Wired in Step 6.
      </div>
    </article>
  );
};
