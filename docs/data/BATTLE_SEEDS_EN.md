---
lang: en
title: Battle Seeds Data Maintenance Guide
title-en: Battle Seeds Data Maintenance Guide
title-ja: バトルシードデータメンテナンスガイド
related:
    - BATTLE_SEEDS_EN.md has been translated into Japanese as BATTLE_SEEDS_JA.md.
    - BATTLE_SEEDS_JA.md is a Japanese translation of BATTLE_SEEDS_EN.md.
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Battle Seeds Data Maintenance Guide

This guide explains how to maintain and update battle seed data in the `data/battle-seeds/` package. Battle seeds contain statistical comparisons between Yono and Komae municipalities using real data.

## Overview

Battle seeds are data-driven battles comparing aspects such as population, area, demographics, infrastructure, economy, culture, and development indicators between Yono and Komae. Each battle presents factual data in a playful competitive format while preserving provenance.

## Updated Package Layout (Themed + Drafts + Generated)

```text
data/battle-seeds/
  package.json
  tsconfig.json
  src/
    battle/
      theme/
        community/
        culture/
        development/
        economy/
        figures/
        history/
        information/
        technology/
      __drafts/            # Non-published seeds (publishState !== 'published')
      __generated/         # AUTO-GENERATED indexes (do not edit)
    scripts/
      generate-battle-index.ts  # Unified index generator (draft-only legacy removed)
    seeds.validation.test.ts
    index.ts (re-exports generated maps)
```

Key directories:

- `theme/{themeName}/` : Canonical published (or explicitly stateful) battle seeds
- `__drafts/` : Housing seeds whose `publishState` is not `published` (draft/review/archived)
- `__generated/` : Output of the generator (index + type consolidation)

## File Structure & Naming

**Location (published or any state):** Place new files under an appropriate theme directory. Draft concepts may live under `__drafts/` but the true source of lifecycle is the `publishState` field itself.

**Filename Pattern:** `yono-komae-{topic}.ja.ts` (Japanese content primary). Use concise, kebab-case, descriptive topics.

Examples:

- `yono-komae-population-trends.ja.ts`
- `yono-komae-agriculture-production.ja.ts`
- `yono-komae-financial-resilience.ja.ts`

## Battle Object Schema (Extended)

Each seed default-exports a `Battle`:

```ts
import type { Battle } from '@yonokomae/types';

const battle: Battle = {
    id: 'yono-komae-population-trends-2024',
    themeId: 'figures', // one of the supported theme directory names
    significance: 'medium', // 'low' | 'medium' | 'high' | 'legendary'
    publishState: 'published', // 'published' | 'draft' | 'review' | 'archived' (default = published if omitted)
    title: '人口推移激闘2024',
    subtitle: '長期トレンド対決',
    narrative: {
        overview: '両自治体の人口トレンド比較',
        scenario: '詳細な背景・数値説明...',
    },
    komae: {
        title: 'コマえもん',
        subtitle: '粘りの都市',
        description: '説明...',
        power: 42,
        imageUrl: '',
    },
    yono: {
        title: 'ヨノ丸',
        subtitle: '成長の街',
        description: '説明...',
        power: 55,
        imageUrl: '',
    },
    provenance: [
        {
            label: 'Official Stats',
            url: 'https://example.gov/data',
            note: '2024 annual bulletin',
        },
    ],
};
export default battle;
```

### Required Fields

- `id` (unique repo-wide) – keep stable; used in grouping & analysis
- `themeId` – must map to an existing theme folder (consistency check / grouping reliability)
- `significance` – drives UI chips and potential weighting
- `publishState` – lifecycle; if omitted the generator normalizes to `published`
- `narrative.overview` / `narrative.scenario` – curated descriptive content
- `komae` & `yono` neta objects – each with `title`, `subtitle`, `description`, `power`

### Optional Fields

- `provenance[]` – strongly encouraged; ensures transparency
- `imageUrl` – if omitted consumer code handles empty gracefully (normalizer strips accidental `undefined` prefixes)

## Lifecycle (`publishState`)

