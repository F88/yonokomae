/**
 * Represents a selectable play mode shown on the title screen.
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
 * DEMO
 * - A quick demonstration mode with placeholder data.
 * - repo: `repositories.fake.ts`
 *
 * HISTORICAL RESEARCH (Not implemented)
 * - A mode that generates battles based on historical events.
 * - repo: (reserved; will be separate from Random Joke Data)
 *
 * RANDOM JOKES
 * - A mode that generates random, humorous battle scenarios.
 * - repo: `repositories.random-jokes.ts`
 *
 * AI MODE (MAYBE LATER)
 * - A mode that uses AI to generate unique battle scenarios.
 * - repo: `repositories.ai.ts` (not implemented yet)
 */
export declare const playMode: PlayMode[];
