# CHANGELOG

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
- feat(ops): Add build scripts for data export (`npm run build:usage-examples-tsv`, `npm run build:users-voice-tsv`)
- feat(ui): Add marquee animation effects for user testimonials
- docs: Update documentation to reflect new features and components
- feat(config): Update TypeScript configuration for improved module handling

### Bug Fixes

- fix: Unify provenance array formatting across historical seed files

## 0.1.0

### Minor Changes

- f53d3b8: Fully adopt the repository pattern
- 9aacf56: Update Developer's guide.
- 6e9baf2: - Repository Pattern Implementation: A major architectural shift introduces a repository pattern (BattleReportRepository, JudgementRepository, etc.) for managing data sources and business logic, replacing previous direct implementations.
    - Expanded Documentation: Comprehensive new documentation files (DEVELOPMENT_EN.md, DEVELOPMENT_JA.md, CONTRIBUTING.md, TESTING.md) have been added, detailing development practices, contribution guidelines (including changelog and commit conventions), and testing strategies.
    - Bilingual Documentation Principles: New guidelines are established for maintaining bilingual documentation (English as source of truth, Japanese translation) to ensure consistency.
    - New Play Modes & Data Sources: The system now supports different play modes (demo, historical-evidence, api) with distinct data sources and logic, including a mock API server and seed-based historical data.
    - Enhanced Testing Infrastructure: Integration of MSW (Mock Service Worker) and new test utilities (renderWithProviders) significantly improves the ability to test repository interactions and UI components, especially for API-backed scenarios.
    - UI Enhancements: Minor UI improvements include better navigation to battle reports and a new UI for selecting historical data seeds.
- 9aacf56: 日本語の開発者用文書を追加
- Various other improvements, changes, etc.

## 0.0.1 (2025-08-25)

### chore

- add @changesets/cli as a dev dependency ([d0b3d61](https://github.com/F88/yonokomae/commit/d0b3d61238a71adc27061451a0eda31f22b8cc90))
