import type { Meta, StoryObj } from '@storybook/react-vite';
import { PublishStateChip } from './PublishStateChip';

const meta: Meta<typeof PublishStateChip> = {
  title: 'PublishStateChip',
  component: PublishStateChip,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PublishStateChip>;

export const Published: Story = {
  args: { state: 'published' },
};

export const Draft: Story = {
  args: { state: 'draft', variant: 'outline' },
};

export const ReviewNoLabel: Story = {
  args: { state: 'review', showLabel: false },
};