| Value     | Meaning                                | UI Chip | Typical Location     |
| --------- | -------------------------------------- | ------- | -------------------- |
| published | Canonical, public                      | Hidden  | theme/{themeName}/   |
| draft     | Early concept / incomplete data        | Shown   | \_\_drafts/ or theme |
| review    | Pending validation/editorial review    | Shown   | \_\_drafts/ or theme |
| archived  | Retired / superseded / historical only | Shown   | \_\_drafts/ or theme |

Notes:

- Directory location does not override `publishState`; the field is authoritative.
- The generator emits maps per state (empty objects if none). Unknown states are ignored (fallback to `published`).

## Unified Index Generation

Use the single generator:

```bash
pnpm --filter @yonokomae/data-battle-seeds run generate:battles
```

Outputs (in `__generated/index.generated.ts`):

- `publishedBattleMap` / `draftBattleMap`
- Per-state maps collected in `battleMapsByPublishState`
- `publishStateKeys`, `battleSeedsByPublishState`
- `allBattleMap`
- Grouping aids: `battlesByThemeId`, `themeIds`

Do NOT edit generated files manually; re-run the script instead.

## Adding a New Battle (Checklist)

1. Identify accurate, cited data
2. Choose a theme directory (create folder if truly new domain – keep naming consistent)
3. Create file with correct pattern & populate fields
4. Set `publishState` (omit only if intentionally `published`)
5. Run validation tests:

    ```bash
    pnpm --filter @yonokomae/data-battle-seeds test
    ```

6. Regenerate index (if not already triggered by test)
7. Commit (`data(battle): add <theme>:<topic> battle`)

## Validation & CI

- Schema & uniqueness checks via Vitest test file (`seeds.validation.test.ts`)
- Duplicate basename OR duplicate `id` -> generator hard error
- Missing explicit `publishState` accepted (defaults) but may emit a warning

## Power Value Guidance

- Keep within a defensible band (0–150 typical) – extremes justify rationale in description
- Avoid incidental ties unless meaningful
- Normalize heterogeneous metrics (ratios / per capita) before mapping to power

## Provenance Best Practices

- Prefer primary municipal / statistical bureau sources
- Include `label`, stable `url`, concise `note` (year, snapshot date, transformation hint)
- Multiple sources acceptable – order by primacy

## Theming Consistency

If a theme folder grows too broad, consider splitting after ≥8–10 heterogeneous topics (open a docs PR first). Avoid premature fragmentation.

## Common Pitfalls

| Issue                  | Symptom                            | Fix                                            |
| ---------------------- | ---------------------------------- | ---------------------------------------------- |
| Missing publishState   | Seed silently treated as published | Add explicit field (draft/review/etc.)         |
| Theme typo             | Seed absent from expected group    | Match existing folder name / adjust themeId    |
| Duplicate id           | Test failure / generator error     | Rename id (search repo)                        |
| Over-complex narrative | Hard to localize or validate       | Keep overview concise; move detail to scenario |

## Authoring Aids

If your Japanese `overview`, `scenario`, or `description` contains very long
single-quoted strings, consider running `node scripts/split-long-strings.mjs`.
It splits at sentence boundaries and rewrites lines as concatenated literals
for clearer diffs. See the Data Maintenance Guide for details.

## Consuming in Application

```ts
import {
    battlesByThemeId,
    themeIds,
    battleSeedsByPublishState,
} from '@yonokomae/data-battle-seeds';

const publishedHistory = Object.values(
    battlesByThemeId['history'] || [],
).filter((b) => b.publishState === 'published');
```

## Future Extensions (Non-breaking)

- Additional publish states (e.g. `experimental`) – add to generator + chip map
- Per-state weighting for selection logic
- Optional machine-readable provenance taxonomy

## Related Documentation

- Main Data Guide: `docs/DATA_MAINTENANCE_EN.md`
- Historical Evidence: `docs/data/HISTORICAL_EVIDENCE_SEEDS_EN.md`
- News Seeds: `docs/data/NEWS_SEEDS_EN.md`
- Types: `packages/types/src/battle.ts`
- Schemas: `packages/schema/src/battle.ts`

## Appendix: Repository-level Filtering

`BattleFilter` currently narrows by `themeId`; future fields (`significance`, `id`) will be additive and backward compatible. No authoring changes required.
