import { useEffect, useState } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminShell } from './AdminShell';
import { adminSignOut, getAdminSession } from '@/lib/auth';
import { NotFound } from './NotFound';

const ADMIN_FLAG = '__ADMIN__';

function readAdminFlag(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const direct = (window as unknown as { __ADMIN__?: number }).__ADMIN__;
    if (direct) return true;
    return sessionStorage.getItem(ADMIN_FLAG) === '1';
  } catch {
    return false;
  }
}

function clearAdminFlag(): void {
  try {
    sessionStorage.removeItem(ADMIN_FLAG);
  } catch {
    // ignore
  }
}

export function AdminGate() {
  const [authed, setAuthed] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Defense in depth: the server gate already returned 404 for wrong slugs.
    // The gate's bootstrap page sets sessionStorage.__ADMIN__ = 1 before redirecting
    // here. If we somehow load without that flag, refuse to render.
    if (!readAdminFlag()) {
      setUnauthorized(true);
    }
    setBooting(false);
  }, []);

  const recheck = async () => {
    const session = await getAdminSession().catch(() => null);
    setAuthed(Boolean(session));
  };

  useEffect(() => {
    if (unauthorized) return;
    recheck();
  }, [unauthorized]);

  if (booting) return null;
  if (unauthorized) return <NotFound />;
  if (!authed) return <AdminLogin onSuccess={recheck} />;

  return (
    <AdminShell
      onSignOut={async () => {
        await adminSignOut();
        clearAdminFlag();
        setAuthed(false);
      }}
    />
  );
}
