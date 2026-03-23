/**
 * CameraController - Orbital camera that rotates around Earth.
 * Uses @react-three/drei's OrbitControls with constrained parameters.
 * This file exports configuration; the actual component is used in EngineCore.
 */

import { CAMERA } from '../../constants/visualSettings';

export interface CameraConfig {
  fov: number;
  near: number;
  far: number;
  position: [number, number, number];
}

export interface OrbitConfig {
  enableZoom: boolean;
  enablePan: boolean;
  minDistance: number;
  maxDistance: number;
  enableDamping: boolean;
  dampingFactor: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  maxPolarAngle: number;
  minPolarAngle: number;
}

export const defaultCameraConfig: CameraConfig = {
  fov: CAMERA.fov,
  near: CAMERA.near,
  far: CAMERA.far,
  position: [0, 8, CAMERA.defaultDistance],
};

export const menuOrbitConfig: OrbitConfig = {
  enableZoom: false,
  enablePan: false,
  minDistance: CAMERA.orbitMinDistance,
  maxDistance: CAMERA.orbitMaxDistance,
  enableDamping: true,
  dampingFactor: CAMERA.orbitDamping,
  autoRotate: true,
  autoRotateSpeed: 0.3,
  maxPolarAngle: Math.PI * 0.75,
  minPolarAngle: Math.PI * 0.25,
};

export const gameplayOrbitConfig: OrbitConfig = {
  enableZoom: true,
  enablePan: false,
  minDistance: CAMERA.orbitMinDistance,
  maxDistance: CAMERA.orbitMaxDistance,
  enableDamping: true,
  dampingFactor: CAMERA.orbitDamping,
  autoRotate: false,
  autoRotateSpeed: 0,
  maxPolarAngle: Math.PI * 0.85,
  minPolarAngle: Math.PI * 0.15,
};
