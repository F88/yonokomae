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

## Documentation

- Developer guide (EN): see DEVELOPMENT_EN.md
- 開発ガイド (JA): DEVELOPMENT_JA.md

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

  ## Project notes

    For deeper technical details (architecture, repository pattern, wiring, and diagrams), see the developer guides linked above.

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

## Keyboard Shortcuts

- Title screen navigation: ArrowUp/ArrowDown, J/K, W/S
- Confirm: Enter or Space
- Jump to first/last enabled: Home/End
- Battle: B, Enter, or Space
- Reset: R
