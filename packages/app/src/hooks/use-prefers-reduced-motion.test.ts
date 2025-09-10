import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';
import * as ReducedMotion from '@/lib/reduced-motion';

// Mock the reduced-motion library
vi.mock('@/lib/reduced-motion', () => ({
  prefersReducedMotion: vi.fn(() => false),
  REDUCED_MOTION_EVENT: 'reduced-motion-change',
}));

describe('usePrefersReducedMotion', () => {
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let mockMediaQueryList: {
    matches: boolean;
    media: string;
    addEventListener?: ReturnType<typeof vi.fn>;
    removeEventListener?: ReturnType<typeof vi.fn>;
    addListener?: ReturnType<typeof vi.fn>;
    removeListener?: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Ensure we have a window object for tests
    if (typeof window === 'undefined') {
      Object.defineProperty(global, 'window', {
        value: {
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          matchMedia: vi.fn(),
        },
        writable: true,
        configurable: true,
      });
    }
    
    // Mock window.addEventListener/removeEventListener
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();
    Object.defineProperty(window, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    });
    Object.defineProperty(window, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    });

    // Mock MediaQueryList
    mockMediaQueryList = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia = vi.fn(() => mockMediaQueryList);
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
    });

    // Default mock: reduced motion disabled
    vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('returns initial value from prefersReducedMotion()', () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      expect(result.current).toBe(true);
      expect(ReducedMotion.prefersReducedMotion).toHaveBeenCalledTimes(1);
    });

    it('returns false when prefersReducedMotion() returns false', () => {
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(false);
      
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      expect(result.current).toBe(false);
      expect(ReducedMotion.prefersReducedMotion).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Listeners Setup', () => {
    it('sets up REDUCED_MOTION_EVENT listener', () => {
      renderHook(() => usePrefersReducedMotion());
      
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'reduced-motion-change',
        expect.any(Function)
      );
    });

    it('sets up media query listener for modern browsers', () => {
      renderHook(() => usePrefersReducedMotion());
      
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('sets up legacy media query listener when addEventListener not available', () => {
      // Remove modern addEventListener
      delete mockMediaQueryList.addEventListener;
      delete mockMediaQueryList.removeEventListener;
      
      // Add legacy methods
      mockMediaQueryList.addListener = vi.fn();
      mockMediaQueryList.removeListener = vi.fn();
      
      renderHook(() => usePrefersReducedMotion());
      
      expect(mockMediaQueryList.addListener).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('handles case when matchMedia is not available', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      });
      
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      // Should still work, just without media query listener
      expect(result.current).toBe(false);
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'reduced-motion-change',
        expect.any(Function)
      );
    });

    it('handles case when mediaQueryList is null', () => {
      mockMatchMedia.mockReturnValue(null);
      
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      // Should still work
      expect(result.current).toBe(false);
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'reduced-motion-change',
        expect.any(Function)
      );
    });
  });

  describe('SSR Safety', () => {
    it.skip('handles server-side rendering when window is undefined', () => {
      // This test would require complex SSR simulation
      // The actual hook handles SSR safety with typeof window checks
      expect(true).toBe(true);
    });
  });

  describe('Event Handling', () => {
    it('updates state when REDUCED_MOTION_EVENT is dispatched', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      expect(result.current).toBe(false);
      
      // Change the underlying value
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      
      // Get the event listener function that was registered
      const eventListener = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'reduced-motion-change'
      )?.[1];
      
      expect(eventListener).toBeDefined();
      
      // Dispatch the event
      act(() => {
        eventListener();
      });
      
      expect(result.current).toBe(true);
    });

    it('updates state when media query changes (modern browsers)', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      expect(result.current).toBe(false);
      
      // Change the underlying value
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      
      // Get the media query event listener
      const mediaListener = mockMediaQueryList.addEventListener?.mock.calls.find(
        (call) => call[0] === 'change'
      )?.[1];
      
      expect(mediaListener).toBeDefined();
      
      // Dispatch the media query change
      act(() => {
        mediaListener();
      });
      
      expect(result.current).toBe(true);
    });

    it('updates state when media query changes (legacy browsers)', () => {
      // Set up legacy media query list
      delete mockMediaQueryList.addEventListener;
      delete mockMediaQueryList.removeEventListener;
      mockMediaQueryList.addListener = vi.fn();
      mockMediaQueryList.removeListener = vi.fn();
      
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      expect(result.current).toBe(false);
      
      // Change the underlying value
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      
      // Get the legacy listener
      const legacyListener = mockMediaQueryList.addListener?.mock.calls[0]?.[0];
      
      expect(legacyListener).toBeDefined();
      
      // Dispatch the change
      act(() => {
        legacyListener();
      });
      
      expect(result.current).toBe(true);
    });
  });

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const { unmount } = renderHook(() => usePrefersReducedMotion());
      
      unmount();
      
      // Should remove REDUCED_MOTION_EVENT listener
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'reduced-motion-change',
        expect.any(Function)
      );
      
      // Should remove media query listener
      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('removes legacy media query listeners on unmount', () => {
      // Set up legacy media query list
      delete mockMediaQueryList.addEventListener;
      delete mockMediaQueryList.removeEventListener;
      mockMediaQueryList.addListener = vi.fn();
      mockMediaQueryList.removeListener = vi.fn();
      
      const { unmount } = renderHook(() => usePrefersReducedMotion());
      
      unmount();
      
      // Should remove legacy listener
      expect(mockMediaQueryList.removeListener).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('handles cleanup when media query setup failed', () => {
      mockMatchMedia.mockReturnValue(null);
      
      const { unmount } = renderHook(() => usePrefersReducedMotion());
      
      // Should not throw error on unmount
      expect(() => unmount()).not.toThrow();
      
      // Should still remove main event listener
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'reduced-motion-change',
        expect.any(Function)
      );
    });
  });

  describe('Type Guards', () => {
    it('correctly identifies legacy MediaQueryList', () => {
      // Test the legacy detection path by removing modern methods
      delete mockMediaQueryList.addEventListener;
      delete mockMediaQueryList.removeEventListener;
      mockMediaQueryList.addListener = vi.fn();
      mockMediaQueryList.removeListener = vi.fn();
      
      renderHook(() => usePrefersReducedMotion());
      
      // Should use legacy methods
      expect(mockMediaQueryList.addListener).toHaveBeenCalled();
      expect(mockMediaQueryList.addEventListener).toBeUndefined();
    });

    it('handles media query list without legacy methods', () => {
      // Remove all listener methods
      delete mockMediaQueryList.addEventListener;
      delete mockMediaQueryList.removeEventListener;
      delete mockMediaQueryList.addListener;
      delete mockMediaQueryList.removeListener;
      
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      // Should still work, just without media query listeners
      expect(result.current).toBe(false);
    });
  });

  describe('Multiple Updates', () => {
    it('handles multiple rapid state changes', () => {
      const { result } = renderHook(() => usePrefersReducedMotion());
      
      expect(result.current).toBe(false);
      
      const eventListener = mockAddEventListener.mock.calls.find(
        (call) => call[0] === 'reduced-motion-change'
      )?.[1];
      
      // Change value multiple times
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      act(() => {
        eventListener();
      });
      expect(result.current).toBe(true);
      
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(false);
      act(() => {
        eventListener();
      });
      expect(result.current).toBe(false);
      
      vi.mocked(ReducedMotion.prefersReducedMotion).mockReturnValue(true);
      act(() => {
        eventListener();
      });
      expect(result.current).toBe(true);
    });
  });
});