import { useEffect, useState } from 'react';
import {
  prefersReducedMotion,
  REDUCED_MOTION_EVENT,
} from '@/lib/reduced-motion';

/**
 * usePrefersReducedMotion
 *
 * Returns the current effective reduced-motion state as a boolean:
 * - true  => motion should be reduced
 * - false => motion can be allowed
 *
 * Single source of truth: delegates to prefersReducedMotion() and
 * subscribes to the global REDUCED_MOTION_EVENT and media query changes.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [val, setVal] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    // Re-evaluate on our custom event (override or initial system change)
    const onChange = () => setVal(prefersReducedMotion());
    window.addEventListener(REDUCED_MOTION_EVENT, onChange);

    // Also listen to system media query updates for immediate re-evaluation
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    mql.addEventListener('change', onChange);

    return () => {
      window.removeEventListener(REDUCED_MOTION_EVENT, onChange);
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return val;
};
