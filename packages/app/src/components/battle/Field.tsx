import type { Props as NetaCardProps } from '@/components/battle/NetaCard';
import { NetaCard } from '@/components/battle/NetaCard';
import { NetaCardSkelton } from '@/components/battle/NetaCardSkelton';
import type { NetaCardImage } from '@/lib/build-historical-scene-background';
import { mergeNetaCardImage } from '@/lib/neta-card-image';
import type { Neta } from '@yonokomae/types';
import type { FC } from 'react';

/**
 * Battle field that renders a pair of Neta cards (Yono, Komae).
 *
 * Responsibilities:
 * - Layout two `NetaCard` components side-by-side with consistent spacing.
 * - Propagate app-level Reduced Motion to skeleton placeholders.
 * - Apply optional top-cropped banner presentation for card images.
 * - Merge a base `netaCardImage` with each Neta's own `imageUrl` via
 *   `mergeNetaCardImage` so that per-Neta images take precedence.
 */
export type FieldProps = {
  yono?: Neta;
  komae?: Neta;
  /** App-level Reduced Motion flag propagated to placeholders. */
  reducedMotion?: boolean;
  /** When true, render images in cropped-top banner style. */
  cropTopBanner?: boolean;
  /**
   * Optional base image configuration applied to both Yono and Komae.
   *
   * Merge rules (performed per card):
   * - If the Neta has a non-empty `imageUrl`, it overrides `base.imageUrl`.
   * - Otherwise, falls back to `base.imageUrl` (if provided).
   * - Whitespace is trimmed on both inputs; empty strings are ignored.
   * - Returns `undefined` to `NetaCard` when no usable image URL is present.
   */
  netaCardImage?: NetaCardProps['cardImage'];
  /**
   * Pass-through background settings for each NetaCard.
   * When provided, each card surface becomes transparent and, if imageUrl is set,
   * a decorative image layer is drawn inside the card.
   *
   * Notes:
   * - This does not alter the merge priority described in `netaCardImage`.
   * - Reduced Motion is respected by the card implementation; this component
   *   only forwards the flag to placeholders.
   */
  netaCardBackground?: NetaCardProps['cardBackground'];
  /**
   * Optional banner aspect ratio (W/H) used only when `cropTopBanner` is true.
   * Format: 'W/H' (e.g. '16/7'). Default is '16/7'.
   * Smaller denominator (H) = taller banner.
   */
  cropAspectRatio?:
    | '32/1'
    | '32/2'
    | '32/3'
    | '32/4'
    | '32/5'
    | '32/6'
    | '32/7'
    | '32/8'
    | '32/9'
    | '32/10'
    | '32/11'
    | '32/12'
    | '32/13'
    | '32/14'
    | '32/15'
    | '32/16'
    | '32/17'
    | '32/18'
    | '32/19'
    | '32/20'
    | '32/21'
    | '32/22'
    | '32/23'
    | '32/24'
    | '32/25'
    | '32/26'
    | '32/27'
    | '32/28'
    | '32/29'
    | '32/30'
    | '32/31';
  /**
   * Optional vertical focal point for the cropped banner when `cropTopBanner` is true.
   * See NetaCard Props `cropFocusY` for accepted values.
   */
  cropFocusY?:
    | 'top'
    | 'center'
    | 'bottom'
    | 'y-0'
    | 'y-10'
    | 'y-20'
    | 'y-30'
    | 'y-40'
    | 'y-50'
    | 'y-60'
    | 'y-70'
    | 'y-80'
    | 'y-90'
    | 'y-100';
};

/**
 * Renders the battle field with 2 columns. Uses `mergeNetaCardImage` to derive
 * each card's `cardImage` from an optional base config and the Neta's image.
 */
export const Field: FC<FieldProps> = ({
  yono,
  komae,
  reducedMotion = false,
  cropTopBanner = false,
  cropAspectRatio,
  cropFocusY,
  netaCardImage,
  netaCardBackground,
}) => {
  // Use shared util for testability
  /**
   * Delegate to `mergeNetaCardImage` so behavior stays consistent and tested.
   */
  const mergeCardImage = (
    base: NetaCardImage | undefined,
    url: string | undefined | null,
  ): NetaCardImage | undefined => mergeNetaCardImage(base, url);

  // Loading placeholder that mirrors NetaCard background behavior
  const Placeholder: FC = () => (
    <NetaCardSkelton
      fullHeight
      reducedMotion={reducedMotion}
      cardBackground={netaCardBackground}
      cropTopBanner={cropTopBanner}
      cropAspectRatio={cropAspectRatio}
    />
  );

  return (
    <div className="w-full space-y-8">
      {/* Full-width band; stretch cards to edges so side strips are hidden */}
      <div className="flex w-full items-stretch justify-between gap-2 md:gap-3 px-0">
        {/* YONO */}
        <div
          data-testid="slot-yono"
          className="flex min-w-0 flex-1 flex-col items-stretch space-y-4"
        >
          {yono ? (
            (() => {
              const { imageUrl: _omitYonoImage, ...yonoProps } = yono;
              void _omitYonoImage;
              return (
                <NetaCard
                  {...yonoProps}
                  fullHeight
                  cropTopBanner={cropTopBanner}
                  cropFocusY={cropFocusY}
                  cropAspectRatio={cropAspectRatio}
                  cardImage={mergeCardImage(netaCardImage, yono.imageUrl)}
                  cardBackground={netaCardBackground}
                />
              );
            })()
          ) : (
            <Placeholder />
          )}
        </div>
        ;{/* KOMAE */}
        <div
          data-testid="slot-komae"
          className="flex min-w-0 flex-1 flex-col items-stretch space-y-4"
        >
          {komae ? (
            (() => {
              const { imageUrl: _omitKomaeImage, ...komaeProps } = komae;
              void _omitKomaeImage;
              return (
                <NetaCard
                  {...komaeProps}
                  fullHeight
                  cropTopBanner={cropTopBanner}
                  cropFocusY={cropFocusY}
                  cropAspectRatio={cropAspectRatio}
                  cardImage={mergeCardImage(netaCardImage, komae.imageUrl)}
                  cardBackground={netaCardBackground}
                />
              );
            })()
          ) : (
            <Placeholder />
          )}
        </div>
        ;
      </div>
    </div>
  );
};
