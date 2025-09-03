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

This guide summarizes how tests are organized and run in this project, covering unit, integration, and end-to-end testing.

## Stack

- **Unit/Integration:** [Vitest](https://vitest.dev/)
- **Component Testing:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with [jsdom](https://github.com/jsdom/jsdom)
- **API Mocking:** [MSW (Mock Service Worker)](https://mswjs.io/) in node server mode
- **End-to-End:** [Playwright](https://playwright.dev/)

## How to Run Tests

### Unit & Integration Tests

- **Run once:** `npm run test:unit`
- **Watch mode:** `npm run test:unit:watch`
- **UI mode:** `npm run test:ui`
- **Coverage:** `npm run test:coverage`

### End-to-End (E2E) Tests

- **Run all E2E tests:** `npm run e2e`
- **Run in UI mode:** `npm run e2e:ui`
- **Show report:** `npm run e2e:report`

See `package.json` for all available scripts.

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

- **Fake Repositories:** Used to test deterministic logic without actual delays.
- **Historical Repositories:** Test the seed-based generation of historical battles.
- **Demo Repositories:** Test localized content and fixed scenarios for `demo-ja`, `demo-en`, and `demo-de` modes.
- **News Reporter Repository:** Tests the multi-source blending (local and API) and caching behavior for the `yk-now` mode.

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

## CI/CD

Our CI pipeline runs all checks, including linting, type checking, and all forms of tests. For details, see the [CI/CD Pipeline section in CONTRIBUTING.md](../CONTRIBUTING.md).
