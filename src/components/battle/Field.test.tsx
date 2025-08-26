import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Field } from './Field';
import type { Neta } from '@/types/types';

const neta = (overrides: Partial<Neta> = {}): Neta => ({
  imageUrl: 'http://example.com/img.png',
  title: 'Sample Neta',
  subtitle: 'Sub',
  description: 'Desc',
  power: 42,
  ...overrides,
});

describe('Field', () => {
  it('renders placeholders when yono and komae are missing', () => {
    render(<Field />);
    // both slots rendered
    const yonoSlot = screen.getByTestId('slot-yono');
    const komaeSlot = screen.getByTestId('slot-komae');

    // placeholders visible in both
    expect(within(yonoSlot).getByTestId('placeholder')).toBeInTheDocument();
    expect(within(komaeSlot).getByTestId('placeholder')).toBeInTheDocument();

    // no images should be present
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('renders NetaView for provided yono and komae', () => {
    render(
      <Field
        yono={neta({ title: 'Yono X', power: 7 })}
        komae={neta({ title: 'Komae Y', power: 9 })}
      />,
    );

    // Images and headings present
    expect(screen.getByRole('img', { name: 'Yono X' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Komae Y' })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Yono X' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Komae Y' }),
    ).toBeInTheDocument();

    // Power badge text from NetaView
    expect(screen.getByText('Power: 7')).toBeInTheDocument();
    expect(screen.getByText('Power: 9')).toBeInTheDocument();

    // Exactly 2 images
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('renders mixed: placeholder for missing side', () => {
    render(<Field yono={neta({ title: 'Only Yono', power: 3 })} />);

    // Yono slot has content, komae slot has placeholder
    const yonoSlot = screen.getByTestId('slot-yono');
    const komaeSlot = screen.getByTestId('slot-komae');

    expect(
      within(yonoSlot).getByRole('img', { name: 'Only Yono' }),
    ).toBeInTheDocument();
    expect(within(komaeSlot).getByTestId('placeholder')).toBeInTheDocument();

    // Only one image present overall
    expect(screen.getAllByRole('img')).toHaveLength(1);

    // Power text for provided side only
    expect(screen.getByText('Power: 3')).toBeInTheDocument();
  });
});
