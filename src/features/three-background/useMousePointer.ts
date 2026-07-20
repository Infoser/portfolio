import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type PointerState = {
  current: THREE.Vector2;
  target: THREE.Vector2;
  active: boolean;
  lastMoveAt: number;
};

const IDLE_TIMEOUT_MS = 2000;

export function useMousePointer(): React.MutableRefObject<PointerState> {
  const ref = useRef<PointerState>({
    current: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(0, 0),
    active: false,
    lastMoveAt: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      ref.current.target.set(x, y);
      ref.current.active = true;
      ref.current.lastMoveAt = performance.now();
    };

    const onLeave = () => {
      ref.current.active = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return ref;
}

export const isPointerIdle = (state: PointerState, now: number): boolean =>
  !state.active || now - state.lastMoveAt > IDLE_TIMEOUT_MS;

export type { PointerState };
