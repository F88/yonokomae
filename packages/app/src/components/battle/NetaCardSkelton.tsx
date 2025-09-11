import type { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { NetaCardBackground } from '@/lib/build-historical-scene-background';

export type NetaCardSkeltonProps = {
  /** Match NetaCard prop to keep heights aligned within Field. */
  fullHeight?: boolean;
  /** App-level Reduced Motion flag to stop shimmer animations. */
  reducedMotion?: boolean;
  /** Apply the same decorative background behavior as NetaCard. */
  cardBackground?: NetaCardBackground | undefined;
  /** When true, render a banner-like image area placeholder. */
  cropTopBanner?: boolean;
  /** Optional banner aspect ratio (W/H) for the placeholder when `cropTopBanner` is true. */
  cropAspectRatio?:
    | '16/1'
    | '16/2'
    | '16/3'
    | '16/4'
    | '16/5'
    | '16/6'
    | '16/7'
    | '16/8'
    | '16/9'
    | '16/10'
    | '16/11'
    | '16/12'
    | '16/13'
    | '16/14'
    | '16/15'
    | '16/16'
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
};

// numeric opacity has been removed in favor of Tailwind class strings

export const NetaCardSkelton: FC<NetaCardSkeltonProps> = ({
  fullHeight = false,
  reducedMotion = false,
  cardBackground,
  cropTopBanner = false,
  cropAspectRatio,
}) => {
  const hasCardBackground =
    typeof cardBackground !== 'undefined' && cardBackground !== null;
  const cardBgUrlRaw = cardBackground?.imageUrl;
  const hasCardBgImage =
    typeof cardBgUrlRaw === 'string' && cardBgUrlRaw.trim() !== '';
  const cardBgUrl = hasCardBgImage ? cardBgUrlRaw!.trim() : undefined;
  const cardBgOpacityClass = cardBackground?.opacityClass ?? 'opacity-30';
  const ratio = cropTopBanner ? (cropAspectRatio ?? '16/7') : undefined;
  let ratioClass = '';
  switch (ratio) {
    case '16/1':
      ratioClass = 'aspect-[16/1]';
      break;
    case '16/2':
      ratioClass = 'aspect-[16/2]';
      break;
    case '16/3':
      ratioClass = 'aspect-[16/3]';
      break;
    case '16/4':
      ratioClass = 'aspect-[16/4]';
      break;
    case '16/5':
      ratioClass = 'aspect-[16/5]';
      break;
    case '16/6':
      ratioClass = 'aspect-[16/6]';
      break;
    case '16/7':
      ratioClass = 'aspect-[16/7]';
      break;
    case '16/8':
      ratioClass = 'aspect-[16/8]';
      break;
    case '16/9':
      ratioClass = 'aspect-[16/9]';
      break;
    case '16/10':
      ratioClass = 'aspect-[16/10]';
      break;
    case '16/11':
      ratioClass = 'aspect-[16/11]';
      break;
    case '16/12':
      ratioClass = 'aspect-[16/12]';
      break;
    case '16/13':
      ratioClass = 'aspect-[16/13]';
      break;
    case '16/14':
      ratioClass = 'aspect-[16/14]';
      break;
    case '16/15':
      ratioClass = 'aspect-[16/15]';
      break;
    case '16/16':
      ratioClass = 'aspect-[16/16]';
      break;
    case '32/1':
      ratioClass = 'aspect-[32/1]';
      break;
    case '32/2':
      ratioClass = 'aspect-[32/2]';
      break;
    case '32/3':
      ratioClass = 'aspect-[32/3]';
      break;
    case '32/4':
      ratioClass = 'aspect-[32/4]';
      break;
    case '32/5':
      ratioClass = 'aspect-[32/5]';
      break;
    case '32/6':
      ratioClass = 'aspect-[32/6]';
      break;
    case '32/7':
      ratioClass = 'aspect-[32/7]';
      break;
    case '32/8':
      ratioClass = 'aspect-[32/8]';
      break;
    case '32/9':
      ratioClass = 'aspect-[32/9]';
      break;
    case '32/10':
      ratioClass = 'aspect-[32/10]';
      break;
    case '32/11':
      ratioClass = 'aspect-[32/11]';
      break;
    case '32/12':
      ratioClass = 'aspect-[32/12]';
      break;
    case '32/13':
      ratioClass = 'aspect-[32/13]';
      break;
    case '32/14':
      ratioClass = 'aspect-[32/14]';
      break;
    case '32/15':
      ratioClass = 'aspect-[32/15]';
      break;
    case '32/16':
      ratioClass = 'aspect-[32/16]';
      break;
    case '32/17':
      ratioClass = 'aspect-[32/17]';
      break;
    case '32/18':
      ratioClass = 'aspect-[32/18]';
      break;
    case '32/19':
      ratioClass = 'aspect-[32/19]';
      break;
    case '32/20':
      ratioClass = 'aspect-[32/20]';
      break;
    case '32/21':
      ratioClass = 'aspect-[32/21]';
      break;
    case '32/22':
      ratioClass = 'aspect-[32/22]';
      break;
    case '32/23':
      ratioClass = 'aspect-[32/23]';
      break;
    case '32/24':
      ratioClass = 'aspect-[32/24]';
      break;
    case '32/25':
      ratioClass = 'aspect-[32/25]';
      break;
    case '32/26':
      ratioClass = 'aspect-[32/26]';
      break;
    case '32/27':
      ratioClass = 'aspect-[32/27]';
      break;
    case '32/28':
      ratioClass = 'aspect-[32/28]';
      break;
    case '32/29':
      ratioClass = 'aspect-[32/29]';
      break;
    case '32/30':
      ratioClass = 'aspect-[32/30]';
      break;
    case '32/31':
      ratioClass = 'aspect-[32/31]';
      break;
    default:
      ratioClass = '';
  }

  return (
    <Card
      data-testid="placeholder"
      className={[
        'w-full overflow-hidden pt-0 relative',
        'max-w-none',
        hasCardBackground ? '!bg-transparent' : '',
        fullHeight ? 'h-full' : '',
      ].join(' ')}
    >
      {/* Optional decorative background image (inside the card) */}
      {hasCardBgImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
        >
          <img
            src={cardBgUrl}
            alt=""
            className={['h-full w-full object-cover', cardBgOpacityClass].join(
              ' ',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/0 to-background/20" />
        </div>
      )}
      {/* Optional blur overlay to enhance readability over busy backgrounds */}
      {hasCardBackground && cardBackground?.backdropBlur === true && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] backdrop-blur-sm"
        />
      )}

      {/* Image area placeholder (optional banner-like) */}
      {cropTopBanner && (
        <div className={['w-full overflow-hidden', ratioClass].join(' ')}>
          <Skeleton className="h-full w-full" animated={!reducedMotion} />
        </div>
      )}

      <CardContent className="px-2 pt-2 pb-0 flex-1 flex flex-col">
        <div className="flex h-full min-w-0 flex-col gap-3">
          <div className="text-center">
            <Skeleton className="mx-auto h-5 w-2/3" animated={!reducedMotion} />
            <Skeleton
              className="mx-auto mt-2 h-4 w-1/2"
              animated={!reducedMotion}
            />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" animated={!reducedMotion} />
            <Skeleton className="h-4 w-3/4" animated={!reducedMotion} />
          </div>
          <div className="mt-auto flex justify-center">
            <Skeleton className="h-6 w-28 rounded" animated={!reducedMotion} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
