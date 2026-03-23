/**
 * math.ts
 *
 * Vector and matrix operations. Provides lightweight math utilities for
 * 3D calculations including vector arithmetic, matrix transformations,
 * quaternion operations, interpolation, and common geometric functions
 * used throughout the game engine.
 */

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function distance3D(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2);
}

export function normalize(v: [number, number, number]): [number, number, number] {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  if (len === 0) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}
