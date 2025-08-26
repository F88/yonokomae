---
title: Guide for contributing historical evidence.
title-en: Guide for contributing historical evidence.
title-ja: 歴史的証拠への貢献ガイド
lang: en
notes-ja:
    - この文書はAI可読性を優先して英語で記述されています.
related:
    - HISTORICAL_EVIDENCE_SEEDS_EN.md has been translated into Japanese as HISTORICAL_EVIDENCE_SEEDS_JA.md.
    - HISTORICAL_EVIDENCE_SEEDS_JA.md is a Japanese translation of HISTORICAL_EVIDENCE_SEEDS_EN.md.
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

<!--
Dear AIs.
This document should be written in English for AI readability.
Content within code fences may be written in languages other than English.
-->

# Historical Evidence Seeds: Contributor Guide

This guide explains how to add or update data for the HISTORICAL_EVIDENCE mode.
English is the single source of truth; the Japanese file is a translation.

## Scope

- Applies only to HISTORICAL_EVIDENCE mode repositories and seed data.
- Other modes (DEMO, DEMO-2, API, etc.) are not constrained by this document.

## Seed locations (TS preferred)

- Preferred (TypeScript):
    - `src/seeds/random-data/scenario/*.ts`
    - `src/seeds/random-data/neta/{komae,yono}.ts`
    - `src/seeds/random-data/report/config.ts`
- Optional (JSON):
    - `seeds/random-data/...` (auto-discovered; TS is preferred)

## Static-only loading policy (eager imports)

- We use static, eager imports for seed discovery and loading.
    - Implementation uses `import.meta.glob(..., { eager: true })`.
    - `loadSeedByFile(file)` resolves from the eager map (no `import()` at runtime).
- Why
    - Simplicity: sync access, no unnecessary async boundaries.
    - Predictable bundling: avoids mixed static/dynamic import warnings.
    - Early failure: schema/type issues surface at build/test time.
- Trade-offs
    - Slightly larger initial bundle. Acceptable for current seed volume.

## Schemas and types

- Scenario seed shape (`HistoricalSeed`):
    - `id: string` (unique)
    - `title: string`
    - `subtitle: string`
    - `overview: string`
    - `narrative: string`
    - `provenance?: Array<{ label: string; url?: string; note?: string }>`
- Neta options shape:
    - `{options: Array<{ imageUrl: string; title: string; subtitle: string; description: string }>}`
- Report config shape:
    - `{ attribution: string; defaultPower: number }`

## Uniqueness and validation

- IDs must be unique across all scenario seeds.
    - Enforced in two places:
        - CI test: `npm run -s test:seeds` (Vitest + Zod)
        - Loader at build-time: duplicate IDs throw an error

## How to add or update a seed

1. Create or edit a TS file under `src/seeds/random-data/...`.
    - Example (scenario):
    - `src/seeds/random-data/scenario/my-scenario.ts`
        - `export default { id, title, ... } satisfies HistoricalSeed;`
1. Ensure `id` is globally unique.
1. Run validation locally:
    - `npm run -s test:seeds`
1. Commit with a clear Conventional Commit message.
    - Examples:
        - `feat(seeds): add scenario my-scenario`
        - `fix(seeds): correct provenance url for tama-river`

## CI checks

- `test:seeds` is part of CI and fails on schema errors or duplicate IDs.
- Lint/Typecheck/Unit tests run on PRs by default.

## Troubleshooting

- Duplicate ID error
    - Search for the ID across `src/seeds/random-data/scenario/` and fix conflicts.
- Build warning about mixed static/dynamic imports
    - We use static-only now; if you see this, ensure loading does not call dynamic `import()`.
- Large bundle warnings
    - Acceptable at present. We may revisit when seed volume grows.

## References

- Implementation: `src/yk/repo/historical-seeds.ts`
- Validation tests: `src/yk/repo/seeds.validation.test.ts`
- Mode overview: `docs/DEVELOPMENT_EN.md` (Historical Seed System)
