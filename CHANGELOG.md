# CHANGELOG

## Unreleased

### Features

- feat(components): add NetaCardSkelton component with background support and Storybook stories
- feat(components): add HistoricalSceneSkelton component with reduced motion support
- feat(components): enhance NetaCard with image merging logic and improved props structure
- feat(ui): add dynamic background building for historical scenes
- feat(tailwind): add safelist for opacity utility classes and extend opacity scale
- feat(ui): integrate reduced motion support for loading animations
- feat(storybook): add comprehensive stories for battle components
- feat(data): add watch scripts for continuous index generation in data packages
- feat(data): update and synchronize battle scenarios with improved narrative formatting
- feat(data): reorganize significance field documentation across battle scenarios
- feat(data): synchronize publishState across all battle scenarios

### Refactoring

- refactor(locales): update significance from 'low' to 'legendary' for historical templates
- refactor(components): simplify icon selection and opacity handling in battle components
- refactor(build): replace numeric opacity with Tailwind utility classes for consistency
- refactor(data): improve narrative formatting with split-long-strings utility

### Bug Fixes

- chore(data): remove stale build artifacts under data/battle-seeds/src/battle/theme
  (`*.js`, `*.d.ts.map`)
- fix(types): restore ambient import.meta.env declarations (env.d.ts) in data
  packages to fix tsc errors
- chore(gitignore): tighten ignore rules for data/\*/src while allowing
  env.d.ts
- fix(data): correct punctuation inconsistencies in battle subtitles

### Documentation

- docs(data): document scripts/split-long-strings.mjs utility in Data
  Maintenance Guide and cross-link from battle seeds guide
- docs(dev): update development guides with HistoricalScene background configuration details
- docs: update README with latest architecture and component updates
- docs: update contributing guides with Storybook test workflow
- docs: improve Japanese typography consistency in README

### Miscellaneous

- chore(scripts): remove obsolete cleanup script
- chore(data): remove obsolete battle drafts and update unified index

## 1.2.0

### Breaking Changes (Unreleased)

- refactor(play-mode): remove mixed-nuts mode
- refactor(provider): drop mixed-nuts mapping and delay case
- refactor(api): remove dedicated api battle report repository mode
- refactor: streamline documentation and remove unused scenario repositories

### Minor Changes (1.2.0)

- feat(ops): enhance battle directory loading with multiple candidate paths
- feat(ops): add --help flags to export CLI scripts and corresponding tests
- feat(vitest): add central Vitest workspace configuration for project management
- fix(tsconfig): update include patterns to support nested TypeScript files
- feat(logging): add environment-driven logging for battle report generation
- chore(deps): update eslint and related packages to latest versions
- chore(env): add logging and news configuration options to .env.example

- refactor: update repository provider documentation to reflect current implementation
- docs: update play mode documentation to clarify available modes
- test(e2e): update title navigation tests without mixed-nuts mode
- docs(types): clean JSDoc references to removed modes
- feat(core): introduce custom error classes for battle seed and news reporter repositories
- feat(ops): add --help flags to export CLI scripts and corresponding tests
- test(core): add deterministic and instance checks for BattleSeed\* errors
- feat(core): add seedable shuffle utilities and tests (regression guard)
- test(e2e): fix End key navigation assertion to ignore disabled play modes
- feat(ui): introduce repository-level BattleFilter component
- refactor(ui): deprecate BattleSeedFilter (shim re-exports BattleFilter; removal next minor)
- feat(ui): add optional theme icon to BattleTitleChip (`showThemeIcon`)
- feat(ui): add `showIds` prop to BattleSeedSelector for displaying battle ids
- fix(core): ensure BattleFilter selected theme propagates to report generation
- docs(dev): add BattleFilter section to Japanese development guide
- docs: update contributing guides to reflect accurate monorepo structure (no root src/)
- fix(ui): correct iOS/WebKit touch mode selection misalignment (coordinate-based nearest option correction in TitleContainer)
- test(e2e): remove title selection specs relying on dev-only selection counter instrumentation
- docs(test): clarify E2E policy around dev-only instrumentation and production parity
- chore(seeds): remove legacy draft index generator and leftover stubs (generate-draft-index.ts, \_\_drafts/index.generated.\*)
- docs(dev,dev-ja,data-ja): sync removal of legacy draft generator; unify index generation docs

## 1.1.0

### Minor Changes (1.1.0)

- c052628: Remove Space from shortcut that triggers handleGenerate

## 1.0.0 (2025-09-02)

### Major Changes

- bbfcdff: BREAKING CHANGE: Judgeの判定結果をWinnerからVerdictに変更

### Breaking Changes

- refactor(core)!: migrate `determineWinner` to return a structured
  `Verdict` and remove the legacy `Winner` alias entirely. The literal union
  for the winner field is inlined (`'YONO' | 'KOMAE' | 'DRAW'`). This impacts
  all call sites and implementations.
    - API: `JudgementRepository.determineWinner` now returns `Promise<Verdict>`
      instead of `Promise<Winner>`.
    - Call sites: read `verdict.winner` instead of using a raw string.
    - Implementations/Mocks: return a `Verdict` object with `winner` and
      a valid `reason` (e.g. `'power'`).
    - Tests: expectations updated to assert `verdict.winner`.
    - Docs: DEVELOPMENT_EN.md updated with migration notes and DEVELOPMENT_JA.md
      synced.

### Enhancements

- feat(usage): Add UsageExamples and UserVoices components with interactive displays
- feat(export): Add TSV export functionality for usage examples and user voices data
- feat(ops): Add comprehensive CLI tools for data export and analysis
    - Export commands for TSV and JSON formats
    - Battle seed analysis with distribution statistics
    - Help flags for all ops commands
- feat(ui): Add marquee animation effects for user testimonials
- docs: Update documentation to reflect new features and components
- feat(config): Update TypeScript configuration for improved module handling
- test(repository-provider): add mapping tests for 'yk-now' play mode

### Bug Fixes

- fix: Unify provenance array formatting across historical seed files

## 0.1.0

### Minor Changes

- f53d3b8: Fully adopt the repository pattern
- 9aacf56: Update Developer's guide.
- 6e9baf2: - Repository Pattern Implementation: A major architectural shift introduces a repository pattern (BattleReportRepository, JudgementRepository, etc.) for managing data sources and business logic, replacing previous direct implementations.
    - Expanded Documentation: Comprehensive new documentation files (DEVELOPMENT_EN.md, DEVELOPMENT_JA.md, CONTRIBUTING.md, TESTING.md) have been added, detailing development practices, contribution guidelines (including changelog and commit conventions), and testing strategies.
    - Bilingual Documentation Principles: New guidelines are established for maintaining bilingual documentation (English as source of truth, Japanese translation) to ensure consistency.
    - New Play Modes & Data Sources: The system now supports different play modes (demo, historical-evidence) with distinct data sources and logic, including a mock API server for judgement-only flows and seed-based historical data.
    - Enhanced Testing Infrastructure: Integration of MSW (Mock Service Worker) and new test utilities (renderWithProviders) significantly improves the ability to test repository interactions and UI components, especially for API-backed scenarios.
    - UI Enhancements: Minor UI improvements include better navigation to battle reports and a new UI for selecting historical data seeds.
- 9aacf56: 日本語の開発者用文書を追加
- Various other improvements, changes, etc.

## 0.0.1 (2025-08-25)

### chore

- add @changesets/cli as a dev dependency ([d0b3d61](https://github.com/F88/yonokomae/commit/d0b3d61238a71adc27061451a0eda31f22b8cc90))
