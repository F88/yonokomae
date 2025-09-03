import type { Meta, StoryObj } from '@storybook/react-vite';
import { BattleContainer } from './BattleContainer';
import { playMode } from '@/yk/play-mode';
import type { Battle } from '@/types/types';

const demoMode = playMode.find((m) => m.id === 'demo-en') ?? playMode[0];

function makeSampleBattle(overrides?: Partial<Battle>): Battle {
  return {
    id: 'sample-battle-1',
    title: 'YONO vs KOMAE',
    subtitle: 'A classic showdown',
    overview:
      'Two legendary rivals meet again. Who will prevail in this iconic matchup?',
    scenario:
      'On a misty morning by the Tama River, strategies clash and wit decides the day.',
    status: 'success',
    yono: {
      imageUrl: '/YONO-SYMBOL.png',
      title: 'YONO',
      subtitle: 'Swift and precise',
      description: 'Focuses on tempo and positioning to outmaneuver opponents.',
      power: 78,
    },
    komae: {
      imageUrl: '/KOMAE-SYMBOL.png',
      title: 'KOMAE',
      subtitle: 'Steady and strong',
      description: 'Relies on resilience and counterattacks to seize control.',
      power: 82,
    },
    provenance: [
      { label: 'Local Chronicles' },
      {
        label: 'Tama River Archives',
        url: 'https://example.com/records/tama-river',
        note: 'Chapter 3',
      },
    ],
    ...overrides,
  } satisfies Battle;
}

const meta: Meta<typeof BattleContainer> = {
  title: 'Battle/BattleContainer',
  component: BattleContainer,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BattleContainer>;

export const Default: Story = {
  args: {
    battle: makeSampleBattle(),
    mode: demoMode,
  },
};

export const HistoricalCrop: Story = {
  args: {
    battle: makeSampleBattle(),
    mode: { ...demoMode, id: 'historical-research' },
  },
};
