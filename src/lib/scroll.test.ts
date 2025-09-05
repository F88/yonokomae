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
  let scrollByYMock: typeof scrollByY;

  beforeEach(() => {
    scrollByYMock = vi.mocked(scrollByY);

    // Create real elements and override getBoundingClientRect to return DOMRect
    mockElement = document.createElement('div');
    Object.defineProperty(mockElement, 'getBoundingClientRect', {
      configurable: true,
      value: vi.fn(() => new DOMRect(0, 100, 100, 50)),
    });

    mockHeader = document.createElement('div');
    Object.defineProperty(mockHeader, 'getBoundingClientRect', {
      configurable: true,
      value: vi.fn(() => new DOMRect(0, 0, 1200, 60)),
    });

    // Mock document.getElementById
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'test-element') return mockElement;
      return null;
    });

    // Mock document.querySelector
    vi.spyOn(document, 'querySelector').mockImplementation(
      (selector: string) => {
        if (selector === '.sticky-header') return mockHeader;
        return null;
      },
    );

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
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
        value: vi.fn().mockImplementation((query: string) => ({
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
      (document.getElementById as unknown as vi.Mock).mockImplementation(
        () => null,
      );

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
      (window.matchMedia as unknown as (q: string) => {
        matches: boolean;
        media: string;
        onchange: null;
        addListener: () => void;
        removeListener: () => void;
        addEventListener: () => void;
        removeEventListener: () => void;
        dispatchEvent: () => boolean;
      }) = vi.fn((query: string) => ({
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

      (window.matchMedia as unknown as (q: string) => any) = vi.fn(
        (query: string) => ({
          matches: query === '(min-width: 900px)' && window.innerWidth >= 900,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }),
      );

      scrollToAnchor('test-element', {
        largeMinWidth: 900,
        extraGapSmall: 10,
        extraGapLarge: 30,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(90); // 100 - 0 - 10 (small gap)
    });

    it('should not scroll if delta is very small', () => {
      Object.defineProperty(mockElement, 'getBoundingClientRect', {
        configurable: true,
        value: vi.fn(() => new DOMRect(0, 79.5, 100, 50)),
      });

      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.sticky-header',
      });

      expect(scrollByYMock).not.toHaveBeenCalled();
    });

    it('should handle missing header selector gracefully', () => {
      (document.querySelector as unknown as vi.Mock).mockImplementation(
        () => null,
      );

      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.non-existent-header',
      });

      expect(scrollByYMock).toHaveBeenCalledWith(80); // Uses headerBottom = 0
    });

    it('should work in SSR environment (no window.matchMedia)', () => {
      // @ts-expect-error - testing without matchMedia
      (window as any).matchMedia = undefined;

      scrollToAnchor('test-element', {
        extraGapLarge: 25,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(75); // Should use large gap based on innerWidth
    });

    it('should work in environment without window', () => {
      const originalWindow = global.window;

      // @ts-expect-error - testing without window
      delete (global as any).window;

      // Mock getElementById to work without window
      vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
        if (id === 'test-element') return mockElement;
        return null;
      });

      scrollToAnchor('test-element', {
        extraGapSmall: 8,
      });

      expect(scrollByYMock).toHaveBeenCalledWith(92); // Should use small gap (no window = small viewport)

      (global as any).window = originalWindow;
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
      Object.defineProperty(mockElement, 'getBoundingClientRect', {
        configurable: true,
        value: vi.fn(() => new DOMRect(0, -50, 100, 50)),
      });

      scrollToAnchor('test-element', {
        stickyHeaderSelector: '.sticky-header',
      });

      expect(scrollByYMock).toHaveBeenCalledWith(-130); // -50 - 60 - 20 (negative scroll up)
    });
  });
});
