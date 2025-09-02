import { describe, it, expect } from 'vitest';
import {
  DemoDeBattleReportRepository,
  DemoDeJudgementRepository,
} from './repositories.demo-de';

describe('demo-de repositories', () => {
  it('DemoDeBattleReportRepository.generateReport returns a valid battle with demo-de markers', async () => {
    const repo = new DemoDeBattleReportRepository({
      delay: { min: 0, max: 0 },
    });
    const battle = await repo.generateReport();

    expect(battle.id).toMatch(/^battle-/);
    // Title/Subitle are dynamic per scenario in DE; assert non-empty strings
    expect(typeof battle.title).toBe('string');
    expect(battle.title.length).toBeGreaterThan(0);
    expect(typeof battle.subtitle).toBe('string');
    expect(battle.subtitle.length).toBeGreaterThan(0);
    // DE strings are localized; overview/scenario may include (DE) markers, but not required for unit titles
    expect(typeof battle.overview).toBe('string');
    expect(typeof battle.scenario).toBe('string');
    expect(battle.status).toBe('success');

    expect(typeof battle.yono.subtitle).toBe('string');
    expect(battle.yono.subtitle.length).toBeGreaterThan(0);
    expect(typeof battle.komae.subtitle).toBe('string');
    expect(battle.komae.subtitle.length).toBeGreaterThan(0);
    expect(battle.yono.imageUrl).toBe('/YONO-SYMBOL.png');
    expect(battle.komae.imageUrl).toBe('/KOMAE-SYMBOL.png');
    expect(battle.yono.power).toBeGreaterThanOrEqual(0);
    expect(battle.yono.power).toBeLessThanOrEqual(100);
    expect(battle.komae.power).toBeGreaterThanOrEqual(0);
    expect(battle.komae.power).toBeLessThanOrEqual(100);
  });

  it('DemoDeJudgementRepository.determineWinner compares power correctly', async () => {
    const judge = new DemoDeJudgementRepository({ delay: { min: 0, max: 0 } });
    const battleBase = {
      id: 'battle_demo_de_test',
      title: 'Demo-DE Battle',
      subtitle: 'Variant Showcase (DE)',
      overview: 'n/a',
      scenario: 'n/a',
      status: 'success' as const,
    };

    // YONO wins
    let verdict = await judge.determineWinner(
      {
        judge: { id: 't-judge', name: 'Test Judge', codeName: 'TEST' },
        battle: {
          ...battleBase,
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
    expect(verdict.winner).toBe('YONO');

    // KOMAE wins
    verdict = await judge.determineWinner(
      {
        judge: { id: 't-judge', name: 'Test Judge', codeName: 'TEST' },
        battle: {
          ...battleBase,
          yono: {
            title: 'Y',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 2,
          },
          komae: {
            title: 'K',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 9,
          },
        },
      },
      { signal: undefined },
    );
    expect(verdict.winner).toBe('KOMAE');

    // DRAW
    verdict = await judge.determineWinner(
      {
        judge: { id: 't-judge', name: 'Test Judge', codeName: 'TEST' },
        battle: {
          ...battleBase,
          yono: {
            title: 'Y',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 5,
          },
          komae: {
            title: 'K',
            subtitle: 's',
            description: 'd',
            imageUrl: 'u',
            power: 5,
          },
        },
      },
      { signal: undefined },
    );
    expect(verdict.winner).toBe('DRAW');
  });
});
