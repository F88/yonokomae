import { faker } from '@faker-js/faker';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetaCard } from './NetaCard';
import './NetaCard.stories.css';

const meta: Meta<typeof NetaCard> = {
  title: 'Battle/NetaCard',
  component: NetaCard,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof NetaCard>;

const baseArgs = {
  title: 'Sample Neta',
  subtitle: 'Exhibit A',
  description:
    'A demonstration card showcasing the visual layout and power badge.',
  power: 70,
  cardImage: { imageUrl: '/YONO-SYMBOL.png' },
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

// Background image inside the card (cardBackground)
export const WithBackgroundWithHeaderImage: Story = {
  args: {
    ...baseArgs,
    // Keep header image and show cardBackground together
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      // uses default opacity (0.3)
    },
  },
};

export const WithBackgroundWithNoHeaderImage: Story = {
  args: {
    ...baseArgs,
    // Hide top image to focus on cardBackground
    cardImage: undefined,
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      // uses default opacity (0.3)
    },
  },
};

export const BackgroundOpacity10: Story = {
  args: {
    ...baseArgs,
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      opacityClass: 'opacity-10',
    },
  },
};

export const BackgroundOpacity80: Story = {
  args: {
    ...baseArgs,
    cardImage: undefined,
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      opacityClass: 'opacity-80',
    },
  },
};

export const BackgroundWithBlur: Story = {
  args: {
    ...baseArgs,
    cardImage: undefined,
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      opacityClass: 'opacity-40',
      backdropBlur: true,
    },
  },
};

// Transparent card over a parent background (no image inside the card)
export const TransparentOverParent: Story = {
  args: {
    ...baseArgs,
    cardImage: undefined,
    cardBackground: {},
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="story-frame story-bg-gradient">
        <Story />
      </div>
    ),
  ],
};

export const TransparentOverParentWithBlur: Story = {
  args: {
    ...baseArgs,
    cardImage: undefined,
    cardBackground: {
      backdropBlur: true,
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="story-frame story-bg-composite">
        <Story />
      </div>
    ),
  ],
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
