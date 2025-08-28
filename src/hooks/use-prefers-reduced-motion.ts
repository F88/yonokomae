import { useEffect, useState } from 'react';
import {
  prefersReducedMotion,
  REDUCED_MOTION_EVENT,
} from '@/lib/reduced-motion';

/**
 * Legacy MediaQueryList interface for Safari compatibility.
 * These methods are deprecated but still present in older browsers.
 */
interface LegacyMediaQueryList extends MediaQueryList {
  addListener: (listener: () => void) => void;
  removeListener: (listener: () => void) => void;
}

/**
 * Type guard to check if MediaQueryList has legacy addListener method.
 */
const hasLegacyListener = (
  mql: MediaQueryList,
): mql is LegacyMediaQueryList => {
  return (
    'addListener' in mql &&
    typeof (mql as unknown as LegacyMediaQueryList).addListener ===
      'function' &&
    'removeListener' in mql &&
    typeof (mql as unknown as LegacyMediaQueryList).removeListener ===
      'function'
  );
};

/**
 * usePrefersReducedMotion
 *
 * Returns the current effective reduced-motion state as a boolean:
 * - true  => motion should be reduced
 * - false => motion can be allowed
 *
 * Single source of truth: delegates to prefersReducedMotion() and
 * subscribes to the global REDUCED_MOTION_EVENT and media query changes.
 *
 * SSR-safe: guards against window/matchMedia being unavailable.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [val, setVal] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    // SSR/Non-DOM guard
    if (typeof window === 'undefined') return;

    // Re-evaluate on our custom event (override or initial system change)
    const onChange = () => setVal(prefersReducedMotion());
    window.addEventListener(REDUCED_MOTION_EVENT, onChange);

    // Also listen to system media query updates for immediate re-evaluation
    let mql: MediaQueryList | null = null;
    let detachMql: (() => void) | null = null;

    if (typeof window.matchMedia === 'function') {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      // EventTarget path (modern browsers)
      const handleMqlChangeEvent: EventListener = () => onChange();
      if (mql && 'addEventListener' in mql) {
        mql.addEventListener('change', handleMqlChangeEvent);
        detachMql = () =>
          mql && mql.removeEventListener('change', handleMqlChangeEvent);
      } else if (mql && hasLegacyListener(mql)) {
        // Legacy Safari fallback using deprecated addListener/removeListener
        const handleLegacy = () => onChange();
        mql.addListener(handleLegacy);
        detachMql = () =>
          mql && hasLegacyListener(mql) && mql.removeListener(handleLegacy);
      }
    }

    return () => {
      window.removeEventListener(REDUCED_MOTION_EVENT, onChange);
      if (detachMql) detachMql();
    };
  }, []);

  return val;
};
