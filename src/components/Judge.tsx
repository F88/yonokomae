import type { FC } from 'react';
import type { Battle } from '@/types/types';
import { useJudgement } from '@/hooks/use-judgement';

export type JudgeCardProps = {
  nameOfJudge: string;
  battle: Battle;
};

export const JudgeCard: FC<JudgeCardProps> = ({ nameOfJudge, battle }) => {
  const judgement = useJudgement(nameOfJudge, battle);

  return (
    <div className="rounded-lg border p-4 text-center">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Judge {nameOfJudge}
      </div>
      <div className="font-semibold">
        {judgement.status === 'loading' && '…'}
        {judgement.status === 'error' && (
          <span className="text-destructive">Failed</span>
        )}
        {judgement.status === 'success' && judgement.data}
      </div>
    </div>
  );
};
