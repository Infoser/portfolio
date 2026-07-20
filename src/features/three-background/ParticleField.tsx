import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Particles } from './Particles';

export function ParticleField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}
