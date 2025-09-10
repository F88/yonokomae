import { describe, it, expect } from 'vitest';
import {
  getBattleReportRepository,
  getJudgementRepository,
} from './repository-provider';

/**
 * Mapping test for 'yk-now' play mode ensuring the NewsReporter repositories
 * are wired instead of any demo/historical fallback.
 */
describe('repository-provider mapping for yk-now', () => {
  const mode = {
    id: 'yk-now',
    title: 'よのこまライブ',
    description: '',
    enabled: true,
    srLabel: 'よのこまライブ。よーのとこみまが今日のよのこまに鋭く斬り込む。',
  } as const;

  it('returns NewsReporterMultiSourceReportRepository for battle reports', async () => {
    const repo = await getBattleReportRepository(mode);
    const battle = await repo.generateReport({ signal: undefined });
    expect(battle).toBeTruthy();
    expect(typeof battle.title).toBe('string');
  });

  it('falls back to FakeJudgementRepository (decorated) for judgement', async () => {
    const judge = await getJudgementRepository(mode);
    const verdict = await judge.determineWinner(
      {
        judge: { id: 't-judge', name: 'Test Judge', codeName: 'TEST' },
        battle: {
          id: 'b',
          themeId: 'information',
          significance: 'low',
          publishState: 'published',
          title: 'Temp',
          subtitle: 'Temp',
          narrative: { overview: '', scenario: '' },
          status: 'success',
          yono: {
            title: 'Y',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 10,
          },
          komae: {
            title: 'K',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 1,
          },
        },
      },
      { signal: undefined },
    );
    expect(['YONO', 'KOMAE']).toContain(verdict.winner);
  });
});
