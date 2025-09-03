/**
 * Play modes available in the game.
 */
export interface PlayMode {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

/**
 * Play modes available in the game.
 *
 * DEMO (ja / en / de)
 * - Quick demonstration modes with fixed/demo data.
 * - repos: language-specific Demo repositories
 *   - DemoJaBattleReportRepository / DemoEnBattleReportRepository / DemoDeBattleReportRepository
 *
 * HISTORICAL RESEARCH
 * - Seed-based curated historical evidences (default experience).
 * - repo: HistoricalEvidencesBattleReportRepository (via RepositoryProvider)
 *
 * YK-NOW
 * - News-driven current-events mode.
 * - repo: NewsReporterApiBattleReportRepository (API-backed)
 *
 * AI MODE (MAYBE LATER)
 * - A mode that uses AI to generate unique battle scenarios.
 * - repo: `repositories.ai.ts` (not implemented yet)
 */

export const playMode: PlayMode[] = [
  {
    id: 'historical-research',
    title: 'よの ⚔️ こまえ',
    description:
      '[WIP] ' + '歴史的な出来事に基づいてよのこまを分析、眠れない夜のおともに',
    enabled: true,
  },
  {
    id: 'yk-now',
    title: 'よのこまライブ',
    description: '[WIP] ' + '🥷😼 よーのとこみまが今日のよのこまに鋭く斬り込む',
    enabled: true,
  },
  {
    id: 'demo',
    title: 'デモ (ja)',
    description: 'デモモード',
    enabled: true,
  },
  {
    id: 'demo-en',
    title: 'DEMO (en)',
    description: 'Demonstration mode',
    enabled: true,
  },
  {
    id: 'demo-de',
    title: 'DEMO (de)',
    description: 'Demonstrationsmodus',
    enabled: true,
  },
  {
    id: 'ai-mode',
    title: 'AI MODE',
    description:
      'A mode that uses AI to generate unique battle scenarios. (Maybe later)',
    enabled: false,
  },
];
