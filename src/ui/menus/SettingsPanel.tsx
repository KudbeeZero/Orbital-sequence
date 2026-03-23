/**
 * SettingsPanel - Graphics, audio, and control settings.
 * Persists to settingsStore via Zustand.
 */

import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { useSettingsStore } from '../../core/state/settingsStore';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const {
    quality, masterVolume, musicVolume, sfxVolume,
    sensitivity, invertY, showFps,
    setQuality, setMasterVolume, setMusicVolume, setSfxVolume,
    setSensitivity, toggleInvertY, toggleShowFps, resetToDefaults,
  } = useSettingsStore();

  return (
    <Modal isOpen onClose={onClose} title="Settings">
      <div className="space-y-4">
        {/* Graphics */}
        <section>
          <h3 className="text-xs font-[var(--font-display)] text-cyan-primary uppercase mb-2">Graphics</h3>
          <div className="flex gap-2">
            {(['low', 'medium', 'high', 'ultra'] as const).map((q) => (
              <Button
                key={q}
                variant={quality === q ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setQuality(q)}
              >
                {q}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 mt-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={showFps}
              onChange={toggleShowFps}
              className="accent-cyan-500"
            />
            Show FPS
          </label>
        </section>

        {/* Audio */}
        <section>
          <h3 className="text-xs font-[var(--font-display)] text-cyan-primary uppercase mb-2">Audio</h3>
          {[
            { label: 'Master', value: masterVolume, setter: setMasterVolume },
            { label: 'Music', value: musicVolume, setter: setMusicVolume },
            { label: 'SFX', value: sfxVolume, setter: setSfxVolume },
          ].map(({ label, value, setter }) => (
            <div key={label} className="flex items-center gap-3 mb-1">
              <span className="text-xs text-gray-300 w-14">{label}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="text-xs text-cyan-primary w-8 text-right">
                {Math.round(value * 100)}%
              </span>
            </div>
          ))}
        </section>

        {/* Controls */}
        <section>
          <h3 className="text-xs font-[var(--font-display)] text-cyan-primary uppercase mb-2">Controls</h3>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs text-gray-300 w-14">Sensitivity</span>
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.1}
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="flex-1 accent-cyan-500"
            />
            <span className="text-xs text-cyan-primary w-8 text-right">
              {sensitivity.toFixed(1)}
            </span>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={invertY}
              onChange={toggleInvertY}
              className="accent-cyan-500"
            />
            Invert Y Axis
          </label>
        </section>

        {/* Reset */}
        <div className="pt-2 border-t border-panel-border">
          <Button variant="danger" size="sm" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </div>
      </div>
    </Modal>
  );
}
