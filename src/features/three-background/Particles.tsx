import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  ATTRACTION_RADIUS,
  ATTRACTION_STRENGTH,
  buildParticleData,
  IDLE_DRIFT_AMPLITUDE,
  IDLE_DRIFT_SPEED,
  type ParticleData,
} from './particleData';
import { useMousePointer, type PointerState } from './useMousePointer';

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = smoothstep(-2.0, 0.0, mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.35, 0.5, dist)) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const INV_DENOM = 1 / (3 * 3);

const stepSimulation = (
  data: ParticleData,
  pointer: PointerState,
  time: number,
  delta: number,
): void => {
  const targetX = pointer.current.x * 2.2;
  const targetY = pointer.current.y * 1.4;

  for (let i = 0; i < data.positions.length / 3; i++) {
    const ix3 = i * 3;

    const px = data.positions[ix3];
    const py = data.positions[ix3 + 1];
    const bx = data.basePositions[ix3];
    const by = data.basePositions[ix3 + 1];

    const dx = targetX - px;
    const dy = targetY - py;
    const dist2 = dx * dx + dy * dy;
    const inRange = dist2 < ATTRACTION_RADIUS * ATTRACTION_RADIUS;

    if (inRange && pointer.active) {
      const f = ATTRACTION_STRENGTH * (1 - Math.sqrt(dist2) / ATTRACTION_RADIUS);
      data.velocities[ix3] += dx * f * delta;
      data.velocities[ix3 + 1] += dy * f * delta;
    }

    const driftX = Math.sin(time * IDLE_DRIFT_SPEED + bx * 2.1) * IDLE_DRIFT_AMPLITUDE;
    const driftY = Math.cos(time * IDLE_DRIFT_SPEED + by * 1.7) * IDLE_DRIFT_AMPLITUDE;
    const restoringX = (bx + driftX - px) * 0.02;
    const restoringY = (by + driftY - py) * 0.02;
    data.velocities[ix3] += restoringX;
    data.velocities[ix3 + 1] += restoringY;

    data.velocities[ix3] *= 0.94;
    data.velocities[ix3 + 1] *= 0.94;
    data.velocities[ix3 + 2] *= 0.94;

    data.positions[ix3] += data.velocities[ix3];
    data.positions[ix3 + 1] += data.velocities[ix3 + 1];
    data.positions[ix3 + 2] += data.velocities[ix3 + 2];
  }
};

export function Particles() {
  const pointerRef = useMousePointer();
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const positionsRef = useRef<Float32Array | null>(null);

  const data = useMemo(() => buildParticleData(), []);

  const material = useMemo(
    () => new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    }),
    [],
  );

  useFrame((_, delta) => {
    const pointer = pointerRef.current;
    pointer.current.lerp(pointer.target, 0.08);

    const safeDelta = Math.min(delta, 1 / 30);
    stepSimulation(data, pointer, performance.now() / 1000, safeDelta);

    const geom = geomRef.current;
    if (geom) {
      const attr = geom.getAttribute('position') as THREE.BufferAttribute;
      attr.array = data.positions;
      attr.needsUpdate = true;
    }
    positionsRef.current = data.positions;

    void INV_DENOM;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[data.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[data.sizes, 1]}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}
