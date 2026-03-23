# Orbital Sequence — Architectural Review

**Date:** 2026-03-23
**Status:** APPROVED — Foundation supports autonomous AI feature development

---

## Executive Summary

The Orbital Sequence foundation passes all architectural quality gates. State management,
rendering, component structure, type safety, and build configuration are all correctly
implemented. The codebase is ready for feature development by autonomous AI agents working
from specification documents.

---

## 1. State Management

### Stores

| Store | Persist | Scope |
|---|---|---|
| `settingsStore` | Yes (full) | Display, audio, and control preferences |
| `combatStore` | No (ephemeral) | Active combat — weapons, targeting, vitals |
| `inventoryStore` | Yes (full) | Items, credits, quick slots |
| `progressionStore` | Yes (full) | Level, XP, unlocks, achievements |
| `storyStore` | Yes (partial*) | Chapter, narrative flags, dialogue |

> *`storyStore` correctly uses `partialize` to exclude `currentDialogue` and `isDialogueActive` from
> persistence — transient UI state is not written to localStorage.

### Findings

**PASS** — Each store has a single, clearly scoped responsibility with no overlapping
state ownership.

**PASS** — `combatStore` is correctly ephemeral (no persist) because combat state should
reset between sessions. Inventory, progression, and story state correctly persist.

**PASS** — Stores do not import from each other. The only cross-store interaction pattern
present is through React components subscribing to multiple stores independently.

**PASS** — All store interfaces are fully typed with `TypeScript` interfaces
(`CombatStoreState`, `InventoryStoreState`, etc.). No `any` types in store definitions.

**PASS** — All action functions have explicit parameter types and return types.

**PASS** — Selector functions are co-located with their stores as named exports
(e.g. `selectActiveWeapon`, `selectVitals`, `selectLevelProgress`).

**NOTE** — `combatStore` would benefit from an event bus for notifying other systems of
combat outcomes (e.g. enemy killed → inventory reward). This should be added during the
combat system implementation, not as a foundation change.

---

## 2. Component Architecture

### Separation of Concerns

| Component | Type | Notes |
|---|---|---|
| `App` | Container | Subscribes to `combatStore`; passes all data as props |
| `EngineCore` | Presentational | Receives `mode` prop; configures Canvas |
| `MainMenu` | Presentational | Receives `onDeploy` callback |
| `TopBar` | Presentational | Receives `oxygen`, `hull`, `sector` as props |
| `CombatControls` | Presentational | Receives all data and callbacks as props |
| `PauseMenu` | Presentational | Receives `isOpen`, `onResume`, `onQuit` |

**PASS** — `App` is the sole container component; all children are presentational and
receive data exclusively through props.

**PASS** — No presentational component imports from Zustand stores directly.

**PASS** — All component props use explicit TypeScript interface definitions.

---

## 3. Rendering System

### Engine Configuration (`EngineCore.tsx`)

- **Tone mapping:** ACESFilmic with exposure 1.2 — industry-standard for space scenes
- **Color space:** SRGBColorSpace — correct for modern WebGL/Three.js r152+
- **Shadows:** Enabled with 2048×2048 shadow maps
- **Adaptive DPR:** `AdaptiveDpr pixelated` — automatically reduces pixel ratio under load
- **Stars background:** `@react-three/drei` Stars component with 5,000 particles

**PASS** — Renderer is correctly configured for high-quality PBR space rendering.

### Camera (`CameraController.ts`)

The camera module exports pure configuration objects (not React components):

- `defaultCameraConfig` — FOV, near/far planes, initial position
- `menuOrbitConfig` — Auto-rotate enabled, zoom disabled, constrained polar angles
- `gameplayOrbitConfig` — User zoom enabled, auto-rotate off, wider polar range

**PASS** — Camera correctly implements orbital behavior locked to Earth by constraining
min/max distance and polar angles.

**PASS** — Config-object pattern (rather than component) is clean and testable.

**PASS** — Mode switching (menu ↔ gameplay) uses different config presets without
recreating the camera.

### Lighting (`LightingSystem.ts`)

Three-point lighting rig:
- **Directional (sun):** Primary key light with shadow casting
- **Ambient:** Low-intensity fill for shadow softness
- **Point (fill):** Secondary fill from opposite direction

**PASS** — Physically plausible three-point space lighting.

---

## 4. File Organization

