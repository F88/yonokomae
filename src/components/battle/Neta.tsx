import type { FC } from 'react';
import type { Neta } from '@yonokomae/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type Props = Neta & {
  /**
   * When true, makes the card take full available height to match siblings.
   */
  fullHeight?: boolean;
  /**
   * When true, render the image inside a fixed banner-like aspect and crop centered.
   * This shows only a portion of the image (center area) similar to a header strip.
   */
  cropTopBanner?: boolean;
  /**
   * Optional banner aspect ratio (W/H) used only when `cropTopBanner` is true.
   * - Format: 'W/H' (e.g. '16/7' means width:height = 16:7)
   * - Visual guide: smaller H = taller banner (shows more vertical area)
   *   - 16/5 (tallest) → 16/6 → 16/7 (default) → 16/8 → 16/9 → 16/10 → 16/11 → 16/12 (slimmest)
   * - Supported values are safe-listed to match Tailwind's arbitrary aspect classes.
   * - Default: '16/7' (balanced height)
   * - Ignored when `cropTopBanner` is false.
   */
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
  /**
   * Optional vertical focal point for the cropped banner when `cropTopBanner` is true.
   * Controls which vertical area of the image is prioritized inside the fixed aspect.
   * - Presets: 'top' | 'center' | 'bottom'
   * - Percent buckets (from top): 'y-0' | 'y-10' | ... | 'y-100' (10% steps)
   *   - Example: 'y-80' ≈ focus around 4/5 from top.
   * Default is 'center'. Ignored when `cropTopBanner` is false.
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

export const NetaView: FC<Props> = ({
  imageUrl,
  title,
  subtitle,
  description,
  power,
  fullHeight = false,
  cropTopBanner = false,
  cropFocusY,
  cropAspectRatio,
}) => {
  const hasImage = typeof imageUrl === 'string' && imageUrl.trim() !== '';
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
  // Determine vertical focal point class for object-position
  const focus = cropTopBanner ? (cropFocusY ?? 'center') : undefined;
  let focusClass = '';
  switch (focus) {
    case 'top':
      focusClass = 'object-top';
      break;
    case 'center':
      focusClass = 'object-center';
      break;
    case 'bottom':
      focusClass = 'object-bottom';
      break;
    case 'y-0':
      focusClass = 'object-[50%_0%]';
      break;
    case 'y-10':
      focusClass = 'object-[50%_10%]';
      break;
    case 'y-20':
      focusClass = 'object-[50%_20%]';
      break;
    case 'y-30':
      focusClass = 'object-[50%_30%]';
      break;
    case 'y-40':
      focusClass = 'object-[50%_40%]';
      break;
    case 'y-50':
      focusClass = 'object-[50%_50%]';
      break;
    case 'y-60':
      focusClass = 'object-[50%_60%]';
      break;
    case 'y-70':
      focusClass = 'object-[50%_70%]';
      break;
    case 'y-80':
      focusClass = 'object-[50%_80%]';
      break;
    case 'y-90':
      focusClass = 'object-[50%_90%]';
      break;
    case 'y-100':
      focusClass = 'object-[50%_100%]';
      break;
    default:
      focusClass = '';
  }
  return (
    <Card
      className={[
        'w-full overflow-hidden pt-0',
        'max-w-none',
        fullHeight ? 'h-full' : '',
      ].join(' ')}
    >
      {/* Image */}
      {hasImage && (
        <div className={['w-full overflow-hidden', ratioClass].join(' ')}>
          <img
            src={imageUrl}
            alt={title}
            className={[
              'h-full w-full object-cover transition-transform hover:scale-105',
              cropTopBanner ? focusClass : '',
            ].join(' ')}
          />
        </div>
      )}
      {/* Content */}
      <CardContent className="px-2 pt-2 pb-0 flex-1 flex flex-col">
        <div className="flex h-full min-w-0 flex-col gap-3">
          <div className="text-center">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground italic">{subtitle}</p>
          </div>

          <p className="text-sm text-center text-muted-foreground break-words">
            {description}
          </p>

          {/* Power */}
          <div className="mt-auto flex justify-center ">
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <span className="text-lg">💥</span>
              <span className="font-bold">
                Power: {new Intl.NumberFormat(undefined).format(power)}
              </span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
