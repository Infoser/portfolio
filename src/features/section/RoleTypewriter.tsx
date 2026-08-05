import { useEffect, useMemo, useRef, useState } from 'react';
import { useSection } from '@/lib/hooks/useSection';
import { cn } from '@/lib/utils';

// Typewriter shown at the top of the About section. Renders a fixed
// "I am " prefix followed by a role that types in, holds, deletes out,
// and moves to the next role — looping forever. Roles are loaded from
// the `about_roles` meta section (admin-editable via the Supabase
// `sections` table; falls back to a bundled default list when no live
// row exists).
//
// The animation is driven by a tiny rAF state machine (states: 'typing',
// 'holding', 'deleting', 'idle-before-next'). All timing is in milli-
// seconds so it's frame-rate-independent. Reduced-motion users see the
// roles cross-fade on a slow cadence instead of per-char typing — a
// soft concession to accessibility that still changes the role.

const PREFIX = 'I am ';

const TYPE_RATE_MS = 65;     // ms per character typed
const DELETE_RATE_MS = 35;   // ms per character deleted (faster than typing)
const HOLD_MS = 1400;        // pause after a role is fully typed
const POST_DELETE_MS = 250;  // pause after a role is fully deleted, before next
const CARET_BLINK_MS = 500; // caret blink cadence

const REDUCED_TYPE_RATE_MS = 110;
const REDUCED_HOLD_MS = 1800;

type Phase = 'typing' | 'holding' | 'deleting' | 'gap';

export function RoleTypewriter() {
  const { content, isLoading } = useSection('about_roles');
  // Memoized so the array reference is stable across renders that don't
  // actually change the roles content (otherwise the rAF effect below
  // tears itself down and restarts every parent re-render).
  const roles = useMemo(
    () =>
      content &&
      content.kind === 'about_roles' &&
      content.enabled &&
      content.roles.length > 0
        ? content.roles
        : [],
    [content],
  );
  const hasRoles = roles.length > 0;
  // Stable string key for the reset effect — avoids putting an inline
  // `.join()` expression in the deps array (which lint can't analyse).
  const rolesKey = useMemo(() => roles.join('\u0001'), [roles]);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [roleIdx, setRoleIdx] = useState(0);
  const [caretOn, setCaretOn] = useState(true);

  // Phase-start timestamp. Using rAF with elapsed-time comparison keeps
  // the animation pinned to wall-clock ms rather than frame count —
  // same feel on 60 and 144 Hz.
  const phaseStartRef = useRef<number>(performance.now());

  // Reset the typewriter when the roles list identity changes (admin
  // edit, live refresh, or first load). Walks back to role 0 with an
  // empty string and starts typing the first role.
  useEffect(() => {
    if (!hasRoles) {
      setText('');
      return;
    }
    setText('');
    setRoleIdx(0);
    setPhase('typing');
    phaseStartRef.current = performance.now();
  }, [hasRoles, rolesKey]);

  useEffect(() => {
    if (!hasRoles) return;

    let raf = 0;

    const frame = (now: number) => {
      const phaseElapsed = now - phaseStartRef.current;

      const current = roles[roleIdx] ?? '';

      if (phase === 'typing') {
        const rate = reducedMotion ? REDUCED_TYPE_RATE_MS : TYPE_RATE_MS;
        // How many characters we *should* have typed by now.
        const visible = Math.min(current.length, Math.floor(phaseElapsed / rate));
        const next = current.slice(0, visible);
        if (next !== text) setText(next);
        if (visible >= current.length) {
          // Finished typing this role → hold.
          setPhase('holding');
          phaseStartRef.current = now;
        }
      } else if (phase === 'holding') {
        const holdMs = reducedMotion ? REDUCED_HOLD_MS : HOLD_MS;
        if (phaseElapsed >= holdMs) {
          // If there's only one role and we're not deleting, just stay
          // typed (no point deleting+retyping the same word forever).
          if (roles.length === 1) {
            // Stay in holding; reset the phase clock so we hold again.
            phaseStartRef.current = now;
          } else {
            setPhase('deleting');
            phaseStartRef.current = now;
          }
        }
      } else if (phase === 'deleting') {
        const rate = reducedMotion ? REDUCED_TYPE_RATE_MS : DELETE_RATE_MS;
        // How many characters we should have *remaining*.
        const remaining = Math.max(
          0,
          current.length - Math.floor(phaseElapsed / rate),
        );
        const next = current.slice(0, remaining);
        if (next !== text) setText(next);
        if (remaining === 0) {
          setPhase('gap');
          phaseStartRef.current = now;
        }
      } else if (phase === 'gap') {
        if (phaseElapsed >= POST_DELETE_MS) {
          // Move to the next role, wrap the index, start typing.
          setRoleIdx((i) => (i + 1) % roles.length);
          setPhase('typing');
          phaseStartRef.current = now;
          setText('');
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [hasRoles, phase, roleIdx, roles, text, reducedMotion]);

  // Independent caret blink — a separate cheap rAF so the blink cadence
  // doesn't consume a slot in the typing state machine.
  useEffect(() => {
    if (!hasRoles) return;
    let raf = 0;
    let last = performance.now();
    const blink = (now: number) => {
      if (now - last >= CARET_BLINK_MS) {
        setCaretOn((v) => !v);
        last = now;
      }
      raf = requestAnimationFrame(blink);
    };
    raf = requestAnimationFrame(blink);
    return () => cancelAnimationFrame(raf);
  }, [hasRoles]);

  if (isLoading && !hasRoles) {
    // Keep layout space while loading so the About section doesn't jump
    // when the roles load.
    return (
      <p
        aria-live="polite"
        className="font-display text-2xl font-medium tracking-tight text-muted-foreground"
      >
        <span className="opacity-50">{PREFIX}</span>
        <span className="opacity-30">…</span>
      </p>
    );
  }

  if (!hasRoles) return null;

  return (
    <p
      aria-live="polite"
      aria-label={`${PREFIX}${roles[roleIdx] ?? ''}`}
      className="font-display text-2xl font-medium tracking-tight"
    >
      <span className="text-foreground">{PREFIX}</span>
      <span className="text-primary tabular-nums">{text}</span>
      <span
        aria-hidden="true"
        className={cn(
          'ml-0.5 inline-block w-[2px] self-stretch bg-primary transition-opacity',
          caretOn ? 'opacity-100' : 'opacity-0',
        )}
        style={{ height: '1.1em' }}
      />
    </p>
  );
}
