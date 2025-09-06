import { ConsiderationsAndJudgments } from '@/components/battle/ConsiderationsAndJudgments';
import { HistoricalScene } from '@/components/battle/HistoricalScene';
import type { PlayMode } from '@/yk/play-mode';
import type { Battle } from '@yonokomae/types';
import type { FC } from 'react';

export type BattleContainerProps = {
  battle: Battle;
  mode: PlayMode;
  /** Toggle visibility of metadata (ID/Theme/Significance chips) in HistoricalScene. */
  showMetaData?: boolean;
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
  'yk-now': {
    enableCropTopBanner: true,
    aspect: '32/9',
    focusY: 'y-50',
  },
} as const;

type CropSettingsKey = keyof typeof cropSettings;
const isCropSettingsKey = (key: string): key is CropSettingsKey =>
  key in cropSettings;

export const BattleContainer: FC<BattleContainerProps> = ({
  battle,
  mode,
  showMetaData,
}) => {
  const isBattleReportLoading = battle.status === 'loading';

  const cropSettingsForMode = isCropSettingsKey(mode.id)
    ? cropSettings[mode.id]
    : cropSettings.default;

  return (
    <div className="space-y-4 sm:space-y-6" data-testid="battle">
      <HistoricalScene
        battle={isBattleReportLoading ? undefined : battle}
        isLoading={isBattleReportLoading}
        cropTopBanner={cropSettingsForMode.enableCropTopBanner}
        cropAspectRatio={cropSettingsForMode.aspect}
        cropFocusY={cropSettingsForMode.focusY}
        showMetaData={showMetaData}
      />
      {isBattleReportLoading ? (
        <ConsiderationsAndJudgments battle={undefined} mode={mode} />
      ) : (
        <ConsiderationsAndJudgments battle={battle} mode={mode} />
      )}
    </div>
  );
};
