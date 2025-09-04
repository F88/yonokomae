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

Battle seeds are data-driven battles that compare various aspects of Yono and Komae municipalities, such as population, area, demographics, and economic indicators. Each battle presents factual data in a competitive format.

## Package Structure

```
data/battle-seeds/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts              # Main exports
    ├── seeds.validation.test.ts # Validation tests
    └── battle/
        ├── yono-komae-agriculture.ja.ts
        ├── yono-komae-area-comparison.ja.ts
        ├── yono-komae-population-trends.ja.ts
        └── ...
```

## File Structure

### Battle Data Files

**Location**: `data/battle-seeds/src/battle/`  
**Pattern**: `yono-komae-{topic}.ja.ts`  
**Language**: Primarily Japanese (`.ja.ts` extension)

Each file exports a default object conforming to the `Battle` type (v2):

```typescript
import type { Battle } from '@yonokomae/types';

const battle: Battle = {
    id: 'unique-battle-id',
    themeId: 'history',
    significance: 'low',
    title: 'Battle Title',
    subtitle: 'Battle Subtitle',
    narrative: {
        overview: 'Brief description...',
        scenario: 'Detailed battle scenario...',
    },
    komae: {
        imageUrl: '/KOMAE-SYMBOL.png',
        title: 'KOMAE',
        subtitle: 'Stone Wall',
        description: 'Komae representative data...',
        power: 42,
    },
    yono: {
        imageUrl: '/YONO-SYMBOL.png',
        title: 'YONO',
        subtitle: 'Lightning Step',
        description: 'Yono representative data...',
        power: 38,
    },
    provenance: [
        {
            label: 'Data Source Name',
            url: 'https://example.com/data',
            note: 'Additional notes about the source',
        },
    ],
};

export default battle;
```

## Data Requirements

### Battle Type Structure (v2)

- **`id`**: Unique identifier (string)
- **`themeId`**: Battle theme id (see `@yonokomae/catalog`)
- **`significance`**: 'low' | 'medium' | 'high' | 'legendary'
- **`title`**: Main battle title (string)
- **`subtitle`**: Secondary title (string)
- **`narrative`**: `{ overview: string, scenario: string }`
- **`komae`**: Neta object representing Komae
- **`yono`**: Neta object representing Yono
- **`provenance`**: Array of data sources (optional)

### Neta Type Structure (v2)

- **`imageUrl`**: Image URL (string)
- **`title`**: Display name (string)
- **`subtitle`**: Short tagline (string)
- **`description`**: Description of the data/rationale (string)
- **`power`**: Numerical power level (number)

### Naming Conventions

**File Names**: `yono-komae-{topic}.ja.ts`

Examples:

- `yono-komae-population-trends.ja.ts`
- `yono-komae-geomorphology-hydrology.ja.ts`
- `yono-komae-commuting-flows.ja.ts`

**Battle IDs**: Descriptive and unique

- Use kebab-case
- Include both municipality names
- Describe the comparison topic

Examples:

- `yono-komae-population-2023`
- `yono-komae-area-density-comparison`
- `yono-komae-agricultural-output`

## Content Guidelines

### Data Sources

- Use official government statistics when possible
- Include proper attribution in the `provenance` array
- Provide URLs to original data sources
- Add explanatory notes for data interpretation

### Power Calculations

Power values should reflect meaningful comparisons:

- Larger/higher values typically get higher power
- Normalize different scales appropriately
- Consider using ratios or percentages
- Document calculation methodology in descriptions

### Language and Tone

- Use Japanese for titles, descriptions, and scenarios
- Maintain a playful, competitive tone
- Reference the characters コマえもん (Komae) and ヨノ丸 (Yono)
- Include relevant municipal context and local knowledge

## How to Add a New Battle

1. **Research Data**: Find official statistics comparing Yono and Komae

2. **Create File**: Add new file in `data/battle-seeds/src/battle/`

    ```bash
    touch data/battle-seeds/src/battle/yono-komae-your-topic.ja.ts
    ```

3. **Implement Battle**: Use the Battle type structure

    ```typescript
    import type { Battle } from '@yonokomae/types';

    const battle: Battle = {
        id: 'yono-komae-your-topic-2024',
        title: 'あなたのトピック対決',
        // ... rest of battle data
    };

    export default battle;
    ```

4. **Validate**: Run tests to ensure compliance

    ```bash
    cd data/battle-seeds
    pnpm test
    ```

5. **Update Index** (if needed): The index file should automatically export your battle

## Validation and Testing

### Schema Validation

The package includes validation tests that check:

- Battle objects match the `Battle` schema
- All required fields are present
- IDs are unique across all battles
- Power values are valid numbers

### Running Tests

```bash
# From the battle-seeds directory
cd data/battle-seeds
pnpm test

# From project root
pnpm test
```

### Common Validation Errors

**Invalid Power Values**:

- Ensure power is a number, not a string
- Avoid negative values unless intentional
- Consider reasonable ranges (0-100 is typical)

**Missing Required Fields**:

- All Battle fields except `provenance` are required
- Both `komae` and `yono` objects need all Neta fields

**Duplicate IDs**:

- Check existing battles for ID conflicts
- Use descriptive, unique identifiers

## Best Practices

### Data Accuracy

- Verify statistics from official sources
- Use recent data when possible
- Document data collection dates
- Explain any data transformations or calculations

### Maintainability

- Use consistent naming patterns
- Keep scenarios focused on specific comparisons
- Avoid overly complex power calculations
- Document unusual or complex data sources

### Localization

- Primary content in Japanese
- Use appropriate municipal terminology
- Reference local landmarks and culture
- Maintain consistency with existing battles

## Examples

### Simple Population Comparison

```typescript
const battle: Battle = {
    id: 'yono-komae-population-2023',
    themeId: 'history',
    significance: 'low',
    title: '人口対決2023',
    subtitle: '市民パワーバトル',
    narrative: {
        overview: '2023年の人口データを基にした対決',
        scenario: 'より多くの市民を抱える自治体が勝利...',
    },
    komae: {
        imageUrl: '/KOMAE-SYMBOL.png',
        title: 'コマえもん',
        subtitle: '防御の要',
        power: 83,
        description: '狛江市の人口: 83,000人',
    },
    yono: {
        imageUrl: '/YONO-SYMBOL.png',
        title: 'ヨノ丸',
        subtitle: '俊敏なる策士',
        power: 135,
        description: 'さいたま市中央区の人口: 135,000人',
    },
    provenance: [
        {
            label: '住民基本台帳人口',
            url: 'https://example.gov.jp/data',
            note: '2023年12月31日現在',
        },
    ],
};
```

## Related Documentation

- **Main Data Guide**: `docs/DATA_MAINTENANCE_EN.md`
- **Historical Evidence**: `docs/data/HISTORICAL_EVIDENCE_SEEDS_EN.md`
- **News Seeds**: `docs/data/NEWS_SEEDS_EN.md`
- **Type Definitions**: `packages/types/src/battle.ts`
- **Validation Schema**: `packages/schema/src/battle.ts`
