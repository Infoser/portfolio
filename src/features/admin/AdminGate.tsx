import { useCallback, useEffect, useState } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminShell } from './AdminShell';
import { adminSignOut, getAdminSession } from '@/lib/auth';
import { NotFound } from './NotFound';

const ADMIN_FLAG = '__ADMIN__';

/**
 * Returns true iff the server's admin-gate bootstrap page has set the
 * sessionStorage flag before redirecting here. The server gate has already
 * validated the slug and returned 404 for wrong ones; this check is pure
 * defense in depth — if the SPA somehow loads at /__admin__ without going
 * through the bootstrap (e.g. direct navigation, browser pre-fetch), we
 * refuse to render the login surface so we don't advertise that an admin
 * route exists.
 *
 * Note: an earlier implementation also checked window.__ADMIN__ as a global,
 * but the bootstrap page (a transient redirect shim) doesn't carry globals
 * into the SPA after window.location.replace(). So that second check was
 * dead code and has been removed.
 */
function readAdminFlag(): boolean {
  if (typeof window === 'undefined') return false;
  try {
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
    if (!readAdminFlag()) {
      setUnauthorized(true);
    }
    setBooting(false);
  }, []);

  // Stable identity so downstream effects don't capture a fresh closure on
  // every render (the previous inline definition caused an
  // exhaustive-deps issue: the effect at the bottom was missing `recheck`
  // from its deps array, which is harmless today but becomes a latent
  // stale-closure hazard the moment anything else is added to `recheck`).
  const recheck = useCallback(async () => {
    const session = await getAdminSession().catch(() => null);
    setAuthed(Boolean(session));
  }, []);

  useEffect(() => {
    if (unauthorized) return;
    recheck();
  }, [unauthorized, recheck]);

  if (booting) return null;
  if (unauthorized) return <NotFound />;
  if (!authed) return <AdminLogin onSuccess={recheck} skipBootSessionCheck />;

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
