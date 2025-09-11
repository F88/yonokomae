import { Field } from '@/components/battle/Field';
import { OverView } from '@/components/battle/OverView';
import { Scenario } from '@/components/battle/Scenario';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { battleThemeCatalog } from '@yonokomae/catalog';
import type { Battle } from '@yonokomae/types';
import type { FC } from 'react';
import { useMemo } from 'react';
import { SignificanceChip } from '../ui/SignificanceChip';
import { MetaData } from './MetaData';
import { PublishStateChip } from './PublishStateChip';

export type Props = {
  battle?: Battle | null;
  /** When true, render images in cropped-top banner style. */
  cropTopBanner?: boolean;
  /** Toggle visibility of metadata (ID/Theme/Significance chips). Default true. */
  showMetaData?: boolean;
  /** Optional explicit loading flag. When true, sets aria-busy regardless of data. */
  isLoading?: boolean;
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
   * Optional vertical focal point for cropped banner. See NetaView Props `cropFocusY`.
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

export const HistoricalScene: FC<Props> = ({
  battle,
  cropTopBanner = false,
  cropAspectRatio,
  cropFocusY,
  showMetaData = false,
  isLoading = false,
}) => {
  // Pick one of three icons at mount to avoid re-randomizing on each render
  const randomIconSrc = useMemo(() => {
    const icons = [
      'ykw-icon-4.png',
      'ykw-icon-6.png',
      'ykw-icon-7.png',
      'showdown-on-the-great-river.png',
    ];
    const pick = icons[Math.floor(Math.random() * icons.length)];
    return `${import.meta.env.BASE_URL}${pick}`;
  }, []);

  const isBusy = isLoading || !battle;

  // Render placeholder when no battle is provided
  if (!battle) {
    return (
      <Card className="w-full" aria-busy={isBusy}>
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
              <Skeleton className="mx-auto h-4 w-4/5" />
            </div>

            <Separator />

            {/* Title block placeholder */}
            <div className="space-y-2 w-full">
              <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 py-2">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-8 w-3/5" />
              </div>
              <div className="text-center">
                <Skeleton className="mx-auto h-5 w-3/5" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 lg:px-6">
          {/* Reuse Field placeholders by passing undefined sides */}
          <Field
            yono={undefined}
            komae={undefined}
            cropTopBanner={cropTopBanner}
            cropAspectRatio={cropAspectRatio}
            cropFocusY={cropFocusY}
          />
        </CardContent>
      </Card>
    );
  }

  /**
   * Resolves the theme for the battle.
   * Finds the theme in the catalog by battle.themeId.
   * If not found, defaults to the first theme in the catalog.
   */
  const theme =
    battleThemeCatalog.find((t) => t.id === battle.themeId) ??
    battleThemeCatalog[0];

  return (
    <Card
      className={cn(
        'w-full',
        battle.significance === 'legendary' && 'legendary-card',
      )}
      aria-busy={isBusy}
      style={{
        // backgroundImage: "url('/showdown-on-the-great-river.png')",
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
      }}
    >
      <CardHeader className="text-center px-4 lg:px-6">
        <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
          {/* Meta data first (optional) */}
          {showMetaData ? <MetaData battle={battle} align="center" /> : null}

          {/* Overview */}
          <div className="mx-auto max-w-3xl space-y-3 text-left sm:text-center">
            <OverView battle={battle} showLabel />
          </div>

          <Separator />

          {/* Title block */}
          <div className="space-y-2">
            {/* Publish State (HistoricalScene only shows when NOT published) */}
            {battle.publishState !== 'published' && (
              <div className="flex justify-center">
                <PublishStateChip state={battle.publishState} showLabel />
              </div>
            )}

            {/* Legendary battle */}
            {battle.significance && battle.significance === 'legendary' && (
              <>
                <SignificanceChip
                  significance={battle.significance}
                  showLabel
                />
                <img
                  src={randomIconSrc}
                  alt="Legendary battle icon"
                  className="mx-auto h-30 w-auto opacity-90"
                />
              </>
            )}

            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 py-2">
              <span aria-hidden className="inline-block text-3xl lg:text-4xl">
                {theme.icon}
              </span>
              <CardTitle className="font-extrabold tracking-tight leading-tight text-4xl lg:text-5xl text-balance break-words">
                {battle.title}
              </CardTitle>
            </div>
            {battle.subtitle ? (
              <CardDescription className="text-muted-foreground italic text-lg lg:text-xl text-balance mx-auto max-w-3xl">
                {battle.subtitle}
              </CardDescription>
            ) : null}
          </div>

          {/* Scenario */}
          <Scenario battle={battle} showLabel />

          {battle.provenance && battle.provenance.length > 0 && (
            <>
              <Separator />
              <div className="mx-auto max-w-3xl space-y-2 text-left">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-center">
                  Sources / Provenance
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {battle.provenance.map((p, i) => (
                    <li key={i} className="text-sm">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                        >
                          {p.label}
                        </a>
                      ) : (
                        <span>{p.label}</span>
                      )}
                      {p.note ? (
                        <span className="text-muted-foreground">
                          {' '}
                          — {p.note}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-4 lg:px-6">
        <Field
          yono={battle.yono}
          komae={battle.komae}
          cropTopBanner={cropTopBanner}
          cropAspectRatio={cropAspectRatio}
          cropFocusY={cropFocusY}
        />
      </CardContent>
    </Card>
  );
};
