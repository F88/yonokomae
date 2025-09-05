import type { Meta, StoryObj } from '@storybook/react-vite';
import { TheStartOfTheWar } from './TheStartOfTheWar';

const meta: Meta<typeof TheStartOfTheWar> = {
  title: 'Components/TheStartOfTheWar',
  component: TheStartOfTheWar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TheStartOfTheWar>;

export const Default: Story = {};
