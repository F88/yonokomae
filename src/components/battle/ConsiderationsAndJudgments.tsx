import { type FC, useEffect } from 'react';
import type { Battle } from '@/types/types';
import { JudgeCard } from '@/components/battle/Judge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { PlayMode } from '@/yk/play-mode';

export type Props = {
  battle?: Battle;
  mode: PlayMode;
};

const judgesName: string[] = ['O', 'U', 'S', 'C'];

export const ConsiderationsAndJudgments: FC<Props> = ({ battle, mode }) => {
  // 画面最下部までスクロール（新しい Battle が表示されたタイミング）
  useEffect(() => {
    // Defer until layout is painted so height is correct
    const id = requestAnimationFrame(() => {
      // Use documentElement to cover the whole page height
      const doc = document.documentElement;
      const top = Math.max(doc.scrollHeight - window.innerHeight, 0);
      window.scrollTo({ top, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(id);
  }, [battle?.id]);

  if (battle === undefined) {
    return null;
  }
  // 週休2日
  const todaysJudges = judgesName.filter(() => Math.random() < 5 / 7);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">
          Judge's Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{battle.title}</h3>
        </div>
        <div className="flex flex-row flex-nowrap items-stretch gap-4">
          {todaysJudges.map((judge) => (
            <div key={judge} className="flex-1 basis-0 min-w-0">
              <JudgeCard nameOfJudge={judge} battle={battle} mode={mode} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
