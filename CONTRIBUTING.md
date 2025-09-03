# Contributing Guide

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. We also follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages.

## Development Workflow

1.  **Create a branch:** Create a new branch from `main` for your feature or bug fix.
2.  **Make changes:** Make your changes to the codebase.
3.  **Run checks locally:** Before committing, run the CI checks locally to ensure everything is in order. See the [Running CI Checks Locally](#running-ci-checks-locally) section.
4.  **Commit your changes:** Follow the [Commit Message Conventions](#commit-message-conventions).
5.  **Create a changeset:** If your changes are user-facing, create a changeset.
    ```bash
    npx changeset
    ```
    Follow the prompts to select the appropriate version bump (patch, minor, or major) and write a description of the change.
6.  **Push and create a Pull Request:** Push your branch to GitHub and create a Pull Request against `main`.

## Commit Message Conventions

This project follows the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). This helps us automate versioning and changelog generation.

A commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Common types:**

-   `feat`: A new feature
-   `fix`: A bug fix
-   `docs`: Documentation only changes
-   `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   `refactor`: A code change that neither fixes a bug nor adds a feature
-   `perf`: A code change that improves performance
-   `test`: Adding missing tests or correcting existing tests
-   `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

## CI/CD Pipeline

We use GitHub Actions for our CI/CD pipeline. The workflow is defined in `.github/workflows/ci.yml`.

When you create a Pull Request, the following checks are automatically run:

1.  **Lint**: Checks the code for style and formatting issues using ESLint.
2.  **Typecheck**: Verifies the TypeScript types in the project.
3.  **Unit tests**: Runs the unit test suite using Vitest.
4.  **Seed schema validation**: Ensures that the data seeds are valid.

All checks must pass before a Pull Request can be merged.

### Running CI Checks Locally

Before submitting a PR, please run these commands locally:

```bash
# Lint check
npm run lint

# Typecheck
npx tsc -b --pretty false

# Run unit tests
npm run test:unit

# Run seed validation tests
npm run test:seeds
```

## Release Workflow

When we're ready to release a new version, we follow these steps:

1.  **Version bump:** The `changeset version` command is run. This consumes all changeset files, updates the package versions and the `CHANGELOG.md`.
    ```bash
    npx changeset version
    ```
2.  **Create a release commit and tag:** The changes are committed and a new version tag is created.
3.  **Publish to npm (if applicable):** The package is published to the npm registry.
4.  **Deploy to GitHub Pages:** The application is deployed to GitHub Pages.
    ```bash
    npm run deploy:ghpages
    ```

## Data Export Scripts

The project includes TSV export functionality for usage examples and user voices:

-   `npm run ops:export-usage-examples-to-tsv` - Exports usage examples to TSV format
-   `npm run ops:export-users-voice-to-tsv` - Exports user voices data to TSV format

These scripts use the TypeScript configurations in `tsconfig.ops.json` and process data from:

-   `src/data/usage-examples.ts` - Usage examples with categories and descriptions
-   `src/data/users-voice.ts` - User testimonials and feedback

Export scripts are located in `src/ops/` directory and generate TSV files suitable for data analysis and external use.