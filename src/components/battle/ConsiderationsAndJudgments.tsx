import { JudgeCard } from '@/components/battle/Judge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Battle } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';
import { ScrollText } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { scrollToY } from '@/lib/reduced-motion';
import { scrollToAnchor } from '@/lib/scroll';
import { BREAKPOINTS } from '@/hooks/use-breakpoint';

export type Props = {
  battle?: Battle;
  mode: PlayMode;
};

const judgesCodeName: string[] = ['O', 'U', 'S', 'C', 'K'];

export const ConsiderationsAndJudgments: FC<Props> = ({ battle, mode }) => {
  // 画面最下部までスクロール（新しい Battle が表示されたタイミング）
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const doc = document.documentElement;
      const top = Math.max(doc.scrollHeight - window.innerHeight, 0);
      scrollToY(top);
    });
    return () => cancelAnimationFrame(id);
  }, [battle?.id]);

  if (battle === undefined) {
    return null;
  }

  // 週休2日（その日の担当をランダムに抽出）
  const todaysJudges = judgesCodeName.filter(() => Math.random() < 5 / 7);

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-semibold">
          Judge's Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
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
        <div className="flex flex-row flex-nowrap items-stretch gap-4">
          {todaysJudges.map((judge) => (
            <div key={judge} className="flex-1 basis-0 shrink min-w-0">
              <JudgeCard codeNameOfJudge={judge} battle={battle} mode={mode} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
