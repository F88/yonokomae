---
lang: en
title: News Seeds Data Maintenance Guide
title-en: News Seeds Data Maintenance Guide
title-ja: ニュースシードデータメンテナンスガイド
related:
    - NEWS_SEEDS_EN.md has been translated into Japanese as NEWS_SEEDS_JA.md.
    - NEWS_SEEDS_JA.md is a Japanese translation of NEWS_SEEDS_EN.md.
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# News Seeds Data Maintenance Guide

This guide explains how to maintain and update news seed data in the `data/news-seeds/` package. News seeds are sample battle data used for demonstration, testing, and news-style presentations of the Yono-Komae conflict.

## Overview

News seeds serve as sample data that showcases the battle system in a news-style format. They provide realistic examples of how battles might be presented to users and serve as test data for development and demonstration purposes.

## Package Structure

```
data/news-seeds/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts              # Main exports
    ├── seeds.validation.test.ts # Validation tests
    └── samples/
        ├── news-sample-1.ts
        ├── news-sample-2.ts
        └── ...
```

## File Structure

### News Sample Files

**Location**: `data/news-seeds/src/samples/`  
**Pattern**: `news-sample-{number}.ts`  
**Language**: Language-neutral (primarily English-based)

Each file exports a default object conforming to the `Battle` type:

```typescript
import type { Battle } from '@yonokomae/types';

const newsSample: Battle = {
    id: 'news-sample-unique-id',
    themeId: 'information',
    significance: 'high',
    title: 'News Battle Title',
    subtitle: 'Breaking News Style Subtitle',
    narrative: {
        overview: 'Brief news-style overview...',
        scenario: 'Detailed news narrative...',
    },
    komae: {
        imageUrl: './imgs/neta/komae-news.png',
        title: 'Komae Representative',
        subtitle: 'Latest development',
        description: 'Komae faction details...',
        power: 75,
    },
    yono: {
        imageUrl: './imgs/neta/yono-news.png',
        title: 'Yono Representative',
        subtitle: 'Breaking story',
        description: 'Yono faction details...',
        power: 68,
    },
    provenance: [
        {
            label: 'News Source',
            url: 'https://example-news.com/article',
            note: 'Fictional news source for demonstration',
        },
    ],
};

export default newsSample;
```

## Data Requirements

### Battle Type Structure

News seeds use the same `Battle` type as battle-seeds:

- **`id`**: Unique identifier (string)
- **`themeId`**: Theme identifier (typically 'information' for news)
- **`significance`**: Importance level ('low' | 'medium' | 'high' | 'legendary')
- **`title`**: News-style headline (string)
- **`subtitle`**: Supporting headline (string)
- **`narrative`**: Object containing:
    - **`overview`**: Brief news summary (string)
    - **`scenario`**: Full news article content (string)
- **`komae`**: Neta object representing Komae faction
- **`yono`**: Neta object representing Yono faction
- **`provenance`**: Array of fictional or demonstration sources (optional)

### News-Style Characteristics

Unlike battle-seeds which focus on statistical data, news seeds should:

- Present information in journalistic style
- Include narrative elements and context
- Feature balanced, news-like reporting
- Provide engaging, story-driven content

## Naming Conventions

**File Names**: `news-sample-{number}.ts`

Examples:

- `news-sample-1.ts`
- `news-sample-2.ts`
- `news-sample-breaking.ts`

**Battle IDs**: Include "news" identifier

- Use descriptive, unique names
- Include "news" or "sample" in the ID
- Consider the content theme

Examples:

- `news-sample-economic-dispute-2024`
- `breaking-news-territorial-claim`
- `sample-cultural-festival-rivalry`

## Content Guidelines

### News Writing Style

- Use professional journalism tone
- Present both sides fairly
- Include quotes and perspectives
- Maintain engaging narrative flow
- Focus on human interest elements

### Fictional Elements

Since these are sample/demonstration data:

- Clearly mark fictional sources
- Use plausible but not real scenarios
- Avoid copying actual news content
- Create original narratives that fit the project theme

### Power Balance

For news samples:

- Powers should be relatively balanced for interesting battles
- Avoid extreme power differences unless narratively justified
- Consider the story impact of power levels
- Use powers that make sense in the news context

## How to Add a New News Sample

1. **Develop Concept**: Create a news-worthy scenario for the Yono-Komae conflict

2. **Create File**: Add new file in `data/news-seeds/src/samples/`

    ```bash
    touch data/news-seeds/src/samples/news-sample-your-topic.ts
    ```

