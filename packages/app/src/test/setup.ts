import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './msw';

// jsdom polyfills for browser-only APIs used in components (e.g., Embla, Marquee)
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  // Minimal matchMedia mock used by Embla's options handler
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });
}

// ResizeObserver polyfill for react-fast-marquee
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class MockResizeObserver implements ResizeObserver {
    // Minimal instance implementation; params are unused in tests
    constructor(_cb: ResizeObserverCallback) {
      void _cb;
    }
    observe(_target: Element, _options?: ResizeObserverOptions): void {
      void _target;
      void _options;
    }
    unobserve(_target: Element): void {
      void _target;
    }
    disconnect(): void {}
  }
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: MockResizeObserver,
  });
}

// IntersectionObserver polyfill for Embla
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(
      _cb: IntersectionObserverCallback,
      _opts?: IntersectionObserverInit,
    ) {
      // mark as used to satisfy lint rules
      void _cb;
      void _opts;
    }
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: MockIntersectionObserver,
  });
}

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
});

// jsdom: Polyfill scroll APIs with no-ops to avoid noisy "Not implemented" errors
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    writable: true,
    value: () => {},
  });
  Object.defineProperty(window, 'scrollBy', {
    configurable: true,
    writable: true,
    value: () => {},
  });
}
