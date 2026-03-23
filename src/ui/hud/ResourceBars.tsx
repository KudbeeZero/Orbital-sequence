/**
 * ResourceBars - Compact progress bars for shield, energy, and ammo.
 */

import { ProgressBar } from '../shared/ProgressBar';

interface ResourceBarsProps {
  shield: number;
  maxShield: number;
  ammo: number;
  maxAmmo: number;
}

export function ResourceBars({ shield, maxShield, ammo, maxAmmo }: ResourceBarsProps) {
  return (
    <div className="flex flex-col gap-1 w-32">
      <ProgressBar value={shield} max={maxShield} color="blue" label="Shield" size="sm" showValue />
      <ProgressBar value={ammo} max={maxAmmo} color="yellow" label="Ammo" size="sm" showValue />
    </div>
  );
}
