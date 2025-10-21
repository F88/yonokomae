/**
 * Represents a single Neta (ネタ) entity, the atomic content unit used in battles.
 *
 * A Neta is a self-contained item with visual and textual attributes and a
 * numeric power used in simple comparisons or calculations. Two Netas (one for
 * Komae and one for Yono) make up a {@link Battle} scenario.
 */
export interface Neta {
  /**
   * Absolute or base-path-resolved URL of the image representing this Neta.
   *
   * - Accepts public/ assets or external URLs.
   * - Should be an accessible image (decorative vs informative is decided by UI).
   * - Prefer stable paths to avoid cache churn during build/deploy.
   *
   * @example "./imgs/neta/komae-townhall.png"
   */
  imageUrl: string;
  /**
   * The main title or name of the Neta, concise and scannable.
   *
   * Shown prominently in the UI and used in tests. Keep it human-readable and
   * unique within the context of a single battle.
   */
  title: string;
  /**
   * A short subtitle or catchphrase that supplements the title.
   *
   * Typically a brief phrase (<= 50 chars) displayed with smaller emphasis.
   */
  subtitle: string;
  /**
   * A detailed description of the Neta.
   *
   * Use full sentences. May include provenance-like hints, but authoritative
   * citations should be attached to {@link Battle.provenance} at the battle level.
   */
  description: string;
  /**
   * Numeric power used for simple battle calculations.
   *
   * This is a domain-specific score (not necessarily normalized). Higher values
   * typically indicate stronger presence. Keep it a non-negative integer when
   * possible for predictable ordering; fractional values are allowed but avoid
   * unnecessary precision.
   */
  power: number;
}

/**
 * Represents a battle theme or category. This is the rich shape used by
 * external catalogs (e.g., @yonokomae/catalog) to describe a theme.
 */
export interface BattleTheme {
  /** A unique identifier for the theme (slug-like, stable) */
  id: string;
  /** The display name of the theme */
  name: string;
  /** A brief description explaining the theme's conflict or focus */
  description: string;
  /** Emoji or small icon representing the theme in UI */
  icon: string;
  /** A concise sub-theme phrase describing the tension/axes */
  subThemes: string;
  /** Representative elements included in this theme (comma-separated) */
  includedElements: string;
}

/** Literal id union for themes (keep in sync with catalog ids). */
export type BattleThemeId =
  | 'history'
  | 'culture'
  | 'community'
  | 'development'
  | 'economy'
  | 'figures'
  | 'information'
  | 'technology';

/**
 * Represents a single battle scenario between two {@link Neta} entities.
 *
 * A Battle is the unit rendered by the app after a user triggers generation.
 * It includes human-facing copy (title/overview/scenario), the two competing
 * Netas (Komae vs Yono), optional provenance for transparency, and an optional
 * status used by the UI and metrics.
 */

/**
 * Narrative container for the scenario copy.
 *
 * Groups a short overview and a free-form scenario description for cohesion
 * and future extensibility.
 */
export interface BattleNarrative {
  /** One or two sentences summarizing the key idea behind the battle */
  overview: string;
  /** Free-form detailed description of the scenario */
  scenario: string;
}
/**
 * Canonical publish lifecycle states for a Battle (runtime and type).
 *
 * Keep this the single source of truth and derive the type from it to avoid
 * duplicated string unions.
 */
export const PUBLISH_STATES = [
  'draft',
  'review',
  'published',
  'archived',
] as const;
/** Literal union type of {@link PUBLISH_STATES}. */
export type PublishState = (typeof PUBLISH_STATES)[number];
export interface Battle {
  /**
   * Stable unique id for list keys, caching, and tracking.
   *
   * - Must be unique across the current session and ideally across runs.
   * - Prefer URL-safe strings (no spaces) like `battle_2025_09_04_001`.
   */
  id: string;

  /**
   * The theme id (catalog key) of the battle scenario.
   *
   * Use with {@link battleThemeCatalog} to resolve display data (name/icon,
   * subThemes, description, includedElements) at render time.
   */
  themeId: BattleThemeId;

  /**
   * Publishing lifecycle state of this battle data.
   *
   * This controls which environments / selection flows should surface the
   * battle. Selection (e.g. random generation) SHOULD by default include only
   * `published` items in production. Other states are intended for development
   * and curation workflows.
   *
   * States:
   * - `draft`     – Under active creation; content and IDs may still change.
   * - `review`    – Content frozen for editorial / data quality review.
   * - `published` – Stable and eligible for end-user selection (default).
   * - `archived`  – Retained for history; normally excluded from random pick.
   *
   * Omitted field MUST be treated as `published` for backward compatibility.
   */
  publishState: PublishState;

  /**
   * The historical significance or rank of the battle.
   *
   * Can be used to sort, highlight, or filter scenarios based on their impact.
   *
   * Levels:
   * - 'low' — Everyday skirmishes with only minor strategic impact.
   *   Example: "Debate over waste disposal methods"
   * - 'medium' — Conflicts that cause a moderate impact on both sides.
   *   Example: "Budget showdown over the local festival"
   * - 'high' — Major turning points that could reshape the balance of power.
   *   Example: "Battle to prevent population outflow by improving public services"
   * - 'legendary' — The most consequential battles that define the overall story.
   *   Example: "The final showdown over merger (or independence) between Yono and Komae"
   */
  significance: 'low' | 'medium' | 'high' | 'legendary';

  /**
   * The main title of the battle scenario.
   *
   * Displayed as a heading and used in tests. Keep it meaningful and concise.
   */
  title: string;
  /**
   * A short subtitle for the scenario.
   *
   * Complements the title with additional context (e.g., time period, theme).
   */
  subtitle: string;
  /**
   * Scenario copy grouped for cohesion and future growth.
   *
   * Replaces the previous `overview`/`scenario` top-level fields with a single
   * narrative container that keeps summary and details together.
   */
  narrative: BattleNarrative;
  /**
   * The {@link Neta} entity representing Komae.
   *
   * Accessed frequently by UI; ensure `title` and `imageUrl` are present.
   */
  komae: Neta;
  /**
   * The {@link Neta} entity representing Yono.
   *
   * Accessed frequently by UI; ensure `title` and `imageUrl` are present.
   */
  yono: Neta;
  /**
   * Optional provenance/citations for the scenario as a whole.
   *
   * Use to link sources or provide notes that justify the scenario statements.
   * Keep labels short and URLs stable. Notes can include brief explanations.
   */
  provenance?: Array<{
    /** Human-friendly label for the source entry */
    label: string;
    /** Direct URL to the source, if available */
    url?: string;
    /** Short note or context about how the source is used */
    note?: string;
  }>;
  /**
   * Optional status for UI flow control and metrics aggregation.
   *
   * - `loading`: generation in progress (placeholder render)
   * - `success`: fully generated and safe to render
   * - `error`: failed to generate (UI may show a fallback)
   *
   * When omitted, the UI treats it as a finalized item in most contexts.
   */
  status?: 'loading' | 'success' | 'error';
}
