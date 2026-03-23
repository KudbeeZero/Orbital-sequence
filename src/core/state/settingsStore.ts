import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────────

export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface SettingsStoreState {
  // State
  quality: QualityPreset;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  sensitivity: number;
  invertY: boolean;
  showFps: boolean;
  showMinimap: boolean;
  tutorialCompleted: boolean;

  // Actions
  setQuality: (quality: QualityPreset) => void;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setSensitivity: (sensitivity: number) => void;
  toggleInvertY: () => void;
  toggleShowFps: () => void;
  toggleShowMinimap: () => void;
  completeTutorial: () => void;
  resetToDefaults: () => void;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: Pick<
  SettingsStoreState,
  | 'quality'
  | 'masterVolume'
  | 'musicVolume'
  | 'sfxVolume'
  | 'sensitivity'
  | 'invertY'
  | 'showFps'
  | 'showMinimap'
  | 'tutorialCompleted'
> = {
  quality: 'high',
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.7,
  sensitivity: 1.0,
  invertY: false,
  showFps: false,
  showMinimap: true,
  tutorialCompleted: false,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ── Store ──────────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      // Actions
      setQuality: (quality: QualityPreset) => set({ quality }),

      setMasterVolume: (volume: number) =>
        set({ masterVolume: clamp(volume, 0, 1) }),

      setMusicVolume: (volume: number) =>
        set({ musicVolume: clamp(volume, 0, 1) }),

      setSfxVolume: (volume: number) =>
        set({ sfxVolume: clamp(volume, 0, 1) }),

      setSensitivity: (sensitivity: number) =>
        set({ sensitivity: clamp(sensitivity, 0.1, 2.0) }),

      toggleInvertY: () => set((state) => ({ invertY: !state.invertY })),

      toggleShowFps: () => set((state) => ({ showFps: !state.showFps })),

      toggleShowMinimap: () =>
        set((state) => ({ showMinimap: !state.showMinimap })),

      completeTutorial: () => set({ tutorialCompleted: true }),

      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'orbital-sequence-settings',
    },
  ),
);
