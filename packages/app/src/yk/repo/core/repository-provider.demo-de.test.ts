import { describe, it, expect } from 'vitest';
import {
  getBattleReportRepository,
  getJudgementRepository,
} from './repository-provider';

describe('repository-provider mapping for demo-de', () => {
  it('returns DemoDeBattleReportRepository for battle reports', async () => {
    const repo = await getBattleReportRepository({
      id: 'demo-de',
      title: 'Demonstrationsmodus (de)',
      description: '',
      enabled: true,
      srLabel: 'Deutscher Demomodus',
    });
    const battle = await repo.generateReport({ signal: undefined });

    expect(typeof battle.title).toBe('string');
    expect(battle.title.length).toBeGreaterThan(0);
    expect(typeof battle.subtitle).toBe('string');
    expect(battle.subtitle.length).toBeGreaterThan(0);
  });

  it('returns DemoDeJudgementRepository (decorated) for judgement', async () => {
    const judge = await getJudgementRepository({
      id: 'demo-de',
      title: 'DEMO(de)',
      description: '',
      enabled: true,
      srLabel: 'Deutscher Demomodus',
    });
    const verdict = await judge.determineWinner(
      {
        judge: { id: 't-judge', name: 'Test Judge', codeName: 'TEST' },
        battle: {
          id: 'b',
          themeId: 'history' as const,
          significance: 'low' as const,
          publishState: 'published',
          title: 'Demo-DE Schlacht',
          subtitle: 'Varianten-Schaukasten (DE)',
          narrative: { overview: '', scenario: '' },
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
