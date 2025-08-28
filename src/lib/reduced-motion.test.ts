import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as RM from './reduced-motion';

const originalMatchMedia = globalThis.window?.matchMedia;
const originalScrollTo = globalThis.window?.scrollTo;
const originalScrollBy = globalThis.window?.scrollBy;

function setMatchMedia(matches: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

describe('reduced-motion utilities', () => {
  beforeEach(() => {
    // reset spies/mocks
    vi.restoreAllMocks();
    RM.setReducedMotionOverride('auto');
    document.documentElement.classList.remove('reduced-motion');

    // jsdom: provide noop implementations so spying doesn't throw "Not implemented"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).scrollTo = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).scrollBy = vi.fn();
  });

  afterEach(() => {
    if (originalMatchMedia) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).matchMedia = originalMatchMedia;
    }
    // restore original scroll functions (which may throw in jsdom, but keeps global clean)
    if (originalScrollTo) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).scrollTo = originalScrollTo;
    }
    if (originalScrollBy) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).scrollBy = originalScrollBy;
    }
  });

  it('prefersReducedMotion respects window.matchMedia', () => {
    setMatchMedia(true);
    expect(RM.prefersReducedMotion()).toBe(true);
    setMatchMedia(false);
    expect(RM.prefersReducedMotion()).toBe(false);
  });

  it('override: reduce forces enabled; no-preference forces disabled; auto follows system', () => {
    // System not reduced
    setMatchMedia(false);
    RM.setReducedMotionOverride('reduce');
    expect(RM.prefersReducedMotion()).toBe(true);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      true,
    );

    RM.setReducedMotionOverride('no-preference');
    expect(RM.prefersReducedMotion()).toBe(false);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      false,
    );

    RM.setReducedMotionOverride('auto');
    expect(RM.prefersReducedMotion()).toBe(false);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      false,
    );

    // System reduced
    setMatchMedia(true);
    RM.setReducedMotionOverride('auto');
    expect(RM.prefersReducedMotion()).toBe(true);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(
      true,
    );
  });

  it('dispatches a change event when override changes', () => {
    setMatchMedia(false);
    const handler = vi.fn();
    window.addEventListener('reduced-motion:change', handler);
    RM.setReducedMotionOverride('reduce');
    RM.setReducedMotionOverride('no-preference');
    RM.setReducedMotionOverride('auto');
    // At least one event should have fired
    expect(handler).toHaveBeenCalled();
    window.removeEventListener('reduced-motion:change', handler);
  });

  it('pickScrollBehavior coerces to auto when reduced', () => {
    setMatchMedia(true);
    expect(RM.pickScrollBehavior('smooth')).toBe('auto');
    expect(RM.pickScrollBehavior('auto')).toBe('auto');
  });

  it('pickScrollBehavior returns desired when not reduced', () => {
    setMatchMedia(false);
    expect(RM.pickScrollBehavior('smooth')).toBe('smooth');
    expect(RM.pickScrollBehavior('auto')).toBe('auto');
  });

  it('scrollToY uses auto behavior when reduced', () => {
    setMatchMedia(true);
    const spy = vi.spyOn(window, 'scrollTo');
    RM.scrollToY(100, { behavior: 'smooth' });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 100, behavior: 'auto' }),
    );
  });

  it('scrollByY uses auto behavior when reduced', () => {
    setMatchMedia(true);
    const spy = vi.spyOn(window, 'scrollBy');
    RM.scrollByY(50, { behavior: 'smooth' });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 50, behavior: 'auto' }),
    );
  });

  // Hook is tested in src/hooks/usePrefersReducedMotion.test.tsx (file name kept for historical reasons)
});
