/** Core game balance values — tweak these to adjust difficulty and progression */

export const SHIP_STATS = {
  scout:     { hp: 1200, shield: 400,  speed: 280, agility: 0.9, cargo: 20,  weaponSlots: 2, gadgetSlots: 2 },
  cruiser:   { hp: 3500, shield: 1200, speed: 160, agility: 0.5, cargo: 60,  weaponSlots: 4, gadgetSlots: 3 },
  miner:     { hp: 2800, shield: 800,  speed: 140, agility: 0.4, cargo: 120, weaponSlots: 2, gadgetSlots: 4 },
  destroyer: { hp: 5000, shield: 2000, speed: 120, agility: 0.3, cargo: 40,  weaponSlots: 6, gadgetSlots: 2 },
  carrier:   { hp: 8000, shield: 3000, speed: 80,  agility: 0.2, cargo: 200, weaponSlots: 3, gadgetSlots: 5 },
} as const;

export const COMBAT = {
  criticalHitChance: 0.15,
  criticalHitMultiplier: 2.0,
  shieldRegenRate: 5,        // points per second
  shieldRegenDelay: 3,       // seconds after last hit
  lockOnBaseTime: 1.5,       // seconds to lock target
  maxTargetDistance: 1500,
  projectileSpeed: 400,
  missileSpeed: 200,
  beamDuration: 0.5,
} as const;

export const RESOURCES = {
  oxygenDrainRate: 0.02,     // percent per second
  oxygenRefillRate: 0.5,
  hullRepairRate: 2,
  miningBaseRate: 10,
  startingOxygen: 100,
  startingHull: 100,
  startingCredits: 500,
} as const;

export const PROGRESSION = {
  xpPerKill: 50,
  xpPerMission: 200,
  xpPerMining: 10,
  levelXpBase: 100,
  levelXpMultiplier: 1.5,
  maxLevel: 50,
} as const;

export const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#f59e0b',
} as const;
