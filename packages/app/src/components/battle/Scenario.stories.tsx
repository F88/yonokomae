import type { Meta, StoryObj } from '@storybook/react-vite';
import { Scenario } from './Scenario';
import type { Battle } from '@yonokomae/types';

const meta: Meta<typeof Scenario> = {
  title: 'Battle/Scenario',
  component: Scenario,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Scenario>;

const sampleBattle: Battle = {
  id: 'battle_story_sample_003',
  themeId: 'information',
  significance: 'low',
  title: 'Scenario Sample Title',
  subtitle: 'Scenario subtitle',
  narrative: {
    overview: 'Short overview for context.',
    scenario:
      'Stakeholders present different paths forward with practical tradeoffs.',
  },
  komae: {
    title: 'Komae Item',
    subtitle: 'Komae subtitle',
    description: 'Komae description',
    imageUrl: '/icon.png',
    power: 20,
  },
  yono: {
    title: 'Yono Item',
    subtitle: 'Yono subtitle',
    description: 'Yono description',
    imageUrl: '/icon.png',
    power: 22,
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

export const Empty: Story = {
  args: {
    battle: {
      ...sampleBattle,
      narrative: { ...sampleBattle.narrative, scenario: '' },
    },
    showLabel: true,
  },
};
