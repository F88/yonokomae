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
- Other modes (DEMO, RANDOM-DATA, API, etc.) are not constrained by this document.

## Seed locations (TS preferred)

- Preferred (TypeScript, file-based Battle data):
    - `src/seeds/historical-evidences/battle/*.ts`
- Optional (JSON):
    - `seeds/historical-evidences/battle/*.json` (auto-discovered; TS is preferred)

Note: Random-data seeds under `src/seeds/random-data/**` are used by the RANDOM-DATA/DEMO modes and are out of scope for this document.

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

- Battle file shape (module default export should be Battle-compatible):
    - See `src/seeds/historical-evidences/README.md` for a minimal example and the expected `Battle` fields.

## Uniqueness and validation

- Battle `id` values must be unique across all historical battles.
    - Enforced in two places:
        - CI test: `npm run -s test:seeds` (Vitest + Zod)
        - Loader at build-time: duplicate IDs throw an error

## How to add or update a battle (TS recommended)

1. Create or edit a TS file under `src/seeds/historical-evidences/battle/`.
    - Example: `src/seeds/historical-evidences/battle/my-battle.ts`
    - Export `default` as a `Battle`-compatible object.
1. Ensure `id` is globally unique.
1. Run validation locally:
    - `npm run -s test:seeds`
1. Commit with a clear Conventional Commit message.
    - Examples:
        - `feat(seeds): add historical battle my-battle`
        - `fix(seeds): correct provenance url for tama-river`

## CI checks

- `test:seeds` is part of CI and fails on schema errors or duplicate IDs.
- Lint/Typecheck/Unit tests run on PRs by default.

## Troubleshooting

- Duplicate ID error
    - Search under `src/seeds/historical-evidences/battle/` and fix conflicts.
- Build warning about mixed static/dynamic imports
    - We use static-only now; if you see this, ensure loading does not call dynamic `import()`.
- Large bundle warnings
    - Acceptable at present. We may revisit when seed volume grows.

## Data Export Integration

The historical seed system integrates with the TSV export functionality:

- Export scripts can process seed-based data for external analysis
- Usage examples and user voices can be exported via:
    - `npm run ops:export-usage-examples-to-tsv`
    - `npm run ops:export-users-voice-to-tsv`
- Export data sources:
    - `src/data/usage-examples.ts` - Usage examples with categories
    - `src/data/users-voice.ts` - User testimonials and feedback

## References

- Implementation: `src/yk/repo/seed-system/seeds.ts`
- Validation tests: `src/yk/repo/seed-system/seeds.validation.test.ts`
- Historical Battle authoring: `src/seeds/historical-evidences/README.md`
- Mode overview: `docs/DEVELOPMENT_EN.md` (Historical Seed System)
- Export scripts: `src/ops/export-*-to-tsv.ts`
