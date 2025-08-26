export interface PlayMode {
  id: string;
  title: string;
  description: string;
}

/**
 * - DEMO
- HISTORICAL EVIDENCE (WIP)
- AI MODE (MAYBE LATER)
 */

export const playMode: PlayMode[] = [
  {
    id: 'demo',
    title: 'DEMO',
    description: 'A quick demonstration mode with placeholder data.',
  },
  {
    id: 'historical-evidence',
    title: 'HISTORICAL EVIDENCE',
    description:
      'A mode that generates battles based on historical events. (WIP)',
  },
  {
    id: 'ai-mode',
    title: 'AI MODE',
    description:
      'A mode that uses AI to generate unique battle scenarios. (Maybe later)',
  },
];
