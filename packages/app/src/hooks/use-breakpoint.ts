import { useEffect, useState } from 'react';

/** Tailwind-style breakpoints in px. Keep in sync with tailwind.config.js if customized. */
export const BREAKPOINTS = {
  lg: 1024,
} as const;

export function useBreakpoint(min: keyof typeof BREAKPOINTS): boolean {
  const minPx = BREAKPOINTS[min];
  const query = `(min-width: ${minPx}px)`;
  const getInitial = () => {
    if (typeof window === 'undefined') return false;
    if (typeof window.matchMedia === 'function') {
      try {
        return window.matchMedia(query).matches;
      } catch {
        // fall through
      }
    }
    // Fallback to innerWidth when matchMedia is unavailable (SSR/tests)
    return window.innerWidth >= minPx;
  };
  const [matches, set] = useState<boolean>(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prefer matchMedia when available
    if (typeof window.matchMedia === 'function') {
      const mql = window.matchMedia(query);
      const handler = () => set(mql.matches);
      handler();
      if ('addEventListener' in mql) {
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
      }
      // Legacy Safari
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const legacy = mql as any;
      if (typeof legacy.addListener === 'function') {
        legacy.addListener(handler);
        return () => legacy.removeListener(handler);
      }
      return; // nothing to cleanup
    }

    // Fallback: listen to window resize and recompute
    const onResize = () => set(window.innerWidth >= minPx);
    window.addEventListener('resize', onResize);
    // Initialize once
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [query, minPx]);

  return matches;
}
