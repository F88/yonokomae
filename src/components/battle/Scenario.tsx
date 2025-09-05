import type { FC } from 'react';
import type { Battle } from '@yonokomae/types';

export type ScenarioProps = {
  battle: Battle;
  className?: string;
  showLabel?: boolean;
};

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(' ');

/**
 * Presenter: renders only the scenario text from a Battle.
 */
export const Scenario: FC<ScenarioProps> = ({
  battle,
  className,
  showLabel,
}) => {
  const text = battle.narrative?.scenario ?? '';
  const hasText = typeof text === 'string' && text.trim() !== '';

  if (!hasText) return null;

  return (
    <section
      className={cx('space-y-1 text-center max-w-3xl mx-auto', className)}
      data-testid="battle-scenario"
    >
      {showLabel && (
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
          Scenario
        </h3>
      )}
      <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {text}
      </p>
    </section>
  );
};

export default Scenario;
