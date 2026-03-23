# Cloudflare Pages Deployment Guide

## Overview

Orbital Sequence is a static SPA (Single Page Application) built with Vite + React + Three.js.
It deploys to Cloudflare Pages with automatic CI/CD from the GitHub repository.

## Project Configuration Files

| File | Purpose |
|---|---|
| `wrangler.toml` | Pages project metadata and environment variable scaffolding |
| `public/_headers` | Security headers applied to all routes (CSP, HSTS, etc.) |
| `public/_redirects` | SPA fallback — routes all 404s to `index.html` for client-side routing |

## Build Settings (Cloudflare Dashboard)

When creating the Pages project, configure:

| Setting | Value |
|---|---|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (repository root) |
| **Node.js version** | `20` (LTS) |

## Branch Strategy

| Branch | Deployment |
|---|---|
| `main` | Production (`orbital-sequence.pages.dev` or custom domain) |
| Pull requests | Automatic preview deployments with unique URLs |

## Environment Variables

No runtime environment variables are required for the base game — all feature flags are
compile-time constants in `src/constants/`. If external services are added, configure them
through **Cloudflare Pages → Settings → Environment variables** rather than committing them
to the repository.

### Adding a Variable

1. Dashboard → Orbital Sequence project → Settings → Environment variables
2. Add variable under **Production** and/or **Preview** scope
3. Prefix with `VITE_` so Vite exposes it to client-side code:
   ```
   VITE_ANALYTICS_ID=G-XXXXXXXX
   ```
4. Access in code via `import.meta.env.VITE_ANALYTICS_ID`

## Content Security Policy Notes

The `public/_headers` file includes a CSP that explicitly allows:

- `script-src 'wasm-unsafe-eval'` — Required for Three.js WASM math operations
- `worker-src blob:` — Required for Web Workers spawned by `@react-three/drei`
- `style-src 'unsafe-inline'` — Required for Tailwind CSS v4 runtime styles
- `img-src data: blob:` — Required for canvas texture exports and Three.js blob textures

If new external services (CDNs, analytics, etc.) are added, update the `connect-src` and
relevant directives accordingly.

## Initial Deployment Steps

1. **Verify build locally** — `npm run build` should produce `dist/` with no errors
2. **Connect repository** — Cloudflare Dashboard → Pages → Create a project → Connect to Git
3. **Select repository** — `KudbeeZero/Orbital-sequence`
4. **Configure build settings** — Use the values from the table above
5. **Deploy** — Click "Save and Deploy"
6. **Verify** — Access the `*.pages.dev` URL and confirm the main menu renders
7. **Test settings persistence** — Open settings, change a value, reload — the value should persist via localStorage

## Verifying Deployment Health

After each deployment:

- [ ] Main menu renders with rotating Earth sphere
- [ ] Stars background visible
- [ ] Deploy button transitions to gameplay mode
- [ ] TopBar shows oxygen/hull/sector values
- [ ] CombatControls render at the bottom
- [ ] Pause → Quit returns to main menu
- [ ] Settings panel opens and persists preferences across reloads (localStorage)

## Custom Domain (Optional)

1. Dashboard → Pages project → Custom domains → Set up a custom domain
2. Add provided CNAME record to DNS
3. Cloudflare automatically provisions and renews the TLS certificate

## Preview Deployments for Pull Requests

Cloudflare Pages automatically creates a preview URL for each pull request.
The URL format is: `https://<hash>.orbital-sequence.pages.dev`

To use previews effectively:
1. Create a feature branch
2. Push commits
3. Open a pull request against `main`
4. Cloudflare Pages builds and posts the preview URL as a PR status check
5. Review the preview before merging
