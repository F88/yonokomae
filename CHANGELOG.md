# CHANGELOG

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
