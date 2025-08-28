import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as RM from './reduced-motion';

const originalMatchMedia = globalThis.window?.matchMedia;

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
  });

  afterEach(() => {
    if (originalMatchMedia) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).matchMedia = originalMatchMedia;
    }
  });

  it('prefersReducedMotion respects window.matchMedia', () => {
    setMatchMedia(true);
    expect(RM.prefersReducedMotion()).toBe(true);
    setMatchMedia(false);
    expect(RM.prefersReducedMotion()).toBe(false);
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
});
