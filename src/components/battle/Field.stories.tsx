import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
  title: 'Battle/Field',
  component: Field,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Field>;

const yono = {
  imageUrl: '/YONO-SYMBOL.png',
  title: 'YONO',
  subtitle: 'Lightning Step',
  description: 'Quick strikes from unexpected angles.',
  power: 76,
};

const komae = {
  imageUrl: '/KOMAE-SYMBOL.png',
  title: 'KOMAE',
  subtitle: 'Stone Wall',
  description: 'Endures the storm and counters decisively.',
  power: 79,
};

export const Empty: Story = {
  args: {},
};

export const OneSideOnly: Story = {
  args: {
    yono,
  },
};

export const BothSides: Story = {
  args: {
    yono,
    komae,
  },
};

export const CroppedTopBanner: Story = {
  args: {
    yono,
    komae,
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    cropFocusY: 'y-40',
  },
};
