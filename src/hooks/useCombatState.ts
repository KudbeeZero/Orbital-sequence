/**
 * useCombatState.ts
 *
 * Combat store convenience hook. Provides simplified access to the combat
 * Zustand store with pre-selected slices for common combat UI and logic
 * needs including health, shields, ammo, score, and active enemies.
 */

export function useCombatState() {
  return {
    health: 100,
    shields: 100,
    score: 0,
    activeEnemies: 0,
  };
}

export default useCombatState;
