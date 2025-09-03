import { describe, it, expect } from 'vitest';
import { computeBattleReportMetrics } from './metrics';
import type { Battle } from '@/types/types';

function b(id: string, status?: Battle['status']): Battle {
  return {
    id,
    title: 't',
    subtitle: 's',
    overview: 'o',
    scenario: 'c',
    komae: {
      imageUrl: '',
      title: 'k',
      subtitle: 'ks',
      description: 'kd',
      power: 1,
    },
    yono: {
      imageUrl: '',
      title: 'y',
      subtitle: 'ys',
      description: 'yd',
      power: 1,
    },
    status,
  };
}

describe('computeBattleReportMetrics', () => {
  it('handles empty list', () => {
    const m = computeBattleReportMetrics([]);
    expect(m).toEqual({
      totalReports: 0,
      generatingCount: 0,
      generationSuccessCount: 0,
      generationErrorCount: 0,
    });
  });

  it('counts loading and treats others as success by difference', () => {
    const reports: Battle[] = [
      b('1', 'loading'),
      b('2', undefined),
      b('3', undefined),
    ];
    const m = computeBattleReportMetrics(reports);
    expect(m).toEqual({
      totalReports: 3,
      generatingCount: 1,
      generationSuccessCount: 2,
      generationErrorCount: 0,
    });
  });

  it('counts errors explicitly', () => {
    const reports: Battle[] = [
      b('1', 'loading'),
      b('2', 'error'),
      b('3', 'success'),
    ];
    const m = computeBattleReportMetrics(reports);
    expect(m).toEqual({
      totalReports: 3,
      generatingCount: 1,
      generationSuccessCount: 1,
      generationErrorCount: 1,
    });
  });
});
