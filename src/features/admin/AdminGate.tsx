import { useEffect, useState } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminShell } from './AdminShell';
import { adminSignOut, getAdminSession } from '@/lib/auth';
import { NotFound } from './NotFound';

declare global {
  interface Window {
    __ADMIN__?: number;
    __ADMIN_SLUG__?: string;
  }
}

export function AdminGate() {
  const [authed, setAuthed] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Defense in depth: the server gate already returns 404 for wrong slugs
    // and only injects window.__ADMIN__ = 1 when the slug matched. If we
    // somehow load without that flag, refuse to render.
    if (typeof window === 'undefined' || !window.__ADMIN__) {
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
        setAuthed(false);
      }}
    />
  );
}
