import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Controller } from './Controller';
import * as DomUtils from '@/lib/dom-utils';

// Mock the dependencies
vi.mock('@/lib/dom-utils', () => ({
  isEditable: vi.fn(),
}));

vi.mock('@/components/KeyChip', () => ({
  KeyChip: ({ label }: { label: string }) => (
    <span data-testid={`key-chip-${label}`}>{label}</span>
  ),
}));

describe('Controller', () => {
  const mockOnGenerateReport = vi.fn();
  const mockOnClearReports = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(DomUtils.isEditable).mockReturnValue(false); // Default to not editable
  });

  afterEach(() => {
    // Clean up event listeners
    vi.restoreAllMocks();
  });

  it('renders both buttons', () => {
    render(
      <Controller
        onGenerateReport={mockOnGenerateReport}
        onClearReports={mockOnClearReports}
      />,
    );

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Battle' })).toBeInTheDocument();
  });

  it('calls onClearReports when reset button is clicked', () => {
    render(
      <Controller
        onGenerateReport={mockOnGenerateReport}
        onClearReports={mockOnClearReports}
      />,
    );

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    fireEvent.click(resetButton);

    expect(mockOnClearReports).toHaveBeenCalledTimes(1);
  });

  it('calls onGenerateReport when battle button is clicked', () => {
    render(
      <Controller
        onGenerateReport={mockOnGenerateReport}
        onClearReports={mockOnClearReports}
      />,
    );

    const battleButton = screen.getByRole('button', { name: 'Battle' });
    fireEvent.click(battleButton);

    expect(mockOnGenerateReport).toHaveBeenCalledTimes(1);
  });

  it('disables battle button when canBattle is false', () => {
    render(
      <Controller
        onGenerateReport={mockOnGenerateReport}
        onClearReports={mockOnClearReports}
        canBattle={false}
      />,
    );

    const battleButton = screen.getByRole('button', { name: 'Battle' });
    expect(battleButton).toBeDisabled();
  });

  it('enables battle button when canBattle is true (default)', () => {
    render(
      <Controller
        onGenerateReport={mockOnGenerateReport}
        onClearReports={mockOnClearReports}
      />,
    );

    const battleButton = screen.getByRole('button', { name: 'Battle' });
    expect(battleButton).toBeEnabled();
  });

  it('does not call onGenerateReport when battle button is disabled and clicked', () => {
    render(
      <Controller
        onGenerateReport={mockOnGenerateReport}
        onClearReports={mockOnClearReports}
        canBattle={false}
      />,
    );

    const battleButton = screen.getByRole('button', { name: 'Battle' });
    fireEvent.click(battleButton);

    expect(mockOnGenerateReport).not.toHaveBeenCalled();
  });

  describe('keyboard shortcuts', () => {
    it('triggers battle on Enter key press', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockOnGenerateReport).toHaveBeenCalledTimes(1);
    });

    it('triggers battle on B key press', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      fireEvent.keyDown(window, { key: 'B' });

      expect(mockOnGenerateReport).toHaveBeenCalledTimes(1);
    });

    it('triggers battle on lowercase b key press', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      fireEvent.keyDown(window, { key: 'b' });

      expect(mockOnGenerateReport).toHaveBeenCalledTimes(1);
    });

    it('triggers reset on R key press', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      fireEvent.keyDown(window, { key: 'R' });

      expect(mockOnClearReports).toHaveBeenCalledTimes(1);
    });

    it('triggers reset on lowercase r key press', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      fireEvent.keyDown(window, { key: 'r' });

      expect(mockOnClearReports).toHaveBeenCalledTimes(1);
    });

    it('does not trigger battle when disabled and key pressed', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
          canBattle={false}
        />,
      );

      fireEvent.keyDown(window, { key: 'B' });

      expect(mockOnGenerateReport).not.toHaveBeenCalled();
    });

    it('does not trigger shortcuts when target is editable', () => {
      vi.mocked(DomUtils.isEditable).mockReturnValue(true);

      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      const editable = document.createElement('div');
      editable.setAttribute('contenteditable', 'true');
      document.body.appendChild(editable);

      // Dispatch the event on the editable element so it bubbles to window
      fireEvent.keyDown(editable, { key: 'B' });

      expect(DomUtils.isEditable).toHaveBeenCalledWith(editable);
      expect(mockOnGenerateReport).not.toHaveBeenCalled();

      document.body.removeChild(editable);
    });

    it('does not trigger shortcuts when modifier keys are pressed', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      fireEvent.keyDown(window, { key: 'B', metaKey: true });
      fireEvent.keyDown(window, { key: 'B', ctrlKey: true });
      fireEvent.keyDown(window, { key: 'B', altKey: true });

      expect(mockOnGenerateReport).not.toHaveBeenCalled();
    });

    it('prevents default behavior for handled keys', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      const event = new KeyboardEvent('keydown', {
        key: 'B',
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('UI elements and styling', () => {
    it('renders key chips for shortcuts', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      expect(screen.getByTestId('key-chip-R')).toBeInTheDocument();
      expect(screen.getByTestId('key-chip-B')).toBeInTheDocument();
      expect(screen.getByTestId('key-chip-Enter')).toBeInTheDocument();
    });

    it('renders navigation hint chips', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      expect(screen.getByTestId('key-chip-←')).toBeInTheDocument();
      expect(screen.getByTestId('key-chip-↑')).toBeInTheDocument();
      expect(screen.getByTestId('key-chip-K')).toBeInTheDocument();
      expect(screen.getByTestId('key-chip-J')).toBeInTheDocument();
      expect(screen.getByTestId('key-chip-↓')).toBeInTheDocument();
      expect(screen.getByTestId('key-chip-→')).toBeInTheDocument();
    });

    it('has proper button titles', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      expect(screen.getByRole('button', { name: 'Reset' })).toHaveAttribute(
        'title',
        'Reset (R)',
      );
      expect(screen.getByRole('button', { name: 'Battle' })).toHaveAttribute(
        'title',
        'Battle (Enter or B)',
      );
    });

    it('has proper ARIA attributes', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      const battleButton = screen.getByRole('button', { name: 'Battle' });
      expect(battleButton).toHaveAttribute(
        'aria-describedby',
        'kbd-battle-hint',
      );

      expect(screen.getByText('Shortcut: B, Enter')).toHaveAttribute(
        'id',
        'kbd-battle-hint',
      );
      expect(screen.getByText('Shortcut: B, Enter')).toHaveClass('sr-only');
    });

    it('has correct button variants', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      const resetButton = screen.getByRole('button', { name: 'Reset' });
      const battleButton = screen.getByRole('button', { name: 'Battle' });

      // Check that reset has destructive styling (red)
      expect(resetButton).toHaveClass('bg-destructive');

      // Check that battle has default primary styling
      expect(battleButton).toHaveClass('bg-primary');
    });
  });

  describe('responsive design', () => {
    it('hides navigation hints on small screens', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      const navigationHint = screen.getByText('Navigate').parentElement;
      expect(navigationHint).toHaveClass('hidden', 'sm:flex');
    });

    it('hides key chips on small screens', () => {
      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      const resetKeyChip = screen.getByTestId('key-chip-R').parentElement;
      expect(resetKeyChip).toHaveClass('hidden', 'sm:flex');

      const battleKeyChips = screen.getByTestId('key-chip-B').parentElement;
      expect(battleKeyChips).toHaveClass('hidden', 'sm:flex');
    });
  });

  describe('event cleanup', () => {
    it('removes event listeners on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('async handlers', () => {
    it('handles async onGenerateReport', async () => {
      const asyncGenerateReport = vi.fn().mockResolvedValue(undefined);

      render(
        <Controller
          onGenerateReport={asyncGenerateReport}
          onClearReports={mockOnClearReports}
        />,
      );

      const battleButton = screen.getByRole('button', { name: 'Battle' });
      fireEvent.click(battleButton);

      expect(asyncGenerateReport).toHaveBeenCalledTimes(1);
    });

    it('handles async onClearReports', async () => {
      const asyncClearReports = vi.fn().mockResolvedValue(undefined);

      render(
        <Controller
          onGenerateReport={mockOnGenerateReport}
          onClearReports={asyncClearReports}
        />,
      );

      const resetButton = screen.getByRole('button', { name: 'Reset' });
      fireEvent.click(resetButton);

      expect(asyncClearReports).toHaveBeenCalledTimes(1);
    });
  });
});
