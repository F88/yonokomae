import { describe, it, expect } from 'vitest';
import {
  DemoEnBattleReportRepository,
  DemoEnJudgementRepository,
} from './repositories.demo-en';

describe('demo-en repositories', () => {
  it('DemoEnBattleReportRepository.generateReport returns a valid battle with demo-en markers', async () => {
    const repo = new DemoEnBattleReportRepository({
      delay: { min: 0, max: 0 },
    });
    const battle = await repo.generateReport();

    expect(battle.id).toMatch(/^battle-/);
    // Title and subtitle depend on the selected scenario; ensure they are non-empty strings.
    expect(battle.title).toBeTypeOf('string');
    expect(battle.title.length).toBeGreaterThan(0);
    expect(battle.subtitle).toBeTypeOf('string');
    expect(battle.subtitle.length).toBeGreaterThan(0);
    expect(battle.overview).toBeTypeOf('string');
    expect(battle.scenario).toBeTypeOf('string');
    expect(battle.status).toBe('success');

    // reasonable neta structure
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

  it('DemoEnJudgementRepository.determineWinner compares power correctly', async () => {
    const judge = new DemoEnJudgementRepository({ delay: { min: 0, max: 0 } });
    const battleBase = {
      id: 'battle_demo_en_test',
      title: 'Demo-2 Battle',
      subtitle: 'Variant Showcase',
      overview: 'n/a',
      scenario: 'n/a',
      status: 'success' as const,
    };

    // YONO wins
  let winner = await judge.determineWinner(
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
    expect(winner).toBe('YONO');

    // KOMAE wins
  winner = await judge.determineWinner(
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
    expect(winner).toBe('KOMAE');

    // DRAW
  winner = await judge.determineWinner(
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
    expect(winner).toBe('DRAW');
  });
});
