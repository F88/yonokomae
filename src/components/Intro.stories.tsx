import type { Meta, StoryObj } from '@storybook/react-vite';
import { Intro } from './Intro';

const meta: Meta<typeof Intro> = {
  title: 'Components/Intro',
  component: Intro,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Intro>;

export const Default: Story = {};
