import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type TomlEditorProps = {
  initialData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const serialize = (data: Record<string, unknown>): string => {
  const lines: string[] = [];
  const render = (prefix: string, val: unknown): void => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        render(prefix ? `${prefix}.${k}` : k, v);
      }
      return;
    }
    const formatted =
      typeof val === 'string' ? `"${val.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : String(val);
    lines.push(`${prefix} = ${formatted}`);
  };
  for (const [k, v] of Object.entries(data ?? {})) {
    render(k, v);
  }
  return lines.join('\n');
};

const naiveTomlParse = (text: string): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } => {
  const out: Record<string, unknown> = {};
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) return { ok: false, error: `line ${i + 1}: missing '='` };
    const key = trimmed.slice(0, eq).trim();
    let valueRaw = trimmed.slice(eq + 1).trim();
    let value: unknown = valueRaw;
    if (valueRaw.startsWith('"') && valueRaw.endsWith('"') && valueRaw.length >= 2) {
      value = valueRaw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    } else if (!Number.isNaN(Number(valueRaw))) {
      value = Number(valueRaw);
    } else if (valueRaw === 'true' || valueRaw === 'false') {
      value = valueRaw === 'true';
    }
    out[key] = value;
  }
  return { ok: true, data: out };
};

export function TomlEditor({ initialData, onChange }: TomlEditorProps) {
  const [text, setText] = useState(() => serialize(initialData));
  const parsed = useMemo(() => naiveTomlParse(text), [text]);

  // Keep latest onChange in a ref to avoid re-running the propagate effect on
  // every parent render (which created a new onChange arrow and caused an
  // infinite update loop with the previous [parsed, onChange] deps).
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (parsed.ok) onChangeRef.current(parsed.data);
  }, [parsed]);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex min-h-0 flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Source · TOML (flat dotted keys supported)
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label="TOML source"
          className={cn(
            'min-h-0 flex-1 resize-none rounded-md border border-border bg-code-bg p-3',
            'font-mono text-xs leading-relaxed text-code-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        />
      </div>
      <div className="flex min-h-0 flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Parsed preview
        </p>
        <pre className="min-h-0 flex-1 overflow-y-auto rounded-md border border-border bg-background p-3 font-mono text-xs leading-relaxed">
          {parsed.ok ? (
            <code>{JSON.stringify(parsed.data, null, 2)}</code>
          ) : (
            <code className="text-destructive">Error: {parsed.error}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
