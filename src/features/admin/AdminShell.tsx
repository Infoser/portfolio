import { useEffect, useState } from 'react';
import type { AdminSectionKey, MetaKey } from '@/config/sections-manifest';
import {
  SECTIONS_MANIFEST,
  SECTION_KEYS,
  META_MANIFEST,
  META_KEYS,
} from '@/config/sections-manifest';
import { MarkdownEditor } from './editors/MarkdownEditor';
import { StructuredListEditor } from './editors/StructuredListEditor';
import { JsonEditor } from './editors/JsonEditor';
import { TomlEditor } from './editors/TomlEditor';
import { BannerEditor } from './editors/BannerEditor';
import { SectionRenderer } from '@/features/section';
import { useSection } from '@/lib/hooks/useSection';
import { updateSectionContent } from '@/lib/auth';
import { clearSectionCache } from '@/lib/hooks/useSection';
import { Button } from '@/design-system';
import { cn } from '@/lib/utils';
import { SaveIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const SectionEditor = ({ sectionKey }: { sectionKey: AdminSectionKey }) => {
  const { content, isLoading, refetch } = useSection(sectionKey);
  const [draft, setDraft] = useState<unknown>(content);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  // Non-null when the active editor has unparseable input. Disables Save so we
  // don't commit the last-valid draft and silently drop the user's in-flight
  // keystrokes. Each editor factory below wires its onParseError into here.
  const [parseError, setParseError] = useState<string | null>(null);

  // Initialize draft whenever the freshly-loaded content changes (mount or
  // section switch). Kept in an effect rather than during render so we never
  // mutate state mid-render. The parent passes a `key={sectionKey}` so this
  // component remounts cleanly when switching sections.
  useEffect(() => {
    if (!content) return;
    setDraft(content);
    setDirty(false);
  }, [content]);

  if (isLoading || !content) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const entry =
    sectionKey in SECTIONS_MANIFEST
      ? SECTIONS_MANIFEST[sectionKey as Exclude<AdminSectionKey, MetaKey>]
      : META_MANIFEST[sectionKey as MetaKey];

  const handleChange = (next: unknown) => {
    setDraft(next);
    setDirty(JSON.stringify(next) !== JSON.stringify(content));
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateSectionContent(sectionKey, draft);
      clearSectionCache(sectionKey);
      // Force a refetch so the live-preview pane reflects what was just
      // persisted (the live-mounted useSection's state stays otherwise
      // stale — the prior bug made the "saved" status flip green while the
      // preview still showed the pre-save content).
      await refetch();
      setDirty(false);
      toast.success(`Saved ${entry.label}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {entry.label.toLowerCase()}.{entry.extension}
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight">{entry.label}</h2>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {dirty ? (
            <span className="font-mono text-xs text-muted-foreground">unsaved changes</span>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              saved
            </span>
          )}
          {parseError && (
            <span
              role="alert"
              title={parseError}
              className="max-w-[18rem] truncate font-mono text-xs text-destructive"
            >
              parse error: {parseError}
            </span>
          )}
          <Button onClick={save} disabled={!dirty || saving || !!parseError}>
            <SaveIcon className="size-3.5" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </header>

      <div className="grid h-full min-h-0 grid-rows-[1fr_auto] gap-4">
        <div className="min-h-0 overflow-hidden">
          {content.kind === 'markdown' && (
            <MarkdownEditor
              initialBody={content.body}
              onChange={(body) => handleChange({ kind: 'markdown', body })}
            />
          )}
          {content.kind === 'structured-list' && (
            <StructuredListEditor
              sectionKey={sectionKey as Exclude<AdminSectionKey, MetaKey>}
              initialEntries={content.entries}
              onChange={(entries) => handleChange({ kind: 'structured-list', entries })}
            />
          )}
          {content.kind === 'json' && (
            <JsonEditor
              initialData={content.data}
              onChange={(data) => handleChange({ kind: 'json', data })}
              onParseError={setParseError}
            />
          )}
          {content.kind === 'toml' && (
            <TomlEditor
              initialData={content.data}
              onChange={(data) => handleChange({ kind: 'toml', data })}
              onParseError={setParseError}
            />
          )}
          {content.kind === 'banner' && (
            <BannerEditor
              initialEnabled={content.enabled}
              initialMessage={content.message}
              onChange={({ enabled, message }) =>
                handleChange({ kind: 'banner', enabled, message })
              }
            />
          )}
        </div>

        <details className="overflow-hidden rounded-md border border-border bg-surface">
          <summary className="cursor-pointer px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Live preview (current saved content)
          </summary>
          <div className="border-t border-border bg-background p-4">
            {content.kind === 'banner' ? (
              <BannerPreview enabled={content.enabled} message={content.message} />
            ) : (
              <SectionRenderer
                sectionKey={sectionKey as Exclude<AdminSectionKey, MetaKey>}
                content={content}
              />
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

const BannerPreview = ({ enabled, message }: { enabled: boolean; message: string }) => {
  if (!enabled || !message.trim()) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        Banner is currently hidden on the public site.
      </p>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-primary/15 px-3 py-1.5 font-mono text-xs text-foreground/90">
      <span aria-hidden className="text-primary">
        ▸
      </span>
      <span className="truncate">{message}</span>
    </div>
  );
};

type AdminShellProps = {
  onSignOut: () => void;
};

export function AdminShell({ onSignOut }: AdminShellProps) {
  const [active, setActive] = useState<AdminSectionKey>('about');

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <header className="flex h-12 items-center gap-3 border-b border-border bg-surface px-4">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">
          /__admin__/
        </span>
        <span className="text-xs text-muted-foreground">portfolio editor · live to public site on save</span>
        <button
          type="button"
          onClick={onSignOut}
          className="ml-auto rounded-md border border-border px-2.5 py-1 font-mono text-xs hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Sign out
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav
          aria-label="Admin section list"
          className="w-56 shrink-0 overflow-y-auto border-r border-border bg-surface py-3"
        >
          <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Sections
          </p>
          <ul className="flex flex-col">
            {SECTION_KEYS.map((key) => {
              const entry = SECTIONS_MANIFEST[key];
              const isActive = key === active;
              const Icon = entry.icon;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setActive(key)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-sm',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {entry.label}
                    <span className="ml-auto text-[10px] text-muted-foreground">.{entry.extension}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 px-3 pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Site Settings
          </p>
          <ul className="flex flex-col">
            {META_KEYS.map((key) => {
              const entry = META_MANIFEST[key];
              const isActive = key === active;
              const Icon = entry.icon;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setActive(key)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-sm',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {entry.label}
                    <span className="ml-auto text-[10px] text-muted-foreground">.{entry.extension}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="min-w-0 flex-1 overflow-y-auto p-6">
          {/* key forces a clean remount on section switch so editor state never
              bleeds between sections. */}
          <SectionEditor key={active} sectionKey={active} />
        </main>
      </div>
    </div>
  );
}
