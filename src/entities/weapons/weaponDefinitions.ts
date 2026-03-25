/**
 * weaponDefinitions.ts
 *
 * Weapon stats and behaviors. Defines base damage, fire rate, range,
 * projectile speed, energy cost, and special properties for every weapon
 * type in the game. Used by WeaponController and DamageCalculation systems.
 */

import type { WeaponType } from '../../types/combat';

export interface WeaponDefinition {
  id: string;
  name: string;
  type: WeaponType;
  baseDamage: number;
  fireRate: number;
  range: number;
  projectileSpeed: number;
  energyCost: number;
}

export const weaponDefinitions: Record<string, WeaponDefinition> = {};

export default weaponDefinitions;
