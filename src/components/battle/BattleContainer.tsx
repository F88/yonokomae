import type { FC } from 'react';
import type { Battle } from '@/types/types';
import { HistoricalScene } from '@/components/battle/HistoricalScene';
import { ConsiderationsAndJudgments } from '@/components/battle/ConsiderationsAndJudgments';
import type { PlayMode } from '@/yk/play-mode';

export type BattleContainerProps = {
  battle: Battle;
  mode: PlayMode;
};

const cropSettings = {
  default: {
    enableCropTopBanner: false,
    aspect: '32/16',
    focusY: 'y-50',
  },
  'historical-research': {
    enableCropTopBanner: true,
    // const aspect = '32/5';
    // const aspect = '32/6';
    // const aspect = '32/7';
    // const aspect = '32/8';
    aspect: '32/9',
    // const aspect = '32/10';
    // const aspect = '32/11';
    // const aspect = '32/12';
    // const aspect = '32/13';
    // const aspect = '32/14';
    // const aspect = '32/15';
    focusY: 'y-50',
  },
} as const;

type CropSettingsKey = keyof typeof cropSettings;
const isCropSettingsKey = (key: string): key is CropSettingsKey =>
  key in cropSettings;

export const BattleContainer: FC<BattleContainerProps> = ({ battle, mode }) => {
  const isBattleReportLoading = battle.status === 'loading';

  const cropSettingsForMode = isCropSettingsKey(mode.id)
    ? cropSettings[mode.id]
    : cropSettings.default;

  return (
    <div className="space-y-6" data-testid="battle">
      <HistoricalScene
        battle={battle}
        cropTopBanner={cropSettingsForMode.enableCropTopBanner}
        cropAspectRatio={cropSettingsForMode.aspect}
        cropFocusY={cropSettingsForMode.focusY}
      />
      {isBattleReportLoading ? (
        <ConsiderationsAndJudgments battle={undefined} mode={mode} />
      ) : (
        <ConsiderationsAndJudgments battle={battle} mode={mode} />
      )}
    </div>
  );
};
