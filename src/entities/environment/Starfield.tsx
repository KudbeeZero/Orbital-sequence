/**
 * Starfield - Background star particles rendered as points.
 * Uses drei's Stars component (configured in EngineCore).
 * This component adds additional subtle nebula-like color variation.
 */

import { useMemo } from 'react';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
  radius?: number;
}

export function Starfield({ count = 1000, radius = 500 }: StarfieldProps) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random position on a sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.8 + Math.random() * 0.2);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Slight color variation: white to blue to warm
      const temp = Math.random();
      if (temp < 0.6) {
        // White
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      } else if (temp < 0.8) {
        // Blue-ish
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Warm
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.7;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [count, radius]);

  return (
    <points geometry={points}>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </points>
  );
}
