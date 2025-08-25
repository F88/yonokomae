# Yonokomae

[![DeepWiki](https://img.shields.io/badge/DeepWiki-F88%2Fyonokomae-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/F88/yonokomae)

Yono Komae War

This game is a thought-provoking game that examines from multiple angles what happened to two countries that experienced "The World Merger Battle of the Heisei era" ("平成の大合併対戦")'

```text
Note: This game is full of humorous jokes and is not a deepfake or fake.
```


## Tech Stack (en)

### Core Technologies

- **React** (v19.1.1) - UI library
- **TypeScript** (v5.8.3) - Type-safe JavaScript
- **Vite** (v7.1.2) - Fast build tool

### Styling

- **Tailwind CSS** (v4.1.12) - Utility-first CSS framework
- **tailwind-merge** - Tailwind class merging
- **class-variance-authority** (CVA) - Component variant management
- **tw-animate-css** - Animations for Tailwind

### UI Components

- **Radix UI** - Accessible headless UI components
    - @radix-ui/react-separator
    - @radix-ui/react-slot
- **lucide-react** - Icon library
- **react-icons** - Additional icon sets

### Testing

- **Vitest** (v3.2.4) - Vite-native test framework
- **@testing-library/react** - React component testing
- **@testing-library/jest-dom** - DOM assertions
- **jsdom** - DOM implementation for Node.js

### Development Tools

- **ESLint** (v9.33.0) - Linter
- **PostCSS** & **Autoprefixer** - CSS processing
- **gh-pages** - GitHub Pages deployment
- **changesets/cli** - Release note and changelog management

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

