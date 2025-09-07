import type { Meta, StoryObj } from '@storybook/react-vite';
import { BattleTitleChip } from './BattleTitleChip';

const meta: Meta<typeof BattleTitleChip> = {
  title: 'Battle/BattleTitleChip',
  component: BattleTitleChip,
  args: {
    file: 'alpha.js',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Displays a battle title (from battleSeedsByFile) as a compact chip. Falls back gracefully when not found.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BattleTitleChip>;

export const Basic: Story = {};

export const Untitled: Story = {
  args: { file: 'untitled.js' },
};

export const Unknown: Story = {
  args: {
    file: 'ghost.js',
    fallbackToFileName: false,
    notFoundLabel: 'Missing',
  },
};

export const NoTruncate: Story = {
  args: { file: 'alpha.js', truncate: false },
};

export const WithThemeIcon: Story = {
  args: { file: 'alpha.js', showThemeIcon: true },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the associated theme icon before the title when showThemeIcon is true.',
      },
    },
  },
};
