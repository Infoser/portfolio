import { useEffect, useState } from 'react';
import { Input } from '@/design-system';
import { cn } from '@/lib/utils';

type BannerEditorProps = {
  initialEnabled: boolean;
  initialMessage: string;
  onChange: (data: { enabled: boolean; message: string }) => void;
};

export function BannerEditor({ initialEnabled, initialMessage, onChange }: BannerEditorProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState(initialMessage);
  const [hasInit, setHasInit] = useState(false);

  useEffect(() => {
    if (!hasInit) {
      setHasInit(true);
      return;
    }
    onChange({ enabled, message });
  }, [enabled, message, hasInit, onChange]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          aria-label="Show banner on public site"
          className="size-4 cursor-pointer accent-primary"
        />
        <span className="font-mono text-sm text-foreground">
          Show banner on public site
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Banner message
        </span>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          spellCheck={true}
          maxLength={200}
          placeholder="Under Development"
          aria-label="Banner message"
          className={cn('font-mono text-sm')}
        />
        <p className="font-mono text-[11px] text-muted-foreground/70">
          Shown at the top of every public page. Leave empty to hide even when enabled.
        </p>
      </label>

      <div className="rounded-md border border-border bg-surface p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Live preview
        </p>
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border border-border bg-primary/15 px-3 py-1.5',
            'font-mono text-xs text-foreground/90',
            !enabled || !message.trim() ? 'opacity-50' : '',
          )}
        >
          <span aria-hidden className="text-primary">
            ▸
          </span>
          <span className="truncate">
            {message.trim() || 'Banner message preview'}
          </span>
        </div>
        {!enabled && (
          <p className="mt-2 font-mono text-[11px] text-muted-foreground/70">
            Disabled — banner will not render.
          </p>
        )}
      </div>
    </div>
  );
}
