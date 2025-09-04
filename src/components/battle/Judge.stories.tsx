import type { Meta, StoryObj } from '@storybook/react-vite';
import { JudgeCard } from './Judge';
import type { Battle } from '@yonokomae/types';
import { playMode } from '@/yk/play-mode';

const mode = playMode.find((m) => m.id === 'demo-en') ?? playMode[0];

const battle: Battle = {
  id: 'judge-battle-1',
  title: 'Verdict Preview',
  subtitle: 'Judging outcomes',
  overview: 'Judge card shows loading, success, or error states.',
  scenario: 'Visual component; outcome depends on repository logic.',
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

const meta: Meta<typeof JudgeCard> = {
  title: 'Battle/JudgeCard',
  component: JudgeCard,
  parameters: { layout: 'centered' },
  args: {
    battle,
    mode,
  },
};
export default meta;

type Story = StoryObj<typeof JudgeCard>;

export const JudgeO: Story = {
  args: { codeNameOfJudge: 'O' },
};

export const JudgeU: Story = {
  args: { codeNameOfJudge: 'U' },
};

export const JudgeS: Story = {
  args: { codeNameOfJudge: 'S' },
};

export const JudgeC: Story = {
  args: { codeNameOfJudge: 'C' },
};

export const JudgeKK: Story = {
  args: { codeNameOfJudge: 'KK' },
};
