import type { Meta, StoryObj } from '@storybook/react-vite';
import { BattleFilter } from './BattleFilter';

const meta: Meta<typeof BattleFilter> = {
  title: 'Battle/BattleFilter',
  component: BattleFilter,
  args: {},
  parameters: {
    docs: {
      description: {
        component:
          'Repository-level battle filter (dev utility) narrowing generation pool by theme.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BattleFilter>;

export const Basic: Story = { args: {} };

export const PreFilteredUniverse: Story = {
  args: { themeIdsFilter: ['history', 'technology'] },
};

export const WithSelectedTheme: Story = {
  args: { selectedThemeId: 'history' },
};
