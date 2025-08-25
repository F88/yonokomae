# Yonokomae

[![DeepWiki](https://img.shields.io/badge/DeepWiki-F88%2Fyonokomae-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/F88/yonokomae)

Yono Komae War

This game is a thought-provoking game that examines from multiple angles what happened to two countries that experienced "The World Merger Battle of the Heisei era" ("平成の大合併大戦")'

```text
Note: This game is full of humorous jokes and is not a deepfake or fake.
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
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

