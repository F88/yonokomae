export interface PlayMode {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
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
    enabled: true,
  },
  {
    id: 'historical-evidence',
    title: 'HISTORICAL EVIDENCE',
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
];
