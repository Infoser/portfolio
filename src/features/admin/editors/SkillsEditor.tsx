import { useEffect, useRef, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { ReorderControls } from './ReorderControls';
import { Input } from '@/design-system';
import { Plus, X, FolderPlus } from 'lucide-react';

type Skill = { id: string; value: string };
type Category = { id: string; key: string; skills: Skill[] };

type SkillsEditorProps = {
  initialData: unknown;
  onChange: (data: unknown) => void;
  onParseError?: (error: string | null) => void;
};

const labelClass =
  'font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground';

let uidCounter = 0;
const uid = () => `k${Date.now().toString(36)}-${(uidCounter++).toString(36)}`;

const toInternal = (data: unknown): Category[] => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return [];
  return Object.entries(data as Record<string, unknown>)
    .filter(([, v]) => Array.isArray(v))
    .map(([key, skills]) => ({
      id: uid(),
      key,
      skills: (skills as string[]).map((s) => ({ id: uid(), value: s })),
    }));
};

const toData = (cats: Category[]): Record<string, string[]> => {
  const data: Record<string, string[]> = {};
  for (const c of cats) {
    const key = c.key.trim();
    if (!key) continue;
    data[key] = c.skills.map((s) => s.value);
  }
  return data;
};

type SkillRowProps = {
  skill: Skill;
  index: number;
  count: number;
  onUpdate: (idx: number, value: string) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (idx: number) => void;
};

const SkillRow = ({ skill, index, count, onUpdate, onMove, onRemove }: SkillRowProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={skill.id}
      id={skill.id}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-2"
    >
      <ReorderControls index={index} count={count} onMove={onMove} dragControls={dragControls} />
      <Input
        value={skill.value}
        onChange={(e) => onUpdate(index, e.target.value)}
        spellCheck={false}
        aria-label={`Skill ${index + 1}`}
        className="flex-1 font-mono text-xs"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`Remove skill ${index + 1}`}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded border border-transparent text-muted-foreground hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </Reorder.Item>
  );
};

type CategoryCardProps = {
  category: Category;
  index: number;
  count: number;
  onUpdate: (idx: number, patch: Partial<Category>) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (idx: number) => void;
  onAddSkill: (catIdx: number) => void;
  onMoveSkill: (catIdx: number, from: number, to: number) => void;
  onReorderSkills: (catIdx: number, ids: string[]) => void;
  onUpdateSkill: (catIdx: number, skillIdx: number, value: string) => void;
  onRemoveSkill: (catIdx: number, skillIdx: number) => void;
};

