import type { FC } from 'react';
import type { Battle } from '@/types/types';
import { HistoricalScene } from '@/components/HistoricalScene';
import { ConsiderationsAndJudgments } from '@/components/ConsiderationsAndJudgments';

export type BattleContainerProps = {
  battle: Battle;
};

export const BattleContainer: FC<BattleContainerProps> = ({ battle }) => {
  const isBattleReportLoading = battle.status === 'loading';
  return (
    <div className="space-y-6">
      <HistoricalScene battle={battle} />
      {isBattleReportLoading ? (
        <ConsiderationsAndJudgments battle={undefined} />
      ) : (
        <ConsiderationsAndJudgments battle={battle} />
      )}
    </div>
  );
};
