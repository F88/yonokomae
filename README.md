# Yonokomae

[![DeepWiki](https://img.shields.io/badge/DeepWiki-F88%2Fyonokomae-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/F88/yonokomae)

Yono Komae War

This thought-provoking game explores the outcomes for two countries after 'The World Merger Battle' of the Heisei era (平成の大合併大戦).

```text
Note: This game is full of humorous jokes, but to be clear, it is not a deepfake or a mere fabrication.
```

![ykwar.png](imgs/ykwar.png)

## Key Features

- Multiple play modes with clear status
    - DEMO: quick demonstration with placeholder data (enabled)
    - HISTORICAL EVIDENCE: WIP mode based on events (enabled)
    - AI MODE: planned, AI-generated scenarios (disabled)
- One-click battle report generation with smooth auto-scroll to latest
- Robust loading and error states
    - Async judgement with simulated latency
    - Shadcn skeleton placeholders on the battle field
- Title screen selection with full keyboard support
    - Navigate: ArrowUp/ArrowDown, J/K, W/S; Confirm: Enter/Space; Home/End
- Global controller shortcuts
    - Battle: B / Enter / Space; Reset: R
- Modern UI stack
    - React + Vite + TypeScript, Tailwind CSS v4, shadcn/ui (New York)
    - Dark mode toggle via class-based theme
- Testing-first setup with Vitest + React Testing Library
- Zero-SSR SPA optimized for client-side rendering
- GitHub Pages deployment with base path configured

## Roadmap / TODO

- Historical Evidence mode
    - Implement data sources and generation rules for historical events
    - Surface provenance/notes in the UI (citations, links, disclaimers)
    - Tests for deterministic generation paths
- AI Mode (later)
    - Evaluate model/provider and on-device vs API trade-offs
    - Add safety guardrails and content filters
    - Provide offline mock for tests and local dev
- Battle UX polish
    - Add progress indicator for async judgement (per-step animation)
    - Improve error surfaces with retry
    - Persist last N battle reports in localStorage with clear button
- Accessibility
    - Ensure keyboard traps are eliminated in dialogs/menus
    - Add aria attributes to interactive elements and list updates
    - High-contrast focus rings consistent with theme
- Internationalization
    - Prepare copy for i18n; externalize strings, English/日本語
    - RTL-friendly layout checks
- Performance
    - Virtualize long battle lists
    - Avoid unnecessary re-renders in `BattleContainer` and children
- Tooling
    - Add pre-commit hooks (lint, typecheck, test) via simple Git hook or Husky
    - Add CI workflow: lint, typecheck, test, build
- Docs
    - Expand developer guide for adding new play modes
    - Document keyboard map and customization

## Tech Stack

- **Framework**: [React](https://react.dev/) v19.1.1
- **Build Tool**: [Vite](https://vitejs.dev/) v7.1.2
- **Language**: [TypeScript](https://www.typescriptlang.org/) v5.8.3
- **UI Framework**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4.1.12 with [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react) & [React Icons](https://react-icons.github.io/react-icons/)
- **Testing**: [Vitest](https://vitest.dev/) v3.2.4 & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) v16.3.0
- **Linting**: [ESLint](https://eslint.org/) v9.33.0 with TypeScript support
- **Data Generation**: [@faker-js/faker](https://fakerjs.dev/) v10.0.0
- **Deployment**: [GitHub Pages](https://pages.github.com/) via [gh-pages](https://github.com/tschaub/gh-pages)

## Project notes

### Architecture: Repository Pattern

This project adopts the Repository Pattern to decouple data generation/fetching
from UI and domain logic. It allows swapping implementations per play mode, and
enables clean dependency injection and testing.

Key goals:

- Clear contracts for data access (interfaces) decoupled from UI
- Pluggable implementations (fake, historical, future API)
- Mode-based selection with optional latency emulation
- Simple DI for components and hooks; easy unit testing

Directory layout (under `src/yk/repo/`):

- `repositories.ts`: Core interfaces and shared types
    - `BattleReportRepository`, `JudgementRepository`, `ScenarioRepository`, `NetaRepository`
- `repositories.fake.ts`: Default fake implementations
    - Deterministic shapes; uses `@faker-js/faker` for titles/narratives
    - Optional delay with abort support; delay is capped to 10s and disabled in tests
- `repositories.historical.ts`: Historical mode data providers (seeded/static for now)
- `repository-provider.ts`: Async factories to get repositories by `PlayMode`
    - `getBattleReportRepository(mode?)`, `getJudgementRepository(mode?)`
    - Applies sensible default delays per mode (e.g., DEMO vs HISTORICAL)
- `repository-context.ts`: React Context + hooks for DI
- `RepositoryProvider.tsx`: Thin provider that lazily creates repos via factories

Usage in hooks:

- `use-generate-report(mode?)`
    - Resolves a `BattleReportRepository` from provider (if present) or factories
    - Adds a 10s timeout and passes `AbortSignal` down to the repo
- `use-judgement(nameOfJudge, battle, mode)`
    - Resolves a `JudgementRepository` similarly; exposes `idle/loading/success/error`
    - Adds a 10s timeout and passes `AbortSignal`

Latency emulation (fake repos):

- Accepts `delay` as a number or `{ min, max }`
- Negative values clamp to 0
- Values above 10_000ms are capped with a console warning
- Delays are skipped when `NODE_ENV === 'test'`

Testing:

- Unit tests live beside implementations, e.g. `src/yk/repo/repositories.fake.test.ts`
- Tests cover delay capping and basic behavior of fake repositories
- UI tests focus on states (`loading/error/success`) rather than random values

How to add a new implementation (e.g., API-backed):

1. Implement the relevant interface(s) in `src/yk/repo/*` (e.g., `ApiJudgementRepository`)
2. Add a branch in `repository-provider.ts` to return the new repo for certain `PlayMode`
3. If you need configuration, pass it through the provider or Context
4. Add tests for the new repo; prefer deterministic inputs and mock network
5. Optionally document the mode and behavior in this README

Migration note:

- Legacy files under `src/yk/` that re-exported `yk/repo/*` have been removed to
    avoid ambiguity. Consumers should import from `@/yk/repo/...`.

#### Diagrams (Mermaid)

High-level flow of data and DI:

```mermaid
flowchart TD
    A["Components / App"]
    B["RepositoryProvider (Context)"]
    C["Hooks: use-generate-report / use-judgement"]
    D["Repos from Context"]
    E["Factories: get*Repository(mode)"]
    F["Implementation: Fake / Historical / Future API"]
    G["Domain Data: Battle / Winner"]

    A --> B
    A --> C
    C -->|provided?| D
    C -->|fallback| E
    E --> F
    F --> G
    G --> C
    C --> A
```

Sequence for generating a battle report:

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI (Button)
    participant H as use-generate-report
    participant X as Repo Context (optional)
    participant F as Factory (getBattleReportRepository)
    participant R as Repo Impl (Fake/Historical)

    U->>UI: Click "Battle"
    UI->>H: generateReport()
    H->>X: useRepositoriesOptional()
    alt Provider present
        H->>R: battleReport.generateReport({ signal })
    else No provider
        H->>F: getBattleReportRepository(mode)
        F-->>H: Repo instance
        H->>R: generateReport({ signal })
    end
    R-->>H: Battle
    H-->>UI: setState(success)
```

Interfaces and implementations:

```mermaid
classDiagram
    class BattleReportRepository {
        +generateReport(options) Promise<Battle>
    }
    class JudgementRepository {
        +determineWinner(input, options) Promise<Winner>
    }
    class ScenarioRepository {
        +generateTitle() Promise<string>
        +generateSubtitle() Promise<string>
        +generateOverview() Promise<string>
        +generateNarrative() Promise<string>
    }
    class NetaRepository {
        +getKomaeBase() Promise<...>
        +getYonoBase() Promise<...>
    }
    class FakeBattleReportRepository
    class FakeJudgementRepository
    class HistoricalScenarioRepository
    class HistoricalNetaRepository

    FakeBattleReportRepository ..|> BattleReportRepository
    FakeJudgementRepository ..|> JudgementRepository
    HistoricalScenarioRepository ..|> ScenarioRepository
    HistoricalNetaRepository ..|> NetaRepository
```

### Adding a new Repository or Play Mode (step-by-step)

This guide shows how to add a new repository implementation (e.g., DEMO-2) or
an API-backed repo, while keeping the system flexible and easy to extend.

1. Pick a Play Mode ID and register it

- File: `src/yk/play-mode.ts`
- Add a new item to `playMode` with a unique `id` (e.g., `demo-2` or `api`),
    `title`, `description`, and `enabled` flag.
- Keep `id` stable; it is used to select implementations in the provider.

1. Implement the repository (or repositories)

- File suggestion: `src/yk/repo/repositories.demo2.ts` or `repositories.api.ts`.
- Implement the relevant interfaces from `src/yk/repo/repositories.ts`.
- Keep responsibilities focused; if needed, add new small interfaces (e.g.,
    `IdProvider`, `Clock`) to avoid bloated repos.

Example (DEMO-2 variant):

```ts
// src/yk/repo/repositories.demo2.ts
import type {
    BattleReportRepository,
    JudgementRepository,
} from '@/yk/repo/repositories';

export class Demo2BattleReportRepository implements BattleReportRepository {
    constructor(private readonly opts?: { delay?: number | { min: number; max: number } }) {}
    async generateReport() {
        // ...produce a slightly different flavor of Battle
        // Use your own seeded random or constants for determinism in tests
        return {
            id: crypto.randomUUID(),
            yono: { /* ... */ },
            komae: { /* ... */ },
            // ...other fields
        } as any;
    }
}

export class Demo2JudgementRepository implements JudgementRepository {
    constructor(private readonly opts?: { delay?: number | { min: number; max: number } }) {}
    async determineWinner(input) {
        // ...alternative rule set
        return 'DRAW';
    }
}
```

Example (API-backed skeleton):

```ts
// src/yk/repo/repositories.api.ts
import type {
    BattleReportRepository,
    JudgementRepository,
} from '@/yk/repo/repositories';

export class ApiClient {
    constructor(private readonly baseUrl: string, private readonly token?: string) {}
    async get<T>(path: string, signal?: AbortSignal): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, { headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined, signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
    }
}

export class ApiBattleReportRepository implements BattleReportRepository {
    constructor(private readonly api: ApiClient) {}
    async generateReport(opts?: { signal?: AbortSignal }) {
        return this.api.get('/battle/report', opts?.signal);
    }
}

export class ApiJudgementRepository implements JudgementRepository {
    constructor(private readonly api: ApiClient) {}
    async determineWinner(input, opts?: { signal?: AbortSignal }) {
        return this.api.get(`/battle/judgement?mode=${encodeURIComponent(input.mode.id)}`, opts?.signal);
    }
}
```

1. Wire it in the provider factories

- File: `src/yk/repo/repository-provider.ts`
- Add a branch for your new `mode.id` to return the new implementations.
- Keep default delays or introduce mode-specific timing.

Example:

```ts
// inside getBattleReportRepository
if (mode?.id === 'demo-2') {
    const { Demo2BattleReportRepository } = await import('@/yk/repo/repositories.demo2');
    return new Demo2BattleReportRepository({ delay });
}

// inside getJudgementRepository
if (mode?.id === 'demo-2') {
    const { Demo2JudgementRepository } = await import('@/yk/repo/repositories.demo2');
    return new Demo2JudgementRepository({ delay });
}
```

API-backed example:

```ts
if (mode?.id === 'api') {
    const { ApiClient, ApiBattleReportRepository, ApiJudgementRepository } = await import('@/yk/repo/repositories.api');
    const api = new ApiClient(import.meta.env.VITE_API_BASE_URL as string);
    return new ApiBattleReportRepository(api);
}
```

1. Create or extend a hook (optional)

- Hooks live under `src/hooks/`.
- Prefer taking dependencies via Context (Provider present) or explicit
    parameters (constructor-style injection) rather than recreating repos inside
    the hook.
- Keep timeouts and `AbortSignal` handling consistent (10s cap already used).

1. Decide Provider vs. explicit injection

- App runtime: prefer `RepositoryProvider` (or `RepositoryProviderSuspense` for
    async init). This centralizes configuration.
- Tests/stories: either wrap with the Provider or pass repo instances into the
    hook/component explicitly.

1. Async initialization (API)

- Use `RepositoryProviderSuspense` and wrap in `<Suspense>` to block until
    repos are ready.
- If only one repo needs async init, you can still resolve both up-front for a
    consistent DI story.

1. Testing checklist

- Unit tests next to the implementation (e.g., `repositories.demo2.test.ts`).
- Cover edge cases: delay capping, abort behavior, error mapping.
- For API repos: mock `fetch` and assert request paths/headers; keep responses
    deterministic.
- UI tests should assert on states and interactions, not random values.

1. Optional: Feature flags and env config

- Use `enabled` in `playMode` to hide WIP modes.
- Read `import.meta.env.*` for API base URLs, tokens, or flags. Avoid baking
    secrets into the codebase.

1. Minimal acceptance criteria (green gates)

- TypeScript passes (no new errors).
- Unit tests pass locally (`npm test`).
- README updated with the new mode and any notable behavior.

### Styling (Tailwind CSS v4)

- Tailwind v4 is used. The single CSS entry is the project root `index.css`.
    - `src/main.tsx` imports `../index.css`.
    - Tailwind plugin is wired via Vite (`@tailwindcss/vite`), not PostCSS config files.
    - `index.css` registers `@plugin "tailwindcss-animate"` and uses `@theme inline`.
- Dark mode uses the `.dark` class on `document.documentElement` (toggled in `ThemeToggle`).

### shadcn/ui

- Config: see `components.json` (style: `new-york`, aliases for `@/components`, etc.).
- Components live under `src/components/ui`.
- You can add more via shadcn CLI (optional), following the Vite guide.

### Async judgement flow

- `Judge.determineWinner` is async and waits 0..5 seconds before resolving (0 ms in tests).
- Use `useJudgement(nameOfJudge, battle, mode)` to fetch and render results with `loading/error/success` states.
- `mode` must be a `PlayMode` from `@/yk/play-mode`.
- UI component: `JudgeCard` consumes `useJudgement` and handles the states.

### Play mode selection & keyboard shortcuts

- Title screen component allows selecting a play mode using both mouse and keyboard.
- Keyboard on the title screen (global and focused):
    - Navigate: ArrowUp/ArrowDown, J/K, W/S
    - Confirm: Enter or Space
    - Jump to first/last enabled: Home/End
- Controller shortcuts (global):
    - Battle: B, Enter, or Space
    - Reset: R
- Key hints are rendered using the shared `<KeyChip />` component (`src/components/ui/key-chip.tsx`).

### Path aliases

- `@` maps to `src/` (configured in `tsconfig` and `vite.config.ts`).

### Testing notes

- Tests avoid asserting on random values. If you need deterministic behavior for
  `@faker-js/faker`, mock the specific generators within the test case.
  For example, spy on `faker.lorem.words` or `faker.number.int` as needed.
- `faker.number.int` is called three times in `FrontlineJournalist.report`:
  `komae.power`, `yono.power`, and title year.
- For UI tests around the battle field, placeholders and slots expose test IDs
  to make assertions robust:
    - `data-testid="slot-yono"`, `data-testid="slot-komae"`
    - `data-testid="placeholder"`

### SSR

- Server-Side Rendering (SSR) is not used. This app is a client-side rendered SPA.
- Accessing `window`/`document` in components is acceptable.
- Hydration mismatch concerns for random values (e.g., `Math.random()` during render) do not apply in the current setup.

## Release Notes (Changelog) Generation

このプロジェクトでは `@changesets/cli` を利用してリリースノート (CHANGELOG.md) を作成します。

### 使い方

1. 変更内容をまとめるため、コミット後に下記コマンドを実行します。

    ```bash
    npx changeset
    ```

    対話形式で変更内容 (feat, fix など) を記述します。

2. すべての変更がまとまったら、リリースノート (CHANGELOG.md) を生成します。

    ```bash
    npx changeset-changelog
    ```

    または、下記コマンドで既存の CHANGELOG.md を更新できます。

    ```bash
    npx conventional-changelog --infile CHANGELOG.md -r 0 --same-file --preset eslint
    ```

詳細は [changesets documentation](https://github.com/changesets/changesets) を参照してください。
