/**
 * LightingSystem - Configures sun, ambient, and point lights for the space scene.
 * Exported as props objects to be spread onto R3F light components.
 */

import type { ColorRepresentation } from 'three';

export interface LightConfig {
  color: ColorRepresentation;
  intensity: number;
  position?: [number, number, number];
  castShadow?: boolean;
}

export const sunLight: LightConfig = {
  color: '#fff5e6',
  intensity: 2.5,
  position: [50, 30, 50],
  castShadow: true,
};

export const ambientLight: LightConfig = {
  color: '#1a1a3a',
  intensity: 0.3,
};

export const fillLight: LightConfig = {
  color: '#4488ff',
  intensity: 0.4,
  position: [-30, -10, -20],
};