3. **Write News Content**: Focus on journalistic style

    ```typescript
    import type { Battle } from '@yonokomae/types';

    const newsSample: Battle = {
        id: 'news-sample-your-topic-2024',
        title: 'Breaking: New Development in Yono-Komae Situation',
        subtitle: 'Latest updates on the ongoing municipal rivalry',
        overview: 'News summary in journalistic style...',
        scenario: 'Full news article with quotes, context, and analysis...',
        // ... rest of the battle data
    };

    export default newsSample;
    ```

4. **Validate**: Run tests to ensure compliance

    ```bash
    cd data/news-seeds
    pnpm test
    ```

5. **Update Index**: Ensure the new sample is exported from `src/index.ts`

## Validation and Testing

### Schema Validation

The package includes validation tests that check:

- News samples match the `Battle` schema
- All required fields are present
- IDs are unique across all samples
- Power values are valid numbers

### Running Tests

```bash
# From the news-seeds directory
cd data/news-seeds
pnpm test

# From project root
pnpm test
```

### Common Validation Errors

**Missing Narrative Elements**:

- Ensure scenarios tell a complete story
- Include sufficient detail for news-style presentation
- Provide context and background information

**Unrealistic Power Values**:

- Keep powers within reasonable ranges
- Consider the narrative impact of power differences
- Avoid powers that don't match the story

**Weak Source Attribution**:

- Even for fictional sources, provide plausible attribution
- Include realistic-sounding source names
- Add appropriate disclaimers for demonstration content

## Best Practices

### Content Quality

- Write engaging, readable news content
- Include direct quotes and human perspectives
- Provide proper context and background
- Maintain journalistic objectivity

### Demonstration Value

- Create scenarios that showcase different battle types
- Provide good examples for developers and users
- Include varied power levels and story types
- Demonstrate different aspects of the system

### Maintainability

- Use consistent writing style across samples
- Keep scenarios focused and coherent
- Avoid overly complex or confusing narratives
- Document any special considerations

## Examples

### Breaking News Sample

```typescript
const newsSample: Battle = {
    id: 'news-sample-cherry-blossom-controversy-2024',
    title: '桜の名所論争が再燃',
    subtitle: '与野・狛江間で花見スポット優劣を主張',
    overview:
        '春の訪れとともに、両市の桜の名所をめぐる論争が再び話題となっている',
    scenario:
        '今年も桜の季節が到来し、与野公園と狛江市内の桜並木について、どちらがより美しい花見スポットかを巡って議論が白熱している。地域住民からは「歴史ある与野公園の桜は格別」との声がある一方、「狛江の多摩川沿いの桜並木は圧巻」との反論も...',
    komae: {
        name: 'コマえもん',
        power: 82,
        description:
            '多摩川沿いの2.5kmに及ぶ桜並木。約800本のソメイヨシノが川面を彩る絶景スポット。',
    },
    yono: {
        name: 'ヨノ丸',
        power: 78,
        description:
            '明治時代から愛される与野公園の桜。約300本の桜と歴史ある公園の風情が自慢。',
    },
    provenance: [
        {
            label: 'さいたま市公園緑地課',
            url: 'https://example.saitama.jp/parks/yono',
            note: 'サンプルデータ - 実際のソースではありません',
        },
        {
            label: '狛江市観光協会',
            url: 'https://example.komae.jp/tourism/sakura',
            note: 'デモンストレーション用の架空のソースです',
        },
    ],
};
```

### Feature Story Sample

```typescript
const newsSample: Battle = {
    id: 'news-sample-local-cuisine-showdown',
    title: 'Local Cuisine Champions Face Off',
    subtitle: 'Regional specialties compete for culinary supremacy',
    overview:
        'A friendly competition between signature dishes showcases local food culture',
    scenario:
        'In an unprecedented culinary showdown, representative dishes from both regions have been nominated by local residents. Food critics and community members gathered to evaluate the unique flavors that define each area...',
    komae: {
        name: 'Komae Culinary Ambassador',
        power: 73,
        description: 'Traditional local sweets and riverside dining culture',
    },
    yono: {
        name: 'Yono Food Representative',
        power: 71,
        description: 'Historic sake brewing tradition and seasonal specialties',
    },
    provenance: [
        {
            label: 'Local Food Culture Survey 2024',
            url: 'https://example.com/food-survey',
            note: 'Fictional survey for demonstration purposes',
        },
    ],
};
```

## Related Documentation

- **Main Data Guide**: `docs/DATA_MAINTENANCE_EN.md`
- **Battle Seeds**: `docs/data/BATTLE_SEEDS_EN.md`
- **Historical Evidence**: `docs/data/HISTORICAL_EVIDENCE_SEEDS_EN.md`
- **Type Definitions**: `packages/types/src/battle.ts`
- **Validation Schema**: `packages/schema/src/battle.ts`
