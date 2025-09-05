import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeChip } from './ThemeChip';

const meta: Meta<typeof ThemeChip> = {
  title: 'ThemeChip',
  component: ThemeChip,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ThemeChip>;

export const History: Story = {
  args: {
    themeId: 'history',
  },
};

export const TechnologyOutline: Story = {
  args: {
    themeId: 'technology',
    variant: 'outline',
  },
};

export const FinanceNoName: Story = {
  args: {
    themeId: 'finance',
    showName: false,
  },
};
