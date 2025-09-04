import type { FC } from 'react';
import type { Neta } from '@yonokomae/types';
import { NetaView } from '@/components/battle/Neta';
import { Skeleton } from '@/components/ui/skeleton';

export type FieldProps = {
  yono?: Neta;
  komae?: Neta;
  /** When true, render images in cropped-top banner style. */
  cropTopBanner?: boolean;
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
   * See NetaView Props `cropFocusY` for accepted values.
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

export const Field: FC<FieldProps> = ({
  yono,
  komae,
  cropTopBanner = false,
  cropAspectRatio,
  cropFocusY,
}) => {
  // Loading placeholder using shadcn/ui Skeleton
  const Placeholder: FC = () => (
    <div
      data-testid="placeholder"
      className="flex h-full flex-1 flex-col items-stretch rounded-lg border bg-card p-6"
    >
      <div className="w-full space-y-4">
        <div className="text-center">
          <Skeleton className="mx-auto h-6 w-32" />
          <Skeleton className="mx-auto mt-2 h-4 w-24" />
        </div>
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
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
            <NetaView
              {...yono}
              fullHeight
              cropTopBanner={cropTopBanner}
              cropFocusY={cropFocusY}
              cropAspectRatio={cropAspectRatio}
            />
          ) : (
            <Placeholder />
          )}
        </div>
        {/* KOMAE */}
        <div
          data-testid="slot-komae"
          className="flex min-w-0 flex-1 flex-col items-stretch space-y-4"
        >
          {komae ? (
            <NetaView
              {...komae}
              fullHeight
              cropTopBanner={cropTopBanner}
              cropFocusY={cropFocusY}
              cropAspectRatio={cropAspectRatio}
            />
          ) : (
            <Placeholder />
          )}
        </div>
      </div>
    </div>
  );
};
