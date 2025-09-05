import type { FC } from 'react';
import type { Battle } from '@yonokomae/types';

export type OverViewProps = {
  battle: Battle;
  className?: string;
  showLabel?: boolean;
};

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(' ');

/**
 * Presenter: renders only the overview text from a Battle.
 */
export const OverView: FC<OverViewProps> = ({
  battle,
  className,
  showLabel,
}) => {
  const text = battle.narrative?.overview ?? '';
  const hasText = typeof text === 'string' && text.trim() !== '';

  if (!hasText) return null;

  return (
    <section
      className={cx('space-y-1 text-center max-w-3xl mx-auto', className)}
      data-testid="battle-overview"
    >
      {showLabel && (
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
          Overview
        </h3>
      )}
      <p className="text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
        {text}
      </p>
    </section>
  );
};

export default OverView;
