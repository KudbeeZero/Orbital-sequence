/**
 * CombatControls - Bottom center panel with fire button, speed, and target lock.
 * Matches reference UI: speed/contacts on left, FIRE button center, LOCK on right.
 */

import { Button } from '../shared/Button';

interface CombatControlsProps {
  speed: number;
  contacts: number;
  isTargetLocked: boolean;
  canFire: boolean;
  onFire: () => void;
  onLock: () => void;
  onSwitchTarget: () => void;
}

export function CombatControls({
  speed,
  contacts,
  isTargetLocked,
  canFire,
  onFire,
  onLock,
  onSwitchTarget,
}: CombatControlsProps) {
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-end gap-4">
      {/* Speed / Contacts */}
      <div className="bg-hud-bg border border-panel-border px-4 py-2 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-cyan-primary font-[var(--font-display)] uppercase">Speed</span>
          <span className="text-white">{String(speed).padStart(3, '0')} KM/S</span>
        </div>
        <div className="text-gray-400">
          Contacts: {contacts}
        </div>
      </div>

      {/* Fire button */}
      <button
        onClick={onFire}
        disabled={!canFire}
        className={`
          w-24 h-24 rounded-full border-2 cursor-pointer
          font-[var(--font-display)] text-lg uppercase tracking-wider
          transition-all duration-150
          ${canFire
            ? 'border-cyan-primary bg-cyan-primary/20 text-cyan-primary hover:bg-cyan-primary/40 active:scale-95'
            : 'border-gray-600 bg-gray-800/50 text-gray-500'
          }
        `}
      >
        Fire
      </button>

      {/* Target acquisition */}
      <div className="bg-hud-bg border border-panel-border px-4 py-2">
        <div className="text-[10px] font-[var(--font-display)] text-cyan-primary uppercase mb-1 text-center">
          Target Acquisition
        </div>
        <Button
          variant={isTargetLocked ? 'primary' : 'outline'}
          size="md"
          onClick={onLock}
        >
          Lock
        </Button>
        <button
          onClick={onSwitchTarget}
          className="block text-[10px] text-cyan-primary/60 hover:text-cyan-primary mt-1 mx-auto cursor-pointer"
        >
          Switch Target
        </button>
      </div>
    </div>
  );
}
