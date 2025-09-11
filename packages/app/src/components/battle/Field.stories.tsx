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

export const LongContent: Story = {
  args: {
    yono: {
      ...yono,
      title: 'YONO with a Very Long Title That Might Wrap',
      subtitle: 'A Subtitle That Is Also Quite Lengthy and Descriptive',
      description:
        'YONO represents the swift and agile approach, striking from unexpected angles with precision and speed. This strategy emphasizes flexibility and adaptability in the face of changing circumstances, allowing for quick adjustments and maneuvers to outpace the opponent effectively.',
    },
    komae: {
      ...komae,
      title: 'KOMAE with an Equally Long Title That Could Also Wrap',
      subtitle: 'A Subtitle That Matches in Length and Detail',
      description:
        "KOMAE embodies the steadfast and resilient approach, enduring the storm with unwavering determination. This strategy focuses on building a solid foundation, weathering challenges, and countering decisively when the moment is right. KOMAE's strength lies in its ability to maintain composure      and respond effectively to the opponent's moves.",
      power: 1_000_000,
    },
  },
};

// netaCardBackground variations

export const CardBg_Combined: Story = {
  name: 'netaCardBackground: image + opacity + blur',
  args: {
    yono,
    komae,
    netaCardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
      opacityClass: 'opacity-50',
      backdropBlur: true,
    },
  },
};

export const CardBg_Transparent: Story = {
  name: 'netaCardBackground (transparent only)',
  args: {
    yono,
    komae,
    netaCardBackground: {},
  },
};

export const CardBg_Image: Story = {
  name: 'netaCardBackground.imageUrl = /icon.png',
  args: {
    yono,
    komae,
    netaCardBackground: {
      imageUrl: '/showdown-on-the-great-river.png',
    },
  },
};

export const CardBg_Opacity20: Story = {
  name: 'netaCardBackground.opacity = 0.2',
  args: {
    yono,
    komae,
    netaCardBackground: {
      opacityClass: 'opacity-20',
    },
  },
};

export const CardBg_Opacity70: Story = {
  name: 'netaCardBackground.opacity = 0.7',
  args: {
    yono,
    komae,
    netaCardBackground: {
      opacityClass: 'opacity-70',
    },
  },
};

export const CardBg_BackdropBlur: Story = {
  name: 'netaCardBackground.backdropBlur = true',
  args: {
    yono,
    komae,
    netaCardBackground: {
      backdropBlur: true,
    },
  },
};
