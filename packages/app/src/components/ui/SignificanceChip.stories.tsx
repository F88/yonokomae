import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignificanceChip } from './SignificanceChip';

const meta: Meta<typeof SignificanceChip> = {
  title: 'Battle/SignificanceChip',
  component: SignificanceChip,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SignificanceChip>;

export const Low: Story = {
  args: { significance: 'low' },
};

export const Medium: Story = {
  args: { significance: 'medium' },
};

export const High: Story = {
  args: { significance: 'high' },
};

export const LegendaryWithLabel: Story = {
  args: { significance: 'legendary', showLabel: true },
};
