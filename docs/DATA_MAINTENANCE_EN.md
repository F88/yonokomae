---
lang: en
title: Data Maintenance Guide
title-en: Data Maintenance Guide
title-ja: データメンテナンスガイド
related:
    - DATA_MAINTENANCE_EN.md has been translated into Japanese as DATA_MAINTENANCE_JA.md.
    - DATA_MAINTENANCE_JA.md is a Japanese translation of DATA_MAINTENANCE_EN.md.
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Data Maintenance Guide

This guide explains how to maintain and update data across all data packages in the Yono Komae War project. This is the central reference for data maintainers working with the pnpm monorepo structure.

## Overview

The project uses a pnpm monorepo with separate data packages for different domains:

- **`data/battle-seeds/`** - Battle data comparing Yono and Komae
- **`data/historical-evidence/`** - Historical scenarios and evidence
- **`data/news-seeds/`** - News-style battle samples

Each package is independent and can be maintained separately while sharing common types and validation schemas.

## Quick Start for Data Maintainers

### Prerequisites

- Basic understanding of TypeScript
- Familiarity with the project's bilingual documentation approach (English as source of truth)

### Common Workflow

1. **Navigate to the appropriate data package**:

```bash
cd data/{package-name}/
```

1. **Edit or add data files** in the `src/` directory

1. **Validate your changes**:

```bash
pnpm test  # Test current package only
# OR from project root:
pnpm test  # Test all packages
```

1. **Commit your changes**:

```bash
git add data/{package-name}/
git commit -m "data({domain}): describe your changes"
```

## Data Packages

### Battle Seeds (`data/battle-seeds/`)

**Purpose**: Statistical battles between Yono and Komae using real municipal data.

### Updated Directory Structure (themed + drafts)

The battle seeds directory has been reorganized to support thematic grouping and explicit draft separation. This enables cleaner curation, easier discovery, and publish state–aware tooling.

```text
data/battle-seeds/
    src/battle/
        theme/
            community/
            culture/
            development/
            economy/
            figures/
            history/
            information/
            technology/
        __drafts/           # Non-published battle concepts (publishState !== 'published')
        __generated/        # Build artifacts (indexes) – do not edit manually
```

**Legacy flat files** (previously: `data/battle-seeds/src/battle/yono-komae-*.ja.ts`) have been migrated into the appropriate `theme/{themeName}/` subdirectory. New files MUST follow the thematic structure.

**File Location (published)**: `data/battle-seeds/src/battle/theme/{themeName}/`
**File Location (draft / review / archived)**: `data/battle-seeds/src/battle/__drafts/`

**File Pattern**: `yono-komae-{topic}.ja.ts`
**Type**: `Battle` from `@yonokomae/types`
**Validation**: `BattleSchema` from `@yonokomae/schema`

**Examples**:

- `theme/development/yono-komae-agriculture.ja.ts`
- `theme/economy/yono-komae-area-comparison.ja.ts`
- `theme/history/yono-komae-population-trends.ja.ts`

### Publish State

Battle seeds now explicitly support a `publishState` field to indicate lifecycle:

| Value       | Meaning                             | Display Behavior |
| ----------- | ----------------------------------- | ---------------- |
| `published` | Canonical, visible to users         | No chip shown    |
| `draft`     | Early concept / incomplete          | Chip shown       |
| `review`    | Pending editorial / data validation | Chip shown       |
| `archived`  | Retired or superseded               | Chip shown       |

Rules:

- Files placed under `__drafts/` MUST declare a non-`published` `publishState`.
- Missing `publishState` defaults to `published` (backward compatibility) – a warning may be emitted by generation scripts later.
- Only non-`published` states surface a `PublishStateChip` in the UI.

### Index Generation & Tooling

Unified index generation is handled by a single script:

- `data/battle-seeds/scripts/generate-battle-index.ts` – builds a unified index of all battles (published + non-published metadata) with normalized `publishState` and per-state maps.

The legacy `generate-draft-index.ts` (draft-only enumeration) has been removed. Any previous workflow invoking it should switch to the unified generator.

Do not manually edit files under `__generated/`; regenerate instead:

```bash
pnpm tsx data/battle-seeds/scripts/generate-battle-index.ts
```

### Adding a New Themed Battle

1. Pick or create a theme directory under `theme/` (use lowercase kebab-case)
2. Create `yono-komae-{topic}.ja.ts`
3. Include `publishState: 'published'` (or another explicit state if not ready)
4. Run validation tests (`pnpm test`) and (optionally) regenerate indexes
5. Commit with: `data(battle): add {theme}:{topic} battle`

### Migrating Legacy Files

If you still have un-migrated flat files:

1. Determine appropriate theme (e.g. population → `history` or `figures` depending on narrative)
2. Move file into `theme/{themeName}/`
3. (Optional) Add `publishState` if conceptually a draft
4. Update imports if referenced directly (prefer index consumption inside app)
5. Regenerate indexes if needed

### Query & Filtering Behavior

Downstream repository filtering now supports combined theme + publish state constraints. Unknown states gracefully default to `published` to avoid accidental exclusion.

**Detailed Guide**: See [docs/data/BATTLE_SEEDS_EN.md](data/BATTLE_SEEDS_EN.md)

### Historical Evidence (`data/historical-evidence/`)

**Purpose**: Fictional historical scenarios presented as evidence of the "war."

**File Locations**:

- Scenarios: `data/historical-evidence/src/scenario/`
- Neta data: `data/historical-evidence/src/neta/`

**File Patterns**:

- `{scenario-name}.en.ts` (English version)
- `{scenario-name}.ja.ts` (Japanese version)

**Type**: `HistoricalSeed` from `@yonokomae/types`
**Validation**: `HistoricalSeedSchema` from `@yonokomae/schema`

