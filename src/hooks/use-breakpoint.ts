import { useEffect, useState } from 'react';

/** Tailwind-style breakpoints in px. Keep in sync with tailwind.config.js if customized. */
export const BREAKPOINTS = {
  lg: 1024,
} as const;

export function useBreakpoint(min: keyof typeof BREAKPOINTS): boolean {
  const minPx = BREAKPOINTS[min];
  const query = `(min-width: ${minPx}px)`;
  const [matches, set] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = () => set(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}
