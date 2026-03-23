/**
 * MainMenu - Title screen overlay with "WELCOME TO FRONTIER" text,
 * ship selection carousel placeholder, and deploy/settings buttons.
 * Overlaid on the 3D Earth scene.
 */

import { useState } from 'react';
import { Button } from '../shared/Button';
import { SettingsPanel } from './SettingsPanel';

interface MainMenuProps {
  onDeploy: () => void;
}

export function MainMenu({ onDeploy }: MainMenuProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
      {/* Title */}
      <div className="text-center mb-8 pointer-events-auto">
        <h2 className="text-cyan-primary text-sm font-[var(--font-display)] uppercase tracking-[0.3em] mb-1">
          Welcome to
        </h2>
        <h1 className="text-white text-5xl md:text-7xl font-[var(--font-display)] uppercase tracking-wider">
          Frontier
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Orbital Sequence - Lost in Space
        </p>
      </div>

      {/* Ship selection placeholder */}
      <div className="mb-8 pointer-events-auto">
        <div className="text-center text-xs font-[var(--font-display)] text-cyan-primary/60 uppercase tracking-wider">
          Select Your Vessel
        </div>
        <div className="flex items-center gap-4 mt-3">
          <button className="text-cyan-primary/40 hover:text-cyan-primary text-2xl cursor-pointer">
            &lt;
          </button>
          <div className="flex gap-3">
            {['Scout', 'Cruiser', 'Miner'].map((ship) => (
              <div
                key={ship}
                className="w-32 h-24 bg-black/40 border border-panel-border flex flex-col items-center justify-center hover:border-cyan-primary/60 transition-colors"
              >
                <div className="text-2xl text-cyan-primary/30 mb-1">&#9670;</div>
                <div className="text-xs text-white uppercase">{ship}</div>
                <div className="text-[10px] text-gray-400">
                  {ship === 'Scout' ? '1200 HP' : ship === 'Cruiser' ? '3500 HP' : '2800 HP'}
                </div>
              </div>
            ))}
          </div>
          <button className="text-cyan-primary/40 hover:text-cyan-primary text-2xl cursor-pointer">
            &gt;
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 pointer-events-auto">
        <Button variant="primary" size="lg" onClick={onDeploy}>
          Deploy
        </Button>
        <Button variant="outline" size="lg" onClick={() => setShowSettings(true)}>
          Settings
        </Button>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="pointer-events-auto">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
}
