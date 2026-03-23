import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROGRESSION } from '../../constants/gameBalance';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProgressionStoreState {
  // State
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
  unlockedShips: string[];
  unlockedWeapons: string[];
  completedMissions: string[];
  achievements: string[];

  // Actions
  addXp: (amount: number) => void;
  unlockShip: (shipId: string) => void;
  unlockWeapon: (weaponId: string) => void;
  completeMission: (missionId: string) => void;
  addAchievement: (achievementId: string) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function calculateXpForLevel(level: number): number {
  return Math.floor(
    PROGRESSION.levelXpBase * Math.pow(PROGRESSION.levelXpMultiplier, level - 1),
  );
}

// ── Store ──────────────────────────────────────────────────────────────────────

export const useProgressionStore = create<ProgressionStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      level: 1,
      currentXp: 0,
      xpToNextLevel: calculateXpForLevel(1),
      totalXp: 0,
      unlockedShips: ['scout'],
      unlockedWeapons: ['weapon-plasma-burster'],
      completedMissions: [],
      achievements: [],

      // Actions
      addXp: (amount: number) => {
        const state = get();
        let { level, currentXp, xpToNextLevel } = state;
        let xpRemaining = currentXp + amount;
        const totalXp = state.totalXp + amount;

        // Handle multiple level-ups
        while (xpRemaining >= xpToNextLevel && level < PROGRESSION.maxLevel) {
          xpRemaining -= xpToNextLevel;
          level += 1;
          xpToNextLevel = calculateXpForLevel(level);
        }

        // Clamp at max level
        if (level >= PROGRESSION.maxLevel) {
          level = PROGRESSION.maxLevel;
          xpRemaining = 0;
          xpToNextLevel = 0;
        }

        set({
          level,
          currentXp: xpRemaining,
          xpToNextLevel,
          totalXp,
        });
      },

      unlockShip: (shipId: string) => {
        const { unlockedShips } = get();
        if (unlockedShips.includes(shipId)) return;
        set({ unlockedShips: [...unlockedShips, shipId] });
      },

      unlockWeapon: (weaponId: string) => {
        const { unlockedWeapons } = get();
        if (unlockedWeapons.includes(weaponId)) return;
        set({ unlockedWeapons: [...unlockedWeapons, weaponId] });
      },

      completeMission: (missionId: string) => {
        const { completedMissions } = get();
        if (completedMissions.includes(missionId)) return;
        set({ completedMissions: [...completedMissions, missionId] });
      },

      addAchievement: (achievementId: string) => {
        const { achievements } = get();
        if (achievements.includes(achievementId)) return;
        set({ achievements: [...achievements, achievementId] });
      },
    }),
    {
      name: 'orbital-sequence-progression',
    },
  ),
);

// ── Selectors ──────────────────────────────────────────────────────────────────

export const selectLevelProgress = (
  state: ProgressionStoreState,
): { level: number; progress: number } => ({
  level: state.level,
  progress:
    state.xpToNextLevel > 0 ? state.currentXp / state.xpToNextLevel : 1,
});

export const selectIsShipUnlocked =
  (shipId: string) =>
  (state: ProgressionStoreState): boolean =>
    state.unlockedShips.includes(shipId);

export const selectIsWeaponUnlocked =
  (weaponId: string) =>
  (state: ProgressionStoreState): boolean =>
    state.unlockedWeapons.includes(weaponId);
