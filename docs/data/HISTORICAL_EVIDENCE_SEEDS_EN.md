---
lang: en
title: Guide for contributing historical evidence.
title-en: Guide for contributing historical evidence.
title-ja: 歴史的証拠への貢献ガイド
related:
    - HISTORICAL_EVIDENCE_SEEDS_EN.md has been translated into Japanese as HISTORICAL_EVIDENCE_SEEDS_JA.md.
    - HISTORICAL_EVIDENCE_SEEDS_JA.md is a Japanese translation of HISTORICAL_EVIDENCE_SEEDS_EN.md.
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Historical Evidence Seeds: Contributor Guide

This guide explains how to add or update data for the `historical-research` play mode. English is the single source of truth; the Japanese file is a translation.

## Scope

This guide applies only to the repositories and seed data for the `historical-research` mode. Other modes like `demo` or `yk-now` are out of scope.

## Seed Locations

- **TypeScript (Preferred):**
    - `data/historical-evidence/src/scenario/*.ts` - Standard scenarios
    - `data/historical-evidence/src/scenario/*.ja.ts` - Japanese localized scenarios
    - `data/historical-evidence/src/scenario/*.en.ts` - English localized scenarios
    - `data/historical-evidence/src/neta/*.ts` - Neta data files
- **JSON:** Not supported in current structure

We recommend using TypeScript to benefit from type checking. For localized content, use language-specific file extensions (`.ja.ts`).

## Loading Policy: Static Eager Imports

- Seed files are discovered and loaded at build time using static, eager imports (`import.meta.glob(..., { eager: true })`).
- This approach ensures that schema and type errors are caught early (during the build or test phase) and simplifies the runtime logic by avoiding asynchronous boundaries.
- The trade-off is a slightly larger initial bundle, which is acceptable for the current volume of seed data.

## Schema and Types

- The canonical type definition for historical seeds is the `HistoricalSeed` type in `packages/types/src/historical.ts`.
- Your seed file's default export must be an object compatible with the `HistoricalSeed` type.
- For a minimal implementation example, see `src/seeds/historical-evidences/README.md`.

## Uniqueness and Validation

- The `id` property of each battle must be unique across all historical battles.
- Uniqueness and schema compliance are enforced by a CI check (`pnpm test`), which runs Vitest with Zod validation in each data package.

## How to Add or Update a Battle

1.  **Create or Edit a Seed File:**
    Add or modify a TypeScript file in `data/historical-evidence/src/scenario/`.
    Example: `my-scenario.ts`

2.  **Define the Historical Seed Data:**
    Ensure the file has a default export that conforms to the `HistoricalSeed` type. Make sure the `id` is unique.

3.  **Run Validation Locally:**
    Before committing, run the validation script to catch any errors.

    ```bash
    # Test specific package
    cd data/historical-evidence
    pnpm test

    # Or test all from root
    pnpm test
    ```

4.  **Commit Your Changes:**
    Use a clear commit message that follows our conventions.
    - `data(historical): add new scenario my-scenario`
    - `data(historical): fix provenance url for tama-river`

## CI Checks

The `pnpm test` command is part of our CI pipeline. Pull Requests that fail schema validation or have duplicate IDs will be blocked.

## Troubleshooting

- **Duplicate ID Error:** Search within `data/historical-evidence/src/scenario/` to find and resolve the conflicting ID.
- **Large Bundle Warnings:** This is acceptable for now. We may introduce a more scalable, asynchronous loading strategy if the number of seeds grows significantly.

## References

- **Implementation:** `data/historical-evidence/src/index.ts`
- **Validation Tests:** `data/historical-evidence/src/seeds.validation.test.ts`
- **Type Definitions:** `packages/types/src/historical.ts`
- **Development Overview:** `docs/DEVELOPMENT_EN.md`

## Appendix: Repository-level Filtering

Historical evidence seeds currently are not narrowed by additional repository
filters beyond potential future support for `themeId` or `significance`. If
filtering is introduced, it will operate at generation time without requiring
changes to existing seed files. Monitor the Development Guide changelog for
updates.
