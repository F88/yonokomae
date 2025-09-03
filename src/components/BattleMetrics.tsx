import type { BattleReportMetrics } from '@/types/types';
import clsx from 'clsx';

interface BattleMetricsProps {
  metrics: BattleReportMetrics;
  className?: string;
}

export function BattleMetrics({ metrics, className }: BattleMetricsProps) {
  const {
    totalReports,
    generatingCount,
    generationSuccessCount,
    generationErrorCount,
  } = metrics;

  const Item = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: 'default' | 'amber' | 'green' | 'red';
  }) => {
    const colorClasses =
      color === 'amber'
        ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200'
        : color === 'green'
          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200'
          : color === 'red'
            ? 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200'
            : 'bg-muted text-foreground/80';
    return (
      <div
        className={clsx(
          'flex items-center gap-2 rounded-md px-2 py-1 text-sm',
          colorClasses,
        )}
      >
        <span className="font-medium">{label}</span>
        <span className="rounded-md bg-background/60 px-1.5 py-0.5 text-xs font-semibold">
          {value}
        </span>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-center gap-2 rounded-md border bg-card px-2 py-2',
        className,
      )}
      aria-label="Battle metrics"
    >
      <Item label="T" value={totalReports} color="default" />
      <Item label="G" value={generatingCount} color="amber" />
      <Item label="S" value={generationSuccessCount} color="green" />
      <Item label="E" value={generationErrorCount} color="red" />
    </div>
  );
}
