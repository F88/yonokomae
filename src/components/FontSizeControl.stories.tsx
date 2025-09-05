import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FontSizeControl } from './FontSizeControl';

const meta: Meta<typeof FontSizeControl> = {
  title: 'Components/FontSizeControl',
  component: FontSizeControl,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FontSizeControl>;

function WithLocalStorage({ initial }: { initial?: string | null }) {
  const prevFontRef = useRef<string>('');
  const prevSavedRef = useRef<string | null>(null);

  if (typeof window !== 'undefined') {
    // Capture current state and set up initial localStorage before first render
    if (prevFontRef.current === '') {
      prevFontRef.current = document.documentElement.style.fontSize;
      prevSavedRef.current = localStorage.getItem('userFontSize');
      if (initial === null) {
        localStorage.removeItem('userFontSize');
      } else if (initial !== undefined) {
        localStorage.setItem('userFontSize', initial);
      }
    }
  }

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        // Restore document font-size and localStorage on unmount
        document.documentElement.style.fontSize = prevFontRef.current;
        const prevSaved = prevSavedRef.current;
        if (prevSaved === null) {
          localStorage.removeItem('userFontSize');
        } else {
          localStorage.setItem('userFontSize', prevSaved);
        }
      }
    };
  }, []);

  return <FontSizeControl />;
}

export const Default: Story = {
  name: 'Default (100%)',
  render: () => <WithLocalStorage initial={null} />,
};

export const WithSaved120: Story = {
  name: 'With saved 120%',
  render: () => <WithLocalStorage initial={'120'} />,
};

export const AtMin75: Story = {
  name: 'At min 75% (saved)',
  render: () => <WithLocalStorage initial={'75'} />,
};

export const AtMax150: Story = {
  name: 'At max 150% (saved)',
  render: () => <WithLocalStorage initial={'150'} />,
};
