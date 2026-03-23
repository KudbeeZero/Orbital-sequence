import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RESOURCES } from '../../constants/gameBalance';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ItemCategory =
  | 'weapon'
  | 'consumable'
  | 'material'
  | 'quest'
  | 'gadget';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  maxStack: number;
  description: string;
  value: number;
}

export interface QuickSlot {
  slotIndex: number;
  itemId: string | null;
  quantity: number;
  maxQuantity: number;
}

// ── State & Actions ────────────────────────────────────────────────────────────

export interface InventoryStoreState {
  // State
  items: InventoryItem[];
  credits: number;
  maxSlots: number;
  quickSlots: QuickSlot[];

  // Actions
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setQuickSlot: (slotIndex: number, itemId: string, quantity: number) => void;
  clearQuickSlot: (slotIndex: number) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  canAfford: (amount: number) => boolean;
}

// ── Default quick slots ────────────────────────────────────────────────────────

const DEFAULT_QUICK_SLOTS: QuickSlot[] = Array.from({ length: 6 }, (_, i) => ({
  slotIndex: i,
  itemId: null,
  quantity: 0,
  maxQuantity: 99,
}));

// ── Store ──────────────────────────────────────────────────────────────────────

export const useInventoryStore = create<InventoryStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      credits: RESOURCES.startingCredits,
      maxSlots: 30,
      quickSlots: DEFAULT_QUICK_SLOTS,

      // Actions
      addItem: (item: InventoryItem) => {
        const { items, maxSlots } = get();

        // Try to stack with an existing item of the same id
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          const newQty = Math.min(
            existing.maxStack,
            existing.quantity + item.quantity,
          );
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: newQty } : i,
            ),
          });
          return;
        }

        // Otherwise add as new item if there's space
        if (items.length < maxSlots) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (itemId: string) => {
        const { items, quickSlots } = get();
        set({
          items: items.filter((i) => i.id !== itemId),
          // Also clear any quick slots referencing this item
          quickSlots: quickSlots.map((slot) =>
            slot.itemId === itemId
              ? { ...slot, itemId: null, quantity: 0 }
              : slot,
          ),
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: items.map((i) =>
            i.id === itemId
              ? { ...i, quantity: Math.min(i.maxStack, quantity) }
              : i,
          ),
        });
      },

      setQuickSlot: (slotIndex: number, itemId: string, quantity: number) => {
        const { quickSlots } = get();
        set({
          quickSlots: quickSlots.map((slot) =>
            slot.slotIndex === slotIndex
              ? {
                  ...slot,
                  itemId,
                  quantity: Math.min(quantity, slot.maxQuantity),
                }
              : slot,
          ),
        });
      },

      clearQuickSlot: (slotIndex: number) => {
        const { quickSlots } = get();
        set({
          quickSlots: quickSlots.map((slot) =>
            slot.slotIndex === slotIndex
              ? { ...slot, itemId: null, quantity: 0 }
              : slot,
          ),
        });
      },

      addCredits: (amount: number) => {
        set((state) => ({ credits: state.credits + amount }));
      },

      spendCredits: (amount: number) => {
        const { credits } = get();
        if (credits < amount) return false;
        set({ credits: credits - amount });
        return true;
      },

      canAfford: (amount: number) => {
        return get().credits >= amount;
      },
    }),
    {
      name: 'orbital-sequence-inventory',
    },
  ),
);

// ── Selectors ──────────────────────────────────────────────────────────────────

export const selectItemsByCategory =
  (category: ItemCategory) =>
  (state: InventoryStoreState): InventoryItem[] =>
    state.items.filter((item) => item.category === category);

export const selectQuickSlots = (state: InventoryStoreState): QuickSlot[] =>
  state.quickSlots;

export const selectFreeSlots = (state: InventoryStoreState): number =>
  state.maxSlots - state.items.length;