const CategoryCard = ({
  category,
  index,
  count,
  onUpdate,
  onMove,
  onRemove,
  onAddSkill,
  onMoveSkill,
  onReorderSkills,
  onUpdateSkill,
  onRemoveSkill,
}: CategoryCardProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={category.id}
      id={category.id}
      dragListener={false}
      dragControls={dragControls}
      className="rounded-md border border-border bg-surface p-4"
    >
      <header className="flex flex-wrap items-start gap-2">
        <ReorderControls index={index} count={count} onMove={onMove} dragControls={dragControls} className="mt-1.5" />
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={labelClass}>Category key</span>
          <Input
            value={category.key}
            onChange={(e) => onUpdate(index, { key: e.target.value })}
            spellCheck={false}
            aria-label={`Category ${index + 1} key`}
            className="font-mono text-xs"
          />
        </label>
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remove category ${index + 1}`}
          className="mt-1.5 inline-flex size-6 shrink-0 items-center justify-center rounded border border-transparent text-muted-foreground hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </header>

      <p className={`${labelClass} mb-1.5 mt-4`}>Skills</p>
      <Reorder.Group
        as="div"
        axis="y"
        values={category.skills.map((s) => s.id)}
        onReorder={(ids: string[]) => onReorderSkills(index, ids)}
        className="flex flex-col gap-1.5"
      >
        {category.skills.map((skill, i) => (
          <SkillRow
            key={skill.id}
            skill={skill}
            index={i}
            count={category.skills.length}
            onUpdate={(si, v) => onUpdateSkill(index, si, v)}
            onMove={(from, to) => onMoveSkill(index, from, to)}
            onRemove={(si) => onRemoveSkill(index, si)}
          />
        ))}
        <button
          type="button"
          onClick={() => onAddSkill(index)}
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-border px-2 py-1 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="size-3.5" />
          Add skill
        </button>
      </Reorder.Group>
    </Reorder.Item>
  );
};

export function SkillsEditor({ initialData, onChange, onParseError }: SkillsEditorProps) {
  const [categories, setCategories] = useState<Category[]>(() => toInternal(initialData));
  const [shapeInvalid, setShapeInvalid] = useState(false);

  // Keep the latest callbacks in refs so effects don't re-fire when the
  // parent recreates them each render (mirrors JsonEditor's pattern).
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const onParseErrorRef = useRef(onParseError);
  useEffect(() => {
    onParseErrorRef.current = onParseError;
  }, [onParseError]);

  useEffect(() => {
    const ok = !!initialData && typeof initialData === 'object' && !Array.isArray(initialData);
    setShapeInvalid(!ok);
    onParseErrorRef.current?.(ok ? null : 'Skills data must be an object of string arrays');
  }, [initialData]);

  const commit = (next: Category[]) => {
    setCategories(next);
    onChangeRef.current(toData(next));
  };

  const move = (list: unknown[], from: number, to: number) => {
    if (to < 0 || to >= list.length || from === to) return false;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  };

  const updateCategory = (idx: number, patch: Partial<Category>) => {
    const target = { ...categories[idx], ...patch };
    if (patch.key !== undefined) {
      const trimmed = target.key.trim();
      if (!trimmed) return;
      const dup = categories.find((c, i) => i !== idx && c.key === trimmed);
      if (dup) return;
      target.key = trimmed;
    }
    commit(categories.map((c, i) => (i === idx ? target : c)));
  };

  const moveCategory = (from: number, to: number) => {
    const next = move(categories, from, to);
    if (next) commit(next as Category[]);
  };

  const handleReorderCategories = (ids: string[]) => {
    const byId = new Map(categories.map((c) => [c.id, c]));
    const next = ids.map((id) => byId.get(id)).filter((c): c is Category => Boolean(c));
    if (next.length === categories.length) commit(next);
  };

  const addCategory = () => {
    const base = `category_${categories.length + 1}`;
    let key = base;
    let n = 2;
    while (categories.some((c) => c.key === key)) key = `${base}_${n++}`;
    commit([...categories, { id: uid(), key, skills: [] }]);
  };

  const removeCategory = (idx: number) => {
    commit(categories.filter((_, i) => i !== idx));
  };

  const addSkill = (catIdx: number) => {
    const next = categories.map((c, i) =>
      i === catIdx ? { ...c, skills: [...c.skills, { id: uid(), value: '' }] } : c,
    );
    commit(next);
  };

  const updateSkill = (catIdx: number, skillIdx: number, value: string) => {
    const next = categories.map((c, i) =>
      i === catIdx
        ? { ...c, skills: c.skills.map((s, j) => (j === skillIdx ? { ...s, value } : s)) }
        : c,
    );
    commit(next);
  };

  const moveSkill = (catIdx: number, from: number, to: number) => {
    const next = move(categories[catIdx].skills, from, to);
    if (!next) return;
    commit(
      categories.map((c, i) =>
        i === catIdx ? { ...c, skills: next as Skill[] } : c,
      ),
    );
  };

  const handleReorderSkills = (catIdx: number, ids: string[]) => {
    const cat = categories[catIdx];
    const byId = new Map(cat.skills.map((s) => [s.id, s]));
    const next = ids.map((id) => byId.get(id)).filter((s): s is Skill => Boolean(s));
    if (next.length === cat.skills.length) {
      commit(categories.map((c, i) => (i === catIdx ? { ...c, skills: next } : c)));
    }
  };

  const removeSkill = (catIdx: number, skillIdx: number) => {
    commit(
      categories.map((c, i) =>
        i === catIdx ? { ...c, skills: c.skills.filter((_, j) => j !== skillIdx) } : c,
      ),
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Skills · categories &amp; chips
        </p>
        {shapeInvalid && (
          <p role="alert" className="font-mono text-xs text-destructive">
            Skills data must be an object of string arrays
          </p>
        )}
      </div>

      {categories.length === 0 && !shapeInvalid ? (
        <p className="text-sm italic text-muted-foreground">No categories yet.</p>
      ) : (
        <Reorder.Group
          as="div"
          axis="y"
          values={categories.map((c) => c.id)}
          onReorder={handleReorderCategories}
          className="flex flex-col gap-4"
        >
          {categories.map((category, idx) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={idx}
              count={categories.length}
              onUpdate={updateCategory}
              onMove={moveCategory}
              onRemove={removeCategory}
              onAddSkill={addSkill}
              onMoveSkill={moveSkill}
              onReorderSkills={handleReorderSkills}
              onUpdateSkill={updateSkill}
              onRemoveSkill={removeSkill}
            />
          ))}
        </Reorder.Group>
      )}

      <button
        type="button"
        onClick={addCategory}
        className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <FolderPlus className="size-3.5" />
        Add category
      </button>
    </div>
  );
}