# Combat System Specification — First Vertical Slice

**Status:** READY FOR IMPLEMENTATION
**Priority:** P0 — First vertical slice
**Dependencies:** Foundation (complete), rendering system (complete), state management (complete)

---

## 1. Overview

The combat system is the first complete gameplay loop. It connects the rendering layer,
state layer, and UI layer into a playable experience: the player orbits Earth, detects
ground targets, locks onto them, fires weapons, destroys them, and receives rewards.

### Scope of This Slice

| In Scope | Out of Scope |
|---|---|
| Target spawning on Earth surface | Multiplayer |
| Lock-on targeting via raycasting | AI-controlled enemy ships |
| Pulse cannon (projectile) firing | Missile guidance system |
| Rail gun (beam) firing | Cover/stealth mechanics |
| Damage calculation with armor | Environmental hazards |
| Target destruction + XP reward | Full explosion particle system |
| Ammo display in HUD | Weapon crafting/upgrades |
| Shield damage absorption | Enemy AI retaliation |

---

## 2. Responsibilities

### `features/combat/TargetingSystem.ts`

- Maintains a list of spawned target objects in the scene
- Uses Three.js raycasting from the camera through the scene to detect targets
- Computes angular distance from crosshair to each target
- Returns the closest target within `COMBAT.maxTargetDistance` units
- Exposes `getNearbyTargets(scene, camera)` returning `NearbyTarget[]`
- Exposes `computeLockProgress(dt, currentTarget)` that increments lock progress at
  `1 / COMBAT.lockOnBaseTime` per second
- Does **not** read from or write to Zustand — it is a pure computation module

### `features/combat/WeaponController.ts`

- Reads the active weapon from `combatStore` via `selectActiveWeapon`
- Determines if a shot can be fired based on: ammo > 0, target locked, fire cooldown elapsed
- Calls `combatStore.fireWeapon()` to decrement ammo
- Emits a `projectile:spawn` or `beam:fire` event with position, direction, and damage
- Respects the weapon's `fireRate` (shots/sec) as a cooldown
- Does **not** spawn Three.js objects directly — events are consumed by `WeaponEffects`

### `features/combat/DamageCalculation.ts`

- Pure function: `calculateDamage(weapon, target, isCritical): number`
- Applies armor reduction: `finalDamage = baseDamage * (1 - armor / (armor + 100))`
- Applies critical hit: if `isCritical` (roll < `COMBAT.criticalHitChance`), multiply by
  `COMBAT.criticalHitMultiplier`
- Emits a `damage:applied` event with a `DamageEvent` payload
- No side effects — callers decide what to do with the result

### `features/combat/EnemyAI.ts`

- **Out of scope for this slice** — placeholder only

### `features/combat/CombatMode.tsx`

- Container component wrapping the full combat experience
- Subscribes to `combatStore` for vitals and target state
- Runs the game loop tick: targeting → lock progress → fire → damage → reward
- Spawns `GroundTarget` entities on the Earth surface at start of combat
- Handles target destruction: remove entity, call `progressionStore.addXp(PROGRESSION.xpPerKill)`,
  call `inventoryStore.addCredits(target.reward)`
- Handles combat exit: call `combatStore.exitCombat()` when no targets remain or player quits

---

## 3. Data Structures

### Target Instance (runtime, not persisted)

```typescript
interface ActiveTarget {
  id: string;                      // Unique runtime ID
  definitionId: string;            // References targetDefinitions
  position: Vector3Tuple;          // World position on Earth surface
  currentHealth: number;           // Starts at definition.health
  isDestroyed: boolean;
}
```

### Target Definitions (expand `targetDefinitions.ts`)

```typescript
// Add to targetDefinitions.ts
export const targetDefinitions: Record<string, TargetDefinition> = {
  'ground-relay': {
    id: 'ground-relay',
    name: 'Relay Station',
    health: 200,
    armor: 10,
    reward: 50,         // credits
    xpReward: 50,       // XP (add this field to TargetDefinition)
    modelPath: '',      // placeholder until 3D models are added
  },
  'ground-bunker': {
    id: 'ground-bunker',
    name: 'Hardened Bunker',
    health: 500,
    armor: 40,
    reward: 150,
    xpReward: 120,
    modelPath: '',
  },
  'ground-aa': {
    id: 'ground-aa',
    name: 'Anti-Air Battery',
    health: 300,
    armor: 20,
    reward: 80,
    xpReward: 80,
    modelPath: '',
  },
};
```

### Events (use a lightweight event bus)

Create `src/core/events/eventBus.ts`:

```typescript
// Typed event bus using a simple Map<string, Set<Function>> pattern
// Events:
//   'projectile:spawn'  payload: { id, position, direction, damage, speed }
//   'beam:fire'         payload: { id, origin, direction, damage, duration }
//   'damage:applied'    payload: DamageEvent (from src/types/combat.ts)
//   'target:destroyed'  payload: { targetId, position, xpReward, creditReward }
//   'combat:started'    payload: void
//   'combat:ended'      payload: { killCount, totalXp, totalCredits }
```

---

## 4. UI Changes

### `ui/hud/TopBar.tsx`

No changes required — already receives `oxygen`, `hull`, `sector` as props.

### `ui/hud/CombatControls.tsx`

The existing component already has the correct prop interface. Implement:
- `onFire` — calls `WeaponController.tryFire()`
- `onLock` — calls `combatStore.setTarget()` with nearest unlocked target
- `onSwitchTarget` — cycles through `combatStore.nearbyTargets`

