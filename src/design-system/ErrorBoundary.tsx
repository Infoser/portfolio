import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Optional label shown in the fallback UI, e.g. "admin editor". */
  label?: string;
  /** Optional callback invoked with the thrown error + stack, e.g. for
   * sending to an error-reporting service. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Optional custom fallback render. Defaults to a styled panel with a
   * "Reload" button. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    const label = this.props.label ?? 'this view';
    return (
      <div
        role="alert"
        className="flex h-full min-h-dvh w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-destructive">
          Workspace error · {label} crashed
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          Something broke while rendering {label}.
        </h1>
        <pre className="max-w-2xl overflow-x-auto rounded-md border border-border bg-surface p-3 text-left font-mono text-xs text-muted-foreground">
          {error.message ?? String(error)}
        </pre>
        <p className="max-w-md text-sm text-muted-foreground">
          This is contained to {label} — the rest of the site should still work.
          Try reloading. If the error persists, clear your browser storage and
          re-enter via the admin URL.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={this.reset}
            className="rounded-md border border-border px-4 py-2 font-mono text-xs hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md border border-border px-4 py-2 font-mono text-xs hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
