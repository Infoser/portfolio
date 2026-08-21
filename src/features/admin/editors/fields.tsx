import { useRef, useState } from 'react';
import { Input } from '@/design-system';
import { Loader2 } from 'lucide-react';
import { uploadSectionImage } from '@/lib/storage';
import { cn } from '@/lib/utils';

const labelClass = 'font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground';

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
  mono?: boolean;
};

export function TextField({ label, value, onChange, optional, mono }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal text-muted-foreground/60">· optional</span>}
      </span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn(mono && 'font-mono text-xs')}
        aria-label={label}
      />
    </label>
  );
}

export function TextAreaField({ label, value, onChange, optional }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal text-muted-foreground/60">· optional</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        aria-label={label}
        className={cn(
          'min-h-32 resize-y rounded-md border border-border bg-code-bg p-3 font-mono text-xs leading-relaxed text-code-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      />
    </label>
  );
}

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  sectionKey: string;
  /** Optional suffix to make the file input ID unique when multiple
   * ImageFields share the same label (e.g. multiple entries in a list). */
  idSuffix?: string;
};

export function ImageField({ label, value, onChange, sectionKey, idSuffix }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const url = await uploadSectionImage(file, sectionKey);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const fileInputId = `file-${label.replace(/\s+/g, '-').toLowerCase()}${idSuffix ? `-${idSuffix}` : ''}`;

  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder="https://…"
          aria-label={`${label} URL`}
          className={cn(
            'flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => onPick(e.target.files?.[0])}
          className="sr-only"
          id={fileInputId}
          aria-label={`${label} upload`}
        />
        <label
          htmlFor={fileInputId}
          className={cn(
            'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-2 font-mono text-xs',
            'hover:border-primary hover:text-primary focus-within:ring-2 focus-within:ring-ring',
          )}
        >
          {busy && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
          {busy ? 'Uploading…' : 'Upload image'}
        </label>
      </div>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      {value && (
        <img
          src={value}
          alt="Preview"
          loading="lazy"
          className="mt-1 max-h-32 w-full rounded-md border border-border object-cover"
        />
      )}
    </label>
  );
}
