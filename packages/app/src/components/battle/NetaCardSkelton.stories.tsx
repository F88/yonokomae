import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetaCardSkelton } from './NetaCardSkelton';
import './NetaCard.stories.css';

const meta: Meta<typeof NetaCardSkelton> = {
  title: 'Battle/NetaCardSkelton',
  component: NetaCardSkelton,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof NetaCardSkelton>;

export const Default: Story = {
  args: {},
};

export const BannerDefault: Story = {
  args: {
    cropTopBanner: true,
  },
};

export const Banner16x9: Story = {
  args: {
    cropTopBanner: true,
    cropAspectRatio: '16/9',
  },
};

export const Banner32x7: Story = {
  args: {
    cropTopBanner: true,
    cropAspectRatio: '32/7',
  },
};

export const FullHeight: Story = {
  args: {
    fullHeight: true,
  },
};

export const ReducedMotion: Story = {
  args: {
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    reducedMotion: true,
  },
};

export const WithBackground: Story = {
  name: 'with background (image inside the card)',
  args: {
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      // default opacity (0.3)
    },
  },
};

export const BackgroundOpacity10: Story = {
  args: {
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      opacityClass: 'opacity-10',
    },
  },
};

export const BackgroundWithBlur: Story = {
  args: {
    cropTopBanner: true,
    cropAspectRatio: '16/7',
    cardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      opacityClass: 'opacity-40',
      backdropBlur: true,
    },
  },
};

export const TransparentOverParent: Story = {
  args: {
    // transparent card over a parent background
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
