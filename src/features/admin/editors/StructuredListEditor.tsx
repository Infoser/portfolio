import { useState } from 'react';
import { TextField, TextAreaField, ImageField } from './fields';
import { Badge } from '@/design-system';
import { Plus, Trash2 } from 'lucide-react';
import type { StructuredEntryBase } from '@/types/sections';

type StructuredListEditorProps = {
  initialEntries: StructuredEntryBase[];
  onChange: (entries: StructuredEntryBase[]) => void;
  sectionKey: string;
};

export function StructuredListEditor({
  initialEntries,
  onChange,
  sectionKey,
}: StructuredListEditorProps) {
  const [entries, setEntries] = useState(initialEntries);

  const update = (idx: number, patch: Partial<StructuredEntryBase>) => {
    const next = entries.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    setEntries(next);
    onChange(next);
  };

  const updateBullets = (idx: number, bullets: string[]) => update(idx, { bullets });
  const updateTags = (idx: number, tags: string[]) => update(idx, { tags });
  const updateLinks = (idx: number, links: StructuredEntryBase['links']) =>
    update(idx, { links });

  const addEntry = () => {
    const next: StructuredEntryBase[] = [
      ...entries,
      { id: `${Date.now()}`, title: 'New entry', bullets: [''], tags: [], links: [] },
    ];
    setEntries(next);
    onChange(next);
  };

  const removeEntry = (idx: number) => {
    const next = entries.filter((_, i) => i !== idx);
    setEntries(next);
    onChange(next);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
      {entries.map((entry, idx) => (
        <div
          key={entry.id}
          className="flex flex-col gap-4 rounded-md border border-border bg-surface p-4"
        >
          <header className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Entry #{idx + 1}
            </p>
            <button
              type="button"
              onClick={() => removeEntry(idx)}
              aria-label={`Remove entry ${idx + 1}`}
              className="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-xs text-muted-foreground hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </header>

          <TextField
            label="ID"
            value={entry.id}
            onChange={(v) => update(idx, { id: v })}
            mono
          />
          <TextField
            label="Title"
            value={entry.title}
            onChange={(v) => update(idx, { title: v })}
          />
          <TextField
            label="Subtitle"
            value={entry.subtitle ?? ''}
            onChange={(v) => update(idx, { subtitle: v })}
            optional
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <TextField
              label="Start"
              value={entry.start ?? ''}
              onChange={(v) => update(idx, { start: v })}
              optional
            />
            <TextField
              label="End"
              value={entry.end ?? ''}
              onChange={(v) => update(idx, { end: v })}
              optional
            />
            <TextField
              label="Location"
              value={entry.location ?? ''}
              onChange={(v) => update(idx, { location: v })}
              optional
            />
          </div>

          <TextAreaField
            label="Bullets (one per line)"
            value={(entry.bullets ?? []).join('\n')}
            onChange={(v) => updateBullets(idx, v.split('\n'))}
          />

          <TextField
            label="Tags (comma-separated)"
            value={(entry.tags ?? []).join(', ')}
            onChange={(v) => updateTags(idx, v.split(',').map((t) => t.trim()).filter(Boolean))}
          />

          <TextField
            label="Links (comma-separated, format: label|href|kind)"
            value={(entry.links ?? [])
              .map((l) => `${l.label}|${l.href}|${l.kind ?? 'site'}`)
              .join(', ')}
            onChange={(v) => {
              const links = v
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => {
                  const [label, href, kind] = s.split('|').map((p) => p?.trim());
                  return { label: label ?? '', href: href ?? '', kind: (kind as 'demo' | 'site' | 'github' | 'paper') ?? 'site' };
                });
              updateLinks(idx, links);
            }}
            optional
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            AI Badge:
            <Badge variant="secondary" className="font-mono text-[10px]">
              tags preview
            </Badge>
            <span className="text-muted-foreground">(will render as badges on the right)</span>
          </div>

          <ImageField
            label="Thumbnail image"
            value={entry.imageUrl ?? ''}
            onChange={(url) => update(idx, { imageUrl: url })}
            sectionKey={sectionKey}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="size-3.5" />
        Add entry
      </button>
    </div>
  );
}
