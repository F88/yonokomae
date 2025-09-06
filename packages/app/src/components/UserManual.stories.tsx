import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserManual } from './UserManual';

const meta: Meta<typeof UserManual> = {
  title: 'Components/UserManual',
  component: UserManual,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof UserManual>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('onClose'),
  },
};

export const WithCustomHeight: Story = {
  args: {
    isOpen: true,
    modalHeight: '60vh',
    onClose: () => console.log('onClose'),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
  },
};
