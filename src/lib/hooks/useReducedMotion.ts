import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const handle = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handle);
    setReduced(mq.matches);
    return () => mq.removeEventListener('change', handle);
  }, []);

  return reduced;
}
