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

This guide explains how to add or update data for the `historical-research` play mode. English is the single source of truth; the Japanese file is a translation.

## Scope

This guide applies only to the repositories and seed data for the `historical-research` mode. Other modes like `demo` or `yk-now` are out of scope.

## Seed Locations

-   **TypeScript (Preferred):** `src/seeds/historical-evidences/battle/*.ts`
-   **JSON (Optional):** `seeds/historical-evidences/battle/*.json`

We recommend using TypeScript to benefit from type checking.

## Loading Policy: Static Eager Imports

-   Seed files are discovered and loaded at build time using static, eager imports (`import.meta.glob(..., { eager: true })`).
-   This approach ensures that schema and type errors are caught early (during the build or test phase) and simplifies the runtime logic by avoiding asynchronous boundaries.
-   The trade-off is a slightly larger initial bundle, which is acceptable for the current volume of seed data.

## Schema and Types

-   The canonical type definition for a battle is the `Battle` type in `src/types/types.ts`.
-   Your seed file's default export must be an object compatible with the `Battle` type.
-   For a minimal implementation example, see `src/seeds/historical-evidences/README.md`.

## Uniqueness and Validation

-   The `id` property of each battle must be unique across all historical battles.
-   Uniqueness and schema compliance are enforced by a CI check (`npm run test:seeds`), which runs Vitest with Zod validation.

## How to Add or Update a Battle

1.  **Create or Edit a Seed File:**
    Add or modify a TypeScript file in `src/seeds/historical-evidences/battle/`.
    Example: `my-battle.ts`

2.  **Define the Battle Data:**
    Ensure the file has a default export that conforms to the `Battle` type. Make sure the `id` is unique.

3.  **Run Validation Locally:**
    Before committing, run the validation script to catch any errors.
    ```bash
    npm run test:seeds
    ```

4.  **Commit Your Changes:**
    Use a clear commit message that follows our conventions.
    -   `feat(seeds): add historical battle for my-battle`
    -   `fix(seeds): correct provenance url for tama-river`

## CI Checks

The `test:seeds` command is part of our CI pipeline. Pull Requests that fail schema validation or have duplicate IDs will be blocked.

## Troubleshooting

-   **Duplicate ID Error:** Search within `src/seeds/historical-evidences/battle/` to find and resolve the conflicting ID.
-   **Large Bundle Warnings:** This is acceptable for now. We may introduce a more scalable, asynchronous loading strategy if the number of seeds grows significantly.

## References

-   **Implementation:** `src/yk/repo/seed-system/seeds.ts`
-   **Validation Tests:** `src/yk/repo/seed-system/seeds.validation.test.ts`
-   **Authoring Example:** `src/seeds/historical-evidences/README.md`
-   **Development Overview:** `docs/DEVELOPMENT_EN.md`
