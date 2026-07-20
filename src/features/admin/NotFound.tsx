import { FileX2 } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <FileX2 className="size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="font-display text-3xl font-medium tracking-tight">File not found in workspace</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you were looking for doesn't exist here. If you got here from a link, the link
        may be outdated — try going back to the home page and opening a file from the explorer.
      </p>
      <a
        href="/"
        className="rounded-md border border-border px-3 py-1.5 font-mono text-xs hover:border-primary hover:text-primary"
      >
        Back to workspace
      </a>
    </div>
  );
}
