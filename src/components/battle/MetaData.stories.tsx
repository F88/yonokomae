import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetaData } from './MetaData';
import type { Battle } from '@yonokomae/types';

const meta: Meta<typeof MetaData> = {
  title: 'Battle/MetaData',
  component: MetaData,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MetaData>;

const sampleBattle: Battle = {
  id: 'battle_story_sample_002',
  themeId: 'culture',
  significance: 'high',
  title: 'Another Sample Title',
  subtitle: 'Another subtitle',
  narrative: {
    overview: 'Short overview text for demonstration.',
    scenario: 'Short scenario text.',
  },
  komae: {
    title: 'Komae Item',
    subtitle: 'Komae subtitle',
    description: 'Komae description',
    imageUrl: '/icon.png',
    power: 30,
  },
  yono: {
    title: 'Yono Item',
    subtitle: 'Yono subtitle',
    description: 'Yono description',
    imageUrl: '/icon.png',
    power: 28,
  },
  status: 'success',
};

export const Basic: Story = {
  args: {
    battle: sampleBattle,
  },
};

export const Compact: Story = {
  args: {
    battle: sampleBattle,
    compact: true,
  },
};
