/**
 * shipDefinitions.ts
 *
 * Ship stats configurations. Defines the base statistics, capabilities,
 * weapon slot layouts, and visual properties for every ship in the game.
 * Used by both player ship selection and enemy ship spawning systems.
 */

import type { ShipDefinition as BaseShipDefinition } from '../../types/entities';

export interface ShipDefinition extends BaseShipDefinition {
  armor: number;
  shieldCapacity: number;
  modelPath: string;
}

export const shipDefinitions: Record<string, ShipDefinition> = {};

export default shipDefinitions;
