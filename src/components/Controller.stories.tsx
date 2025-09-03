import type { Meta, StoryObj } from '@storybook/react-vite';
import { Controller } from './Controller';

const meta: Meta<typeof Controller> = {
  title: 'Components/Controller',
  component: Controller,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Controller>;

export const Enabled: Story = {
  args: {
    onGenerateReport: () => console.log('generate'),
    onClearReports: () => console.log('clear'),
    canBattle: true,
  },
};

export const Disabled: Story = {
  args: {
    onGenerateReport: () => console.log('generate'),
    onClearReports: () => console.log('clear'),
    canBattle: false,
  },
};
