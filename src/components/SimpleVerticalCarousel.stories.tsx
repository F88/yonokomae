import type { Meta, StoryObj } from '@storybook/react-vite';
import { SimpleVerticalCarousel } from './SimpleVerticalCarousel';

const meta: Meta<typeof SimpleVerticalCarousel> = {
  title: 'Components/SimpleVerticalCarousel',
  component: SimpleVerticalCarousel,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SimpleVerticalCarousel>;

export const Default: Story = {
  args: {
    height: '120px',
  },
};

export const Shuffled: Story = {
  args: {
    height: '160px',
    shuffle: true,
  },
};
