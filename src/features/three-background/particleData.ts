import * as THREE from 'three';

export const PARTICLE_COUNT = 800;
export const ATTRACTION_RADIUS = 0.45;
export const ATTRACTION_STRENGTH = 0.04;
export const IDLE_DRIFT_AMPLITUDE = 0.02;
export const IDLE_DRIFT_SPEED = 0.3;

export type ParticleKind = 'primary' | 'accent' | 'research';

const KIND_COLORS: Record<ParticleKind, THREE.Color> = {
  primary: new THREE.Color('#06bfa8'),
  accent: new THREE.Color('#eca851'),
  research: new THREE.Color('#f757bd'),
};

const KIND_KEYS = Object.keys(KIND_COLORS) as ParticleKind[];

const PLANE_RANGE = 3;

export type ParticleData = {
  positions: Float32Array;
  basePositions: Float32Array;
  velocities: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  kinds: ParticleKind[];
};

const seededRandom = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

export const buildParticleData = (
  count: number = PARTICLE_COUNT,
  seed: number = 0xc0de,
): ParticleData => {
  const rand = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const kinds: ParticleKind[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * PLANE_RANGE * 2;
    const y = (rand() - 0.5) * PLANE_RANGE * 2;
    const z = (rand() - 0.5) * 0.4;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    basePositions[i * 3] = x;
    basePositions[i * 3 + 1] = y;
    basePositions[i * 3 + 2] = z;
    velocities[i * 3] = 0;
    velocities[i * 3 + 1] = 0;
    velocities[i * 3 + 2] = 0;

    const kind = KIND_KEYS[i % 3];
    kinds[i] = kind;
    const color = KIND_COLORS[kind];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = 0.5 + rand() * 0.75;
  }

  return {
    positions,
    basePositions,
    velocities,
    colors,
    sizes,
    kinds,
  };
};
