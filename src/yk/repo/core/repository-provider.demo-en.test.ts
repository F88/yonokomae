import { describe, it, expect } from 'vitest';
import {
  getBattleReportRepository,
  getJudgementRepository,
} from './repository-provider';

describe('repository-provider mapping for demo-en', () => {
  it('returns DemoEnBattleReportRepository for battle reports', async () => {
    const repo = await getBattleReportRepository({
      id: 'demo-en',
      title: 'DEMO (en)',
      description: '',
      enabled: true,
    });
    const battle = await repo.generateReport({ signal: undefined });

    // basic sanity; title/subtitle vary per scenario
    expect(typeof battle.title).toBe('string');
    expect(battle.title.length).toBeGreaterThan(0);
    expect(typeof battle.subtitle).toBe('string');
    expect(battle.subtitle.length).toBeGreaterThan(0);
  });

  it('returns DemoEnJudgementRepository (decorated) for judgement', async () => {
    const judge = await getJudgementRepository({
      id: 'demo-en',
      title: 'DEMO(en)',
      description: '',
      enabled: true,
    });
    // Use trivial battle to assert algorithm and that call works
    const verdict = await judge.determineWinner(
      {
        judge: { id: 't-judge', name: 'Test Judge', codeName: 'TEST' },
        battle: {
          id: 'b',
          title: 'Demo-2 Battle',
          subtitle: 'Variant Showcase',
          overview: '',
          scenario: '',
          status: 'success',
          yono: {
            title: 'Y',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 1,
          },
          komae: {
            title: 'K',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 0,
          },
        },
      },
      { signal: undefined },
    );
    expect(verdict.winner).toBe('YONO');
  });
});
