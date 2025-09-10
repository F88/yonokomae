import { describe, it, expect } from 'vitest';
import { HistoricalEvidencesJudgementRepository } from './repositories.historical-evidences';
import type { Battle } from '@yonokomae/types';
import { getJudgementRepository } from '@/yk/repo/core/repository-provider';

function makeBattle(yonoPower: number, komaePower: number): Battle {
  return {
    id: 'test-battle',
    themeId: 'history',
    significance: 'low',
    publishState: 'published',
    title: 't',
    subtitle: 's',
    narrative: { overview: 'o', scenario: 'sc' },
    yono: {
      power: yonoPower,
      imageUrl: '',
      title: '',
      subtitle: '',
      description: '',
    },
    komae: {
      power: komaePower,
      imageUrl: '',
      title: '',
      subtitle: '',
      description: '',
    },
  };
}

describe('HistoricalEvidencesJudgementRepository probabilistic bias with power fallback', () => {
  it('O/U: 20% forces YONO; otherwise compare by power', async () => {
    const battle = makeBattle(10, 90);
    const judgeO = { id: 'judge-O', name: 'Judge O', codeName: 'O' };
    const judgeU = { id: 'judge-U', name: 'Judge U', codeName: 'U' };

    const repoForced = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.19,
    });
    await expect(
      repoForced.determineWinner({ battle, judge: judgeO }),
    ).resolves.toMatchObject({ winner: 'YONO' });
    await expect(
      repoForced.determineWinner({ battle, judge: judgeU }),
    ).resolves.toMatchObject({ winner: 'YONO' });

    const repoFallback = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.2,
    });
    // power decides now
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(40, 60),
        judge: judgeO,
      }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(60, 40),
        judge: judgeU,
      }),
    ).resolves.toMatchObject({ winner: 'YONO' });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(50, 50),
        judge: judgeO,
      }),
    ).resolves.toMatchObject({ winner: 'DRAW' });
  });

  it('S/C: 20% forces KOMAE; otherwise compare by power', async () => {
    const judgeS = { id: 'judge-S', name: 'Judge S', codeName: 'S' };
    const judgeC = { id: 'judge-C', name: 'Judge C', codeName: 'C' };

    const repoForced = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.19,
    });
    await expect(
      repoForced.determineWinner({ battle: makeBattle(90, 10), judge: judgeS }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });
    await expect(
      repoForced.determineWinner({ battle: makeBattle(10, 90), judge: judgeC }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });

    const repoFallback = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.2,
    });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(40, 60),
        judge: judgeS,
      }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(60, 40),
        judge: judgeC,
      }),
    ).resolves.toMatchObject({ winner: 'YONO' });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(50, 50),
        judge: judgeS,
      }),
    ).resolves.toMatchObject({ winner: 'DRAW' });
  });

  it('KK: 90% forces KOMAE; otherwise compare by power', async () => {
    const judgeKK = { id: 'judge-KK', name: 'Judge KK', codeName: 'KK' };

    const repoForced = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.89,
    });
    await expect(
      repoForced.determineWinner({ battle: makeBattle(99, 1), judge: judgeKK }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });

    const repoFallback = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.9,
    });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(60, 40),
        judge: judgeKK,
      }),
    ).resolves.toMatchObject({ winner: 'YONO' });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(40, 60),
        judge: judgeKK,
      }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });
    await expect(
      repoFallback.determineWinner({
        battle: makeBattle(50, 50),
        judge: judgeKK,
      }),
    ).resolves.toMatchObject({ winner: 'DRAW' });
  });

  it('Unknown code: no forcing; compare by power', async () => {
    const judgeX = { id: 'judge-X', name: 'Judge X', codeName: 'X' };
    const repo = new HistoricalEvidencesJudgementRepository({ rng: () => 0 });
    await expect(
      repo.determineWinner({ battle: makeBattle(60, 40), judge: judgeX }),
    ).resolves.toMatchObject({ winner: 'YONO' });
    await expect(
      repo.determineWinner({ battle: makeBattle(40, 60), judge: judgeX }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });
    await expect(
      repo.determineWinner({ battle: makeBattle(50, 50), judge: judgeX }),
    ).resolves.toMatchObject({ winner: 'DRAW' });
  });

  it('Judge codeName is trimmed and case-insensitive', async () => {
    // O/U lower-case with spaces still applies O/U rule
    const judge_o = { id: 'o', name: 'o', codeName: '  o  ' };
    const judge_s = { id: 's', name: 's', codeName: ' s ' };
    const judge_k = { id: 'k', name: 'k', codeName: ' k ' };

    // r < 0.2 => YONO for O
    const repoO = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.1,
    });
    await expect(
      repoO.determineWinner({ battle: makeBattle(1, 99), judge: judge_o }),
    ).resolves.toMatchObject({ winner: 'YONO' });

    // r < 0.2 => KOMAE for S
    const repoS = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.15,
    });
    await expect(
      repoS.determineWinner({ battle: makeBattle(99, 1), judge: judge_s }),
    ).resolves.toMatchObject({ winner: 'KOMAE' });

    // r >= 0.9 => fallback for K
    const repoK = new HistoricalEvidencesJudgementRepository({
      rng: () => 0.9,
    });
    await expect(
      repoK.determineWinner({ battle: makeBattle(60, 40), judge: judge_k }),
    ).resolves.toMatchObject({ winner: 'YONO' });
  });

  it('Caches by (battleId, judge.id) in historical-research mode (RNG fixed for pair)', async () => {
    const mode = {
      id: 'historical-research',
      title: 't',
      description: 'd',
      enabled: true,
      srLabel: 't',
    } as const;
    const repo = await getJudgementRepository(mode);

    const judge = { id: 'j-1', name: 'Judge O', codeName: 'O' };
    const first = await repo.determineWinner({
      battle: makeBattle(10, 90),
      judge,
    });
    // Change powers but keep same battle id to simulate subsequent request for same match
    const second = await repo.determineWinner({
      battle: { ...makeBattle(99, 1), id: 'test-battle' },
      judge,
    });
    expect(second.winner).toBe(first.winner);
  });
});
