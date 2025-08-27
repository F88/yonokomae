---
title: Testing Guide
lang: en
notes-ja:
    - この文書はテスト運用の整理用ドキュメントです(英語)。
instructions-for-ais:
    - This document is written in English for AI readability.
    - Code fences may contain TypeScript/TSX/JSON.
---

# Testing Guide

This guide summarizes how tests are organized and run in this project, with a focus on repositories, UI, and API-backed flows.

## Stack

- Vitest (unit/integration runner)
- React Testing Library + jsdom (component testing)
- MSW (Mock Service Worker, node server mode) for API stubbing

## How to run

- All tests: `npm test`
- Watch/UI (optional): `npm run test:ui`
- Coverage (optional): `npm run test:coverage`

See `package.json` for available scripts.

## Test layout & conventions

- Co-locate tests with code using `*.test.ts` or `*.test.tsx`.
- Shared helpers live under `src/test/`:
    - `src/test/setup.ts`: global setup (jest-dom, MSW server lifecycle)
    - `src/test/msw.ts`: default handlers for API mode
    - `src/test/renderWithProviders.tsx`: render helper with repository providers

Vitest references `src/test/setup.ts` via `vitest.config.ts`.

## Setup: MSW for API mode

File: `src/test/msw.ts`

- Handlers stub same-origin paths like `/api/battle/report` and `/api/battle/judgement`.
- In tests, ensure `VITE_API_BASE_URL` points to `/api` (see `repository-provider.api.test.ts`).

Global lifecycle in `src/test/setup.ts`:

- beforeAll: `server.listen({ onUnhandledRequest: 'bypass' })`
- afterEach: `server.resetHandlers()`
- afterAll: `server.close()`

Override per test by calling `server.use(...)` with additional handlers.

## Repositories testing

- Fake repos (`repositories.fake.ts`): test deterministic logic; avoid actual delays (code already skips delays under `NODE_ENV=test`).
- Random Joke repos (`repositories.random-jokes.ts`): seed-backed deterministic generation. Assert structure and `provenance` presence.
- API repos (`repositories.api.ts`): prefer provider-level tests with MSW (see `repository-provider.api.test.ts`).

### Testing Historical Seed System

When testing components that use the Historical Seed System:

```tsx
import { HistoricalSeedProvider } from '@/yk/repo/seed-system/seed-provider';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('rotates seeds on Tab key', async () => {
    const user = userEvent.setup();
    render(
        <HistoricalSeedProvider>
            <YourComponent />
        </HistoricalSeedProvider>,
    );

    // Press Tab to rotate seed
    await user.keyboard('[Tab]');

    // Assert on expected behavior after rotation
});
```

### Provider Testing Patterns

The `renderWithProviders` helper simplifies testing with repository providers:

```tsx
import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';

it('uses historical repository in historical mode', () => {
    renderWithProviders(<YourComponent />, {
        mode: {
            id: 'historical',
            title: 'HISTORICAL',
            description: '',
            enabled: true,
        },
    });

    // Component will receive BattleReportRandomDataRepository
    // Assert on historical-specific behavior
});
```

For testing async provider initialization:

````tsx
import { Suspense } from 'react';
import { RepositoryProviderSuspense } from '@/yk/repo/RepositoryProvider';

it('handles async provider setup', async () => {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <RepositoryProviderSuspense mode={mode}>
        <YourComponent />
      </RepositoryProviderSuspense>
    </Suspense>
  );

  // Wait for suspension to resolve
  await screen.findByText('Expected content');
});

## UI testing

- `HistoricalScene` renders provenance list when `battle.provenance` is provided.
- `Field` shows placeholders when sides are missing; asserts based on roles/labels.
- `TitleContainer` supports keyboard navigation and (in historical mode) minimal seed selection UI.
- `Controller` wires keyboard shortcuts (Enter/Space/B for Battle, R for Reset).
- `UsageExamples` component renders categorized usage examples with interactive cards.
- `UserVoices` component displays user testimonials with marquee animation effects.

Use queries by role/label to keep tests resilient and accessible.

### Testing Export Functionality

For TSV export scripts testing:

```tsx
import { exportUsageExamplesToTsv } from '@/ops/export-usage-examples-to-tsv';
import { exportUsersVoiceToTsv } from '@/ops/export-users-voice-to-tsv';

it('exports usage examples to TSV format', () => {
    const tsvOutput = exportUsageExamplesToTsv();

    // Assert TSV structure
    expect(tsvOutput).toContain('Category\tTitle\tDescription');
    expect(tsvOutput.split('\n').length).toBeGreaterThan(1);
});

it('exports user voices to TSV format', () => {
    const tsvOutput = exportUsersVoiceToTsv();

    // Assert TSV structure
    expect(tsvOutput).toContain('Quote\tAttribution');
    expect(tsvOutput.split('\n').length).toBeGreaterThan(1);
});
```

### Helper: renderWithProviders example

A minimal example using the shared render helper:

```ts
import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';
import React from 'react';

it('renders with provider', () => {
  renderWithProviders(<div>hello</div>, {
    mode: { id: 'demo', title: 'DEMO', description: '', enabled: true },
  });
  expect(screen.getByText('hello')).toBeInTheDocument();
});
````

## Determinism & delays

- Delays are computed but skipped in test environment. Avoid `sleep` in tests.
- Historical seeds live under `seeds/random-data/scenario/*.json` for reproducibility.
- Provider `defaultDelayForMode` returns ranges for UX, but tests shouldn’t wait because repo code bypasses delays under `NODE_ENV=test`.

## Environment & config

- API base URL: `VITE_API_BASE_URL` (tests set to `/api`).
- Vite may warn about dynamic import vars for seeds; it’s harmless for tests. For production, consider mapping files via a static registry.

## Coverage (optional)

- Run `npm run test:coverage` to generate coverage reports.

## CI/CD

See [CONTRIBUTING.md](../CONTRIBUTING.md) for CI/CD pipeline configuration and deployment details.

## Troubleshooting

- “fetch failed” in API tests: ensure MSW handlers match the requested paths; set `VITE_API_BASE_URL` to `/api` in tests.
- jsdom image warnings: tests may emit warnings for empty `src`; they don’t fail tests. Prefer asserting roles/text rather than actual network images.
