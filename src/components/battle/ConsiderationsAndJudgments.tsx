import { JudgeCard } from '@/components/battle/Judge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Battle } from '@yonokomae/types';
import type { PlayMode } from '@/yk/play-mode';
import { ScrollText } from 'lucide-react';
import { type FC, useEffect } from 'react';
// import { scrollToY } from '@/lib/reduced-motion';
import { scrollToAnchor } from '@/lib/scroll';
import { BREAKPOINTS } from '@/hooks/use-breakpoint';
import { JUDGES } from '@/yk/judges';

/**
 * Props for ConsiderationsAndJudgments.
 *
 * Judges displayed in this card are chosen per render by
 * {@link pickTodaysJudgeCodeNames}. The selection is non-deterministic on
 * purpose and does not depend on battle id or date.
 */
export type Props = {
  battle?: Battle;
  mode: PlayMode;
};

// RNG helpers for shuffling are handled by Math.random() in this mode.

/**
 * In-place Fisher–Yates shuffle.
 */
function shuffleInPlace<T>(arr: T[], rnd: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Select judges to display for the current battle render.
 *
 * Contract
 * - Input: none (no dependency on battle id nor calendar date)
 * - Process:
 *   - For each judge in {@link JUDGES}, select independently with probability
 *     p = 4/7.
 *   - If more than 4 judges were selected, shuffle and keep the first 4.
 * - Output: An array of judge code names with length in [0, min(4, JUDGES.length)].
 *
 * Properties
 * - Non-deterministic: results may differ across renders; the same battle can
 *   show different judges.
 * - Expected size: roughly |JUDGES| * (4/7), upper-bounded at 4.
 * - Rationale: models the "3 days off" metaphor with a simple, memoryless
 *   random policy.
 *
 * @returns Array of judge code names to render.
 * @example
 * const judges = pickTodaysJudgeCodeNames();
 * // judges.length is between 0 and 4 inclusively.
 */
function pickTodaysJudgeCodeNames(): string[] {
  // Simple, non-deterministic selection per render:
  // - Each judge is independently selected with probability p = 4/7
  // - Cap the total number of selected judges at 4 (max)
  const base = JUDGES.map((j) => j.codeName);
  // 週休3日をイメージ
  const p = 4 / 7;
  const chosen = base.filter(() => Math.random() < p);
  if (chosen.length <= 4) return chosen;
  // If more than 4 selected, shuffle and take first 4 to enforce the cap
  const arr = [...chosen];
  shuffleInPlace(arr, Math.random);
  return arr.slice(0, 4);
}

export const ConsiderationsAndJudgments: FC<Props> = ({ battle, mode }) => {
  // 画面最下部までスクロール（新しい Battle が表示されたタイミング）
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // nop
      return;
      // console.info('Scrolling to the bottom of the battle');
      // const doc = document.documentElement;
      // const top = Math.max(doc.scrollHeight - window.innerHeight, 0);
      // scrollToY(top); // temporarily disabled // do not delete this line
    });
    return () => cancelAnimationFrame(id);
  }, [battle?.id]);

  if (battle === undefined) {
    return null;
  }

  // Judges
  const todaysJudges = pickTodaysJudgeCodeNames();

  return (
    <Card className="w-full overflow-hidden py-0 pb-2 gap-0 max-w-none h-full">
      <CardHeader className="text-center py-2 gap-0 ">
        <CardTitle className="text-2xl font-semibold my-0">
          Judge's Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mt-0 mb-2">
          <h3 className="text-lg font-semibold">
            <a
              href={`#${battle.id}`}
              className="inline-flex items-center gap-1.5 underline decoration-dotted underline-offset-2 hover:decoration-solid"
              onClick={(e) => {
                e.preventDefault();
                scrollToAnchor(battle.id, {
                  stickyHeaderSelector: 'header.sticky',
                  largeMinWidth: BREAKPOINTS.lg,
                  extraGapLarge: 20,
                  extraGapSmall: 12,
                });
                if (
                  typeof window !== 'undefined' &&
                  window.history &&
                  typeof window.history.replaceState === 'function'
                ) {
                  window.history.replaceState(null, '', `#${battle.id}`);
                }
              }}
              title="Scroll to the top of this battle"
            >
              <ScrollText className="h-4 w-4" aria-hidden="true" />
              {battle.title}
            </a>
          </h3>
        </div>

        {/* Judges: always horizontal, no scroll; fit within viewport */}
        <div className="flex flex-row flex-nowrap items-start gap-4">
          {todaysJudges.map((judge) => (
            <div key={judge} className="flex-1 basis-0 shrink min-w-0 py-0">
              <JudgeCard codeNameOfJudge={judge} battle={battle} mode={mode} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
