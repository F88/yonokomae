import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { useHistoricalSeedSelection } from './use-seed-selection';
import { Ctx, type HistoricalSeedSelection } from './seed-context';

// Test component to use the hook
function TestComponent() {
  const seedSelection = useHistoricalSeedSelection();

  if (!seedSelection) {
    return <div>No seed selection available</div>;
  }

  return (
    <div>
      <div data-testid="current-seed">
        {seedSelection.seedFile || 'undefined'}
      </div>
      <button
        onClick={() => seedSelection.setSeedFile('test-seed.json')}
        data-testid="set-seed-button"
      >
        Set Seed
      </button>
      <button
        onClick={() => seedSelection.rotateSeed()}
        data-testid="rotate-seed-button"
      >
        Rotate Seed
      </button>
      <button
        onClick={() => seedSelection.setSeedFile(undefined)}
        data-testid="clear-seed-button"
      >
        Clear Seed
      </button>
    </div>
  );
}

describe('useHistoricalSeedSelection', () => {
  it('returns null when used outside of provider', () => {
    render(<TestComponent />);

    expect(screen.getByText('No seed selection available')).toBeInTheDocument();
  });

  it('returns seed selection when used inside provider', () => {
    const mockSeedSelection: HistoricalSeedSelection = {
      seedFile: 'current-seed.json',
      setSeedFile: vi.fn(),
      rotateSeed: vi.fn(),
    };

    render(
      <Ctx.Provider value={mockSeedSelection}>
        <TestComponent />
      </Ctx.Provider>,
    );

    expect(screen.getByTestId('current-seed')).toHaveTextContent(
      'current-seed.json',
    );
    expect(screen.getByTestId('set-seed-button')).toBeInTheDocument();
    expect(screen.getByTestId('rotate-seed-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-seed-button')).toBeInTheDocument();
  });

  it('displays undefined when seedFile is undefined', () => {
    const mockSeedSelection: HistoricalSeedSelection = {
      seedFile: undefined,
      setSeedFile: vi.fn(),
      rotateSeed: vi.fn(),
    };

    render(
      <Ctx.Provider value={mockSeedSelection}>
        <TestComponent />
      </Ctx.Provider>,
    );

    expect(screen.getByTestId('current-seed')).toHaveTextContent('undefined');
  });

  it('provides access to setSeedFile function', () => {
    const mockSetSeedFile = vi.fn();
    const mockSeedSelection: HistoricalSeedSelection = {
      seedFile: undefined,
      setSeedFile: mockSetSeedFile,
      rotateSeed: vi.fn(),
    };

    render(
      <Ctx.Provider value={mockSeedSelection}>
        <TestComponent />
      </Ctx.Provider>,
    );

    const setButton = screen.getByTestId('set-seed-button');
    setButton.click();

    expect(mockSetSeedFile).toHaveBeenCalledWith('test-seed.json');
  });

  it('provides access to rotateSeed function', () => {
    const mockRotateSeed = vi.fn();
    const mockSeedSelection: HistoricalSeedSelection = {
      seedFile: 'current.json',
      setSeedFile: vi.fn(),
      rotateSeed: mockRotateSeed,
    };

    render(
      <Ctx.Provider value={mockSeedSelection}>
        <TestComponent />
      </Ctx.Provider>,
    );

    const rotateButton = screen.getByTestId('rotate-seed-button');
    rotateButton.click();

    expect(mockRotateSeed).toHaveBeenCalled();
  });

  it('allows clearing seed file (setting to undefined)', () => {
    const mockSetSeedFile = vi.fn();
    const mockSeedSelection: HistoricalSeedSelection = {
      seedFile: 'some-seed.json',
      setSeedFile: mockSetSeedFile,
      rotateSeed: vi.fn(),
    };

    render(
      <Ctx.Provider value={mockSeedSelection}>
        <TestComponent />
      </Ctx.Provider>,
    );

    const clearButton = screen.getByTestId('clear-seed-button');
    clearButton.click();

    expect(mockSetSeedFile).toHaveBeenCalledWith(undefined);
  });

  describe('hook behavior with different context values', () => {
    it('handles null context value', () => {
      render(
        <Ctx.Provider value={null}>
          <TestComponent />
        </Ctx.Provider>,
      );

      expect(
        screen.getByText('No seed selection available'),
      ).toBeInTheDocument();
    });

    it('properly subscribes to context updates', () => {
      let mockSeedSelection: HistoricalSeedSelection = {
        seedFile: 'initial-seed.json',
        setSeedFile: vi.fn(),
        rotateSeed: vi.fn(),
      };

      const { rerender } = render(
        <Ctx.Provider value={mockSeedSelection}>
          <TestComponent />
        </Ctx.Provider>,
      );

      expect(screen.getByTestId('current-seed')).toHaveTextContent(
        'initial-seed.json',
      );

      // Update context value
      mockSeedSelection = {
        seedFile: 'updated-seed.json',
        setSeedFile: vi.fn(),
        rotateSeed: vi.fn(),
      };

      rerender(
        <Ctx.Provider value={mockSeedSelection}>
          <TestComponent />
        </Ctx.Provider>,
      );

      expect(screen.getByTestId('current-seed')).toHaveTextContent(
        'updated-seed.json',
      );
    });
  });

  describe('component integration patterns', () => {
    it('supports conditional rendering based on hook return value', () => {
      function ConditionalComponent() {
        const seedSelection = useHistoricalSeedSelection();

        return (
          <div>
            {seedSelection ? (
              <div data-testid="with-seeds">Seed system available</div>
            ) : (
              <div data-testid="without-seeds">Seed system not available</div>
            )}
          </div>
        );
      }

      // Without provider
      const { rerender } = render(<ConditionalComponent />);
      expect(screen.getByTestId('without-seeds')).toBeInTheDocument();

      // With provider
      const mockSeedSelection: HistoricalSeedSelection = {
        seedFile: undefined,
        setSeedFile: vi.fn(),
        rotateSeed: vi.fn(),
      };

      rerender(
        <Ctx.Provider value={mockSeedSelection}>
          <ConditionalComponent />
        </Ctx.Provider>,
      );

      expect(screen.getByTestId('with-seeds')).toBeInTheDocument();
    });

    it('supports optional chaining for graceful degradation', () => {
      function OptionalComponent() {
        const seedSelection = useHistoricalSeedSelection();

        return (
          <div>
            <div data-testid="seed-file">
              {seedSelection?.seedFile || 'No seed'}
            </div>
            <button
              onClick={() => seedSelection?.setSeedFile('optional.json')}
              disabled={!seedSelection}
              data-testid="optional-button"
            >
              Set Optional Seed
            </button>
          </div>
        );
      }

      render(<OptionalComponent />);

      expect(screen.getByTestId('seed-file')).toHaveTextContent('No seed');
      expect(screen.getByTestId('optional-button')).toBeDisabled();
    });
  });
});
