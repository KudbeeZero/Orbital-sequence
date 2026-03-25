/**
 * Earth - Procedural Earth sphere with atmosphere glow effect.
 * Uses a layered approach: inner sphere with gradient material,
 * outer transparent sphere for atmospheric glow, and cloud layer.
 * No external textures required — generates visuals procedurally.
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { EARTH } from '../../constants/visualSettings';
import { useIcStore } from '../../core/state/icStore';
import { BIOME_COLORS, latLonToDegrees, latLonToSphere, biomeName } from '../../core/ic/types';
import type { PlotMetadata } from '../../core/ic/types';

// ─── Plot Overlay ─────────────────────────────────────────────────────────────

/**
 * PlotDots — renders 21,000 land plots as coloured instanced dots on the globe.
 * Loads plot metadata in pages to avoid blocking the main thread.
 */
function PlotDots({ radius }: { radius: number }) {
  const { landNft, principal } = useIcStore();
  const [plots, setPlots] = useState<PlotMetadata[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Load a sample of plots (first 1,000 for initial render; full load in background)
  useEffect(() => {
    if (!landNft) return;
    let cancelled = false;
    async function load() {
      try {
        // Load all 21 pages of 1,000 plots
        const pages: PlotMetadata[][] = [];
        for (let page = 0; page < 21; page++) {
          if (cancelled) break;
          const batch = await (landNft as any).get_plots_range(BigInt(page * 1000), BigInt(1000));
          pages.push(batch);
        }
        if (!cancelled) setPlots(pages.flat());
      } catch { /* canister not yet deployed in dev */ }
    }
    load();
    return () => { cancelled = true; };
  }, [landNft]);

  // Load owned plots
  useEffect(() => {
    if (!landNft || !principal) return;
    (landNft as any).get_tokens_of(principal).then((ids: bigint[]) => {
      setOwnedIds(new Set(ids.map(String)));
    }).catch(() => {});
  }, [landNft, principal]);

  // Build instanced mesh positions + colours
  const { positions, colors } = useMemo(() => {
    const PLOT_RADIUS = radius * 1.005;
    const positions: number[] = [];
    const colors: number[] = [];
    for (const plot of plots) {
      const latDeg = latLonToDegrees(plot.lat);
      const lonDeg = latLonToDegrees(plot.lon);
      const [x, y, z] = latLonToSphere(latDeg, lonDeg, PLOT_RADIUS);
      positions.push(x, y, z);
      const owned = ownedIds.has(String(plot.tokenId));
      const hex = owned ? '#00ffff' : BIOME_COLORS[biomeName(plot.biome)];
      const c = new THREE.Color(hex);
      colors.push(c.r, c.g, c.b);
    }
    return { positions, colors };
  }, [plots, ownedIds, radius]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || positions.length === 0) return;
    const count = positions.length / 3;
    const dummy = new THREE.Object3D();
    const colorArr = new Float32Array(colors);
    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArr, 3));
  }, [positions, colors]);

  if (positions.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length / 3]}>
      <circleGeometry args={[0.01, 4]} />
      <meshBasicMaterial vertexColors depthWrite={false} />
    </instancedMesh>
  );
}

// ─── Earth ────────────────────────────────────────────────────────────────────

export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Procedural earth-like color gradient material
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;

        // Simple noise for land/ocean variation
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          // Convert position to spherical for continent generation
          vec2 uv = vUv * 8.0;
          float n = fbm(uv + time * 0.01);

          // Ocean deep blue to land green
          vec3 ocean = vec3(0.05, 0.15, 0.45);
          vec3 shallowOcean = vec3(0.1, 0.3, 0.5);
          vec3 land = vec3(0.15, 0.45, 0.2);
          vec3 highland = vec3(0.25, 0.5, 0.15);

          float landMask = smoothstep(0.45, 0.55, n);
          vec3 oceanColor = mix(ocean, shallowOcean, smoothstep(0.3, 0.45, n));
          vec3 landColor = mix(land, highland, smoothstep(0.55, 0.7, n));
          vec3 baseColor = mix(oceanColor, landColor, landMask);

          // Fresnel edge glow for atmosphere
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
          vec3 atmosphereColor = vec3(0.3, 0.7, 1.0);
          baseColor = mix(baseColor, atmosphereColor, fresnel * 0.3);

          // Simple diffuse lighting
          vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
          float diff = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.15;

          gl_FragColor = vec4(baseColor * (ambient + diff * 0.85), 1.0);
        }
      `,
    });
  }, []);

  // Atmosphere glow shader
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.7, 1.0, intensity * 0.6);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += EARTH.rotationSpeed;
      (earthRef.current.material as THREE.ShaderMaterial).uniforms.time.value += delta;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += EARTH.rotationSpeed * 1.1;
    }
  });

  return (
    <group>
      {/* Earth surface */}
      <mesh ref={earthRef} material={earthMaterial}>
        <sphereGeometry args={[EARTH.radius, 64, 64]} />
      </mesh>

      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[EARTH.radius * 1.01, 48, 48]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[EARTH.radius * EARTH.atmosphereScale, 48, 48]} />
      </mesh>

      {/* Land plot dots — biome-coloured, owned plots highlighted cyan */}
      <PlotDots radius={EARTH.radius} />
    </group>
  );
}
