import { SECTIONS_MANIFEST, SECTION_KEYS, isFolderKey, type SectionKey, type FolderKey } from '@/config/sections-manifest';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { useTabsStore } from '@/store/tabs';
import { getStaticSectionContent } from '@/sections-content';
import type { StructuredListContent } from '@/types/sections';
import { cn } from '@/lib/utils';

const FolderToggle = ({ open, className }: { open: boolean; className?: string }) =>
  open ? <ChevronDown className={cn('size-3', className)} /> : <ChevronRight className={cn('size-3', className)} />;

const FileIcon = ({ Icon, className }: { Icon: ComponentType<{ className?: string }>; className?: string }) => (
  <Icon className={cn('size-3.5', className)} />
);

const getInlineChildTitles = (folderKey: SectionKey): string[] => {
  const content = getStaticSectionContent(folderKey);
  if (!content || content.kind !== 'structured-list') return [];
  return (content as StructuredListContent).entries.map((e) => e.title);
};

export function Explorer() {
  // Accordion-style state: at most one folder open at a time. `null` means
  // all folders collapsed. Clicking a folder either opens it (closing the
  // previously-open one) or closes it if it is already the open one.
  const [openFolder, setOpenFolder] = useState<FolderKey | null>(null);
  const openTab = useTabsStore((s) => s.open);
  const activeTab = useTabsStore((s) => s.activeTab);

  const handleFolderClick = (key: FolderKey) => {
    setOpenFolder((curr) => (curr === key ? null : key));
    openTab(key);
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

          if (isFolderKey(key)) {
            const isFolderOpen = openFolder === key;
            const isActive = activeTab === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleFolderClick(key)}
                  aria-expanded={isFolderOpen}
                  className={cn(
                    'flex w-full items-center gap-1.5 px-3 py-1 text-left',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  )}
                >
                  <FolderToggle open={isFolderOpen} className={isActive ? 'text-primary' : ''} />
                  <FileIcon Icon={Icon} className={isActive ? 'text-primary' : ''} />
                  <span>{entry.label}</span>
                </button>
                {isFolderOpen && <FolderChildren folderKey={key} />}
              </li>
            );
          }

          const isActive = activeTab === key;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => openTab(key)}
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

const FolderChildren = ({ folderKey }: { folderKey: FolderKey }) => {
  const entry = SECTIONS_MANIFEST[folderKey];
  const openTab = useTabsStore((s) => s.open);
  const activeTab = useTabsStore((s) => s.activeTab);

  const isInline = entry.inlineChildren === true;
  const children: Array<{ id: string; label: string }> = isInline
    ? getInlineChildTitles(folderKey).map((title, idx) => ({ id: `${folderKey}-${idx}`, label: title }))
    : (entry.children ?? []).map((c) => ({ id: c, label: SECTIONS_MANIFEST[c as SectionKey].label }));

  if (children.length === 0) {
    return (
      <p className="py-1 pl-12 pr-3 font-mono text-[10px] italic text-muted-foreground">
        (empty)
      </p>
    );
  }

  return (
    <ul role="group" className="flex flex-col">
      {children.map((child) => {
        const isActive = activeTab === folderKey;
        return (
          <li key={child.id}>
            <button
              type="button"
              onClick={() => openTab(folderKey)}
              aria-current={isActive ? 'page' : undefined}
              title={child.label}
              className={cn(
                'flex w-full items-center gap-1.5 py-1 pl-12 pr-3 text-left',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              )}
            >
              <FileText className={cn('size-3.5 shrink-0', isActive ? 'text-primary' : '')} />
              <span className="truncate">{child.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
