import { useState } from 'react';
import { MarkdownRenderer } from '@/features/section';
import { cn } from '@/lib/utils';

type MarkdownEditorProps = {
  initialBody: string;
  onChange: (body: string) => void;
};

export function MarkdownEditor({ initialBody, onChange }: MarkdownEditorProps) {
  const [text, setText] = useState(initialBody);

  const handleChange = (next: string) => {
    setText(next);
    onChange(next);
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex min-h-0 flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Source · markdown
        </p>
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          aria-label="Markdown source"
          className={cn(
            'min-h-0 flex-1 resize-none rounded-md border border-border bg-code-bg p-3',
            'font-mono text-xs leading-relaxed text-code-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        />
      </div>
      <div className="flex min-h-0 flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Preview
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-border bg-background p-4">
          <MarkdownRenderer body={text} />
        </div>
      </div>
    </div>
  );
}
