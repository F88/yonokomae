import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DebugInfo } from './DebugInfo';

// Mock clipboard API
const mockWriteText = vi.fn();
const mockClipboard = {
  writeText: mockWriteText,
};

// Mock document.execCommand for fallback clipboard
const mockExecCommand = vi.fn();

describe('DebugInfo', () => {
  let originalConsoleLog: typeof console.log;
  let originalConsoleDebug: typeof console.debug;
  let originalClipboard: typeof navigator.clipboard;
  let originalExecCommand: typeof document.execCommand;

  beforeEach(() => {
    // Store original console methods
    originalConsoleLog = console.log;
    originalConsoleDebug = console.debug;
    originalClipboard = navigator.clipboard;
    originalExecCommand = document.execCommand;

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    // Mock document.execCommand
    Object.defineProperty(document, 'execCommand', {
      value: mockExecCommand,
      writable: true,
      configurable: true,
    });

    // Reset mocks
    vi.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
    mockExecCommand.mockReturnValue(true);

    // Mock NODE_ENV to not be 'test' for this component
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.debug = originalConsoleDebug;
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document, 'execCommand', {
      value: originalExecCommand,
      writable: true,
      configurable: true,
    });
    vi.unstubAllEnvs();
  });

  describe('Console Log Interception', () => {
    const openOverlay = async () => {
      const button = screen.getByRole('button', { name: /show debug logs/i });
      fireEvent.click(button);
      await waitFor(() => expect(screen.getByText(/Debug Logs/)).toBeTruthy());
    };

    it('captures debug console.log messages', async () => {
      render(<DebugInfo />);
      await openOverlay();
      act(() => {
        console.log('[DEBUG] Test message', { test: 'data' });
      });
      await waitFor(() => {
        expect(screen.getByText(/LOG: \[DEBUG\] Test message/)).toBeTruthy();
      });
      expect(screen.getByText(/"test": "data"/)).toBeTruthy();
    });

    it('captures debug console.debug messages', async () => {
      render(<DebugInfo />);
      await openOverlay();
      act(() => {
        console.debug('[DEBUG] Debug message', { debug: true });
      });
      await waitFor(() => {
        expect(screen.getByText(/DEBUG: \[DEBUG\] Debug message/)).toBeTruthy();
      });
      expect(screen.getByText(/"debug": true/)).toBeTruthy();
    });

    it('ignores non-debug messages', async () => {
      render(<DebugInfo />);
      await openOverlay();
      act(() => {
        console.log('Regular log message');
        console.debug('Regular debug message');
      });
      expect(screen.queryByText(/Regular log message/)).toBeNull();
      expect(screen.queryByText(/Regular debug message/)).toBeNull();
    });

    it('handles circular reference objects', async () => {
      render(<DebugInfo />);
      await openOverlay();
  type WithSelf = { name: string; self?: WithSelf };
  const circularObj: WithSelf = { name: 'test' };
  circularObj.self = circularObj;
      act(() => {
        console.log('[DEBUG] Circular object', circularObj);
      });
      await waitFor(() => {
        expect(screen.getByText(/Circular reference detected/)).toBeTruthy();
      });
    });

    it('limits logs to last 20 entries', async () => {
      render(<DebugInfo />);
      await openOverlay();
      act(() => {
        for (let i = 0; i < 25; i++) {
          console.log(`[DEBUG] Message ${i}`);
        }
      });
      await waitFor(() => {
        expect(screen.getByText('Debug Logs (20)')).toBeTruthy();
      });
      expect(screen.queryByText(/Message 0/)).toBeNull();
      expect(screen.queryByText(/Message 4/)).toBeNull();
      expect(screen.getByText(/Message 5/)).toBeTruthy();
      expect(screen.getByText(/Message 24/)).toBeTruthy();
    });
  });

  describe('Badge Toggle', () => {
    it('opens overlay when badge is clicked', async () => {
      render(<DebugInfo />);
      const button = screen.getByRole('button', { name: /show debug logs/i });
      expect(button).toBeTruthy();
      fireEvent.click(button);
      await waitFor(() => expect(screen.getByText(/Debug Logs/)).toBeTruthy());
    });

    it('hides overlay when Hide button clicked', async () => {
      render(<DebugInfo />);
      fireEvent.click(screen.getByRole('button', { name: /show debug logs/i }));
      await waitFor(() => expect(screen.getByText(/Debug Logs/)).toBeTruthy());
      fireEvent.click(screen.getByText('Hide'));
      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /show debug logs/i }),
        ).toBeTruthy(),
      );
    });
  });

  describe('Clipboard Functionality', () => {
    beforeEach(async () => {
      render(<DebugInfo />);
      fireEvent.click(screen.getByRole('button', { name: /show debug logs/i }));
      await waitFor(() => expect(screen.getByText(/Debug Logs/)).toBeTruthy());
      act(() => {
        console.log('[DEBUG] First message', { data: 'first' });
        console.log('[DEBUG] Second message', { data: 'second' });
      });
    });

    it('should show Copy All button', async () => {
      await waitFor(() => {
        expect(screen.getByText(/First message/)).toBeTruthy();
        expect(screen.getByText(/Second message/)).toBeTruthy();
      });

      const copyAllButton = screen.getByText('Copy All');
      expect(copyAllButton).toBeTruthy();
    });

    it('should show individual copy buttons on hover', async () => {
      await waitFor(() => {
        expect(screen.getByText(/First message/)).toBeTruthy();
      });

      // Individual copy buttons should exist (even if not visible)
      const copyButtons = screen.getAllByTitle('Copy this log entry');
      expect(copyButtons.length).toBeGreaterThan(0);
    });

    it('should clear logs when Clear button is clicked', async () => {
      await waitFor(() => {
        expect(screen.getByText('Debug Logs (2)')).toBeTruthy();
      });

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Debug Logs (0)')).toBeTruthy();
      });
    });
  });

  describe('UI Controls', () => {
    beforeEach(async () => {
      render(<DebugInfo />);
      fireEvent.click(screen.getByRole('button', { name: /show debug logs/i }));
      await waitFor(() => expect(screen.getByText(/Debug Logs/)).toBeTruthy());
      act(() => {
        console.log('[DEBUG] Test message 1');
        console.log('[DEBUG] Test message 2');
      });
    });

    it('should clear all logs when clicking Clear button', async () => {
      await waitFor(() => {
        expect(screen.getByText('Debug Logs (2)')).toBeTruthy();
        expect(screen.getByText(/Test message 1/)).toBeTruthy();
        expect(screen.getByText(/Test message 2/)).toBeTruthy();
      });

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Debug Logs (0)')).toBeTruthy();
        expect(screen.queryByText(/Test message 1/)).toBeNull();
        expect(screen.queryByText(/Test message 2/)).toBeNull();
      });
    });

    it('should hide overlay when clicking Hide button', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeTruthy();
      });

      const hideButton = screen.getByText('Hide');
      fireEvent.click(hideButton);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /show debug logs/i }),
        ).toBeTruthy();
        expect(screen.queryByText(/Debug Logs/)).toBeNull();
      });
    });

    it('should display timestamps correctly', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Test message 1/)).toBeTruthy();
      });

      // Check that timestamps are displayed (they should be in time format)
      const timeElements = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });

    it('should show log count in header', async () => {
      await waitFor(() => {
        expect(screen.getByText('Debug Logs (2)')).toBeTruthy();
      });

      // Add another log
      act(() => {
        console.log('[DEBUG] Test message 3');
      });

      await waitFor(() => {
        expect(screen.getByText('Debug Logs (3)')).toBeTruthy();
      });
    });
  });

  describe('Test Environment Behavior', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'test');
    });

    it('does not intercept console in test environment', () => {
      const { unmount } = render(<DebugInfo />);
      expect(console.log).toBe(originalConsoleLog);
      expect(console.debug).toBe(originalConsoleDebug);
      unmount();
    });
  });

  describe('Memory Management', () => {
    it('should restore console methods on unmount', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const { unmount } = render(<DebugInfo />);

      // Console should be intercepted after mount
      expect(console.log).not.toBe(originalConsoleLog);
      expect(console.debug).not.toBe(originalConsoleDebug);

      unmount();

      // Console should be restored after unmount
      expect(console.log).toBe(originalConsoleLog);
      expect(console.debug).toBe(originalConsoleDebug);
    });

    // Event listener removal test removed because component no longer attaches global listeners.
  });
});
