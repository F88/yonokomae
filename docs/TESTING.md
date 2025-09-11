---
lang: en
title: Testing Guide
title-en: Testing Guide
title-ja: テストガイド
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Testing Guide

This guide summarizes how tests are organized and run in this project, covering unit, integration, and end-to-end testing.

## Stack

- **Unit/Integration:** [Vitest](https://vitest.dev/)
- **Component Testing:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with [jsdom](https://github.com/jsdom/jsdom)
- **API Mocking:** [MSW (Mock Service Worker)](https://mswjs.io/) in node server mode
- **End-to-End:** [Playwright](https://playwright.dev/)

## How to Run Tests

### All Tests

- **Run all tests:** `pnpm test` or `pnpm run test`
- **Watch mode:** `pnpm run test:watch`

### Unit & Integration Tests

- **Run unit tests:** `pnpm run test:unit`
- **Watch mode:** `pnpm run test:unit:watch`
- **UI mode:** `pnpm run test:ui`
- **Coverage:** `pnpm run test:coverage`

### Seed Validation Tests

- **Run seed validation:** `pnpm run test:seeds`

### Storybook Tests

- **Run Storybook tests:** `pnpm run test:storybook`
- **Start Storybook dev server:** `pnpm run storybook`
- **Build static Storybook:** `pnpm run build-storybook`

Storybook is used for component development and visual testing. Key components with stories include:

- `NetaCard` and `NetaCardSkelton` - Battle card components with loading states
- `HistoricalScene` and `HistoricalSceneSkelton` - Battle scene components with backgrounds
- UI components from shadcn/ui with custom variants

### End-to-End (E2E) Tests

- **Run E2E tests (excluding @performance):** `pnpm run e2e`
- **Run all E2E tests (including @performance):** `pnpm run e2e:all`
- **Run in UI mode:** `pnpm run e2e:ui`
- **Run in headed mode (Chromium only):** `pnpm run e2e:headed`
- **Show report:** `pnpm run e2e:report`

See root `package.json` and individual data package `package.json` files for all available scripts.

## Test Layout & Conventions

- **Co-location:** Tests are co-located with the source code, using `*.test.ts` or `*.test.tsx` file extensions.
- **Shared Helpers:** Common test utilities are located in `src/test/`:
    - `setup.ts`: Global setup for Vitest (e.g., `jest-dom`, MSW server lifecycle).
    - `msw.ts`: Default MSW handlers for API endpoints.
    - `renderWithProviders.tsx`: A custom render function that wraps components with necessary context providers.
- **E2E Specs:** Playwright tests are located in the `e2e/` directory.

## API Mocking with MSW

We use MSW to mock API requests in our tests.

- **Handlers:** Mock implementations for API endpoints like `/api/battle/judgement` are defined in `src/test/msw.ts`.
- **Lifecycle:** The MSW server is started before all tests and closed after all tests, with handlers reset between each test. This is configured in `src/test/setup.ts`.
- **Overrides:** You can override default handlers within a specific test by using `server.use(...)`.

## Repository Testing

The application uses different repository implementations for different play modes:

- **Fake Repositories:** Used to test deterministic logic without actual delays or external dependencies.
- **Historical Evidence Repositories:** Test the seed-based generation of historical battles from curated evidence files (`historical-research` mode).
- **Demo Repositories:** Test localized content and fixed scenarios:
    - `demo` - Japanese demonstration mode
    - `demo-en` - English demonstration mode
    - `demo-de` - German demonstration mode
- **News Reporter Repository:** Tests the multi-source blending (local and API) and caching behavior for the `yk-now` mode.

### Filtering Tests

Repository-level filtering (via `BattleFilter` / `generateReport({ filter })`) includes tests that:

- Assert that specifying a `themeId` reduces the candidate battle pool
- Ensure randomness persists within the narrowed set (no starvation of remaining items)
- Verify unfiltered calls remain unaffected by prior filtered generations (statelessness)

When adding new filter dimensions (e.g. `significance`), add:

- A narrowing test (only items matching the predicate are produced over multiple generations)
- A diversity test (multiple distinct ids appear within a reasonable sample count)
- A regression guard ensuring legacy implementations ignoring the new field do so explicitly

### Provider Testing Patterns

The `renderWithProviders` helper simplifies testing components that rely on our repository context.

```tsx
import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';
import { YourComponent } from '@/components/YourComponent';
import { historicalResearchMode } from '@/yk/play-mode';

it('uses historical repository in historical-research mode', () => {
    renderWithProviders(<YourComponent />, { mode: historicalResearchMode });

    // The component will receive HistoricalEvidencesBattleReportRepository via the provider.
    // This repository loads data from @yonokomae/data-historical-evidence
    // Assert on behavior specific to this mode.
});
```

For components that require a provider with async initialization, wrap them with `Suspense`.

```tsx
import { Suspense } from 'react';
import { render } from '@testing-library/react';
import { RepositoryProviderSuspense } from '@/yk/repo/core/RepositoryProvider';

it('handles async provider setup', async () => {
    render(
        <Suspense fallback={<div>Loading...</div>}>
            <RepositoryProviderSuspense mode={someMode}>
                <YourComponent />
            </RepositoryProviderSuspense>
        </Suspense>,
    );

    await screen.findByText('Expected content after async setup');
});
```

## UI Testing

- Follow accessibility best practices by using queries from React Testing Library that are resilient to implementation changes (e.g., `getByRole`, `getByLabelText`).
- `Controller` tests cover keyboard shortcuts (`Enter`/`B` for Battle, `R` for Reset).
- `TitleContainer` tests include keyboard navigation.

## End-to-End (E2E) Testing

E2E tests cover critical user flows from a user's perspective. For a detailed policy, see the [E2E testing policy in the Development Guide](./DEVELOPMENT_EN.md#end-to-end-e2e-testing-policy).

- **Location:** `e2e/`
- **Focus:** Test user-facing behaviors, not implementation details.
- **Accessibility:** Assert accessible names and roles for critical controls.

### Instrumentation Policy

Production E2E runs must not rely on dev-only or test-only globals. A previous
set of title selection specs depended on `window.__YK_TEST_ONSELECT_COUNT__`,
which is incremented only in development / test builds. These specs were
removed. Replacement strategy:

- Prefer asserting the final selected mode visible in the UI.
- Avoid counting internal events unless the counter is deliberately exposed as
  a documented, stable testing hook.
- If future instrumentation is required, gate it behind an explicit opt-in
  variable (e.g. `VITE_ENABLE_E2E_INSTR`) and document the contract.

### iOS/WebKit Touch Selection Correction

An issue on iOS Safari caused occasional misalignment between the tapped
vertical position and the selected play mode. The fix applies a coordinate-
nearest matching algorithm only for real iOS touch environments (never desktop
emulation). Tests should validate the resulting UI state (the intended mode is
highlighted and activated) rather than internal correction heuristics.

## Battle Index Generation Regression Points

The unified battle index generator (generate-battle-index.ts) should remain stable. Suggested regression assertions (unit or snapshot style):

- Duplicate basename or duplicate explicit `id` causes the generator to exit non-zero (negative test harness).
- Missing `publishState` defaults to `published` and still appears in `publishedBattleMap`.
- Empty states still produce an empty object map (e.g. `reviewBattleMap` when no review seeds).
- Adding a new state populates `publishStateKeys` in predictable order (published,draft,review,archived,<extras sorted>).
- `battlesByThemeId[themeId]` arrays are sorted by `battle.id`.

Lightweight approach: invoke the script in a temp workspace copy with synthetic seeds and assert generated file substrings instead of full snapshot brittleness.

## CI/CD

Our CI pipeline runs all checks, including linting, type checking, data package validation, and all forms of tests. The pipeline validates:

- **Application Tests:** Unit, integration, and E2E tests for the main application
- **Data Package Tests:** Schema validation and uniqueness checks for all data packages
- **Type Safety:** TypeScript compilation for all packages
- **Code Quality:** ESLint and Prettier across the monorepo

For details, see the [CI/CD Pipeline section in CONTRIBUTING.md](../CONTRIBUTING_EN.md).
