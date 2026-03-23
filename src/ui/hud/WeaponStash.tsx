/**
 * WeaponStash - Left panel showing equipped weapons with rarity-colored borders.
 * Each card shows weapon name, type icon area, stats, and equip button.
 */

import { Panel } from '../shared/Panel';

interface WeaponCard {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  ammo: string;
  isEquipped: boolean;
}

interface WeaponStashProps {
  weapons: WeaponCard[];
  onEquip: (id: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const rarityBorderColors: Record<string, string> = {
  common: 'border-l-rarity-common',
  uncommon: 'border-l-rarity-uncommon',
  rare: 'border-l-rarity-rare',
  epic: 'border-l-rarity-epic',
  legendary: 'border-l-rarity-legendary',
};

export function WeaponStash({ weapons, onEquip, onClose, isOpen }: WeaponStashProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-2 top-16 z-20 w-56">
      <Panel header="Weapon Stash" onClose={onClose}>
        <div className="flex flex-col gap-1">
          {weapons.map((w) => (
            <div
              key={w.id}
              className={`
                flex items-center justify-between px-2 py-1.5
                bg-black/40 border-l-2 ${rarityBorderColors[w.rarity]}
              `}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white uppercase truncate">{w.name}</div>
                <div className="text-[10px] text-gray-400">{w.ammo}</div>
              </div>
              <button
                onClick={() => onEquip(w.id)}
                className="text-[10px] px-2 py-0.5 bg-cyan-primary/20 border border-cyan-primary/50 text-cyan-primary uppercase cursor-pointer hover:bg-cyan-primary/40"
              >
                Equip
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
