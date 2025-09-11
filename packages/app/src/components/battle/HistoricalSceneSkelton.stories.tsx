import type { HistoricalSceneBackground } from '@/lib/build-historical-scene-background';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HistoricalSceneSkelton } from './HistoricalSceneSkelton';

const meta: Meta<typeof HistoricalSceneSkelton> = {
  title: 'Battle/HistoricalSceneSkelton',
  component: HistoricalSceneSkelton,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof HistoricalSceneSkelton>;

export const DefaultBusy: Story = {
  args: {
    isBusy: true,
  },
};

export const BannerDefault: Story = {
  args: {
    isBusy: true,
    cropTopBanner: true,
  },
};

export const BannerTall: Story = {
  args: {
    isBusy: true,
    cropTopBanner: true,
    cropAspectRatio: '32/5',
  },
};

export const FocusTop: Story = {
  args: {
    isBusy: true,
    cropTopBanner: true,
    cropFocusY: 'y-10',
  },
};

export const FocusBottom: Story = {
  args: {
    isBusy: true,
    cropTopBanner: true,
    cropFocusY: 'y-90',
  },
};

const demoBg: HistoricalSceneBackground = {
  hasImage: true,
  sceneBgUrl: '/showdown-on-the-great-river.png',
  opacityClass: 'opacity-30',
  blur: true,
  netaCardBackground: {
    // imageUrl: '/showdown-on-the-great-river.png',
    imageUrl: undefined,
    opacity: 0.4,
    backdropBlur: true,
  },
};

export const WithBackground: Story = {
  name: 'with background (scene + card)',
  args: {
    isBusy: true,
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    background: demoBg,
  },
};
