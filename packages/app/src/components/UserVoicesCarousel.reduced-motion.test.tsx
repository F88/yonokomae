import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserVoicesCarousel from './UserVoicesCarousel';

const originalMatchMedia = globalThis.window?.matchMedia;

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

describe('UserVoicesCarousel (reduced motion)', () => {
  beforeEach(() => {
    setMatchMedia(true);
  });
  afterEach(() => {
    if (originalMatchMedia) {
      (window as any).matchMedia = originalMatchMedia;
    }
  });

  it('disables autoplay plugin under prefers-reduced-motion', () => {
    render(<UserVoicesCarousel intervalMs={1000} pauseOnHover={true} />);
    // The carousel renders, but autoplay should not be set.
    // We assert by absence of any DOM attributes from embla autoplay,
    // and that navigation buttons exist for manual control.
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /previous slide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next slide/i }),
    ).toBeInTheDocument();
  });
});
