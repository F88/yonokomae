import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
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
