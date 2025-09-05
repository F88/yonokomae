import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useBreakpoint, BREAKPOINTS } from '@/hooks/use-breakpoint';

type Handler = (e?: unknown) => void;

function makeMatchMediaController(initial: { width: number }) {
  let width = initial.width;
  const listeners = new Set<Handler>();
  const getMatches = (query: string) => {
    const m = query.match(/\(min-width: (\d+)px\)/);
    const min = m ? parseInt(m[1]!, 10) : 0;
    return width >= min;
  };
  const install = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).matchMedia = (query: string) => {
      const mql: Partial<MediaQueryList> = {
        media: query,
        onchange: null,
        addEventListener: (_: string, handler: Handler) =>
          listeners.add(handler),
        removeEventListener: (_: string, handler: Handler) =>
          listeners.delete(handler),
        addListener: (handler: Handler) => listeners.add(handler),
        removeListener: (handler: Handler) => listeners.delete(handler),
        dispatchEvent: () => false,
      };
      Object.defineProperty(mql, 'matches', {
        get() {
          return getMatches(query);
        },
      });
      return mql as MediaQueryList;
    };
  };
  const setWidth = (w: number) => {
    width = w;
  };
  const triggerChange = () => {
    listeners.forEach((h) => h({}));
  };
  return { install, setWidth, triggerChange };
}

const Probe = ({ min }: { min: keyof typeof BREAKPOINTS }) => {
  const ok = useBreakpoint(min);
  return <span data-testid="ok">{String(ok)}</span>;
};

describe('useBreakpoint', () => {
  beforeEach(() => {
    // Reset any prior state; nothing global to reset here.
  });

  describe('BREAKPOINTS constant', () => {
    it('should export correct breakpoint values', () => {
      expect(BREAKPOINTS).toEqual({
        lg: 1024,
      });
    });
  });

  describe('Basic functionality with component', () => {
    it('returns false when viewport is below min width', () => {
      const ctl = makeMatchMediaController({ width: 800 });
      ctl.install();
      render(<Probe min="lg" />);
      expect(screen.getByTestId('ok').textContent).toBe('false');
    });

    it('returns true when viewport meets min width and updates on change', () => {
      const ctl = makeMatchMediaController({ width: 900 });
      ctl.install();
      render(<Probe min="lg" />);
      expect(screen.getByTestId('ok').textContent).toBe('false');

      act(() => {
        ctl.setWidth(1200);
        ctl.triggerChange();
      });
      expect(screen.getByTestId('ok').textContent).toBe('true');
    });
  });

  describe('Hook functionality with renderHook', () => {
    it('should return correct initial state based on matchMedia', () => {
      const ctl = makeMatchMediaController({ width: 1200 });
      ctl.install();

      const { result } = renderHook(() => useBreakpoint('lg'));
      expect(result.current).toBe(true);
    });

    it('should update when media query changes', () => {
      const ctl = makeMatchMediaController({ width: 800 });
      ctl.install();

      const { result } = renderHook(() => useBreakpoint('lg'));
      expect(result.current).toBe(false);

      act(() => {
        ctl.setWidth(1200);
        ctl.triggerChange();
      });

      expect(result.current).toBe(true);
    });

    it('should clean up event listeners on unmount', () => {
      const ctl = makeMatchMediaController({ width: 1200 });
      ctl.install();

      const { unmount } = renderHook(() => useBreakpoint('lg'));

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should handle breakpoint transitions correctly', () => {
      const ctl = makeMatchMediaController({ width: 1200 });
      ctl.install();

      const { result } = renderHook(() => useBreakpoint('lg'));
      expect(result.current).toBe(true);

      // Go below breakpoint
      act(() => {
        ctl.setWidth(800);
        ctl.triggerChange();
      });
      expect(result.current).toBe(false);

      // Return above breakpoint
      act(() => {
        ctl.setWidth(1500);
        ctl.triggerChange();
      });
      expect(result.current).toBe(true);
    });

    it('should handle exact breakpoint value', () => {
      const ctl = makeMatchMediaController({ width: 1024 });
      ctl.install();

      const { result } = renderHook(() => useBreakpoint('lg'));
      expect(result.current).toBe(true);
    });
  });
});
