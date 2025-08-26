# RFC: Adopt pnpm monorepo and extract HISTORICAL_EVIDENCE seeds into a data package

Status: Proposed

## Context

Contributors who only want to add or update HISTORICAL_EVIDENCE data (seeds) must currently work inside the application tree. Splitting the repository into clear areas for app and data can reduce cognitive load and make contribution flows more obvious while preserving our static-only (eager) loading policy.

## Goals

- Improve contributor experience for seed authors by separating app and data.
- Keep English docs as the single source of truth; keep the static-only policy.
- Preserve schema validation and duplicate ID checks in CI and at build-time.
- Avoid dynamic imports at runtime; keep deterministic bundling.

## Non-goals

- Moving to multiple repositories. This RFC stays within a single monorepo.
- Introducing runtime dynamic imports or changing the static-only policy.

## Proposal (pnpm workspaces)

Adopt pnpm workspaces and split the repository into:

- app/ — the Vite React application (@f88/app)
- data/historical-evidence/ — the data package exporting seeds (@f88/data-historical-evidence)
- packages/types/ — shared types and Zod schemas (@f88/types-historical)

The application will consume seeds via static imports from the data package instead of import.meta.glob. The data package will explicitly export seed lists and configs. Types and schemas live in a shared package to prevent cyclic dependencies.

## Repository layout (proposed)

- package.json (root, packageManager: pnpm, workspace scripts)
- pnpm-workspace.yaml
- tsconfig.base.json
- eslint.config.js, prettier.config.mjs
- docs/
    - DEVELOPMENT_EN.md (source of truth)
    - DEVELOPMENT_JA.md
    - HISTORICAL_EVIDENCE_SEEDS_EN.md
    - HISTORICAL_EVIDENCE_SEEDS_JA.md
    - RFC_pnpm-monorepo-historical-evidence-seeds.md (this document)
- .github/workflows/ci.yml
- app/
    - package.json (name: @f88/app, private)
    - vite.config.ts
    - tsconfig.json (extends ../../tsconfig.base.json)
    - public/
    - mock-api/
    - src/ (current application code moved here)
        - components/, hooks/, lib/, yk/, assets/, index.css, main.tsx, App.tsx, tests
- data/historical-evidence/
    - package.json (name: @f88/data-historical-evidence)
    - tsconfig.json
    - src/
        - scenario/\*.ts
        - neta/{komae.ts,yono.ts}
        - report/config.ts
        - index.ts (exports: historicalSeeds, netaKomae, netaYono, reportConfig)
    - src/yk/repo/seed-system/seeds.validation.test.ts (Zod + duplicate ID validation)
    - scripts/generate-manifest.ts (optional; see Alternatives)
- packages/types/
    - package.json (name: @f88/types-historical)
    - tsconfig.json
    - src/
        - historical-seed.ts (HistoricalSeed type + Zod schema)
        - index.ts

## Package boundaries and dependencies

- @f88/types-historical
    - deps: zod
    - peerDeps: none
- @f88/data-historical-evidence
    - deps: @f88/types-historical, zod
    - peerDeps: none (no React dependency)
- @f88/app
    - deps: react, react-dom, vite, etc.
    - deps: @f88/types-historical, @f88/data-historical-evidence (workspace:\*)

Guideline: React should exist only in the app package to avoid duplicate instances. Use workspace:\* where appropriate.

## Loader changes (app)

- Remove import.meta.glob-based discovery.
- Add static imports from the data package:
    - import { historicalSeeds, netaKomae, netaYono, reportConfig } from '@f88/data-historical-evidence'
- Keep duplicate ID detection over the imported arrays (same logic as today).
- Maintain the static-only policy.

## Type and schema sharing

- Move HistoricalSeed and its Zod schema to @f88/types-historical.
- Both app and data import from @f88/types-historical to avoid cycles.

## Build and dev notes

- Data and types build with tsc to ESM; bundling is not required.
- The app continues to use Vite.
- React remains only in the app; avoid HMR inconsistencies.
- If needed, consider resolve.preserveSymlinks in the app’s Vite config.

## CI (pnpm)

- Use pnpm/action-setup and cache the pnpm store.
- Split jobs:
    - types: lint/typecheck/test for @f88/types-historical
    - data: lint/typecheck/test (Zod + duplicate ID) for @f88/data-historical-evidence
    - app: lint/typecheck/test/build for @f88/app
- Optionally filter jobs by path changes later.

## Migration plan (phased)

1. Extract shared types/schemas

- Create @f88/types-historical and move HistoricalSeed + Zod schema there.
- Update current code to import types/schemas from the new package (no behavior change).

2. Create the data package

- Move current seeds under data/historical-evidence/src.
- Export historicalSeeds, netaKomae, netaYono, reportConfig from index.ts.
- Update the app loader to import from the data package.

3. Remove legacy discovery

- Delete import.meta.glob discovery and old paths.
- Update docs and CI to reflect the new layout.

## Risks and mitigations

- Duplicate React or HMR issues:
    - Keep React only in the app; other packages have no React dep.
    - Consider preserveSymlinks if needed.
- Type cycles:
    - Centralize types/schemas in @f88/types-historical and import one-way.
- Manual index maintenance in data:
    - Option: generate a manifest in prebuild; see Alternatives.
- Different local vs CI behaviors:
    - Build data/types first in CI; keep app consuming their outputs.

## Alternatives considered

- Vite server.fs.allow to keep import.meta.glob across directories:
    - Not recommended for production builds and consistency.
- Manifest auto-generation in data:
    - A script scans scenario/\*\* and generates src/**manifest**.ts.
    - src/index.ts re-exports from **manifest**.
    - Reduces manual maintenance at the cost of a generation step.
- Keep current single-package layout:
    - Lowest change but worse contributor ergonomics for data authors.

## Open questions

- Should the generated manifest (if used) be committed or generated in CI?
- Asset strategy: local assets in data vs external URLs?
- Versioning: keep data/types private or publish under a scope?
- Do we want partial CI runs based on path filters from day one?

## Appendix: example import paths

- In data seeds (TypeScript):
    - import type { HistoricalSeed } from '@f88/types-historical'
- In app loader:
    - import { historicalSeeds } from '@f88/data-historical-evidence'
