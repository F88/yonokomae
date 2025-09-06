import { useEffect, useState } from 'react';
import {
  setReducedMotionOverride,
  prefersReducedMotion,
} from '@/lib/reduced-motion';

/**
 * Internal UI state that reflects the current effective Reduced Motion.
 *
 * Semantics
 * - `false`: reduced motion is disabled (effective state)
 * - `true`: reduced motion is enabled (effective state)
 *
 * Initialization
 * - Defaults to `false`. On mount, the component checks the system
 *   `prefers-reduced-motion: reduce` and sets this state to the detected
 *   effective value so the UI mirrors the environment initially.
 *
 * Side effects
 * - User interactions update `setReducedMotionOverride(...)` to either
 *   force reduced (enabled) or force not-reduced (disabled) and keep the
 *   `<html>` class `reduced-motion` in sync for CSS hooks.
 *
 * Persistence
 * - Not persisted. Reloading the page returns to the system preference.
 */
type IsReduceModeEnabled = boolean;

/**
 * A compact control to visualize and (temporarily) override the effective
 * Reduced Motion preference.
 *
 * Behavior
 * - Effective states: reduced motion is either enabled or disabled.
 * - Initial determination: based on the OS or system environment (`prefers-reduced-motion`).
 * - Afterwards: the user can freely toggle between enabled and disabled states.
 * - Persistence: none. The override is session-only; on reload it resets to
 *   the system preference. No localStorage is used.
 * - Effective state: toggled by the user; implementation uses
 *   {@link setReducedMotionOverride}('reduce' | 'no-preference').
 *
 * Accessibility
 * - Announces status via the control's accessible name and title.
 * - The control is a single button that toggles the manual override on/off.
 *
 * Visuals
 * - Icon: 〰️ when reduced motion is disabled, ➖ when enabled.
 * - A small status label (sm and up) shows the explicit status text.
 * - A `.motion-debug-badge` dot is rendered and shown only when the effective
 *   reduced-motion is enabled (via CSS hook `html.reduced-motion`).
 *
 * Integration
 * - Uses {@link setReducedMotionOverride} to update the override and sync the
 *   `<html>` class (`.reduced-motion`) for CSS hooks.
 * - Place next to other quick-access toggles (e.g. ThemeToggle) in the header.
 *
 * Limitations
 * - Because the override is session-only, a full reload reverts to the system
 *   preference. This is by design to avoid persistence-related concerns.
 */
export const ReducedMotionModeToggle: React.FC = () => {
  /**
   * Reflects whether reduced motion is currently enabled (effective state).
   */
  const [isReduceModeEnabled, setIsReduceModeEnabled] =
    useState<IsReduceModeEnabled>(false);

  useEffect(() => {
    // Initialize: reflect system preference and sync html class via 'auto'.
    setReducedMotionOverride('auto');
    setIsReduceModeEnabled(prefersReducedMotion());
  }, []);

  const statusText = `Reduced motion mode - ${isReduceModeEnabled ? 'enabled' : 'disabled'}`;

  return (
    <button
      type="button"
      onClick={() => {
        // Toggle the effective state regardless of the system setting.
        const next = !prefersReducedMotion();
        setReducedMotionOverride(next ? 'reduce' : 'no-preference');
        setIsReduceModeEnabled(prefersReducedMotion());
      }}
      aria-label="Toggle reduced motion mode"
      title={statusText}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="text-base" aria-hidden>
        {isReduceModeEnabled ? '➖' : '〰️'}
      </span>
      <span
        className="motion-debug-badge ml-1 hidden h-2 w-2 rounded-full bg-amber-500"
        aria-hidden
      />
    </button>
  );
};
