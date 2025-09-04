import type { Meta, StoryObj } from '@storybook/react-vite';
import { HistoricalScene } from './HistoricalScene';
import type { Battle } from '@yonokomae/types';

function makeSampleBattle(overrides?: Partial<Battle>): Battle {
  return {
    id: 'scene-001',
    themeId: 'history',
    significance: 'low',
    title: 'Bridge Skirmish',
    subtitle: 'Clash at dawn',
    narrative: {
      overview: 'A brief encounter escalates into a tactical exchange.',
      scenario:
        'Both sides contest a narrow crossing, leveraging terrain and timing.',
    },
    yono: {
      imageUrl: '/YONO-SYMBOL.png',
      title: 'YONO',
      subtitle: 'Lightning Step',
      description: 'Quick strikes from unexpected angles.',
      power: 76,
    },
    komae: {
      imageUrl: '/KOMAE-SYMBOL.png',
      title: 'KOMAE',
      subtitle: 'Stone Wall',
      description: 'Endures the storm and counters decisively.',
      power: 79,
    },
    provenance: [{ label: 'Skirmish Notes' }],
    status: 'success',
    ...overrides,
  } satisfies Battle;
}

const meta: Meta<typeof HistoricalScene> = {
  title: 'Battle/HistoricalScene',
  component: HistoricalScene,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof HistoricalScene>;

export const Default: Story = {
  args: {
    battle: makeSampleBattle(),
  },
};

export const CroppedBanner: Story = {
  args: {
    battle: makeSampleBattle(),
    cropTopBanner: true,
    cropAspectRatio: '32/9',
    cropFocusY: 'y-50',
  },
};
