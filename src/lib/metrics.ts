import type { Battle } from '@yonokomae/types';
import type { BattleReportMetrics } from '@yonokomae/types';

/**
 * Compute the minimal BattleReportMetrics from a list of Battle reports.
 * Pure and easily testable.
 */
export function computeBattleReportMetrics(
  reports: Battle[],
): BattleReportMetrics {
  const totalReports = reports.length;
  const generatingCount = reports.filter((r) => r.status === 'loading').length;
  const generationErrorCount = reports.filter(
    (r) => r.status === 'error',
  ).length;
  const generationSuccessCount =
    totalReports - generatingCount - generationErrorCount;
  return {
    totalReports,
    generatingCount,
    generationSuccessCount,
    generationErrorCount,
  };
}
