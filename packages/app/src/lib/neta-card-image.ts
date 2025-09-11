import type { NetaCardImage } from '@/lib/build-historical-scene-background';

/**
 * Merge a base NetaCardImage with a Neta-provided imageUrl.
 *
 * Priority: Neta's imageUrl (yono/komae) takes precedence. If it's absent,
 * fall back to the base.imageUrl.
 *
 * - Trims whitespace on both inputs.
 * - Returns `undefined` when neither source provides a usable URL and `base`
 *   is also undefined.
 * - Does not mutate the `base` object; returns a new object when needed.
 *
 * Examples:
 * - mergeNetaCardImage({ imageUrl: '/fallback.png', opacity: 0.8 }, '/neta.png')
 *   => { imageUrl: '/neta.png', opacity: 0.8 }
 * - mergeNetaCardImage({ imageUrl: '/fallback.png' }, undefined)
 *   => { imageUrl: '/fallback.png' }
 * - mergeNetaCardImage(undefined, '   ')
 *   => undefined
 */
export function mergeNetaCardImage(
  base: NetaCardImage | undefined,
  netaImageUrl: string | undefined | null,
): NetaCardImage | undefined {
  const normalized =
    typeof netaImageUrl === 'string' && netaImageUrl.trim() !== ''
      ? netaImageUrl.trim()
      : undefined;
  const baseUrl =
    typeof base?.imageUrl === 'string' && base.imageUrl.trim() !== ''
      ? base.imageUrl.trim()
      : undefined;
  const finalUrl = normalized ?? baseUrl;
  if (!base && finalUrl === undefined) return undefined;
  return { ...(base ?? {}), imageUrl: finalUrl };
}
