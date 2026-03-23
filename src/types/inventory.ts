import type { Rarity } from './entities';

export type ItemCategory = 'weapon' | 'gadget' | 'resource' | 'consumable' | 'blueprint';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  quantity: number;
  maxStack: number;
  icon: string;
  description: string;
}

export interface ResourceAmount {
  type: 'iron' | 'gold' | 'crystal' | 'uranium' | 'credits';
  amount: number;
}

export interface InventoryState {
  items: InventoryItem[];
  maxSlots: number;
  credits: number;
  resources: Record<string, number>;
}

export interface QuickSlot {
  slotIndex: number;
  itemId: string | null;
  quantity: number;
  maxQuantity: number;
}
