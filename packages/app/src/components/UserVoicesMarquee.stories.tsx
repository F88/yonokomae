import type { Meta, StoryObj } from '@storybook/react-vite';
import UserVoicesMarquee from './UserVoicesMarquee';

const meta: Meta<typeof UserVoicesMarquee> = {
  title: 'Components/UserVoicesMarquee',
  component: UserVoicesMarquee,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof UserVoicesMarquee>;

export const Default: Story = {
  args: {
    speed: 40,
    pauseOnHover: true,
  },
};

export const WithFade: Story = {
  args: {
    speed: 30,
    fadeWidth: 'w-16',
  },
};
