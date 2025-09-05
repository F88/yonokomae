import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetaView } from './Neta';
import { faker } from '@faker-js/faker';

const meta: Meta<typeof NetaView> = {
  title: 'Battle/NetaView',
  component: NetaView,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof NetaView>;

const baseArgs = {
  imageUrl: '/YONO-SYMBOL.png',
  title: 'Sample Neta',
  subtitle: 'Exhibit A',
  description:
    'A demonstration card showcasing the visual layout and power badge.',
  power: 70,
};

export const Default: Story = {
  args: {
    ...baseArgs,
  },
};

export const LongContent: Story = {
  args: {
    ...baseArgs,
    title: 'Sample Neta with a Very Long Title That Might Wrap',
    subtitle:
      'Exhibit A with a Surprisingly Lengthy Subtitle. Indeed, Quite longer than Usual',
    description: faker.lorem.paragraphs(5, '\n\n'),
    power: 1_234_567_890,
  },
};

export const FullHeight: Story = {
  args: {
    ...baseArgs,
    fullHeight: true,
  },
};

// Center-focused variants
export const CroppedBannerCenter: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    cropFocusY: 'center',
  },
};

export const Cropped16x7Center: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '16/7',
    cropFocusY: 'center',
  },
};

export const Cropped16x9Center: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '16/9',
    cropFocusY: 'center',
  },
};

export const Cropped16x5Center: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '16/5',
    cropFocusY: 'center',
  },
};

export const CroppedSquareCenter: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '16/16',
    cropFocusY: 'center',
  },
};

export const Cropped32x7Center: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/7',
    cropFocusY: 'center',
  },
};

export const Cropped32x5Center: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/5',
    cropFocusY: 'center',
  },
};

export const Cropped32x12Center: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/12',
    cropFocusY: 'center',
  },
};

export const Cropped32x16Center: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/16',
    cropFocusY: 'center',
  },
};

// Top-focused (single)
export const Cropped16x7Top: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '16/7',
    cropFocusY: 'top',
  },
};

// Bottom-focused (single)
export const Cropped16x7Bottom: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '16/7',
    cropFocusY: 'bottom',
  },
};

// Numeric y-* focused (ascending)
export const CroppedFocusY20: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    cropFocusY: 'y-20',
  },
};

export const CroppedBannerLower: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/7',
    cropFocusY: 'y-70',
  },
};

export const CroppedFocusY80: Story = {
  args: {
    ...baseArgs,
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    cropFocusY: 'y-80',
  },
};
