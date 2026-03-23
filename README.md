<p align="center">
  <img src="docs/frontier-logo.png" alt="Frontier: Lost in Space" width="600" />
</p>

<h1 align="center">ORBITAL SEQUENCE</h1>

<p align="center">
  <strong>A Frontier: Lost in Space Production</strong><br/>
  <em>Browser-Based Space Combat & Exploration</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-00ffff?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/engine-React_Three_Fiber-00ffff?style=flat-square" alt="Engine" />
  <img src="https://img.shields.io/badge/language-TypeScript-3178c6?style=flat-square" alt="TypeScript" />
  <img src="https://img.shields.io/badge/status-In_Development-f59e0b?style=flat-square" alt="Status" />
</p>

---

## Table of Contents

- [Our Mission](#our-mission)
- [Game Manual](#game-manual)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
  - [Ships & Classes](#ships--classes)
  - [Weapons & Combat](#weapons--combat)
  - [Exploration & Mining](#exploration--mining)
  - [Story Mode & AEGIS](#story-mode--aegis)
  - [Progression & Rarity](#progression--rarity)
  - [Controls](#controls)
- [Infrastructure & Build](#infrastructure--build)
  - [Technology Stack](#technology-stack)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Development Setup](#development-setup)
  - [Build & Deployment](#build--deployment)
  - [Performance Standards](#performance-standards)
- [Contributing](#contributing)
- [License](#license)

---

## Our Mission

**Frontier: Lost in Space** is built on a single conviction: that a AAA-quality space combat experience belongs in every browser — no downloads, no installs, no barriers.

We are a small, focused team of developers and designers committed to pushing the boundaries of what web technology can deliver. Our mission is to build an open-world space game that rivals native desktop titles in visual fidelity, mechanical depth, and emotional storytelling — all running at 60 FPS inside a browser tab.

**Our Core Principles:**

| Principle | What It Means |
|---|---|
| **Accessible by Default** | Runs on any modern browser. Desktop, tablet, mobile. No gatekeeping. |
| **Visual Excellence** | Fortnite-tier graphics via WebGL 2.0 — real-time PBR, volumetric atmospheres, post-processing bloom and depth of field. |
| **Depth Without Complexity** | Systems that are easy to learn but reward mastery. Five ship classes, branching narratives, and emergent combat. |
| **AI-First Development** | Architecture designed for autonomous AI agents to implement features systematically. Every module is self-documenting and decoupled. |
| **Performance is a Feature** | 60 FPS target on mid-range mobile. Dynamic quality scaling. Instanced rendering. Every frame counts. |

We believe the future of gaming is instant. Open a link. You're in orbit.

---

## Game Manual

### Overview

You are a pilot stranded in Sector 7 — a volatile frontier of space on the edge of known territory. Your ship is damaged, oxygen is limited, and hostile forces patrol every quadrant. With the help of **AEGIS**, your onboard AI companion, you must survive, fight, mine, trade, and uncover the truth behind the event that left you lost in space.

**Game Modes:**
- **Story Mode** — Narrative-driven missions with branching choices and permanent consequences
- **Combat Mode** — Real-time orbital combat with lock-on targeting, weapon switching, and tactical maneuvering
- **Exploration Mode** — Free-roam mining, resource collection, and station docking

### Getting Started

1. **Select Your Vessel** — Choose from three starter ships on the deployment screen
2. **Deploy** — Launch into Sector 7 with default loadout and 500 credits
3. **Monitor Vitals** — Watch your oxygen (top bar), hull integrity, and shield status
4. **Engage or Evade** — Targets appear on radar; lock on or navigate around them
5. **Dock & Trade** — Reach space stations to repair, resupply, and upgrade

### Ships & Classes

Each ship class offers a distinct playstyle. Choose based on your preferred role.

| Class | HP | Shield | Speed | Agility | Cargo | Weapon Slots | Gadget Slots | Role |
|---|---|---|---|---|---|---|---|---|
| **Scout** | 1,200 | 400 | 280 km/s | 0.9 | 20 | 2 | 2 | Fast recon, hit-and-run |
| **Cruiser** | 3,500 | 1,200 | 160 km/s | 0.5 | 60 | 4 | 3 | Balanced all-rounder |
| **Miner** | 2,800 | 800 | 140 km/s | 0.4 | 120 | 2 | 4 | Resource extraction |
| **Destroyer** | 5,000 | 2,000 | 120 km/s | 0.3 | 40 | 6 | 2 | Heavy assault |
| **Carrier** | 8,000 | 3,000 | 80 km/s | 0.2 | 200 | 3 | 5 | Fleet support & logistics |

> **Tip:** The Scout is ideal for new players who prefer speed over firepower. The Cruiser is the recommended starter for balanced gameplay.

### Weapons & Combat

**Weapon Types:**

| Type | Behavior | Damage Type | Best Against |
|---|---|---|---|
| **Projectile** | Rapid-fire kinetic rounds | Kinetic | Unshielded hulls |
| **Beam** | Sustained energy stream | Energy | Shields |
| **Missile** | Homing explosive warhead | Explosive | Slow targets |
| **EMP** | Area-of-effect disruption | Electromagnetic | Electronics & shields |

**Combat Mechanics:**
- **Target Lock** — Hold the Lock button to acquire a target. Lock-on takes 1.5 seconds at base speed. Faster ships lock faster.
- **Firing** — Press Fire to discharge your active weapon. Each weapon has its own ammo pool, fire rate, and effective range.
- **Critical Hits** — 15% base chance for 2x damage on any hit.
- **Shield Regeneration** — Shields regenerate at 5 points/second after 3 seconds without taking damage.
- **Weapon Switching** — Cycle through equipped weapons using the weapon stash panel (left side of HUD).

**Default Loadout:**

| Weapon | Type | Rarity | Ammo |
|---|---|---|---|
| Plasma Burster MK4 | Projectile | Rare | 3/24 |
| Ion Disruptor | Beam | Uncommon | 4/11 |
| Shield Breaker | Projectile | Uncommon | 4/11 |
| Kuel Supere | Beam | Common | 4/16 |
| Soak Llaner | Missile | Epic | 33/40 |
| Shield Ublnr | EMP | Legendary | 33/44 |

### Exploration & Mining

When not in combat, switch to **Free Roam Mode** to explore the sector:

- **Asteroid Fields** — Procedurally generated clusters containing iron, gold, crystal, and uranium deposits
- **Mining** — Approach an asteroid and activate the mining laser. Resources flow into your cargo hold at 10 units/second base rate
- **Resource Collection** — Floating debris and supply crates can be picked up by proximity
- **Space Stations** — Dock to access repair bays, weapon shops, and mission boards

**Resource Types:**

| Resource | Symbol | Use |
|---|---|---|
| Iron | Fe | Hull repairs, basic crafting |
| Gold | Au | Trading currency, electronics |
| Crystal | Cr | Shield upgrades, energy weapons |
| Uranium | U | Advanced propulsion, nuclear weapons |
| Credits | C | Universal currency |

### Story Mode & AEGIS

The campaign unfolds across five chapters with branching paths driven by your choices.

**Chapters:**
1. **Prologue** — Awakening in damaged ship, AEGIS activation
2. **Chapter 1** — First contact, establishing sector presence
3. **Chapter 2** — Faction conflicts and alliance choices
4. **Chapter 3** — Discovery of the anomaly
5. **Finale** — Confrontation and resolution (multiple endings)

**AEGIS** (Adaptive Exploration & Guidance Intelligence System) is your AI companion. It provides:
- Mission briefings and tactical advice
- Environmental hazard warnings
- Dialogue choices that shape the narrative
- Ship system diagnostics

> Choices are permanent. Flags set by your decisions unlock or lock future story paths. There is no going back.

### Progression & Rarity

**Leveling:**
- Earn XP through combat (50 XP/kill), missions (200 XP), and mining (10 XP/action)
- Each level requires progressively more XP: `base * 1.5^level`
- Maximum level: 50
- Leveling unlocks new ships, weapons, and story content

**Rarity Tiers:**

| Tier | Color | Drop Rate | Stat Bonus |
|---|---|---|---|
| Common | Gray | Baseline | -- |
| Uncommon | Green | ~30% | +15% |
| Rare | Blue | ~15% | +35% |
| Epic | Purple | ~5% | +60% |
| Legendary | Gold | ~1% | +100% |

### Controls

| Action | Desktop | Mobile |
|---|---|---|
| Rotate Camera | Click + Drag | Touch + Drag |
| Zoom | Scroll Wheel | Pinch |
| Fire Weapon | Spacebar / Click FIRE | Tap FIRE |
| Lock Target | Tab / Click LOCK | Tap LOCK |
| Switch Target | Q / Click Switch | Tap Switch |
| Pause | Escape | Tap Menu |
| Open Inventory | I | Tap Inventory |
| Open Map | M | Tap Map |

---

## Infrastructure & Build

### Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | React | 18.3 | Component architecture & UI |
| **3D Engine** | Three.js | 0.183 | WebGL rendering |
| **3D Framework** | React Three Fiber | 9.5 | Declarative Three.js in React |
| **3D Helpers** | @react-three/drei | 10.7 | Camera controls, Stars, loaders |
| **Post-Processing** | @react-three/postprocessing | 3.0 | Bloom, DOF, color grading |
| **State** | Zustand | 5.0 | Global state with persist middleware |
| **Routing** | React Router | 7.13 | Client-side navigation |
| **Styling** | Tailwind CSS | 4.2 | Utility-first CSS framework |
| **Build Tool** | Vite | 8.0 | HMR dev server & production bundler |
| **Language** | TypeScript | 5.9 | Strict type safety |

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser Window                    │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│    React UI Layer    │    React Three Fiber Layer   │
│   (HTML/CSS/Tailwind)│      (WebGL Canvas)          │
│                      │                              │
│  ┌────────────────┐  │  ┌────────────────────────┐  │
│  │   Main Menu    │  │  │     EngineCore         │  │
│  │   Settings     │  │  │  ┌──────────────────┐  │  │
│  │   HUD / TopBar │  │  │  │  Earth + Atmos   │  │  │
│  │   WeaponStash  │  │  │  │  Starfield       │  │  │
│  │   QuickInv     │  │  │  │  Ships/Entities  │  │  │
│  │   CombatCtrl   │  │  │  │  Particles       │  │  │
│  └────────────────┘  │  │  └──────────────────┘  │  │
│                      │  │  OrbitControls          │  │
│                      │  │  Lighting               │  │
│                      │  │  Post-Processing        │  │
│                      │  └────────────────────────┘  │
├──────────────────────┴──────────────────────────────┤
│                   Zustand Stores                     │
│  ┌──────────┬──────────┬───────────┬──────────────┐  │
│  │ Combat   │Inventory │Progression│   Story      │  │
│  │ Store    │ Store    │  Store    │   Store      │  │
│  └──────────┴──────────┴───────────┴──────────────┘  │
│  ┌──────────────────────────────────────────────────┐│
│  │              Settings Store (persisted)           ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Design Principles:**
- **Separation of Concerns** — UI components never import Three.js; 3D components never import Tailwind
- **Slice-Based State** — Each Zustand store owns one domain. No cross-store dependencies.
- **Selector Pattern** — Components subscribe to minimal state slices to prevent re-renders
- **Container/Presentational Split** — Logic in containers, rendering in presentational components
- **Immutable Updates** — All state mutations through Zustand's `set()` with spread operators

### Project Structure

```
orbital-sequence/
├── public/                     # Static assets served at root
│   ├── models/                 # GLTF/GLB 3D models
│   │   ├── ships/              # Player & enemy ship models
│   │   ├── enemies/            # Enemy-specific models
│   │   └── environment/        # Asteroids, stations
│   ├── textures/               # Image textures
│   │   ├── earth/              # Planet surface maps
│   │   ├── skybox/             # Space backgrounds
│   │   └── particles/          # Effect sprites
│   ├── audio/                  # Sound files
│   │   ├── music/              # Background music (MP3)
│   │   └── sfx/                # Sound effects (MP3)
│   └── fonts/                  # Web fonts (WOFF2)
│
├── src/
│   ├── core/                   # Engine-level systems
│   │   ├── rendering/          # Canvas, camera, lights, post-FX
│   │   ├── state/              # Zustand stores (5 stores)
│   │   └── assets/             # Loader, cache, audio manager
│   │
│   ├── features/               # Game mode implementations
│   │   ├── combat/             # Combat orchestration & AI
│   │   ├── exploration/        # Free roam, mining, asteroids
│   │   ├── story/              # Narrative engine & dialogue
│   │   └── shipSelection/      # Ship picker & carousel
│   │
│   ├── ui/                     # All 2D interface components
│   │   ├── hud/                # In-game overlays (TopBar, etc.)
│   │   ├── menus/              # Main menu, settings, pause
│   │   └── shared/             # Reusable: Button, Panel, Modal
│   │
│   ├── entities/               # 3D game objects
│   │   ├── ships/              # Player/enemy ship components
│   │   ├── weapons/            # Projectile & impact effects
│   │   ├── environment/        # Earth, asteroids, stations, stars
│   │   └── targets/            # Ground targets & definitions
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Math, physics, collision, formatting
│   ├── types/                  # TypeScript interfaces & enums
│   ├── constants/              # Game balance, visuals, asset paths
│   │
│   ├── App.tsx                 # Root: mode transitions & layout
│   ├── main.tsx                # Entry point: React DOM render
│   └── index.css               # Tailwind imports & theme tokens
│
├── docs/                       # Documentation & brand assets
│   └── frontier-logo.png       # Official logo
│
├── index.html                  # HTML shell with mobile meta tags
├── vite.config.ts              # Vite + React + Tailwind plugins
├── tsconfig.json               # TypeScript strict configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

**File Count:** 71 source files | **Total Lines:** ~5,800

### Development Setup

**Prerequisites:**
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Modern browser with WebGL 2.0 support

**Quick Start:**

```bash
# Clone the repository
git clone https://github.com/KudbeeZero/Orbital-sequence.git
cd Orbital-sequence

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Open in browser
# -> http://localhost:5173
```

**Available Scripts:**

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR at port 5173 |
| `npm run build` | TypeScript check + production build to `dist/` |
| `npm run preview` | Preview production build locally |

### Build & Deployment

**Production Build:**

```bash
npm run build
```

Outputs optimized bundles to `dist/`:
- **Code-split chunks**: Three.js and R3F separated into dedicated chunks
- **Tree-shaken**: Only imported code ships
- **Source maps**: Enabled for debugging
- **CSS**: Tailwind purged to ~25 KB gzipped

**Bundle Analysis:**

| Chunk | Raw Size | Gzipped |
|---|---|---|
| Application code | ~156 KB | ~50 KB |
| Three.js + R3F | ~900 KB | ~241 KB |
| CSS | ~24 KB | ~5 KB |
| **Total** | **~1.08 MB** | **~296 KB** |

**Deployment Targets:**
- Any static hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages)
- Serve `dist/` directory
- No server-side rendering required

### Performance Standards

| Metric | Target | Enforcement |
|---|---|---|
| Frame Rate | 60 FPS | Dynamic quality scaling drops effects below 55 FPS |
| First Paint | < 2 seconds | Code splitting, lazy loading |
| Bundle Size | < 1.5 MB gzipped | Tree shaking, chunk splitting |
| Memory | < 512 MB | LRU model cache, texture compression |
| Mobile | Touch-responsive | Viewport meta, touch events, adaptive DPR |

**Quality Scaling Pipeline:**

```
Monitor FPS every 2 seconds
  → If FPS < 55 for 3 consecutive checks:
      Ultra → High → Medium → Low
  → Reduces: shadow resolution, particle count,
     post-processing effects, asteroid density
  → Maintains: core gameplay, UI responsiveness
```

---

## Contributing

This project uses an **AI-first development workflow**. Every module is designed to be implemented by autonomous AI agents following typed interfaces and JSDoc specifications.

**For Human Contributors:**
1. Fork the repository
2. Create a feature branch (`feature/your-feature`)
3. Follow existing TypeScript patterns and Zustand conventions
4. Ensure `npm run build` passes with zero errors
5. Submit a pull request with clear description

**Code Standards:**
- TypeScript strict mode — no `any` types
- Zustand stores for all global state — no prop drilling
- Tailwind utility classes — no custom CSS files
- Presentational/container component separation
- All interfaces defined in `src/types/`

---

## License

Copyright 2024-2026 Frontier: Lost in Space. All rights reserved.

Orbital Sequence is proprietary software. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without express written permission from the project owners.

---

<p align="center">
  <img src="docs/frontier-logo.png" alt="Frontier" width="200" />
  <br/>
  <em>Built with precision. Deployed to the stars.</em>
</p>
