import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Header>;

export const NoMode: Story = {
  args: {
    mode: undefined,
  },
};

export const WithMode: Story = {
  args: {
    mode: {
      id: 'demo-en',
      title: 'Demo EN',
      description: 'English demo',
      enabled: true,
      srLabel: 'English demo mode',
    },
  },
};
