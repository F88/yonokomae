# Yonokomae

[![DeepWiki](https://img.shields.io/badge/DeepWiki-F88%2Fyonokomae-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/F88/yonokomae)

Yono Komae War

This game is a thought-provoking game that examines from multiple angles what happened to two countries that experienced "The World Merger Battle of the Heisei era" ("平成の大合併大戦")'

```text
Note: This game is full of humorous jokes and is not a deepfake or fake.
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher, recommended v20)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/F88/yonokomae.git
cd yonokomae

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

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

## Architecture (CSR-only)

This app is a client-side rendered SPA. All UI is composed and rendered in the browser; there is no server-side rendering or server API.

- Entrypoints
    - `index.html` mounts the app at `#root`.
    - `src/main.tsx` bootstraps React and imports the root `index.css`.
    - `src/App.tsx` composes page sections; no router is used.
- Rendering & state
    - UI is built from feature components under `src/components/**`.
    - State is local to components and custom hooks. Cross-feature global state is not used.
    - Async flow: `useJudgement(judgeName, battle)` handles loading/error/success states and is consumed by `JudgeCard`.
- Data & randomness
    - No network calls; data is derived from local domain logic under `src/yk/**` and generated content via `@faker-js/faker`.
    - Random values during render are acceptable in CSR. Tests mock randomness for determinism.
- Styling & theming
    - Tailwind CSS v4 with a single root `index.css`; dark mode toggled via the `.dark` class.
- Performance
    - Built with Vite for static hosting (GitHub Pages). Code splitting is minimal; consider `React.lazy` if heavy sections are added later.
- Environment & security
    - No secrets/tokens are embedded. If environment variables are introduced, they must be prefixed with `VITE_` to be exposed to the client.
- Implications of CSR-only
    - Accessing `window`/`document` in components is fine.
    - Hydration mismatch issues do not apply.
    - Without JavaScript, only the bare HTML shell is visible; the game requires JS enabled.

## Project notes

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
- Use `useJudgement(nameOfJudge, battle)` to fetch and render results with `loading/error/success` states.
- UI component: `JudgeCard` consumes `useJudgement` and handles the states.

### Path aliases

- `@` maps to `src/` (configured in `tsconfig` and `vite.config.ts`).

### Testing notes

- Tests mock `@faker-js/faker` string generators (`lorem.words`, `lorem.paragraph`) to keep assertions deterministic.
- `faker.number.int` is called three times in `FrontlineJournalist.report`: `komae.power`, `yono.power`, and title year.

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

