import type { FC } from 'react';
import type { Battle } from '@/types/types';
import { HistoricalScene } from '@/components/battle/HistoricalScene';
import { ConsiderationsAndJudgments } from '@/components/battle/ConsiderationsAndJudgments';
import type { PlayMode } from '@/yk/play-mode';

export type BattleContainerProps = {
  battle: Battle;
  mode: PlayMode;
};

export const BattleContainer: FC<BattleContainerProps> = ({ battle, mode }) => {
  const isBattleReportLoading = battle.status === 'loading';
  return (
    <div className="space-y-6">
      <HistoricalScene battle={battle} />
      {isBattleReportLoading ? (
        <ConsiderationsAndJudgments battle={undefined} mode={mode} />
      ) : (
        <ConsiderationsAndJudgments battle={battle} mode={mode} />
      )}
    </div>
  );
};
