import { SECTIONS_MANIFEST, SECTION_KEYS, isFolderKey, type SectionKey } from '@/config/sections-manifest';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { useTabsStore } from '@/store/tabs';
import { cn } from '@/lib/utils';

type FolderState = Record<string, boolean>;

const FolderToggle = ({ open, className }: { open: boolean; className?: string }) =>
  open ? <ChevronDown className={cn('size-3', className)} /> : <ChevronRight className={cn('size-3', className)} />;

const FileIcon = ({ Icon, className }: { Icon: ComponentType<{ className?: string }>; className?: string }) => (
  <Icon className={cn('size-3.5', className)} />
);

export function Explorer() {
  const [folders, setFolders] = useState<FolderState>({ projects: true, experience: true });
  const openTab = useTabsStore((s) => s.open);
  const activeTab = useTabsStore((s) => s.activeTab);

  const toggleFolder = (key: string) => setFolders((f) => ({ ...f, [key]: !f[key] }));

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
            const isFolderOpen = folders[key] ?? true;
            const isActive = activeTab === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    toggleFolder(key);
                    openTab(key);
                  }}
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

const FolderChildren = ({ folderKey }: { folderKey: 'projects' | 'experience' }) => {
  const entry = SECTIONS_MANIFEST[folderKey];
  const children = entry.children as ReadonlyArray<string>;
  const openTab = useTabsStore((s) => s.open);
  const activeTab = useTabsStore((s) => s.activeTab);

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
        const childKey = child as SectionKey;
        const manifest = SECTIONS_MANIFEST[childKey];
        const Icon = manifest.icon;
        const isActive = activeTab === childKey;
        return (
          <li key={child}>
            <button
              type="button"
              onClick={() => openTab(childKey)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-1.5 py-1 pl-12 pr-3 text-left',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              )}
            >
              <FileIcon Icon={Icon} className={isActive ? 'text-primary' : ''} />
              <span>{manifest.label}</span>
              <span className="ml-auto text-[10px] text-muted-foreground">.{manifest.extension}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
