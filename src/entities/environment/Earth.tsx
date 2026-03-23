/**
 * Earth - Procedural Earth sphere with atmosphere glow effect.
 * Uses a layered approach: inner sphere with gradient material,
 * outer transparent sphere for atmospheric glow, and cloud layer.
 * No external textures required — generates visuals procedurally.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { EARTH } from '../../constants/visualSettings';

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
    </group>
  );
}
