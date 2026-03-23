/**
 * TopBar - Displays oxygen, hull integrity, and current sector.
 * Matches the reference UI: "OXYGEN: 98% - HULL: 100% - SECTOR 7"
 */

import { ProgressBar } from '../shared/ProgressBar';

interface TopBarProps {
  oxygen: number;
  hull: number;
  sector: number;
}

export function TopBar({ oxygen, hull, sector }: TopBarProps) {
  const oxygenColor = oxygen > 50 ? 'cyan' : oxygen > 25 ? 'yellow' : 'red';
  const hullColor = hull > 50 ? 'green' : hull > 25 ? 'yellow' : 'red';

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-2 px-4">
      <div className="bg-hud-bg border-b border-panel-border px-6 py-2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-[var(--font-display)] text-cyan-primary uppercase">Oxygen:</span>
          <span className="text-xs text-white">{Math.round(oxygen)}%</span>
          <ProgressBar value={oxygen} color={oxygenColor} size="sm" className="w-16" />
        </div>

        <span className="text-cyan-primary/30">-</span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-[var(--font-display)] text-cyan-primary uppercase">Hull:</span>
          <span className="text-xs text-white">{Math.round(hull)}%</span>
          <ProgressBar value={hull} color={hullColor} size="sm" className="w-16" />
        </div>

        <span className="text-cyan-primary/30">-</span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-[var(--font-display)] text-cyan-primary uppercase">Sector</span>
          <span className="text-xs text-white">{sector}</span>
        </div>
      </div>
    </div>
  );
}
