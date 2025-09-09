---
lang: en
title: Contributing Guide
title-en: Contributing Guide
title-ja: コントリビューティングガイド
related:
    - CONTRIBUTING_EN.md has been translated into Japanese as CONTRIBUTING_JA.md.
    - CONTRIBUTING_JA.md is a Japanese translation of CONTRIBUTING_EN.md.
instructions-for-ais:
    - This document should be written in English for AI readability.
    - Content within code fences may be written in languages other than English.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Contributing Guide

This pnpm monorepo project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. We also follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages.

## Project Structure

This project uses a pnpm monorepo structure with separate data & library packages.

```text
yonokomae/
├── packages/
│   ├── app/                   # Main React application (no root-level src/)
│   │   └── src/
│   │       └── ops/           # CLI operational tools
│   ├── catalog/               # Domain catalogs / enumerations
│   ├── types/                 # Shared TypeScript type definitions
│   └── schema/                # Zod validation schemas
├── data/
│   ├── battle-seeds/          # Statistical battle data (Yono vs Komae)
│   ├── historical-evidence/   # Historical scenario data
│   └── news-seeds/            # News-style sample data
├── docs/                      # Documentation (English is source of truth)
│   └── data/                  # Data-specific documentation
├── e2e/                       # Playwright tests
├── mock-api/                  # Local API stub server
└── dist/                      # Build output
    ├── ops-build/             # Compiled ops scripts
    └── data/                  # Compiled data packages
```

Key recent architectural additions:

- Repository-level filtering (`BattleFilter`) feeding `BattleReportRepository.generateReport({ filter })`
- Optional theme icon rendering in `BattleTitleChip`
- Opt-in `showIds` debug capability in `BattleSeedSelector`
- Custom error classes for battle seed and news reporter repositories
- Seedable shuffle utilities with regression guards
- Environment-driven logging for battle report generation
- Enhanced ops CLI tools with `--help` flags
- iOS/WebKit touch mode selection correction (coordinate-nearest matching)
- Removal of E2E specs depending on dev-only selection counter instrumentation (production parity)

## Contributing to Data Packages

If you're contributing data (battles, historical scenarios, or news samples), please see the dedicated data maintenance guides:

- **Main Data Guide**: [docs/DATA_MAINTENANCE_EN.md](docs/DATA_MAINTENANCE_EN.md)
- **Battle Seeds**: [docs/data/BATTLE_SEEDS_EN.md](docs/data/BATTLE_SEEDS_EN.md)
- **Historical Evidence**: [docs/data/HISTORICAL_EVIDENCE_SEEDS_EN.md](docs/data/HISTORICAL_EVIDENCE_SEEDS_EN.md)
- **News Seeds**: [docs/data/NEWS_SEEDS_EN.md](docs/data/NEWS_SEEDS_EN.md)

### Data Contribution Workflow

1. **Navigate to the appropriate data package**: `cd data/{package-name}/`
2. **Add or edit data files** in the `src/` directory
3. **Validate your changes**: `pnpm test`
4. **Commit with appropriate type**: `git commit -m "data({domain}): describe your changes"`

Data packages have independent testing and validation that automatically runs in CI to ensure data quality and consistency.

## Development Workflow

1. **Create a branch:** Create a new branch from `main` for your feature or bug fix.
2. **Make changes:** Make your changes to the codebase.
3. **Run checks locally:** Before committing, run the CI checks locally to ensure everything is in order. See the [Running CI Checks Locally](#running-ci-checks-locally) section.
4. **Commit your changes:** Follow the [Commit Message Conventions](#commit-message-conventions).
5. **Create a changeset:** If your changes are user-facing, create a changeset.

    ```bash
    pnpm changeset
    ```

    Follow the prompts to select the appropriate version bump (patch, minor, or major) and write a description of the change.

6. **Push and create a Pull Request:** Push your branch to GitHub and create a Pull Request against `main`.

## Commit Message Conventions

This project follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). This helps us automate versioning and changelog generation.

A commit message should be structured as follows:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Common types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation
- `data`: Changes to data packages (battle-seeds, historical-evidence, news-seeds)

**Data-specific commit formats:**

- `data(battle): add yono-komae-transportation battle`
- `data(historical): fix typo in tama-river scenario`
- `data(news): update news-sample-1 with latest content`

## CI/CD Pipeline

We use GitHub Actions for our CI/CD pipeline. The workflow is defined in `.github/workflows/ci.yml`.

When you create a Pull Request, the following checks are automatically run:

1. **Lint**: Checks the code for style and formatting issues using ESLint.
2. **Typecheck**: Verifies the TypeScript types across all packages.
3. **Unit tests**: Runs the unit test suite using Vitest.
4. **Data package validation**: Ensures that all data packages have valid schemas and unique IDs:
    - Battle seeds validation (`@yonokomae/data-battle-seeds`)
    - Historical evidence validation (`@yonokomae/data-historical-evidence`)
    - News seeds validation (`@yonokomae/data-news-seeds`)

All checks must pass before a Pull Request can be merged.

### Running CI Checks Locally

Before submitting a PR, please run these commands locally:

```bash
# Lint check
pnpm run lint

# Typecheck
pnpm run typecheck

# Run unit tests
pnpm run test:unit

# Run all tests (includes data package validation)
pnpm test

# Run every workspace package's own test script (broader sweep)
pnpm run test:all

# Test individual data packages
cd data/battle-seeds && pnpm test
cd data/historical-evidence && pnpm test
cd data/news-seeds && pnpm test
```

## Release Workflow

When we're ready to release a new version, we follow these steps:

1. **Version bump:** The `changeset version` command is run. This consumes all changeset files, updates the package versions and the `CHANGELOG.md`.

```bash
pnpm changeset version
```

1. **Create a release commit and tag:** The changes are committed and a new version tag is created.
2. **Publish to npm (if applicable):** The package is published to the npm registry.
3. **Deploy to GitHub Pages:** The application is deployed to GitHub Pages (see Deployment Guide for details).

```bash
pnpm run deploy:ghpages
```

See `docs/DEPLOYMENT_EN.md` for base path, 404 fallback, and troubleshooting details.

## Data Export and Analysis Scripts

The project includes comprehensive CLI tools for data export and analysis. Each command auto-runs prerequisite data package builds and the ops build (equivalent to `pnpm run ops:prepare`) when needed. You may run `pnpm run ops:prepare` explicitly to force a fresh rebuild.

### Export Commands (auto-build aware)

- `pnpm run ops:export-usage-examples-to-tsv` - Exports usage examples to TSV format
- `pnpm run ops:export-users-voice-to-tsv` - Exports user voices data to TSV format
- `pnpm run ops:export-battle-seeds-to-json` - Exports all battle seeds to JSON format (copies prebuilt unified JSON)

### Analysis Commands (auto-build aware)

- `pnpm run ops:analyze-battle-seeds` - Analyzes battle seed distribution and statistics (reads unified generated index or an exported JSON file)
    - Shows totals, theme/significance distribution, power statistics
    - Supports `--format=json` for machine-readable output
    - Can analyze from dist modules or exported JSON files

### Script Structure

These scripts use the TypeScript configurations in `tsconfig.ops.json` and are located in `packages/app/src/ops/`. They process data from:

- `packages/app/src/data/usage-examples.ts` - Usage examples with categories and descriptions
- `packages/app/src/data/users-voice.ts` - User testimonials and feedback
- `data/battle-seeds/` - Battle seed data packages

All ops commands support `--help` flags for usage information:

```bash
pnpm run ops:analyze-battle-seeds -- --help
```

Compiled scripts are output to `dist/ops-build/` for execution.
