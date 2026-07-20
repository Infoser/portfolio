import { FileQuestion } from 'lucide-react';

type NotFoundRouteProps = {
  path?: string;
};

export function NotFoundRoute({ path }: NotFoundRouteProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background p-6 text-center text-foreground">
      <FileQuestion className="size-12 text-primary" aria-hidden="true" />
      <div className="flex max-w-md flex-col gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Workspace error · file not found
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">
          This file isn't in the workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          {path
            ? `The page ${path} doesn't exist here.`
            : 'The page you tried to open doesn\'t exist as a file.'}{' '}
          If you got here from an old link, that file may have been removed or renamed.
        </p>
        <p className="text-sm text-muted-foreground">
          Use the file tree on the left to open any of the 8 sections — about, experience,
          projects, achievements, skills, education, leadership, and contact.
        </p>
      </div>
      <a
        href="/"
        className="rounded-md border border-border px-4 py-2 font-mono text-xs hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Back to workspace
      </a>
    </main>
  );
}
