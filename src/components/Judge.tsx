import type { FC } from 'react';
import type { Battle } from '@/types/types';
import { useJudgement } from '@/hooks/use-judgement';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <Card className="h-full min-w-0 text-center gap-2 py-2">
      <CardHeader className="py-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Judge {nameOfJudge}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="font-semibold break-words whitespace-normal min-w-0">
          {judgement.status === 'loading' && '…'}
          {judgement.status === 'error' && (
            <span className="text-destructive">Failed</span>
          )}
          {judgement.status === 'success' && judgement.data}
        </div>
      </CardContent>
    </Card>
  );
};
