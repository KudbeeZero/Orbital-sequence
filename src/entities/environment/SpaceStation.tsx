/**
 * SpaceStation - Depot/station 3D placeholder.
 * Will be replaced with a GLTF model when assets are available.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface SpaceStationProps {
  position?: [number, number, number];
}

export function SpaceStation({ position = [15, 0, 0] }: SpaceStationProps) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[2, 1, 3]} />
      <meshStandardMaterial color="#334455" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}
