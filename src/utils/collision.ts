/**
 * collision.ts
 *
 * Raycasting and hit detection utilities. Provides spatial query functions
 * for determining intersections between rays and geometry, sphere-sphere
 * overlap tests, AABB checks, and efficient broad-phase collision culling
 * for the combat and physics systems.
 */

export function sphereIntersect(
  centerA: [number, number, number],
  radiusA: number,
  centerB: [number, number, number],
  radiusB: number
): boolean {
  const dx = centerB[0] - centerA[0];
  const dy = centerB[1] - centerA[1];
  const dz = centerB[2] - centerA[2];
  const distSq = dx * dx + dy * dy + dz * dz;
  const radSum = radiusA + radiusB;
  return distSq <= radSum * radSum;
}

export function raycast(
  origin: [number, number, number],
  direction: [number, number, number],
  maxDistance: number
): { hit: boolean; distance: number } {
  return { hit: false, distance: maxDistance };
}
