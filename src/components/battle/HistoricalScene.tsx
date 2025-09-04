import type { FC } from 'react';
import { battleThemeCatalog } from '@yonokomae/catalog';
import { Field } from '@/components/battle/Field';
import type { Battle } from '@yonokomae/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export type Props = {
  battle: Battle;
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
}) => {
  // battle.themeId から BattleTheme を取得して何かに使う場合、以下のようにする。
  const theme =
    battleThemeCatalog.find((t) => t.id === battle.themeId) ??
    battleThemeCatalog[0];

  return (
    <Card className="w-full">
      <CardHeader className="text-center px-4 lg:px-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ID: {battle.id}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Theme: {battle.themeId} / Significance: {battle.significance}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {theme.name}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Overview
            </div>
            <CardDescription className="text-base">
              {battle.narrative.overview}
            </CardDescription>
          </div>

          <Separator />

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold lg:text-4xl">
              {theme.icon}
              {battle.title}
            </CardTitle>
            <CardDescription className="text-lg italic">
              {battle.subtitle}
            </CardDescription>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Scenario
            </div>
            <CardDescription className="text-base">
              {battle.narrative.scenario}
            </CardDescription>
          </div>

          {battle.provenance && battle.provenance.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2 text-left">
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
