import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReducedMotionModeToggle } from './ReducedMotionModeToggle';

const meta: Meta<typeof ReducedMotionModeToggle> = {
  title: 'Components/ReducedMotionModeToggle',
  component: ReducedMotionModeToggle,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ReducedMotionModeToggle>;

export const Default: Story = {};
