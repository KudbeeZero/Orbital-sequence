/**
 * QuickInventory - Right panel showing 6 quick-access item slots.
 * Each slot shows item icon placeholder, quantity, and max stack.
 */

interface QuickSlot {
  slotIndex: number;
  itemName: string | null;
  quantity: number;
  maxQuantity: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface QuickInventoryProps {
  slots: QuickSlot[];
  onSlotClick: (index: number) => void;
}

const rarityBg: Record<string, string> = {
  common: 'border-rarity-common/40',
  uncommon: 'border-rarity-uncommon/40',
  rare: 'border-rarity-rare/40',
  epic: 'border-rarity-epic/40',
  legendary: 'border-rarity-legendary/40',
};

export function QuickInventory({ slots, onSlotClick }: QuickInventoryProps) {
  return (
    <div className="absolute right-2 top-16 z-20">
      <div className="text-[10px] font-[var(--font-display)] text-cyan-primary uppercase mb-1 text-center">
        Quick Inventory
      </div>
      <div className="grid grid-cols-3 gap-1">
        {slots.map((slot) => (
          <button
            key={slot.slotIndex}
            onClick={() => onSlotClick(slot.slotIndex)}
            className={`
              w-14 h-14 bg-black/50 border cursor-pointer
              flex flex-col items-center justify-center
              hover:bg-cyan-primary/10
              ${slot.rarity ? rarityBg[slot.rarity] : 'border-panel-border'}
            `}
          >
            {slot.itemName ? (
              <>
                <div className="text-lg text-cyan-primary">{slot.quantity}</div>
                <div className="text-[8px] text-gray-400">
                  {slot.quantity}/{slot.maxQuantity}
                </div>
              </>
            ) : (
              <div className="text-gray-600 text-xs">-</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