### `ui/hud/WeaponStash.tsx`

Implement the weapon selector showing all equipped weapons with:
- Weapon name and rarity color (from `RARITY_COLORS`)
- Current ammo / max ammo
- Highlight active weapon
- Tap to switch active weapon via `combatStore.setActiveWeapon(index)`

### `entities/targets/GroundTarget.tsx`

Implement as a `@react-three/fiber` mesh component:
- Render a simple box geometry (placeholder until 3D models are available)
- Color: red (`#ef4444`) at full health → orange → yellow as health decreases
- On destruction: play a brief scale-up → fade animation, then unmount

---

## 5. Combat Flow

```
App.handleDeploy()
  └─ setMode('gameplay')
     └─ CombatMode mounts
        ├─ combatStore.enterCombat()
        ├─ Spawn 3-5 GroundTargets on Earth surface
        └─ Game loop starts (via useGameLoop hook)
           ├─ [each frame] TargetingSystem.getNearbyTargets() → combatStore nearbyTargets
           ├─ [each frame] If target locked & fire pressed → WeaponController.tryFire()
           │                 └─ combatStore.fireWeapon()
           │                 └─ emit 'projectile:spawn' or 'beam:fire'
           ├─ [on hit] DamageCalculation.calculateDamage()
           │           └─ emit 'damage:applied'
           │           └─ reduce ActiveTarget.currentHealth
           ├─ [on target health ≤ 0]
           │   ├─ emit 'target:destroyed'
           │   ├─ progressionStore.addXp(xpReward)
           │   ├─ inventoryStore.addCredits(creditReward)
           │   └─ combatStore.incrementKills()
           └─ [all targets destroyed] combatStore.exitCombat()
```

---

## 6. Shield and Damage Flow

```
Incoming damage D hits ship:
  1. If shield > 0: absorbed = min(shield, D); shield -= absorbed; D -= absorbed
  2. If D > 0: hull -= D
  3. combatStore.takeDamage(originalAmount) — already handles shield/hull split

Armor reduces outgoing damage to targets:
  finalDamage = baseDamage * (1 - armor / (armor + 100))
  This formula ensures 0 armor = full damage, 100 armor = 50% damage, 300 armor = 25% damage
```

---

## 7. Acceptance Criteria

The combat system is **complete** when all of the following scenarios work correctly:

### Scenario A — Target Lock
1. Player is in gameplay mode
2. Ground targets are visible on Earth surface
3. Player rotates camera toward a target
4. Lock progress bar fills over 1.5 seconds (`COMBAT.lockOnBaseTime`)
5. `CombatControls` shows lock indicator as locked

### Scenario B — Firing Projectile Weapon (Plasma Burster)
1. Target is locked
2. Player presses Fire with Plasma Burster selected
3. A projectile visual travels from ship toward target
4. On hit: damage is calculated and applied to target
5. Ammo counter in `WeaponStash` decrements by 1

### Scenario C — Firing Beam Weapon (Ion Disruptor)
1. Target is locked
2. Player presses Fire with Ion Disruptor selected
3. A beam visual appears for `COMBAT.beamDuration` seconds
4. Damage is applied continuously for the beam duration
5. Ammo counter decrements by 1

### Scenario D — Target Destruction
1. Target's health reaches 0
2. Destruction animation plays (scale-up → fade)
3. Target is removed from the scene
4. Kill count in `combatStore` increments
5. XP is added via `progressionStore.addXp()`
6. Credits are added via `inventoryStore.addCredits()`

### Scenario E — Shield Absorption
1. Player takes damage while shield > 0
2. Shield absorbs damage first
3. Hull only decreases if shield is depleted
4. `TopBar` displays updated values

### Scenario F — Ammo Depletion
1. Player fires until ammo reaches 0
2. Fire button is disabled (no more shots)
3. Empty ammo state is shown in `WeaponStash`

### Scenario G — Combat End
1. All spawned targets are destroyed
2. `combatStore.exitCombat()` is called
3. Game transitions back to menu or to a results screen
4. Kill count and rewards are displayed

---

## 8. Implementation Notes for AI Agents

### Import Paths

Use path aliases throughout:
```typescript
import { useCombatStore } from '@core/state/combatStore';
import { COMBAT, PROGRESSION } from '@constants/gameBalance';
import type { DamageEvent } from '@types/combat';
```

### Frame-Rate Independence

All time-based values (lock progress, shield regen, oxygen drain) must be multiplied
by `delta` (seconds since last frame) from the game loop — **never assume 60fps**.

```typescript
// CORRECT
lockProgress += (1 / COMBAT.lockOnBaseTime) * delta;

// WRONG
lockProgress += 1 / 90; // hardcoded frame rate
```

### React Three Fiber Conventions

- Use `useFrame((state, delta) => { ... })` for per-frame updates inside R3F components
- Use `useRef<THREE.Mesh>()` to imperatively update object transforms for performance
- Avoid calling Zustand `set()` every frame — batch updates or use local `useRef` state

### Questions File

If any ambiguity arises during implementation, document it in:
`docs/implementation-questions.md`

Do not make assumptions about ambiguous behavior — document and wait for clarification.

---

## 9. Definition of Done

- [ ] All 7 acceptance scenarios pass
- [ ] No TypeScript errors (`tsc --noEmit` exits 0)
- [ ] Production build succeeds (`npm run build` exits 0)
- [ ] No `console.error` during normal gameplay
- [ ] Cloudflare preview deployment shows combat working correctly
