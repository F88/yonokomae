# Contributing Guide

## Release & Changelog Workflow

This project uses Changesets to manage versioning and changelogs.

### Creating a Changeset

After committing changes, create a changeset to describe them:

```bash
npx changeset
```

Follow the interactive prompts to:

- Select the type of change (major, minor, patch)
- Provide a summary of the changes
- The changeset will be saved in `.changeset/` directory

### Generating/Updating CHANGELOG

When ready to release, generate or update the CHANGELOG.md:

```bash
npx changeset-changelog
```

Alternatively, update an existing CHANGELOG.md using Conventional Changelog:

```bash
npx conventional-changelog --infile CHANGELOG.md -r 0 --same-file --preset eslint
```

### Version Bumping

To consume all changesets and bump versions:

```bash
npx changeset version
```

This will:

- Update package versions based on changesets
- Update CHANGELOG.md with all changes
- Remove consumed changeset files

## Commit Message Conventions

Follow these conventions for clear commit history:

- `feat(scope):` New features
- `fix(scope):` Bug fixes
- `docs(scope):` Documentation changes
- `test(scope):` Test additions or modifications
- `refactor(scope):` Code refactoring
- `chore(scope):` Build process or auxiliary tool changes

Examples:

- `feat(repo): add ExampleRepo repositories and provider wiring`
- `fix(ui): correct battle report scroll behavior`
- `docs(dev): add developer guide for ExampleMode`
- `test(repo): add unit tests for ExampleRepo behavior`

## CI/CD Pipeline

### GitHub Actions Workflow

The project is configured for GitHub Actions CI/CD, though workflow files are not yet present in `.github/workflows/`.

#### Planned CI Pipeline (on PRs)

1. **Lint Check**: Ensures code follows project style guidelines
2. **Type Check**: Verifies TypeScript compilation without errors
3. **Unit Tests**: Runs the test suite with coverage reporting
4. **Build Verification**: Ensures the project builds successfully

#### Current Deployment Process

1. **GitHub Pages Deployment**:
    - Manual deployment via `npm run deploy`
    - Builds the project with proper base path (`/yonokomae/`)
    - Uses `gh-pages` package to push to GitHub Pages branch
    
To set up automated CI/CD, create workflow files in `.github/workflows/` directory.

### Running CI Checks Locally

Before submitting a PR, run these commands locally:

```bash
# Lint check
npm run lint

# Type check (TypeScript compilation)
npm run typecheck

# Run tests
npm test

# Build project
npm run build
```

Note: The `typecheck` script runs TypeScript compiler in check mode without emitting files, ensuring type safety across the codebase.

### Environment Variables

For deployment, ensure these environment variables are configured:

- `VITE_API_BASE_URL`: API endpoint base URL (optional, for API mode)
- GitHub Pages requires repository settings to enable Pages deployment

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Conventional Changelog](https://github.com/conventional-changelog)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
