import type { FC } from 'react';
import type { FieldProps } from './Field';
import type { HistoricalSceneBackground } from '@/lib/build-historical-scene-background';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Field } from './Field';

export type HistoricalSceneSkeltonProps = {
  isBusy: boolean;
  /** App-level Reduced Motion flag to stop shimmer animations. */
  reducedMotion?: boolean;
  /** When true, render images in cropped-top banner style. */
  cropTopBanner?: boolean;
  /** Optional banner aspect ratio (W/H) used only when `cropTopBanner` is true. */
  cropAspectRatio?: FieldProps['cropAspectRatio'];
  /** Optional vertical focal point for the cropped banner. */
  cropFocusY?: FieldProps['cropFocusY'];
  /** Optional decorative background config for the scene. */
  background?: HistoricalSceneBackground;
};

export const HistoricalSceneSkelton: FC<HistoricalSceneSkeltonProps> = ({
  isBusy,
  reducedMotion = false,
  cropTopBanner,
  cropAspectRatio,
  cropFocusY,
  background,
}) => (
  <Card className="relative w-full overflow-hidden" aria-busy={isBusy}>
    {/* Decorative background image layer (only when provided) */}
    {background?.hasImage && background.sceneBgUrl && (
      <div
        aria-hidden="true"
        className={['absolute inset-0 z-0', background.opacityClass].join(' ')}
      >
        <img
          src={background.sceneBgUrl}
          alt=""
          className="h-full w-full object-cover object-center select-none pointer-events-none"
          loading="lazy"
          decoding="async"
          draggable={false}
          data-testid="scene-background-image"
        />
        {background.blur === true && (
          <div
            data-testid="scene-background-blur"
            className="absolute inset-0 backdrop-blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-background/40" />
      </div>
    )}
    <CardHeader className="text-center px-4 lg:px-6">
      <div
        className="mx-auto w-full space-y-5 sm:space-y-6"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">Loading battle content…</span>
        {/* Overview placeholder */}
        <div className="mx-auto w-full space-y-3 text-left sm:text-center">
          <Skeleton className="mx-auto h-4 w-4/5" animated={!reducedMotion} />
        </div>

        <Separator />

        {/* Title block placeholder */}
        <div className="space-y-2 w-full">
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 py-2">
            <Skeleton className="h-10 w-10 rounded" animated={!reducedMotion} />
            <Skeleton className="h-8 w-3/5" animated={!reducedMotion} />
          </div>
          <div className="text-center">
            <Skeleton className="mx-auto h-5 w-3/5" animated={!reducedMotion} />
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="relative z-10 pt-0 px-4 lg:px-6">
      {/* Reuse Field placeholders by passing undefined sides */}
      <Field
        yono={undefined}
        komae={undefined}
        reducedMotion={reducedMotion}
        cropTopBanner={!!cropTopBanner}
        cropAspectRatio={cropAspectRatio}
        cropFocusY={cropFocusY}
        netaCardBackground={background?.netaCardBackground}
      />
    </CardContent>
  </Card>
);
