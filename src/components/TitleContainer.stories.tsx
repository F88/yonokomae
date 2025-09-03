import type { Meta, StoryObj } from '@storybook/react-vite';
import { TitleContainer } from './TitleContainer';
import type { PlayMode } from '@/yk/play-mode';

const meta: Meta<typeof TitleContainer> = {
  title: 'Components/TitleContainer',
  component: TitleContainer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TitleContainer>;

const modes: PlayMode[] = [
  {
    id: 'demo-en',
    title: 'Demo EN',
    description: 'English demo',
    enabled: true,
  },
  {
    id: 'demo-de',
    title: 'Demo DE',
    description: 'Deutsch demo',
    enabled: true,
  },
  {
    id: 'historical-research',
    title: 'Historical Research',
    description: 'Evidence-based mode',
    enabled: true,
  },
];

export const Default: Story = {
  args: {
    modes,
    onSelect: (m) => console.log('select', m.id),
  },
};
