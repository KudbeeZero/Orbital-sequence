/**
 * Asteroids - Instanced asteroid field using random placement around a region.
 * Uses instanced mesh for performance with procedural positioning.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidsProps {
  count?: number;
  spread?: number;
  center?: [number, number, number];
}

export function Asteroids({ count = 30, spread = 40, center = [30, 0, 0] }: AsteroidsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo(() => {
    const temp = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();

    const result: THREE.Matrix4[] = [];
    for (let i = 0; i < count; i++) {
      position.set(
        center[0] + (Math.random() - 0.5) * spread,
        center[1] + (Math.random() - 0.5) * spread * 0.3,
        center[2] + (Math.random() - 0.5) * spread,
      );
      rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      quaternion.setFromEuler(rotation);
      const s = 0.2 + Math.random() * 0.8;
      scale.set(s, s * (0.6 + Math.random() * 0.4), s);

      temp.compose(position, quaternion, scale);
      result.push(temp.clone());
    }
    return result;
  }, [count, spread, center]);

  // Set initial matrices
  useMemo(() => {
    if (meshRef.current) {
      matrices.forEach((m, i) => meshRef.current!.setMatrixAt(i, m));
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  useFrame(() => {
    if (meshRef.current && !meshRef.current.instanceMatrix.needsUpdate) {
      // Lazy init on first frame if needed
      matrices.forEach((m, i) => meshRef.current!.setMatrixAt(i, m));
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#555544" roughness={0.9} metalness={0.1} />
    </instancedMesh>
  );
}
