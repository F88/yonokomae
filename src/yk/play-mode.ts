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
 * HISTORICAL EVIDENCE (Not implemented)
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

export const playMode: PlayMode[] = [
  {
    id: 'demo',
    title: 'DEMO',
    description: 'A quick demonstration mode with placeholder data.',
    enabled: true,
  },
  {
    id: 'historical-evidences',
    title: 'HISTORICAL EVIDENCES',
    description:
      '[WIP] A mode that generates battles based on historical events.',
    enabled: true,
  },
  {
    id: 'ai-mode',
    title: 'AI MODE',
    description:
      'A mode that uses AI to generate unique battle scenarios. (Maybe later)',
    enabled: false,
  },
  {
    id: 'api',
    title: 'API MODE',
    description: 'Backed by a remote API (mockable in dev/test).',
    enabled: false,
  },
  {
    id: 'mixed-nuts',
    title: 'MIXED NUTS',
    description: 'Randomized, seed-backed battle generator (was historical).',
    enabled: true,
  },
];
