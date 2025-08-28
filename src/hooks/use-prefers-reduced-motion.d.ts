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
export declare const usePrefersReducedMotion: () => boolean;
