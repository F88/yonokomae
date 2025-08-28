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
export declare const prefersReducedMotion: () => boolean;
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
export declare const pickScrollBehavior: (
  desired?: ScrollBehavior,
) => ScrollBehavior;
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
export declare const scrollToY: (
  top: number,
  opts?: Omit<ScrollToOptions, 'top' | 'behavior'> & {
    behavior?: ScrollBehavior;
  },
) => void;
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
export declare const scrollByY: (
  deltaY: number,
  opts?: Omit<ScrollToOptions, 'top' | 'left' | 'behavior'> & {
    behavior?: ScrollBehavior;
  },
) => void;
