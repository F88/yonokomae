import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// Static list of design token names (suffix of the CSS variable without leading --)
const TOKEN_NAMES = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
];

function collectPalette() {
  if (typeof window === 'undefined')
    return [] as Array<{ token: string; value: string }>;
  const styles = getComputedStyle(document.documentElement);
  return TOKEN_NAMES.map((n) => {
    const token = `--${n}`;
    const value = styles.getPropertyValue(token).trim();
    return { token, value };
  }).filter((p) => p.value.length > 0);
}

const Swatch: React.FC<{ token: string; value: string }> = ({
  token,
  value,
}) => (
  <div
    className="flex items-center gap-3 w-full rounded-lg border bg-card px-3 py-2"
    data-token={token}
  >
    <div
      className="w-12 h-8 rounded-md ring-1 ring-black/10 dark:ring-white/10"
      aria-label={token}
      data-swatch={token}
    />
    <code className="text-[11px] leading-none">{token}</code>
    <span className="text-[10px] opacity-70">{value}</span>
  </div>
);

const PaletteViewer: React.FC = () => {
  const [palette, setPalette] = React.useState<
    Array<{ token: string; value: string }>
  >([]);
  React.useEffect(() => {
    setPalette(collectPalette());
  }, []);

  return (
    <div className="grid gap-2 max-w-[520px]">
      {/* Generate explicit attribute selector rules because attr() + var() isn't widely supported for color values */}
      <style>
        {TOKEN_NAMES.map(
          (n) => `[data-swatch="--${n}"]{background:var(--${n});}`,
        ).join('')}
      </style>
      {palette.map((p) => (
        <Swatch key={p.token} token={p.token} value={p.value} />
      ))}
      {palette.length === 0 && (
        <span className="text-[12px]">
          No tokens found (are global styles imported?).
        </span>
      )}
    </div>
  );
};

const meta: Meta<typeof PaletteViewer> = {
  title: 'Foundation/Color Palette',
  component: PaletteViewer,
  parameters: {
    docs: {
      description: {
        component:
          'Lists design token CSS variables (by prefix) and shows a live swatch. Edit TOKEN_PREFIXES in the story to expand.',
      },
    },
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj<typeof PaletteViewer> = {
  render: () => <PaletteViewer />,
};
