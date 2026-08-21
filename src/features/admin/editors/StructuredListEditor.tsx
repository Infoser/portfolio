import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { TextField, TextAreaField, ImageField } from './fields';
import { ReorderControls } from './ReorderControls';
import { Badge } from '@/design-system';
import { Plus, Trash2 } from 'lucide-react';
import type { StructuredEntryBase } from '@/types/sections';

type StructuredListEditorProps = {
  initialEntries: StructuredEntryBase[];
  onChange: (entries: StructuredEntryBase[]) => void;
  sectionKey: string;
};

type EntryCardProps = {
  entry: StructuredEntryBase;
  index: number;
  count: number;
  sectionKey: string;
  onUpdate: (idx: number, patch: Partial<StructuredEntryBase>) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (idx: number) => void;
};

const EntryCard = ({ entry, index, count, sectionKey, onUpdate, onMove, onRemove }: EntryCardProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={entry.id}
      id={entry.id}
      dragListener={false}
      dragControls={dragControls}
      className="rounded-md border border-border bg-surface p-4"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Entry #{index + 1}
          </p>
          <ReorderControls index={index} count={count} onMove={onMove} dragControls={dragControls} />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remove entry ${index + 1}`}
          className="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-xs text-muted-foreground hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Trash2 className="size-3.5" />
          Remove
        </button>
      </header>

      <TextField
        label="ID"
        value={entry.id}
        onChange={(v) => onUpdate(index, { id: v })}
        mono
      />
      <TextField
        label="Title"
        value={entry.title}
        onChange={(v) => onUpdate(index, { title: v })}
      />
      <TextField
        label="Subtitle"
        value={entry.subtitle ?? ''}
        onChange={(v) => onUpdate(index, { subtitle: v })}
        optional
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <TextField
          label="Start"
          value={entry.start ?? ''}
          onChange={(v) => onUpdate(index, { start: v })}
          optional
        />
        <TextField
          label="End"
          value={entry.end ?? ''}
          onChange={(v) => onUpdate(index, { end: v })}
          optional
        />
        <TextField
          label="Location"
          value={entry.location ?? ''}
          onChange={(v) => onUpdate(index, { location: v })}
          optional
        />
      </div>

      <TextAreaField
        label="Bullets (one per line)"
        value={(entry.bullets ?? []).join('\n')}
        onChange={(v) => onUpdate(index, { bullets: v.split('\n') })}
      />

      <TextField
        label="Tags (comma-separated)"
        value={(entry.tags ?? []).join(', ')}
        onChange={(v) =>
          onUpdate(index, {
            tags: v.split(',').map((t) => t.trim()).filter(Boolean),
          })
        }
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
          onUpdate(index, { links });
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
        onChange={(url) => onUpdate(index, { imageUrl: url })}
        sectionKey={sectionKey}
        idSuffix={entry.id}
      />
    </Reorder.Item>
  );
};

export function StructuredListEditor({
  initialEntries,
  onChange,
  sectionKey,
}: StructuredListEditorProps) {
  const [entries, setEntries] = useState(initialEntries);

  const commit = (next: StructuredEntryBase[]) => {
    setEntries(next);
    onChange(next);
  };

  const update = (idx: number, patch: Partial<StructuredEntryBase>) => {
    commit(entries.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  };

  // Move an entry to a new index (used by the Up/Down buttons). Clamps and
  // no-ops when the move is out of range.
  const move = (from: number, to: number) => {
    if (to < 0 || to >= entries.length || from === to) return;
    const next = [...entries];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commit(next);
  };

  // Reorder callback from framer-motion Reorder.Group. It hands back the
  // ids in their new visual order; we resolve them back to full entries so
  // object identity stays decoupled from drag state.
  const handleReorder = (nextIds: string[]) => {
    const byId = new Map(entries.map((e) => [e.id, e]));
    const next = nextIds
      .map((id) => byId.get(id))
      .filter((e): e is StructuredEntryBase => Boolean(e));
    if (next.length === entries.length) commit(next);
  };

  const addEntry = () => {
    commit([
      ...entries,
      { id: `${Date.now()}`, title: 'New entry', bullets: [''], tags: [], links: [] },
    ]);
  };

  const removeEntry = (idx: number) => {
    commit(entries.filter((_, i) => i !== idx));
  };

  return (
    <Reorder.Group
      as="div"
      axis="y"
      values={entries.map((e) => e.id)}
      onReorder={handleReorder}
      className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto"
    >
      {entries.map((entry, idx) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          index={idx}
          count={entries.length}
          sectionKey={sectionKey}
          onUpdate={update}
          onMove={move}
          onRemove={removeEntry}
        />
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="size-3.5" />
        Add entry
      </button>
    </Reorder.Group>
  );
}