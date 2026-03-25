/**
 * App - Root component managing game mode transitions.
 * Renders the 3D scene with EngineCore and overlays UI based on current mode.
 *
 * Modes:
 * - auth:     Internet Identity login gate (shown before game loads)
 * - menu:     Main menu with auto-rotating Earth, ship selection, deploy button
 * - gameplay: Active game with HUD, combat controls, and player interaction
 */

import { useState, useCallback, useEffect } from 'react';
import { EngineCore } from './core/rendering/EngineCore';
import { Earth } from './entities/environment/Earth';
import { MainMenu } from './ui/menus/MainMenu';
import { TopBar } from './ui/hud/TopBar';
import { CombatControls } from './ui/hud/CombatControls';
import { PauseMenu } from './ui/menus/PauseMenu';
import { useCombatStore } from './core/state/combatStore';
import { useIcStore } from './core/state/icStore';

type GameMode = 'auth' | 'menu' | 'gameplay';

export function App() {
  const [mode, setMode] = useState<GameMode>('auth');
  const [isPaused, setIsPaused] = useState(false);

  const oxygen = useCombatStore((s) => s.oxygen);
  const hull = useCombatStore((s) => s.hull);
  const sector = useCombatStore((s) => s.sector);
  const currentTarget = useCombatStore((s) => s.currentTarget);

  const { isAuthenticated, isLoading, principal, login, logout, initAuth } = useIcStore();

  // Restore session on mount
  useEffect(() => {
    initAuth().then(() => {
      if (isAuthenticated) setMode('menu');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Advance to menu when auth completes
  useEffect(() => {
    if (isAuthenticated && mode === 'auth') setMode('menu');
  }, [isAuthenticated, mode]);

  const handleLogin = useCallback(async () => {
    await login();
  }, [login]);

  const handleLogout = useCallback(async () => {
    await logout();
    setMode('auth');
    setIsPaused(false);
  }, [logout]);

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

  // Truncate principal for display
  const principalLabel = principal
    ? principal.toText().slice(0, 5) + '...' + principal.toText().slice(-3)
    : '';

  return (
    <div className="w-full h-full relative bg-black">
      {/* 3D Scene — always rendered */}
      <EngineCore mode={mode === 'gameplay' ? 'gameplay' : 'menu'}>
        <Earth />
      </EngineCore>

      {/* ── Internet Identity Auth Gate ── */}
      {mode === 'auth' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 gap-6">
          <h1 className="text-4xl font-bold text-cyan-400 tracking-widest uppercase">
            Zero Colony
          </h1>
          <p className="text-gray-400 text-sm max-w-xs text-center">
            Sign in with Internet Identity to access your land plots and wallet.
          </p>
          {isLoading ? (
            <div className="text-cyan-400 animate-pulse text-sm">Checking session...</div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded text-sm uppercase tracking-widest transition-colors"
            >
              Connect with Internet Identity
            </button>
          )}
        </div>
      )}

      {/* ── Main Menu ── */}
      {mode === 'menu' && (
        <>
          <MainMenu onDeploy={handleDeploy} />
          {/* Principal badge */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
            <span className="text-xs text-cyan-400/70 font-mono">{principalLabel}</span>
            <button
              onClick={handleLogout}
              className="text-[10px] text-gray-500 hover:text-red-400 uppercase px-2 py-1 border border-gray-700 hover:border-red-500 rounded transition-colors"
            >
              Disconnect
            </button>
          </div>
        </>
      )}

      {/* ── Gameplay HUD ── */}
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

          {/* Principal badge */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
            <span className="text-xs text-cyan-400/70 font-mono">{principalLabel}</span>
          </div>

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
