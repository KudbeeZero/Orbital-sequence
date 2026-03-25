import type { Principal } from '@dfinity/principal';

export type { Principal };

export type Biome =
  | { Forest: null }
  | { Desert: null }
  | { Mountain: null }
  | { Plains: null }
  | { Water: null }
  | { Tundra: null }
  | { Volcanic: null }
  | { Swamp: null };

export type BiomeName = 'Forest' | 'Desert' | 'Mountain' | 'Plains' | 'Water' | 'Tundra' | 'Volcanic' | 'Swamp';

export interface PlotMetadata {
  tokenId: bigint;
  biome: Biome;
  lat: bigint;
  lon: bigint;
  ironYield: bigint;
  fuelYield: bigint;
  crystalYield: bigint;
}

export type AvatarTier =
  | { Sentinel: null }
  | { Phantom: null }
  | { Reaper: null };

export interface CommanderAvatar {
  owner: Principal;
  tier: AvatarTier;
  mintedAt: bigint;
  combatBonus: bigint;
}

export interface Battle {
  id: bigint;
  attacker: Principal;
  defender: Principal;
  plotId: bigint;
  startTime: bigint;
  status: { Active: null } | { Pending: null } | { Resolved: null };
  winner: [] | [Principal];
}

export interface AiFaction {
  name: string;
  color: string;
  plotIds: bigint[];
}

/** Helper: extract biome name string from variant */
export function biomeName(biome: Biome): BiomeName {
  if ('Forest'   in biome) return 'Forest';
  if ('Desert'   in biome) return 'Desert';
  if ('Mountain' in biome) return 'Mountain';
  if ('Plains'   in biome) return 'Plains';
  if ('Water'    in biome) return 'Water';
  if ('Tundra'   in biome) return 'Tundra';
  if ('Volcanic' in biome) return 'Volcanic';
  return 'Swamp';
}

/** Biome colours for globe overlay */
export const BIOME_COLORS: Record<BiomeName, string> = {
  Forest:   '#22c55e',
  Desert:   '#d97706',
  Mountain: '#9ca3af',
  Plains:   '#84cc16',
  Water:    '#3b82f6',
  Tundra:   '#e0f2fe',
  Volcanic: '#ef4444',
  Swamp:    '#4d7c0f',
};

/** Convert fixed-point lat/lon (×100) to degrees */
export function latLonToDegrees(raw: bigint): number {
  return Number(raw) / 100;
}

/** Convert lat/lon degrees to 3D sphere point (radius r) */
export function latLonToSphere(latDeg: number, lonDeg: number, r: number): [number, number, number] {
  const phi   = ((90 - latDeg) * Math.PI) / 180;
  const theta = ((lonDeg + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  ];
}
