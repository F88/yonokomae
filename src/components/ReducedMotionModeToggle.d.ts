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
export declare const ReducedMotionModeToggle: React.FC;
