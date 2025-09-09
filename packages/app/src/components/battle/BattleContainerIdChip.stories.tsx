import type { Meta, StoryObj } from '@storybook/react-vite';
import { BattleContainerIdChip } from './BattleContainerIdChip';
import type { Battle } from '@yonokomae/types';

const meta: Meta<typeof BattleContainerIdChip> = {
  title: 'Battle/BattleContainerIdChip',
  component: BattleContainerIdChip,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BattleContainerIdChip>;

const sampleBattle: Battle = {
  id: 'battle_2025_09_05_001',
  themeId: 'history',
  significance: 'medium',
  publishState: 'published',
  title: 'Bridge Stand-off',
  subtitle: 'Control the crossing',
  narrative: {
    overview: 'Control over a vital crossing sparks a tense standoff.',
    scenario:
      'Both sides maneuver to secure logistics while minimizing public disruption.',
  },
  komae: {
    title: 'Komae Rampart',
    subtitle: 'Hold the line',
    description: 'Defensive posture to maintain stability.',
    imageUrl: '/icon.png',
    power: 70,
  },
  yono: {
    title: 'Yono Surge',
    subtitle: 'Swift advance',
    description: 'Seeks quick control to dictate terms.',
    imageUrl: '/icon.png',
    power: 68,
  },
  status: 'success',
};

export const Basic: Story = {
  args: {
    battle: sampleBattle,
  },
};

export const Secondary: Story = {
  args: {
    battle: sampleBattle,
    variant: 'secondary',
  },
};
