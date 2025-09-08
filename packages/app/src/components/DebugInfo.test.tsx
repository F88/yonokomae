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
    it('should capture debug console.log messages', async () => {
      render(<DebugInfo />);

      // Trigger triple tap to show debug overlay
      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      // Wait for the debug overlay to appear
      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Trigger a debug log
      act(() => {
        console.log('[DEBUG] Test message', { test: 'data' });
      });

      // Check if the debug message appears in the overlay
      await waitFor(() => {
        expect(
          screen.getByText(/LOG: \[DEBUG\] Test message/),
        ).toBeInTheDocument();
      });

      // Check if the data is properly serialized and displayed
      expect(screen.getByText(/"test": "data"/)).toBeInTheDocument();
    });

    it('should capture debug console.debug messages', async () => {
      render(<DebugInfo />);

      // Show debug overlay
      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Trigger a debug message
      act(() => {
        console.debug('[DEBUG] Debug message', { debug: true });
      });

      await waitFor(() => {
        expect(
          screen.getByText(/DEBUG: \[DEBUG\] Debug message/),
        ).toBeInTheDocument();
      });

      expect(screen.getByText(/"debug": true/)).toBeInTheDocument();
    });

    it('should ignore non-debug console messages', async () => {
      render(<DebugInfo />);

      // Show debug overlay
      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Trigger non-debug messages
      act(() => {
        console.log('Regular log message');
        console.debug('Regular debug message');
      });

      // These should not appear in the debug overlay
      expect(screen.queryByText(/Regular log message/)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Regular debug message/),
      ).not.toBeInTheDocument();
    });

    it('should handle circular reference objects gracefully', async () => {
      render(<DebugInfo />);

      // Show debug overlay
      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Create circular reference
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      act(() => {
        console.log('[DEBUG] Circular object', circularObj);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Circular reference detected/),
        ).toBeInTheDocument();
      });
    });

    it('should limit logs to last 20 entries', async () => {
      render(<DebugInfo />);

      // Show debug overlay
      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Add 25 debug messages
      act(() => {
        for (let i = 0; i < 25; i++) {
          console.log(`[DEBUG] Message ${i}`);
        }
      });

      await waitFor(() => {
        // Should show "Debug Logs (20)" - limited to 20 entries
        expect(screen.getByText('Debug Logs (20)')).toBeInTheDocument();
      });

      // First 5 messages should not be visible (they were removed)
      expect(screen.queryByText(/Message 0/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Message 4/)).not.toBeInTheDocument();

      // Last 20 messages should be visible
      expect(screen.getByText(/Message 5/)).toBeInTheDocument();
      expect(screen.getByText(/Message 24/)).toBeInTheDocument();
    });
  });

  describe('Triple Tap Toggle', () => {
    it('should toggle visibility on triple tap', async () => {
      render(<DebugInfo />);

      // Initially should show hint message
      expect(
        screen.getByText('Triple tap to show debug logs'),
      ).toBeInTheDocument();

      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;

      // Triple tap
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      // Debug overlay should appear
      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Triple tap again to hide
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      // Should show hint again
      await waitFor(() => {
        expect(
          screen.getByText('Triple tap to show debug logs'),
        ).toBeInTheDocument();
      });
    });

    it('should reset tap count after timeout', async () => {
      render(<DebugInfo />);

      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;

      // Two taps, then wait, then one tap
      fireEvent.click(document!);
      fireEvent.click(document!);

      // Wait more than 500ms (the timeout)
      await new Promise((resolve) => setTimeout(resolve, 600));

      fireEvent.click(document!);

      // Should not show debug overlay (tap count should have reset)
      expect(screen.queryByText(/Debug Logs/)).not.toBeInTheDocument();
      expect(
        screen.getByText('Triple tap to show debug logs'),
      ).toBeInTheDocument();
    });

    it('should work with touch events', async () => {
      render(<DebugInfo />);

      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;

      // Triple touch
      fireEvent.touchEnd(document!);
      fireEvent.touchEnd(document!);
      fireEvent.touchEnd(document!);

      // Debug overlay should appear
      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });
    });
  });

  describe('Clipboard Functionality', () => {
    beforeEach(async () => {
      render(<DebugInfo />);

      // Show debug overlay
      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Add some test logs
      act(() => {
        console.log('[DEBUG] First message', { data: 'first' });
        console.log('[DEBUG] Second message', { data: 'second' });
      });
    });

    it('should show Copy All button', async () => {
      await waitFor(() => {
        expect(screen.getByText(/First message/)).toBeInTheDocument();
        expect(screen.getByText(/Second message/)).toBeInTheDocument();
      });

      const copyAllButton = screen.getByText('Copy All');
      expect(copyAllButton).toBeInTheDocument();
    });

    it('should show individual copy buttons on hover', async () => {
      await waitFor(() => {
        expect(screen.getByText(/First message/)).toBeInTheDocument();
      });

      // Individual copy buttons should exist (even if not visible)
      const copyButtons = screen.getAllByTitle('Copy this log entry');
      expect(copyButtons.length).toBeGreaterThan(0);
    });

    it('should clear logs when Clear button is clicked', async () => {
      await waitFor(() => {
        expect(screen.getByText('Debug Logs (2)')).toBeInTheDocument();
      });

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Debug Logs (0)')).toBeInTheDocument();
      });
    });
  });

  describe('UI Controls', () => {
    beforeEach(async () => {
      render(<DebugInfo />);

      // Show debug overlay
      const document = screen
        .getByText('Triple tap to show debug logs')
        .closest('div')?.parentElement;
      fireEvent.click(document!);
      fireEvent.click(document!);
      fireEvent.click(document!);

      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      // Add test logs
      act(() => {
        console.log('[DEBUG] Test message 1');
        console.log('[DEBUG] Test message 2');
      });
    });

    it('should clear all logs when clicking Clear button', async () => {
      await waitFor(() => {
        expect(screen.getByText('Debug Logs (2)')).toBeInTheDocument();
        expect(screen.getByText(/Test message 1/)).toBeInTheDocument();
        expect(screen.getByText(/Test message 2/)).toBeInTheDocument();
      });

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Debug Logs (0)')).toBeInTheDocument();
        expect(screen.queryByText(/Test message 1/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Test message 2/)).not.toBeInTheDocument();
      });
    });

    it('should hide overlay when clicking Hide button', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Debug Logs/)).toBeInTheDocument();
      });

      const hideButton = screen.getByText('Hide');
      fireEvent.click(hideButton);

      await waitFor(() => {
        expect(
          screen.getByText('Triple tap to show debug logs'),
        ).toBeInTheDocument();
        expect(screen.queryByText(/Debug Logs/)).not.toBeInTheDocument();
      });
    });

    it('should display timestamps correctly', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Test message 1/)).toBeInTheDocument();
      });

      // Check that timestamps are displayed (they should be in time format)
      const timeElements = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });

    it('should show log count in header', async () => {
      await waitFor(() => {
        expect(screen.getByText('Debug Logs (2)')).toBeInTheDocument();
      });

      // Add another log
      act(() => {
        console.log('[DEBUG] Test message 3');
      });

      await waitFor(() => {
        expect(screen.getByText('Debug Logs (3)')).toBeInTheDocument();
      });
    });
  });

  describe('Test Environment Behavior', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'test');
    });

    it('should not intercept console in test environment', () => {
      const { unmount } = render(<DebugInfo />);

      // Console methods should remain unchanged in test env
      expect(console.log).toBe(originalConsoleLog);
      expect(console.debug).toBe(originalConsoleDebug);

      unmount();
    });

    it('should not add event listeners in test environment', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      render(<DebugInfo />);

      // Should not add touch/click event listeners in test env
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
      );
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
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

    it('should remove event listeners on unmount', () => {
      vi.stubEnv('NODE_ENV', 'development');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(<DebugInfo />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
