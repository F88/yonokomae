import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Battle } from '@yonokomae/types';

export type SignificanceChipProps = {
  significance: Battle['significance'];
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
  showLabel?: boolean;
};

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(' ');

const levelIcon: Record<Battle['significance'], string> = {
  low: '•',
  medium: '▲',
  high: '🎖️',
  legendary: '⭐',
};

const levelClasses: Record<Battle['significance'], string> = {
  low: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100',
  medium: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100',
  high: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  legendary:
    'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-100',
};

export const SignificanceChip: FC<SignificanceChipProps> = ({
  significance,
  className,
  variant = 'secondary',
  showLabel = false,
}) => {
  const icon = levelIcon[significance];
  const color = levelClasses[significance];

  return (
    <Badge
      variant={variant}
      className={cx(
        'px-1.5 py-0.5 text-[10px] sm:text-xs gap-1 inline-flex items-center',
        'font-medium tracking-tight',
        color,
        className,
      )}
      aria-label={`Significance ${significance}`}
      data-testid="significance-chip"
      title={significance}
    >
      <span aria-hidden>{icon}</span>
      {showLabel ? <span className="uppercase">{significance}</span> : null}
    </Badge>
  );
};
