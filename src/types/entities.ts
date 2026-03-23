import type { Vector3Tuple } from 'three';

/** Ship class determines base stats and available equipment slots */
export type ShipClass = 'scout' | 'cruiser' | 'miner' | 'destroyer' | 'carrier';

/** Rarity tier affects stat scaling and visual border color */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ShipDefinition {
  id: string;
  name: string;
  class: ShipClass;
  hp: number;
  shield: number;
  speed: number;
  agility: number;
  cargoCapacity: number;
  weaponSlots: number;
  gadgetSlots: number;
  description: string;
}

export interface ShipState {
  definitionId: string;
  currentHp: number;
  currentShield: number;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  velocity: Vector3Tuple;
  equippedWeapons: string[];
  equippedGadgets: string[];
}

export interface EnemyShipState extends ShipState {
  aiPattern: 'patrol' | 'aggressive' | 'defensive' | 'flee';
  targetId: string | null;
  alertLevel: number;
}

export interface SpaceStationDefinition {
  id: string;
  name: string;
  position: Vector3Tuple;
  services: ('repair' | 'trade' | 'upgrade' | 'mission')[];
}

export interface AsteroidDefinition {
  id: string;
  position: Vector3Tuple;
  scale: number;
  resourceType: 'iron' | 'gold' | 'crystal' | 'uranium';
  resourceAmount: number;
}
