import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Helper to mock matchMedia for prefers-reduced-motion
function setMatchMedia(matches: boolean) {
  (window as any).matchMedia = (query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? matches : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Mock the reduced-motion utilities with minimal faithful behavior
vi.mock('@/lib/reduced-motion', () => {
  type ReducedMotionOverride = 'auto' | 'reduce' | 'no-preference';
  let override: ReducedMotionOverride = 'auto';

  const systemPrefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const prefersReducedMotion = (): boolean => {
    if (override === 'reduce') return true;
    if (override === 'no-preference') return false;
    return systemPrefersReducedMotion();
  };

  const setReducedMotionOverride = (mode: ReducedMotionOverride) => {
    override = mode;
    const effective = prefersReducedMotion();
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('reduced-motion', effective);
    }
  };

  const getReducedMotionOverride = () => override;

  return {
    getReducedMotionOverride,
    setReducedMotionOverride,
    prefersReducedMotion,
  };
});

// Import after mocks are set up
import * as RM from '@/lib/reduced-motion';
import { ReducedMotionModeToggle } from './ReducedMotionModeToggle';

describe('ReducedMotionModeToggle', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    RM.setReducedMotionOverride('auto');
    document.documentElement.classList.remove('reduced-motion');
  });

  it('initializes to enabled when system prefers reduced motion', async () => {
    setMatchMedia(true);
    const spy = vi.spyOn(RM, 'setReducedMotionOverride');

    render(<ReducedMotionModeToggle />);

    const btn = screen.getByRole('button', {
      name: /toggle reduced motion mode/i,
    });
    expect(btn).toHaveAttribute('title', expect.stringContaining('enabled'));
    expect(btn).toHaveTextContent('➖');
    expect(spy).toHaveBeenCalledWith('auto');
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      true,
    );
  });

  it('initializes to disabled when system does not prefer reduced motion', async () => {
    setMatchMedia(false);
    const spy = vi.spyOn(RM, 'setReducedMotionOverride');

    render(<ReducedMotionModeToggle />);

    const btn = screen.getByRole('button', {
      name: /toggle reduced motion mode/i,
    });
    expect(btn).toHaveAttribute('title', expect.stringContaining('disabled'));
    expect(btn).toHaveTextContent('〰️');
    expect(spy).toHaveBeenCalledWith('auto');
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      false,
    );
  });

  it('toggles to enabled on click when system is not reduced', async () => {
    setMatchMedia(false);
    const user = userEvent.setup();
    const spy = vi.spyOn(RM, 'setReducedMotionOverride');

    render(<ReducedMotionModeToggle />);
    const btn = screen.getByRole('button', {
      name: /toggle reduced motion mode/i,
    });

    await user.click(btn);

    expect(spy).toHaveBeenLastCalledWith('reduce');
    expect(btn).toHaveAttribute('title', expect.stringContaining('enabled'));
    expect(btn).toHaveTextContent('➖');
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      true,
    );
  });

  it('toggles to disabled on click when system is reduced', async () => {
    setMatchMedia(true);
    const user = userEvent.setup();
    const spy = vi.spyOn(RM, 'setReducedMotionOverride');

    render(<ReducedMotionModeToggle />);
    const btn = screen.getByRole('button', {
      name: /toggle reduced motion mode/i,
    });

    await user.click(btn);

    expect(spy).toHaveBeenLastCalledWith('no-preference');
    expect(btn).toHaveAttribute('title', expect.stringContaining('disabled'));
    expect(btn).toHaveTextContent('〰️');
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      false,
    );
  });
});
