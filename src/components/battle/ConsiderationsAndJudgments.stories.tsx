import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConsiderationsAndJudgments } from './ConsiderationsAndJudgments';
import type { Battle } from '@yonokomae/types';
import { playMode } from '@/yk/play-mode';

const mode = playMode.find((m) => m.id === 'demo-en') ?? playMode[0];

const battle: Battle = {
  id: 'cj-001',
  title: 'Verdict Board',
  subtitle: 'Panel of judges',
  overview: 'Comments and verdicts from a randomized panel.',
  scenario: 'Panel composition changes per render.',
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
  status: 'success',
};

const meta: Meta<typeof ConsiderationsAndJudgments> = {
  title: 'Battle/ConsiderationsAndJudgments',
  component: ConsiderationsAndJudgments,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof ConsiderationsAndJudgments>;

export const Default: Story = {
  args: {
    battle,
    mode,
  },
};

export const LoadingSkeleton: Story = {
  args: {
    battle: { ...battle, status: 'loading' },
    mode,
  },
};
