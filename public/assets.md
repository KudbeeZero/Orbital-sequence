# Asset Organization

## Directory Structure

- `models/` — GLTF/GLB 3D models
  - `ships/` — Player and enemy ship models
  - `enemies/` — Enemy-specific models
  - `environment/` — Asteroids, stations, debris
- `textures/` — Image textures for materials
  - `earth/` — Earth diffuse, normal, specular, clouds, night maps
  - `skybox/` — Space background textures
  - `particles/` — Spark, smoke, glow particle textures
- `audio/` — Sound files
  - `music/` — Background music tracks (MP3)
  - `sfx/` — Sound effects (MP3)
- `fonts/` — Web font files (WOFF2)

## Conventions

- Models: Use GLB format (binary GLTF) for smaller file sizes
- Textures: Use JPG for opaque, PNG for transparent, max 2048x2048
- Audio: MP3 format, music at 128kbps, SFX at 192kbps
- All asset paths are registered in `src/constants/assetPaths.ts`
