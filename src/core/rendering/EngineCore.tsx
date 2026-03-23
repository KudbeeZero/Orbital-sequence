/**
 * EngineCore - Main Canvas wrapper and WebGL configuration.
 * Wraps React Three Fiber Canvas with renderer settings optimized for
 * space combat visuals: PBR, tone mapping, shadows, and performance monitoring.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, AdaptiveDpr } from '@react-three/drei';
import { type ReactNode, Suspense, useCallback, useRef } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { defaultCameraConfig, menuOrbitConfig, gameplayOrbitConfig } from './CameraController';
import { sunLight, ambientLight, fillLight } from './LightingSystem';

interface EngineCoreProps {
  children: ReactNode;
  mode: 'menu' | 'gameplay';
}

export function EngineCore({ children, mode }: EngineCoreProps) {
  const orbitConfig = mode === 'menu' ? menuOrbitConfig : gameplayOrbitConfig;
  const controlsRef = useRef(null);

  const onCreated = useCallback(() => {
    // Scene is ready — future: trigger loading complete event
  }, []);

  return (
    <Canvas
      camera={{
        fov: defaultCameraConfig.fov,
        near: defaultCameraConfig.near,
        far: defaultCameraConfig.far,
        position: defaultCameraConfig.position,
      }}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: SRGBColorSpace,
      }}
      shadows
      onCreated={onCreated}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <AdaptiveDpr pixelated />

      {/* Lighting */}
      <ambientLight color={ambientLight.color} intensity={ambientLight.intensity} />
      <directionalLight
        color={sunLight.color}
        intensity={sunLight.intensity}
        position={sunLight.position}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        color={fillLight.color}
        intensity={fillLight.intensity}
        position={fillLight.position}
      />

      {/* Background stars */}
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={0.5} />

      {/* Camera controls */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={orbitConfig.enableZoom}
        enablePan={orbitConfig.enablePan}
        minDistance={orbitConfig.minDistance}
        maxDistance={orbitConfig.maxDistance}
        enableDamping={orbitConfig.enableDamping}
        dampingFactor={orbitConfig.dampingFactor}
        autoRotate={orbitConfig.autoRotate}
        autoRotateSpeed={orbitConfig.autoRotateSpeed}
        maxPolarAngle={orbitConfig.maxPolarAngle}
        minPolarAngle={orbitConfig.minPolarAngle}
      />

      {/* Scene content */}
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}
