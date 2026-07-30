import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const MonacoEditor = lazy(() =>
  import('@monaco-editor/react').then((m) => ({ default: m.default })),
);

const JsonValue = z.unknown();

type JsonEditorProps = {
  initialData: unknown;
  onChange: (data: unknown) => void;
  /** Called with a non-null message when the current text fails to parse, and
   * with `null` when it parses cleanly again. Used by the parent to disable
   * Save while the editor has unparseable input — prevents silently dropping
   * the user's recent keystrokes on the next successful save. */
  onParseError?: (error: string | null) => void;
};

export function JsonEditor({ initialData, onChange, onParseError }: JsonEditorProps) {
  const [text, setText] = useState(() => {
    try {
      return JSON.stringify(initialData, null, 2);
    } catch {
      return '{}';
    }
  });
  const [error, setError] = useState<string | null>(null);

  // Keep the latest onChange in a ref so the parse effect doesn't re-run when
  // the parent recreates the callback each render. Re-running on a fresh
  // onChange is what caused the previous infinite update loop: effect -> call
  // onChange -> parent setDraft(new object literal) -> new onChange reference
  // -> effect fires again -> "Maximum update depth exceeded".
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const onParseErrorRef = useRef(onParseError);
  useEffect(() => {
    onParseErrorRef.current = onParseError;
  }, [onParseError]);

  useEffect(() => {
    let parseError: string | null = null;
    try {
      const parsed = JSON.parse(text);
      JsonValue.parse(parsed);
      setError(null);
      onChangeRef.current(parsed);
    } catch (err) {
      parseError = err instanceof Error ? err.message : 'Invalid JSON';
      setError(parseError);
    }
    // Surface parse-state up to the parent so it can disable Save while the
    // text doesn't parse. Previously the parent's `dirty` flag stayed true
    // from the last-valid draft, so Save committed stale data and silently
    // dropped the user's broken-but-maybe-in-progress edits.
    if (onParseErrorRef.current) onParseErrorRef.current(parseError);
  }, [text]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Source · JSON
        </p>
        {error && (
          <p role="alert" className="font-mono text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
      <div className="min-h-[400px] flex-1 overflow-hidden rounded-md border border-border bg-code-bg">
        <Suspense fallback={<div className="p-4 font-mono text-xs text-muted-foreground">Loading editor…</div>}>
          <MonacoEditor
            height="100%"
            defaultLanguage="json"
            value={text}
            theme="vs-dark"
            onChange={(v) => setText(v ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              lineNumbers: 'on',
              automaticLayout: true,
              tabSize: 2,
              formatOnPaste: true,
              formatOnType: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
            loading={<div className="p-4 font-mono text-xs text-muted-foreground">Loading Monaco…</div>}
          />
        </Suspense>
      </div>
    </div>
  );
}
