import type { FC } from 'react';
import type { Battle } from '@yonokomae/types';
import { ThemeChip } from '@/components/battle/ThemeChip';
import { BattleContainerIdChip } from './BattleContainerIdChip';
import { SignificanceChip } from '@/components/ui/SignificanceChip';
import { PublishStateChip } from './PublishStateChip';

export type MetaDataProps = {
  battle: Battle;
  className?: string;
  compact?: boolean;
  /** Controls horizontal alignment of the metadata block. Default: 'left' */
  align?: 'left' | 'center' | 'right';
};

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(' ');

/**
 * Presenter: renders meta information of a Battle (id, theme, significance).
 */
export const MetaData: FC<MetaDataProps> = ({
  battle,
  className,
  compact,
  align = 'left',
}) => {
  const base =
    'text-xs font-medium uppercase tracking-wide text-muted-foreground';
  const item = compact ? base : cx(base, 'py-0.5');
  const alignClass =
    align === 'center'
      ? 'text-center'
      : align === 'right'
        ? 'text-right'
        : 'text-left';
  const justifyClass =
    align === 'center'
      ? 'justify-center'
      : align === 'right'
        ? 'justify-end'
        : 'justify-start';

  return (
    <div
      className={cx('space-y-1', alignClass, className)}
      data-testid="battle-metadata"
    >
      <div className={cx(item, 'flex items-center gap-2', justifyClass)}>
        <BattleContainerIdChip battle={battle} variant="outline" />
        <PublishStateChip
          state={battle.publishState}
          variant={compact ? 'outline' : 'secondary'}
          showLabel
        />
        <ThemeChip
          themeId={battle.themeId}
          variant={compact ? 'outline' : 'secondary'}
        />
        <SignificanceChip
          significance={battle.significance}
          variant={compact ? 'outline' : 'secondary'}
          showLabel
        />
      </div>
    </div>
  );
};

export default MetaData;
