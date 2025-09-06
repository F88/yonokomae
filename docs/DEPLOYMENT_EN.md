---
lang: en
title: Deployment Guide
title-en: Deployment Guide
title-ja: デプロイガイド
related:
    - DEPLOYMENT_EN.md has been translated into Japanese as DEPLOYMENT_JA.md.
    - DEPLOYMENT_JA.md is a Japanese translation of DEPLOYMENT_EN.md.
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Deployment Guide (Canonical)

This is the canonical deployment reference for the project. The README contains only a brief summary and links here for details.

## Overview

The app is a static Single Page Application built with Vite and deployed to GitHub Pages under the repository path: `/yonokomae/`.

Key constraints:

- All static asset and router base paths must be prefixed with `/yonokomae/` in production.
- GitHub Pages serves `404.html` for unknown routes. For SPA deep links we duplicate `index.html` as `404.html` to enable client-side routing fallback.
- Deployment artifacts live in `packages/app/dist` (NOT a root-level `dist/`).

## Scripts

| Script                    | Purpose                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `pnpm run build:app`      | Build only the app (assumes packages already built)                                        |
| `pnpm run build:ghpages`  | Full workspace build, then app build with `VITE_BASE_PATH=/yonokomae/`, creates `404.html` |
| `pnpm run deploy:ghpages` | End-to-end: build (above) then publish `packages/app/dist` to `gh-pages`                   |

Internals of `build:ghpages`:

1. `pnpm -r --sort build` builds all packages (types, schema, data, catalog, app declarations).
2. Runs `VITE_BASE_PATH=/yonokomae/ pnpm run build:app` (ensures bundled assets have correct base).
3. Copies `index.html` → `404.html`.

## Environment Variable: `VITE_BASE_PATH`

We do NOT hardcode `base` in `vite.config.ts`; instead we pass an environment variable to keep local dev root-relative (`/`). This avoids broken asset URLs in local preview.

Checklist when adjusting base logic:

1. Confirm `import.meta.env.BASE_URL` matches expected prefix in built code.
2. Search for hardcoded `/yonokomae/` (should only appear in README / docs / scripts).
3. Ensure no runtime string concatenations accidentally produce `//` double slashes.

## Typical Deployment Flow

### Fast path (only UI changes; dependencies already built)

```bash
pnpm run build:ghpages
pnpm run deploy:ghpages
```

### Slower clean path

```bash
pnpm clean
pnpm install --frozen-lockfile
pnpm run deploy:ghpages
```

### Manual publish (advanced)

```bash
pnpm -r --sort build
VITE_BASE_PATH=/yonokomae/ pnpm run build:app
cp packages/app/dist/index.html packages/app/dist/404.html
gh-pages -d packages/app/dist -m "deploy: manual"
```

## Verification Checklist

1. Visit: <https://f88.github.io/yonokomae/>
2. Hard refresh (Shift+Reload) or append `?t=<timestamp>`
3. Open DevTools → Network: confirm asset URLs start with `/yonokomae/`
4. Navigate within the SPA and then refresh the page → content loads (404 fallback works)
5. Optional: Inspect `packages/app/dist` to ensure only one copy each of hashed assets (no duplicate base variants)

## Troubleshooting

| Symptom                      | Likely Cause                                  | Resolution                                                         |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| 404 on deep link refresh     | Missing `404.html` or wrong publish directory | Re-run `build:ghpages`; verify `packages/app/dist/404.html` exists |
| Broken CSS / images          | Missing base prefix                           | Ensure `VITE_BASE_PATH=/yonokomae/` was set in build command       |
| Stale JS after deploy        | Browser cache / CDN delay                     | Hard refresh, append cache-buster query, or wait a few minutes     |
| Double slash in URLs         | Manual concatenation like `${BASE_URL}/path`  | Use `new URL('path', import.meta.env.BASE_URL)` or trim slashes    |
| Assets served but blank page | Publishing wrong folder                       | Must deploy `packages/app/dist` exactly                            |

## CI / Automation Notes

Currently deployment is triggered manually via the provided script. If integrating into CI:

1. Add a workflow that runs on tag or manual dispatch.
2. Cache pnpm store for faster builds.
3. Run `pnpm run build:ghpages` then `pnpm run deploy:ghpages` with a `GITHUB_TOKEN` that can push to `gh-pages`.

Recommendation: keep deployment manual until release cadence stabilizes to avoid accidental overwrites.

## Future Extensions

Potential future hosting targets should mirror the same base path strategy or support root hosting to eliminate the prefix. If migrating to a platform (e.g. Vercel) remove the explicit `VITE_BASE_PATH` export and ensure router base is `/`.

## Change Log (Deployment Process)

- 2025-09-06: Extracted canonical deployment guide from README into this document.

## Related

- README (summary section only)
- `package.json` scripts: `build:ghpages`, `deploy:ghpages`
- Vite config (`packages/app/vite.config.*`) for base path usage
