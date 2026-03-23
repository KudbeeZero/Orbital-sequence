/** Visual quality presets and rendering configuration */

export const QUALITY_PRESETS = {
  low: {
    shadowMapSize: 512,
    antialias: false,
    bloom: false,
    dof: false,
    particles: 100,
    asteroidCount: 20,
    starCount: 500,
  },
  medium: {
    shadowMapSize: 1024,
    antialias: true,
    bloom: true,
    dof: false,
    particles: 500,
    asteroidCount: 50,
    starCount: 2000,
  },
  high: {
    shadowMapSize: 2048,
    antialias: true,
    bloom: true,
    dof: true,
    particles: 2000,
    asteroidCount: 100,
    starCount: 5000,
  },
  ultra: {
    shadowMapSize: 4096,
    antialias: true,
    bloom: true,
    dof: true,
    particles: 5000,
    asteroidCount: 200,
    starCount: 10000,
  },
} as const;

export type QualityLevel = keyof typeof QUALITY_PRESETS;

export const PERFORMANCE = {
  targetFps: 60,
  fpsDropThreshold: 55,
  qualityCheckInterval: 2000,  // ms between quality checks
} as const;

export const COLORS = {
  primary: '#00ffff',
  primaryDim: '#00cccc',
  accent: '#00ff88',
  danger: '#ff4444',
  warning: '#ffaa00',
  panelBg: 'rgba(0, 10, 20, 0.85)',
  panelBorder: 'rgba(0, 255, 255, 0.3)',
} as const;

export const EARTH = {
  radius: 6,
  atmosphereScale: 1.15,
  orbitDistance: 20,
  rotationSpeed: 0.001,
} as const;

export const CAMERA = {
  fov: 60,
  near: 0.1,
  far: 10000,
  orbitMinDistance: 12,
  orbitMaxDistance: 50,
  orbitDamping: 0.05,
  defaultDistance: 25,
} as const;
