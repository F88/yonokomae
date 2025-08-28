import { scrollByY } from './reduced-motion';
/**
 * Smoothly scroll to an element by id, accounting for a sticky header.
 */
export function scrollToAnchor(
  id: string,
  options?: {
    stickyHeaderSelector?: string;
    extraGapSmall?: number;
    extraGapLarge?: number;
    largeMinWidth?: number; // px
  },
): void {
  const target = document.getElementById(id);
  if (!target) return;
  const header = options?.stickyHeaderSelector
    ? (document.querySelector(
        options.stickyHeaderSelector,
      ) as HTMLElement | null)
    : null;
  const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
  const largeMin = options?.largeMinWidth ?? 1024;
  const isLarge = window.matchMedia(`(min-width: ${largeMin}px)`).matches;
  const extraGap = isLarge
    ? (options?.extraGapLarge ?? 20)
    : (options?.extraGapSmall ?? 12);
  const rect = target.getBoundingClientRect();
  const delta = rect.top - headerBottom - extraGap;
  if (Math.abs(delta) > 1) {
    // Respect prefers-reduced-motion
    scrollByY(delta);
  }
}
