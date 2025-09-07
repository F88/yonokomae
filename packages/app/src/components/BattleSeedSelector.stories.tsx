import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BattleSeedSelector } from './BattleSeedSelector';

const meta: Meta<typeof BattleSeedSelector> = {
  title: 'Dev/BattleSeedSelector',
  component: BattleSeedSelector,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof BattleSeedSelector>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return <BattleSeedSelector value={value} onChange={setValue} show={true} />;
  },
};

export const WithInitialFilter: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState('');
    return (
      <BattleSeedSelector
        value={value}
        onChange={setValue}
        show={true}
        searchText={search}
        onSearchTextChange={setSearch}
      />
    );
  },
};

export const ControlledThemeFilter: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    const [theme, setTheme] = useState<string | undefined>('history');
    return (
      <BattleSeedSelector
        value={value}
        onChange={setValue}
        show={true}
        themeIdFilter={theme}
        onThemeIdFilterChange={setTheme}
      />
    );
  },
};

export const DisabledFilters: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <BattleSeedSelector
        value={value}
        onChange={setValue}
        show={true}
        enableFilters={false}
      />
    );
  },
};
