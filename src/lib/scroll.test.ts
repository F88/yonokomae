import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { scrollToAnchor } from './scroll';

// Mock the reduced-motion module
vi.mock('./reduced-motion', () => ({
  scrollByY: vi.fn(),
}));

import { scrollByY } from './reduced-motion';

describe('scroll utilities', () => {
  let mockElement: HTMLElement;
  let mockHeader: HTMLElement;
  let scrollByYMock: ReturnType<typeof vi.mocked>;

  beforeEach(() => {
    scrollByYMock = vi.mocked(scrollByY);

    // Mock DOM methods
    mockElement = {
      getBoundingClientRect: vi.fn(() => ({
        top: 100,
        bottom: 150,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: 100,
      })),
    } as HTMLElement;

    mockHeader = {
      getBoundingClientRect: vi.fn(() => ({
        top: 0,
        bottom: 60,
        left: 0,
        right: 1200,
        width: 1200,
        height: 60,
        x: 0,
        y: 0,
      })),
    } as HTMLElement;

    // Mock document.getElementById
    global.document.getElementById = vi.fn((id) => {
      if (id === 'test-element') return mockElement;
      return null;
    });

    // Mock document.querySelector
    global.document.querySelector = vi.fn((selector) => {
      if (selector === '.sticky-header') return mockHeader;
      return null;
    });

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Ensure matchMedia is present for subsequent tests
    if (!('matchMedia' in window)) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(min-width: 1024px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
  });

  describe('scrollToAnchor', () => {
    it('should scroll to element without header', () => {
      scrollToAnchor('test-element');

      expect(document.getElementById).toHaveBeenCalledWith('test-element');
      expect(scrollByYMock).toHaveBeenCalledWith(80); // 100 (element top) - 0 (no header) - 20 (large extraGap)
    });

    it('should account for sticky header', () => {
      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.sticky-header',
      });

      expect(document.querySelector).toHaveBeenCalledWith('.sticky-header');
      expect(scrollByYMock).toHaveBeenCalledWith(20); // 100 - 60 (header bottom) - 20 (large extraGap)
    });

    it('should return early if element not found', () => {
      scrollToAnchor('non-existent');

      expect(scrollByYMock).not.toHaveBeenCalled();
    });

    it('should use custom extraGapLarge for large viewports', () => {
      scrollToAnchor('test-element', {
        extraGapLarge: 50,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(50); // 100 - 0 - 50
    });

    it('should use extraGapSmall for small viewports', () => {
      // Mock small viewport
      (
        window.matchMedia as vi.MockedFunction<typeof window.matchMedia>
      ).mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      scrollToAnchor('test-element', {
        extraGapSmall: 15,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(85); // 100 - 0 - 15
    });

    it('should handle custom largeMinWidth threshold', () => {
      // Mock window width just below custom threshold
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 800,
      });

      (
        window.matchMedia as vi.MockedFunction<typeof window.matchMedia>
      ).mockImplementation((query) => ({
        matches: query === '(min-width: 900px)' && window.innerWidth >= 900,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      scrollToAnchor('test-element', {
        largeMinWidth: 900,
        extraGapSmall: 10,
        extraGapLarge: 30,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(90); // 100 - 0 - 10 (small gap)
    });

    it('should not scroll if delta is very small', () => {
      // Mock element very close to desired position
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: 79.5, // Header bottom (60) + extraGap (20) = 80 => delta = -0.5
        bottom: 70.5,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: 79.5,
      }));

      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.sticky-header',
      });

      expect(scrollByYMock).not.toHaveBeenCalled();
    });

    it('should handle missing header selector gracefully', () => {
      global.document.querySelector = vi.fn(() => null);

      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.non-existent-header',
      });

      expect(scrollByYMock).toHaveBeenCalledWith(80); // Uses headerBottom = 0
    });

    it('should work in SSR environment (no window.matchMedia)', () => {
      delete (window as Window & { matchMedia?: typeof window.matchMedia })
        .matchMedia;

      scrollToAnchor('test-element', {
        extraGapLarge: 25,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(75); // Should use large gap based on innerWidth
    });

    it('should work in environment without window', () => {
      const originalWindow = global.window;

      // @ts-expect-error - testing without window
      delete global.window;

      // Mock getElementById to work without window
      global.document.getElementById = vi.fn((id) => {
        if (id === 'test-element') return mockElement;
        return null;
      });

      scrollToAnchor('test-element', {
        extraGapSmall: 8,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(92); // Should use small gap (no window = small viewport)

      global.window = originalWindow;
    });

    it('should use default gap values', () => {
      scrollToAnchor('test-element');

      expect(scrollByYMock).toHaveBeenCalledWith(80); // 100 - 0 - 20 (default large gap)
    });

    it('should handle all options together', () => {
      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.sticky-header',
        extraGapSmall: 8,
        extraGapLarge: 25,
        largeMinWidth: 1024,
      });

      expect(document.querySelector).toHaveBeenCalledWith('.sticky-header');
      expect(scrollByYMock).toHaveBeenCalledWith(15); // 100 - 60 - 25
    });

    it('should handle negative scroll delta', () => {
      // Mock element above the target position
      mockElement.getBoundingClientRect = vi.fn(() => ({
        top: -50,
        bottom: 0,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: -50,
      }));

      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.sticky-header',
      });

      expect(scrollByYMock).toHaveBeenCalledWith(-130); // -50 - 60 - 20 (negative scroll up)
    });
  });
});
