import type { FC } from 'react';
import type { Battle } from '@yonokomae/types';
import { Badge } from '@/components/ui/badge';

export type BattleContainerIdChipProps = {
  battle: Battle;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
};

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(' ');

export const BattleContainerIdChip: FC<BattleContainerIdChipProps> = ({
  battle,
  className,
  variant = 'outline',
}) => {
  return (
    <Badge
      variant={variant}
      className={cx(
        'px-1.5 py-0.5 text-[10px] sm:text-xs font-mono tracking-tight',
        'inline-flex items-center gap-1',
        className,
      )}
      aria-label={`Battle ID ${battle.id}`}
      data-testid="battle-container-id-chip"
      title={battle.id}
    >
      <span aria-hidden>🏷️</span>
      <span>{battle.id}</span>
    </Badge>
  );
};
