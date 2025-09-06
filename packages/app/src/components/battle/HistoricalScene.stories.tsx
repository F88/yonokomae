import type { Meta, StoryObj } from '@storybook/react-vite';
import { faker } from '@faker-js/faker';
import { HistoricalScene } from './HistoricalScene';
import type { Battle } from '@yonokomae/types';

const meta: Meta<typeof HistoricalScene> = {
  title: 'Battle/HistoricalScene',
  component: HistoricalScene,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof HistoricalScene>;

const baseBattle: Battle = {
  id: 'battle_story_integrated_001',
  themeId: 'history',
  significance: 'medium',
  title: 'Historic Crossroads',
  subtitle: 'Identity vs Development',
  narrative: {
    overview:
      'A pivotal moment where local identity and future development intersect.',
    scenario:
      'Stakeholders debate how to balance preservation with modernization, seeking a pragmatic path forward.',
  },
  komae: {
    title: 'Komae Hall',
    subtitle: 'Civic pride',
    description: 'Symbol of community cohesion and continuity.',
    imageUrl: '/icon.png',
    power: 42,
  },
  yono: {
    title: 'Yono Hub',
    subtitle: 'Forward vision',
    description: 'Catalyst for innovation and sustainable growth.',
    imageUrl: '/icon.png',
    power: 40,
  },
  status: 'success',
};

export const Basic: Story = {
  args: {
    battle: baseBattle,
  },
};

export const SkeletonState: Story = {
  name: 'Skeleton (battle = null)',
  args: {
    battle: null,
    isLoading: true,
  },
};

export const LongContent: Story = {
  args: {
    battle: {
      ...baseBattle,
      title: faker.lorem.words(4),
      subtitle: faker.lorem.words(10),
      narrative: {
        ...baseBattle.narrative,
        overview: faker.lorem.paragraphs(1, '\n\n'),
        // 'A long and detailed overview of the battle, providing extensive context and background information.',
        scenario: faker.lorem.paragraphs(3, '\n\n'),
        // 'A complex scenario with multiple stakeholders and conflicting interests, requiring careful negotiation and compromise.',
      },
      yono: {
        ...baseBattle.yono,
        title: faker.lorem.words(4),
        subtitle: faker.lorem.words(6),
        description: faker.lorem.paragraphs(2, '\n\n'),
        // 'An extended description of Yono\'s role and significance in the battle, emphasizing its vision and aspirations.',
      },
      komae: {
        ...baseBattle.komae,
      },
    },
  },
};

export const CroppedBanner: Story = {
  args: {
    battle: baseBattle,
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    cropFocusY: 'y-50',
  },
};

export const FocusTop: Story = {
  args: {
    battle: baseBattle,
    cropTopBanner: true,
    cropAspectRatio: '32/6',
    cropFocusY: 'top',
  },
};

export const WithProvenance: Story = {
  args: {
    battle: {
      ...baseBattle,
      id: 'battle_story_integrated_002',
      provenance: [
        {
          label: 'City Archives — Planning Report (2024)',
          url: 'https://example.com/report',
          note: 'Context for development constraints',
        },
        { label: 'Local History Chronicle Vol.12' },
      ],
    },
  },
};

export const ShowMetaDataOn: Story = {
  name: 'showMetaData = true',
  args: {
    battle: { ...baseBattle, id: 'battle_story_integrated_meta_on' },
    showMetaData: true,
  },
};

export const ShowMetaDataOff: Story = {
  name: 'showMetaData = false',
  args: {
    battle: { ...baseBattle, id: 'battle_story_integrated_meta_off' },
    showMetaData: false,
  },
};

export const SignificanceLow: Story = {
  name: 'significance = low',
  args: {
    battle: {
      ...baseBattle,
      id: 'battle_story_significance_low',
      significance: 'low',
    },
  },
};

export const SignificanceMedium: Story = {
  name: 'significance = medium',
  args: {
    battle: {
      ...baseBattle,
      id: 'battle_story_significance_medium',
      significance: 'medium',
    },
  },
};

export const SignificanceHigh: Story = {
  name: 'significance = high',
  args: {
    battle: {
      ...baseBattle,
      id: 'battle_story_significance_high',
      significance: 'high',
    },
  },
};

export const SignificanceLegendary: Story = {
  name: 'significance = legendary',
  args: {
    battle: {
      ...baseBattle,
      id: 'battle_story_significance_legendary',
      significance: 'legendary',
    },
  },
};