**Examples**:

- `banner-mixup.en.ts` / `banner-mixup.ja.ts`
- `tama-river.en.ts` / `tama-river.ja.ts`

**Detailed Guide**: See [docs/data/HISTORICAL_EVIDENCE_SEEDS_EN.md](data/HISTORICAL_EVIDENCE_SEEDS_EN.md)

### News Seeds (`data/news-seeds/`)

**Purpose**: News-style sample battles for demonstration and testing.

**File Location**: `data/news-seeds/src/samples/`
**File Pattern**: `news-sample-{number}.ts`
**Type**: `Battle` from `@yonokomae/types`
**Validation**: `BattleSchema` from `@yonokomae/schema`

**Examples**:

- `news-sample-1.ts`
- `news-sample-2.ts`

**Detailed Guide**: See [docs/data/NEWS_SEEDS_EN.md](data/NEWS_SEEDS_EN.md)

## Common Tasks

### Adding New Data

1. Determine which package your data belongs to
2. Follow the naming conventions for that package
3. Use the appropriate TypeScript type
4. Ensure unique IDs across the package
5. Validate with `pnpm test`

### Updating Existing Data

1. Locate the file in the appropriate `data/{package}/src/` directory
2. Make your changes while preserving the type structure
3. Test your changes with `pnpm test`

### Localization

- **Battle Seeds**: Primarily Japanese (`*.ja.ts`)
- **Historical Evidence**: Both English and Japanese versions required
- **News Seeds**: Language-neutral (English-based)

### Validation and Testing

Each data package includes validation tests that check:

- **Schema compliance**: Data matches TypeScript types
- **Unique IDs**: No duplicate IDs within the package
- **Required fields**: All mandatory fields are present

Run tests from the package directory:

```bash
cd data/battle-seeds/     # or historical-evidence/ or news-seeds/
pnpm test
```

Or test all packages from the root (app + validation focused):

```bash
pnpm test
```

To run every workspace package's own test script (including internal ones if added), you can also use:

```bash
pnpm run test:all
```

### Commit Message Conventions

Use the format: `data({domain}): {description}`

Examples:

- `data(battle): add yono-komae-transportation-networks battle`
- `data(historical): fix typo in tama-river scenario`
- `data(news): update news-sample-1 with latest data`

## Type System

All data packages share common types from:

- **`@yonokomae/types`**: Pure TypeScript type definitions
- **`@yonokomae/schema`**: Zod schemas for runtime validation

### Key Types

- **`Battle`**: Used by battle-seeds and news-seeds
- **`HistoricalSeed`**: Used by historical-evidence
- **`Neta`**: Used within battles and historical seeds

## Architecture Principles

1. **Separation of Concerns**: Each data package handles one domain
2. **Type Safety**: All data is validated against TypeScript types
3. **Independent Testing**: Each package can be tested in isolation
4. **Bilingual Support**: English as source of truth, Japanese translations
5. **Static Loading**: All data is bundled at build time (no dynamic imports)
6. **Component Integration**: Data packages integrate seamlessly with UI components like NetaCard and HistoricalScene

## Troubleshooting

### Common Errors

**Schema Validation Failed**:

- Check that your data object matches the expected TypeScript type
- Ensure all required fields are present
- Verify field types (string, number, array, etc.)

**Duplicate ID Error**:

- Search for the conflicting ID in the package
- Use unique, descriptive IDs for each data entry

**Import Errors**:

- Ensure you're importing types from `@yonokomae/types`
- Import validation schemas from `@yonokomae/schema`

**Build Failures**:

- Run `pnpm test` to identify specific issues
- Check TypeScript compilation with `pnpm typecheck`

### Getting Help

1. Check the detailed guides for your specific data package
2. Review existing data files for examples
3. Run validation tests to identify specific issues
4. Refer to the type definitions in `packages/types/`

## Related Documentation

- **Battle Seeds**: [docs/data/BATTLE_SEEDS_EN.md](data/BATTLE_SEEDS_EN.md)
- **Historical Evidence**: [docs/data/HISTORICAL_EVIDENCE_SEEDS_EN.md](data/HISTORICAL_EVIDENCE_SEEDS_EN.md)
- **News Seeds**: [docs/data/NEWS_SEEDS_EN.md](data/NEWS_SEEDS_EN.md)
- **Development Overview**: `docs/DEVELOPMENT_EN.md`
- (RFC document reference removed – consolidated into the Development Guide.)

## Maintenance Utilities

### split-long-strings.mjs

Location: `scripts/split-long-strings.mjs`

Purpose: Split long single-quoted Japanese string literals in battle seed
files into shorter concatenated segments at sentence boundaries. This improves
readability in diffs and reduces horizontal scrolling in reviews.

Scope:

- Targets files under `data/battle-seeds/src/battle` with extension `.ja.ts`.
- Processes keys: `overview`, `scenario`, and `description` only.

Behavior:

- When a string exceeds an internal threshold (currently 100 chars), it is
  split at Japanese/Latin punctuation (`。！？!?`) into trimmed segments, and
  rewritten as concatenated literals, one per line, ending with a comma.
- Already concatenated blocks are detected and left unchanged so the script is
  idempotent.

Usage:

- From the repository root, run the script with Node:
    - `node ./scripts/split-long-strings.mjs`
- The script prints a summary: total files scanned and how many were modified.

Safety and limitations:

- Designed for simple single-quoted string literals, not template literals.
- Multi-line or escaped quoting patterns beyond the conventional format are
  intentionally unsupported.
- Changes are deterministic; commit results after review.

When to use:

- Before submitting large content updates to battle seeds where long paragraphs
  appear in `overview`, `scenario`, or `description`.
- After bulk content imports to normalize formatting for reviewers.
