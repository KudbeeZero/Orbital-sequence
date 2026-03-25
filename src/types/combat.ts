import type { Vector3Tuple } from 'three';
import type { Rarity } from './entities';

/** Weapon category determines firing behavior and visual effects */
export type WeaponType = 'projectile' | 'beam' | 'missile' | 'plasma' | 'laser' | 'cannon';

/** Damage type determines which defense stat is checked */
export type DamageType = 'kinetic' | 'energy' | 'explosive' | 'electromagnetic';

export interface WeaponDefinition {
  id: string;
  name: string;
  type: WeaponType;
  damageType: DamageType;
  rarity: Rarity;
  baseDamage: number;
  fireRate: number;       // shots per second
  range: number;          // max effective range
  accuracy: number;       // 0-1 hit probability at max range
  ammoCapacity: number;
  currentAmmo: number;
  description: string;
}

export interface TargetLock {
  targetId: string;
  lockProgress: number;   // 0-1, 1 = fully locked
  lockTime: number;       // seconds to achieve full lock
  distance: number;
  position: Vector3Tuple;
}

export interface CombatState {
  isInCombat: boolean;
  activeWeaponIndex: number;
  equippedWeapons: WeaponDefinition[];
  currentTarget: TargetLock | null;
  nearbyTargets: TargetLock[];
  killCount: number;
  damageDealt: number;
  damageTaken: number;
}

export interface DamageEvent {
  sourceId: string;
  targetId: string;
  weaponId: string;
  rawDamage: number;
  finalDamage: number;
  isCritical: boolean;
  hitPosition: Vector3Tuple;
}

export interface ProjectileState {
  id: string;
  weaponId: string;
  position: Vector3Tuple;
  velocity: Vector3Tuple;
  damage: number;
  lifetime: number;
}
