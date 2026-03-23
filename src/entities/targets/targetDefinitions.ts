/**
 * targetDefinitions.ts
 *
 * Target configurations. Defines health, armor, reward values, visual
 * properties, and behavior parameters for all targetable entities
 * including ground installations, space stations, and destructible objects.
 */

export interface TargetDefinition {
  id: string;
  name: string;
  health: number;
  armor: number;
  reward: number;
  modelPath: string;
}

export const targetDefinitions: Record<string, TargetDefinition> = {};

export default targetDefinitions;
