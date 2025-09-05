/**
 * Utilities for honoring the user's reduced-motion preference.
 *
 * These helpers centralize detection of the CSS media feature
 * `prefers-reduced-motion: reduce` and provide safe wrappers around
 * scrolling behaviors. Use them to ensure motion-heavy interactions
 * (smooth scrolling, autoplay, decorative animations) degrade
 * gracefully when users opt to reduce motion at the OS level.
 *
 * Notes
 * - In non-browser environments (SSR/test without a DOM), detection
 *   returns `false` by default to avoid unexpected side effects.
 * - Prefer CSS `@media (prefers-reduced-motion: reduce)` for pure
 *   animations; use these JS utilities for runtime decisions like
 *   scroll behavior or autoplay toggles.
 */
type ReducedMotionOverride = 'auto' | 'reduce' | 'no-preference';

let reducedMotionOverride: ReducedMotionOverride = 'auto';

/** Event name dispatched on window when the effective preference may change. */
export const REDUCED_MOTION_EVENT = 'reduced-motion:change';

/** Get current override mode: 'auto' | 'reduce' | 'no-preference'. */
export const getReducedMotionOverride = (): ReducedMotionOverride =>
  reducedMotionOverride;

/**
 * Set override mode. Use 'auto' for a system-driven decision, or 'reduce'
 * to manually enable reduced motion. This updates the <html> class
 * `reduced-motion` to reflect the current effective preference for CSS hooks.
 */
export const setReducedMotionOverride = (mode: ReducedMotionOverride) => {
  reducedMotionOverride = mode;
  // Update HTML class for CSS-based hooks
  if (typeof document !== 'undefined') {
    const effective = prefersReducedMotion();
    document.documentElement.classList.toggle('reduced-motion', effective);
  }
  // Notify listeners that the effective state may have changed
  if (
    typeof window !== 'undefined' &&
    typeof window.dispatchEvent === 'function'
  ) {
    try {
      window.dispatchEvent(new CustomEvent(REDUCED_MOTION_EVENT));
    } catch {
      // no-op: CustomEvent may be unavailable in exotic environments
    }
  }
};

/** System-level reduced-motion detection. */
const systemPrefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Effective reduced-motion considering override. */
export const prefersReducedMotion = (): boolean => {
  if (reducedMotionOverride === 'reduce') return true;
  if (reducedMotionOverride === 'no-preference') return false;
  return systemPrefersReducedMotion();
};

/**
 * Pick a scroll behavior that respects the reduced-motion preference.
 *
 * When the user prefers reduced motion, this function returns `'auto'`
 * regardless of the desired behavior to avoid smooth/animated scrolls.
 * Otherwise it returns the provided `desired` behavior.
 *
 * @public
 * @param desired The preferred ScrollBehavior (defaults to `'smooth'`).
 * @returns `'auto'` when reduced motion is requested; otherwise `desired`.
 *
 * @example
 * const behavior = pickScrollBehavior('smooth');
 * window.scrollTo({ top: 0, behavior });
 */
export const pickScrollBehavior = (
  desired: ScrollBehavior = 'smooth',
): ScrollBehavior => (prefersReducedMotion() ? 'auto' : desired);

/**
 * Scroll the window to a vertical position while honoring reduced motion.
 *
 * If the environment indicates reduced motion, the effective behavior
 * becomes `'auto'` even when a smooth behavior is requested. This avoids
 * lengthy or potentially disorienting animations.
 *
 * @public
 * @param top The Y offset (in CSS pixels) to scroll to, relative to the top.
 * @param opts Additional `ScrollToOptions` except `top` and `behavior`.
 *   Provide `behavior` to hint the desired behavior; it will be coerced to
 *   `'auto'` when reduced motion is active.
 *
 * @example
 * // Prefer smooth, but fall back to instant when reduced motion is on
 * scrollToY(0, { behavior: 'smooth' });
 */
export const scrollToY = (
  top: number,
  opts: Omit<ScrollToOptions, 'top' | 'behavior'> & {
    behavior?: ScrollBehavior;
  } = {},
) => {
  const behavior = pickScrollBehavior(opts.behavior ?? 'smooth');
  // In non-browser/test environments (e.g., jsdom), scroll APIs may be missing
  if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') {
    return;
  }
  try {
    window.scrollTo({ top, ...opts, behavior });
  } catch {
    // Silently ignore unsupported option shapes in non-standard environments
  }
};

/**
 * Scroll the window by a vertical delta while honoring reduced motion.
 *
 * Works like {@link scrollToY} but applies a relative delta (`top` offset)
 * using `window.scrollBy`. The behavior will be `'auto'` when reduced
 * motion is active.
 *
 * @public
 * @param deltaY The vertical delta (in CSS pixels) to scroll by.
 * @param opts Additional `ScrollToOptions` except `top`, `left`, and
 *   `behavior`. Provide `behavior` to hint the desired behavior; it will be
 *   coerced under reduced motion.
 *
 * @example
 * // Scroll down by 400px; instant when reduced motion is on
 * scrollByY(400, { behavior: 'smooth' });
 */
export const scrollByY = (
  deltaY: number,
  opts: Omit<ScrollToOptions, 'top' | 'left' | 'behavior'> & {
    behavior?: ScrollBehavior;
  } = {},
) => {
  const behavior = pickScrollBehavior(opts.behavior ?? 'smooth');
  if (typeof window === 'undefined') {
    return;
  }
  // Prefer native scrollBy when available
  if (typeof window.scrollBy === 'function') {
    try {
      window.scrollBy({ top: deltaY, ...opts, behavior });
    } catch {
      // ignore in non-standard environments
    }
    return;
  }
  // Fallback to scrollTo if scrollBy is unavailable
  // Note: window.scrollY may be undefined in some environments; treat as 0
  const currentY = typeof window.scrollY === 'number' ? window.scrollY : 0;
  if (typeof window.scrollTo === 'function') {
    try {
      window.scrollTo({ top: currentY + deltaY, behavior });
    } catch {
      // ignore in non-standard environments
    }
  }
};
