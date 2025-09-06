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
