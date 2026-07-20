import { useEffect, useState, type FormEvent } from 'react';
import { adminSignIn, getAdminSession } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button, Input } from '@/design-system';
import { Lock, AlertCircle } from 'lucide-react';

type AdminLoginProps = {
  onSuccess: () => void;
};

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('issuatstudy090@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isSupabaseConfigured()) {
        setCheckingSession(false);
        return;
      }
      const existing = await getAdminSession().catch(() => null);
      if (cancelled) return;
      if (existing) {
        onSuccess();
        return;
      }
      setCheckingSession(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [onSuccess]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminSignIn(email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground">
        <p className="font-mono text-xs uppercase tracking-[0.18em]">Checking session…</p>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
          <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-foreground">
            <AlertCircle className="size-4" />
            Supabase not configured
          </p>
          <p>
            Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> in{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.env.local</code> to use the admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <form
        onSubmit={submit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm"
      >
        <header className="flex flex-col gap-1 text-center">
          <Lock className="mx-auto size-6 text-primary" aria-hidden="true" />
          <h1 className="font-display text-2xl font-medium tracking-tight">Admin sign in</h1>
          <p className="text-xs text-muted-foreground">Supabase Auth · portfolio editor</p>
        </header>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={busy}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Password
          </span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            autoFocus
            disabled={busy}
          />
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
