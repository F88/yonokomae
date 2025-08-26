import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoricalSeedProvider } from './seed-system/historical-seed-provider';
import { useHistoricalSeedSelection } from './seed-system/use-historical-seed-selection';
import { historicalSeeds } from './seed-system/historical-seeds';

function SeedConsumer() {
  const sel = useHistoricalSeedSelection();
  if (!sel) return null;
  return (
    <div>
      <div data-testid="seed-file">{sel.seedFile ?? ''}</div>
      <button onClick={() => sel.rotateSeed()}>rotate</button>
      <button onClick={() => sel.setSeedFile(historicalSeeds[0]?.file)}>
        set-first
      </button>
      <button onClick={() => sel.setSeedFile(undefined)}>clear</button>
    </div>
  );
}

describe('HistoricalSeedProvider rotation', () => {
  it('rotates through historicalSeeds in order', async () => {
    const user = userEvent.setup();
    render(
      <HistoricalSeedProvider>
        <SeedConsumer />
      </HistoricalSeedProvider>,
    );

    const out = () => screen.getByTestId('seed-file');

    // Initial: empty (auto)
    expect(out().textContent).toBe('');

    // First rotate -> first seed
    await user.click(screen.getByText('rotate'));
    expect(out().textContent).toBe(historicalSeeds[0]?.file);

    // Second rotate -> second seed (wraps if only one)
    await user.click(screen.getByText('rotate'));
    const expected =
      historicalSeeds.length > 1
        ? historicalSeeds[1]?.file
        : historicalSeeds[0]?.file;
    expect(out().textContent).toBe(expected);

    // set-first then rotate -> second (or same if single)
    await user.click(screen.getByText('set-first'));
    await user.click(screen.getByText('rotate'));
    const afterSetRotate =
      historicalSeeds.length > 1
        ? historicalSeeds[1]?.file
        : historicalSeeds[0]?.file;
    expect(out().textContent).toBe(afterSetRotate);

    // clear then rotate -> first
    await user.click(screen.getByText('clear'));
    await user.click(screen.getByText('rotate'));
    expect(out().textContent).toBe(historicalSeeds[0]?.file);
  });
});
