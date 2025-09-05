import type { Meta, StoryObj } from '@storybook/react-vite';
import { OverView } from './OverView';
import type { Battle } from '@yonokomae/types';

const meta: Meta<typeof OverView> = {
  title: 'Battle/OverView',
  component: OverView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OverView>;

const sampleBattle: Battle = {
  id: 'battle_story_sample_001',
  themeId: 'history',
  significance: 'medium',
  title: 'Sample Battle Title',
  subtitle: 'A subtitle for the sample',
  narrative: {
    overview:
      'A pivotal moment where local identity and future development intersect.',
    scenario:
      'Both sides bring forward compelling visions balancing continuity and progress.',
  },
  komae: {
    title: 'Komae Item',
    subtitle: 'Komae subtitle',
    description: 'Komae description',
    imageUrl: '/icon.png',
    power: 42,
  },
  yono: {
    title: 'Yono Item',
    subtitle: 'Yono subtitle',
    description: 'Yono description',
    imageUrl: '/icon.png',
    power: 40,
  },
  status: 'success',
};

export const Basic: Story = {
  args: {
    battle: sampleBattle,
  },
};

export const WithLabel: Story = {
  args: {
    battle: sampleBattle,
    showLabel: true,
  },
};