```
src/
├── constants/          # Numeric constants (assetPaths, gameBalance, visualSettings)
├── core/
│   ├── assets/         # AssetLoader, AudioManager, ModelCache
│   ├── rendering/      # EngineCore, CameraController, LightingSystem, PostProcessing, SceneManager
│   └── state/          # All Zustand stores
├── entities/
│   ├── environment/    # Earth, Starfield, Asteroids, SpaceStation
│   ├── ships/          # PlayerShip, EnemyShip, shipDefinitions
│   ├── targets/        # GroundTarget, targetDefinitions
│   └── weapons/        # WeaponEffects, weaponDefinitions
├── features/
│   ├── combat/         # CombatMode, TargetingSystem, WeaponController, DamageCalculation, EnemyAI
│   ├── exploration/    # FreeRoamMode, AsteroidField, MiningSystem, ResourceCollection
│   ├── shipSelection/  # ShipSelector, ShipCarousel, ShipStats
│   └── story/          # StoryMode, DialogueSystem, ChoicePanel, BranchingLogic, EventTriggers
├── hooks/              # useGameLoop, useCombatState, useTargeting, useAssetLoading
├── types/              # Shared TypeScript interfaces (combat, entities, inventory, story)
├── ui/
│   ├── hud/            # TopBar, CombatControls, ResourceBars, WeaponStash, QuickInventory
│   ├── menus/          # MainMenu, SettingsPanel, PauseMenu
│   └── shared/         # Button, Modal, Panel, ProgressBar
└── utils/              # collision, physics, math, formatting
```

**PASS** — Feature-based organization groups related code together.

**PASS** — Shared utilities (`utils/`, `ui/shared/`) are clearly separated from feature code.

**PASS** — All TypeScript path aliases (`@core`, `@features`, `@ui`, etc.) are configured
identically in both `tsconfig.json` and `vite.config.ts`.

---

## 5. Build Configuration

### TypeScript

- `strict: true` — Full strict mode
- `noImplicitAny: true` — No implicit `any` types
- `strictNullChecks: true` — Null safety enforced
- `moduleResolution: "bundler"` — Vite-aware module resolution

**PASS** — Maximum type safety is enforced.

### Vite Build

- `target: 'es2020'` — Supports all modern browsers
- `sourcemap: true` — Source maps for production debugging
- `manualChunks` — Three.js and R3F split into separate chunks for better caching
- CSS and JS are minified by default

**PASS** — Production build includes appropriate optimizations.

**NOTE** — Vite 8 (Rolldown-based) may consolidate Three.js into the R3F chunk rather
than splitting them as separate files. This is acceptable — both libraries are cached
together and load time is not meaningfully affected.

### React Version

**FIXED** — `react` and `react-dom` were set to `^18.3.1` in `package.json` but
`@react-three/drei@10.x` and `@types/react@19.x` require React 19. Updated to `^19.0.0`.

---

## 6. Known Gaps (Not Blockers)

These items are placeholder implementations in the foundation and will be filled during
feature development:

| File | Status |
|---|---|
| `core/rendering/PostProcessing.ts` | Placeholder — to be wired during combat visuals |
| `core/rendering/SceneManager.ts` | Placeholder — to be wired during scene transitions |
| `core/assets/AssetLoader.ts` | Placeholder — to be wired when 3D models are added |
| `core/assets/AudioManager.ts` | Placeholder — to be wired when audio is added |
| `features/combat/*` | Placeholder stubs — implementation is the first vertical slice |
| `features/exploration/*` | Placeholder stubs — implementation follows combat |
| `features/story/*` | Placeholder stubs — implementation follows exploration |

---

## 7. Dependency Graph (Feature Implementation Order)

```
Layer 0 (Foundation — Complete):
  core/rendering, core/state, ui/shared, utils, constants, types

Layer 1 (First Vertical Slice — Combat):
  entities/targets, entities/weapons
  features/combat (TargetingSystem, WeaponController, DamageCalculation, EnemyAI)
  ui/hud (TopBar, CombatControls, WeaponStash)

Layer 2 (Dependent on Combat Rendering):
  entities/environment (Asteroids, SpaceStation — need SceneManager)
  features/exploration (FreeRoamMode, MiningSystem, ResourceCollection)
  ui/hud (ResourceBars, QuickInventory)

Layer 3 (Dependent on Progression):
  features/shipSelection (ShipSelector, ShipCarousel, ShipStats)
  core/assets (AssetLoader, ModelCache — 3D ship models)

Layer 4 (Final Layer):
  features/story (BranchingLogic, EventTriggers, DialogueSystem)
  core/assets (AudioManager)
  core/rendering (PostProcessing — quality-based effects)
```

---

## Verdict

**The foundation is production-ready and supports autonomous AI implementation.**

All five Zustand stores are correctly scoped and typed. The rendering system is correctly
configured for space combat visuals. Component architecture cleanly separates concerns.
Build configuration applies appropriate optimizations. The file organization matches
the specification.

Proceed to the first vertical slice: **Combat System**.
