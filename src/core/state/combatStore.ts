import { create } from 'zustand';
import { RESOURCES } from '../../constants/gameBalance';
import type { WeaponType } from '../../types/combat';
import type { Rarity } from '../../types/entities';

// ── Types ──────────────────────────────────────────────────────────────────────

export type { WeaponType, Rarity };

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  rarity: Rarity;
  baseDamage: number;
  fireRate: number;
  currentAmmo: number;
  ammoCapacity: number;
}

export interface TargetInfo {
  targetId: string;
  lockProgress: number;
  distance: number;
}

export interface NearbyTarget {
  targetId: string;
  distance: number;
}

// ── State & Actions ────────────────────────────────────────────────────────────

export interface CombatStoreState {
  // State
  isInCombat: boolean;
  activeWeaponIndex: number;
  weapons: Weapon[];
  currentTarget: TargetInfo | null;
  nearbyTargets: NearbyTarget[];
  oxygen: number;
  hull: number;
  shield: number;
  sector: number;
  killCount: number;

  // Actions
  enterCombat: () => void;
  exitCombat: () => void;
  setActiveWeapon: (index: number) => void;
  fireWeapon: () => void;
  setTarget: (target: TargetInfo) => void;
  clearTarget: () => void;
  updateLockProgress: (progress: number) => void;
  takeDamage: (amount: number) => void;
  repairHull: (amount: number) => void;
  consumeOxygen: (amount: number) => void;
  refillOxygen: (amount: number) => void;
  setSector: (sector: number) => void;
  incrementKills: () => void;
}

// ── Default weapons ────────────────────────────────────────────────────────────

const DEFAULT_WEAPONS: Weapon[] = [
  {
    id: 'weapon-plasma-burster',
    name: 'Plasma Burster',
    type: 'plasma',
    rarity: 'common',
    baseDamage: 45,
    fireRate: 3.2,
    currentAmmo: 120,
    ammoCapacity: 120,
  },
  {
    id: 'weapon-ion-disruptor',
    name: 'Ion Disruptor',
    type: 'beam',
    rarity: 'uncommon',
    baseDamage: 30,
    fireRate: 5.0,
    currentAmmo: 200,
    ammoCapacity: 200,
  },
  {
    id: 'weapon-shield-breaker',
    name: 'Shield Breaker',
    type: 'missile',
    rarity: 'rare',
    baseDamage: 120,
    fireRate: 0.8,
    currentAmmo: 16,
    ammoCapacity: 16,
  },
  {
    id: 'weapon-kuel-supere',
    name: 'Kuel Supere',
    type: 'projectile',
    rarity: 'epic',
    baseDamage: 75,
    fireRate: 2.4,
    currentAmmo: 80,
    ammoCapacity: 80,
  },
  {
    id: 'weapon-soak-llaner',
    name: 'Soak Llaner',
    type: 'beam',
    rarity: 'legendary',
    baseDamage: 95,
    fireRate: 1.6,
    currentAmmo: 50,
    ammoCapacity: 50,
  },
  {
    id: 'weapon-shield-ublnr',
    name: 'Shield Ublnr',
    type: 'plasma',
    rarity: 'rare',
    baseDamage: 60,
    fireRate: 2.0,
    currentAmmo: 100,
    ammoCapacity: 100,
  },
];

// ── Store ──────────────────────────────────────────────────────────────────────

export const useCombatStore = create<CombatStoreState>()((set, get) => ({
  // Initial state
  isInCombat: false,
  activeWeaponIndex: 0,
  weapons: DEFAULT_WEAPONS,
  currentTarget: null,
  nearbyTargets: [],
  oxygen: RESOURCES.startingOxygen,
  hull: RESOURCES.startingHull,
  shield: 100,
  sector: 1,
  killCount: 0,

  // Actions
  enterCombat: () => set({ isInCombat: true }),

  exitCombat: () =>
    set({
      isInCombat: false,
      currentTarget: null,
      nearbyTargets: [],
    }),

  setActiveWeapon: (index: number) => {
    const { weapons } = get();
    if (index >= 0 && index < weapons.length) {
      set({ activeWeaponIndex: index });
    }
  },

  fireWeapon: () => {
    const { activeWeaponIndex, weapons } = get();
    const weapon = weapons[activeWeaponIndex];
    if (!weapon || weapon.currentAmmo <= 0) return;

    const updatedWeapons = weapons.map((w, i) =>
      i === activeWeaponIndex ? { ...w, currentAmmo: w.currentAmmo - 1 } : w,
    );
    set({ weapons: updatedWeapons });
  },

  setTarget: (target: TargetInfo) => set({ currentTarget: target }),

  clearTarget: () => set({ currentTarget: null }),

  updateLockProgress: (progress: number) => {
    const { currentTarget } = get();
    if (!currentTarget) return;
    set({
      currentTarget: {
        ...currentTarget,
        lockProgress: Math.min(1, Math.max(0, progress)),
      },
    });
  },

  takeDamage: (amount: number) => {
    const { shield, hull } = get();
    let remaining = amount;

    let newShield = shield;
    let newHull = hull;

    if (newShield > 0) {
      const absorbed = Math.min(newShield, remaining);
      newShield -= absorbed;
      remaining -= absorbed;
    }

    if (remaining > 0) {
      newHull = Math.max(0, newHull - remaining);
    }

    set({ shield: newShield, hull: newHull });
  },

  repairHull: (amount: number) => {
    const { hull } = get();
    set({ hull: Math.min(100, hull + amount) });
  },

  consumeOxygen: (amount: number) => {
    const { oxygen } = get();
    set({ oxygen: Math.max(0, oxygen - amount) });
  },

  refillOxygen: (amount: number) => {
    const { oxygen } = get();
    set({ oxygen: Math.min(100, oxygen + amount) });
  },

  setSector: (sector: number) => set({ sector }),

  incrementKills: () => set((state) => ({ killCount: state.killCount + 1 })),
}));

// ── Selectors ──────────────────────────────────────────────────────────────────

export const selectActiveWeapon = (state: CombatStoreState): Weapon | undefined =>
  state.weapons[state.activeWeaponIndex];

export const selectIsTargetLocked = (state: CombatStoreState): boolean =>
  state.currentTarget !== null && state.currentTarget.lockProgress >= 1;

export const selectVitals = (
  state: CombatStoreState,
): { oxygen: number; hull: number; shield: number } => ({
  oxygen: state.oxygen,
  hull: state.hull,
  shield: state.shield,
});
