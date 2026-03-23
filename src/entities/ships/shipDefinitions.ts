/**
 * shipDefinitions.ts
 *
 * Ship stats configurations. Defines the base statistics, capabilities,
 * weapon slot layouts, and visual properties for every ship in the game.
 * Used by both player ship selection and enemy ship spawning systems.
 */

export interface ShipDefinition {
  id: string;
  name: string;
  speed: number;
  armor: number;
  shieldCapacity: number;
  weaponSlots: number;
  cargoCapacity: number;
  modelPath: string;
}

export const shipDefinitions: Record<string, ShipDefinition> = {};

export default shipDefinitions;
