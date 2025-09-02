import type { FC } from 'react';
import type { Battle } from '@/types/types';
import { useJudgement } from '@/hooks/use-judgement';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Winner } from '@/yk/repo/core/repositories';
import type { PlayMode } from '@/yk/play-mode';

export type JudgeCardProps = {
  nameOfJudge: string;
  battle: Battle;
  mode: PlayMode;
};

export const JudgeCard: FC<JudgeCardProps> = ({
  nameOfJudge,
  battle,
  mode,
}) => {
  const judgement = useJudgement(nameOfJudge, battle, mode);

  return (
    <Card className="h-full min-w-0 overflow-hidden text-center gap-2 px-0 py-0">
      <CardHeader className="px-0 pt-4">
        <CardTitle className="text-xs font-medium">
          Judge {nameOfJudge}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 pt-0 pb-2 flex items-center justify-center">
        <div className="min-w-0 font-semibold break-words whitespace-normal">
          <div className="min-h-[28px] flex items-center justify-center">
            {judgement.status === 'loading' && '…'}
            {judgement.status === 'error' && (
              <span className="text-destructive">Failed</span>
            )}
            {judgement.status === 'success' && (
              <WinnerBadge winner={judgement.data} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function WinnerBadge({ winner }: { winner: Winner }) {
  switch (winner) {
    case 'YONO':
      return (
        <Badge
          variant="default"
          aria-label="Winner: YONO"
          className="px-2 py-0.5 text-xs"
        >
          YONO
        </Badge>
      );
    case 'KOMAE':
      return (
        <Badge
          variant="secondary"
          aria-label="Winner: KOMAE"
          className="px-2 py-0.5 text-xs"
        >
          KOMAE
        </Badge>
      );
    case 'DRAW':
      return (
        <Badge
          variant="outline"
          aria-label="Result: DRAW"
          className="px-2 py-0.5 text-xs border-muted-foreground/40 text-muted-foreground"
        >
          DRAW
        </Badge>
      );
  }
}
