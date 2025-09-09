/**
 * Represents a selectable play mode shown on the title screen.
 *
 * Accessibility
 * - `srLabel` (required) supplies the accessible name used by the radio input.
 *   The visible `title` + `description` block is marked `aria-hidden` so it is not
 *   announced twice. Keep labels concise (target <= ~30 chars when possible).
 * - Prefer including an explicit mode name first, then a short purpose / context.
 * - Avoid gratuitous emoji inside `srLabel` unless they materially help meaning;
 *   screen readers can introduce noise when reading many emojis.
 *
 * Internationalization (i18n)
 * - `id` is a stable, non‑localized internal key (do not translate; use for logic / routing).
 * - `title` & `description` are user-visible and localized text.
 * - `srLabel` may differ from `title` to provide clearer spoken wording (e.g. remove emoji,
 *   reorder phrases, or add clarifying terms not ideal for the visual layout).
 *
 * Authoring Guidelines
 * - Start with the core concept (e.g. "歴史研究" / "Demo English").
 * - Follow with a short action / benefit phrase (e.g. "現在のよのこま" / "sample battles").
 * - Omit redundant words that a user already hears in the group context (e.g. "モード" if obvious).
 * - If disabled, you may optionally append a brief state note (e.g. "未実装").
 */
export interface PlayMode {
  /** Stable internal identifier (logic & routing). Not localized. */
  id: string;
  /** Visual heading text for the mode (localized, may contain emoji). */
  title: string;
  /** Secondary explanatory copy shown under the title (localized). */
  description: string;
  /** Whether the user can currently select this mode. */
  enabled: boolean;
  /** Required screen-reader specific accessible name (succinct, localized). */
  srLabel: string;
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
      // '[WIP] ' +
      '歴史的な出来事に基づいてよのこまを分析、眠れない夜のおともに',
    enabled: true,
    srLabel:
      'よのこまえ。歴史的な出来事に基づいてよのこまを分析、眠れない夜のおともに。',
  },
  {
    id: 'yk-now',
    title: 'よのこまライブ',
    description: '[WIP] ' + '🥷😼 よーのとこみまが今日のよのこまに鋭く斬り込む',
    enabled: true,
    srLabel: 'よのこまライブ。よーのとこみまが今日のよのこまに鋭く斬り込む。',
  },
  {
    id: 'demo',
    title: 'デモ (ja)',
    description: 'デモモード',
    enabled: true,
    srLabel: '日本語のデモモード',
  },
  {
    id: 'demo-en',
    title: 'DEMO (en)',
    description: 'English demonstration mode',
    enabled: true,
    srLabel: 'English demonstration mode',
  },
  {
    id: 'demo-de',
    title: 'DEMO (de)',
    description: 'Deutscher Demomodus',
    enabled: true,
    srLabel: 'Deutscher Demomodus',
  },
  {
    id: 'ai-mode',
    title: 'AI MODE',
    description:
      'A mode that uses AI to generate unique battle scenarios. (Maybe later)',
    enabled: false,
    srLabel:
      'A mode that uses AI to generate unique battle scenarios. (Maybe later)',
  },
];
