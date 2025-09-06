import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserVoicesCarousel } from './UserVoicesCarousel';

const meta: Meta<typeof UserVoicesCarousel> = {
  title: 'Components/UserVoicesCarousel',
  component: UserVoicesCarousel,
  // tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof UserVoicesCarousel>;

export const Default: Story = {
  args: {
    slidesToShow: 3,
    intervalMs: 2500,
    showControls: true,
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    containerHeight: '300px',
    slidesToShow: 1,
  },
};
