---
'yonokomae': minor
---

- Repository Pattern Implementation: A major architectural shift introduces a repository pattern (BattleReportRepository, JudgementRepository, etc.) for managing data sources and business logic, replacing previous direct implementations.
- Expanded Documentation: Comprehensive new documentation files (DEVELOPMENT_EN.md, DEVELOPMENT_JA.md, CONTRIBUTING.md, TESTING.md) have been added, detailing development practices, contribution guidelines (including changelog and commit conventions), and testing strategies.
- Bilingual Documentation Principles: New guidelines are established for maintaining bilingual documentation (English as source of truth, Japanese translation) to ensure consistency.
- New Play Modes & Data Sources: The system now supports different play modes (demo, historical-evidence, api) with distinct data sources and logic, including a mock API server and seed-based historical data.
- Enhanced Testing Infrastructure: Integration of MSW (Mock Service Worker) and new test utilities (renderWithProviders) significantly improves the ability to test repository interactions and UI components, especially for API-backed scenarios.
- UI Enhancements: Minor UI improvements include better navigation to battle reports and a new UI for selecting historical data seeds.
