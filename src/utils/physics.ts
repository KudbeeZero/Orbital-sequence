/**
 * physics.ts
 *
 * Collision and trajectory utilities. Provides physics calculations for
 * projectile trajectories, gravitational effects, velocity integration,
 * and basic rigid body dynamics used by combat and flight systems.
 */

export function calculateTrajectory(
  origin: [number, number, number],
  velocity: [number, number, number],
  time: number
): [number, number, number] {
  return [
    origin[0] + velocity[0] * time,
    origin[1] + velocity[1] * time,
    origin[2] + velocity[2] * time,
  ];
}

export function applyGravity(
  velocity: [number, number, number],
  gravity: number,
  delta: number
): [number, number, number] {
  return [velocity[0], velocity[1] - gravity * delta, velocity[2]];
}
