import { JudgeCard } from '@/components/battle/Judge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Battle } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';
import { ScrollText } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { scrollToY } from '@/lib/reduced-motion';
import { scrollToAnchor } from '@/lib/scroll';
import { BREAKPOINTS } from '@/hooks/use-breakpoint';
import { JUDGES } from '@/yk/judges';

export type Props = {
  battle?: Battle;
  mode: PlayMode;
};

// Deterministic RNG based on battle id to avoid flicker across re-renders.
function hashString32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rnd: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function pickTodaysJudgeCodeNames(battleId: string): string[] {
  const base = JUDGES.map((j) => j.codeName);
  const rnd = mulberry32(hashString32(battleId));
  const arr = [...base];
  shuffleInPlace(arr, rnd);
  const maxCount = Math.min(4, arr.length);
  const minCount = 0;
  const count = minCount + Math.floor(rnd() * (maxCount - minCount + 1));
  return arr.slice(0, count);
}

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

  // Judges
  // - 週休3日 (その日の担当をランダムに抽出)
  // - 最大4人まで (5人全員は多すぎる)
  const todaysJudges = pickTodaysJudgeCodeNames(battle.id);

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
