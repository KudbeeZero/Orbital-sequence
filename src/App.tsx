/**
 * App - Root component managing game mode transitions.
 * Renders the 3D scene with EngineCore and overlays UI based on current mode.
 *
 * Modes:
 * - menu: Main menu with auto-rotating Earth, ship selection, deploy button
 * - gameplay: Active game with HUD, combat controls, and player interaction
 */

import { useState, useCallback } from 'react';
import { EngineCore } from './core/rendering/EngineCore';
import { Earth } from './entities/environment/Earth';
import { MainMenu } from './ui/menus/MainMenu';
import { TopBar } from './ui/hud/TopBar';
import { CombatControls } from './ui/hud/CombatControls';
import { PauseMenu } from './ui/menus/PauseMenu';
import { useCombatStore } from './core/state/combatStore';

type GameMode = 'menu' | 'gameplay';

export function App() {
  const [mode, setMode] = useState<GameMode>('menu');
  const [isPaused, setIsPaused] = useState(false);

  const oxygen = useCombatStore((s) => s.oxygen);
  const hull = useCombatStore((s) => s.hull);
  const sector = useCombatStore((s) => s.sector);
  const currentTarget = useCombatStore((s) => s.currentTarget);

  const handleDeploy = useCallback(() => {
    setMode('gameplay');
  }, []);

  const handleQuit = useCallback(() => {
    setMode('menu');
    setIsPaused(false);
  }, []);

  const handleFire = useCallback(() => {
    // Future: trigger weapon fire through combat store
  }, []);

  const handleLock = useCallback(() => {
    // Future: toggle target lock
  }, []);

  const handleSwitchTarget = useCallback(() => {
    // Future: cycle to next target
  }, []);

  return (
    <div className="w-full h-full relative bg-black">
      {/* 3D Scene — always rendered */}
      <EngineCore mode={mode === 'menu' ? 'menu' : 'gameplay'}>
        <Earth />
      </EngineCore>

      {/* UI Overlays */}
      {mode === 'menu' && (
        <MainMenu onDeploy={handleDeploy} />
      )}

      {mode === 'gameplay' && (
        <>
          <TopBar oxygen={oxygen} hull={hull} sector={sector} />
          <CombatControls
            speed={0}
            contacts={6}
            isTargetLocked={currentTarget !== null}
            canFire={true}
            onFire={handleFire}
            onLock={handleLock}
            onSwitchTarget={handleSwitchTarget}
          />

          {/* Bottom nav bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-hud-bg border-t border-panel-border">
            <div className="flex items-center justify-center gap-6 py-2 px-4">
              {['Backpack', 'Inventory', 'Build', 'Map', 'Chat', 'Ship Stats', 'Menu'].map((item) => (
                <button
                  key={item}
                  className="text-[10px] font-[var(--font-display)] text-cyan-primary/60 hover:text-cyan-primary uppercase cursor-pointer"
                  onClick={item === 'Menu' ? () => setIsPaused(true) : undefined}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <PauseMenu
            isOpen={isPaused}
            onResume={() => setIsPaused(false)}
            onQuit={handleQuit}
          />
        </>
      )}
    </div>
  );
}
