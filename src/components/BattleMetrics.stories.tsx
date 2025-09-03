import type { Meta, StoryObj } from '@storybook/react-vite';
import { BattleMetrics } from './BattleMetrics';

const meta: Meta<typeof BattleMetrics> = {
  title: 'Components/BattleMetrics',
  component: BattleMetrics,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BattleMetrics>;

export const Default: Story = {
  args: {
    metrics: {
      totalReports: 5,
      generatingCount: 1,
      generationSuccessCount: 3,
      generationErrorCount: 1,
    },
  },
};
