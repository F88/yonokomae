import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  FakeBattleReportRepository,
  FakeJudgementRepository,
} from './repositories.fake';
import { playMode } from '@/yk/play-mode';

describe('Fake repositories - delay capping', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('caps numeric delay > 10s and warns (BattleReport)', async () => {
    const repo = new FakeBattleReportRepository(undefined, undefined, {
      delay: 20_000,
    });
    const battle = await repo.generateReport();
    expect(battle).toBeTruthy();
    expect(warnSpy).toHaveBeenCalled();
    const messages = warnSpy.mock.calls.map((c) => String(c[0]));
    expect(messages.some((m) => m.includes('Delay capped at 10000ms'))).toBe(
      true,
    );
  });

  it('caps range delay when max > 10s and warns (Judgement)', async () => {
    const repo = new FakeJudgementRepository({
      delay: { min: 5_000, max: 20_000 },
    });
    const result = await repo.determineWinner({
      mode: playMode[0],
      yono: {
        imageUrl: '',
        title: 'Y',
        subtitle: '',
        description: '',
        power: 10,
      },
      komae: {
        imageUrl: '',
        title: 'K',
        subtitle: '',
        description: '',
        power: 5,
      },
    });
    expect(result).toBe('YONO');
    expect(warnSpy).toHaveBeenCalled();
    const messages = warnSpy.mock.calls.map((c) => String(c[0]));
    expect(
      messages.some((m) => m.includes('Delay range capped to <= 10000ms')),
    ).toBe(true);
  });

  it('does not warn when delay is negative (clamped to 0)', async () => {
    const repo = new FakeJudgementRepository({ delay: -100 });
    const res = await repo.determineWinner({
      mode: playMode[0],
      yono: {
        imageUrl: '',
        title: 'Y',
        subtitle: '',
        description: '',
        power: 1,
      },
      komae: {
        imageUrl: '',
        title: 'K',
        subtitle: '',
        description: '',
        power: 2,
      },
    });
    expect(res).toBe('KOMAE');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not warn when range is within limit and min==max', async () => {
    const repo = new FakeBattleReportRepository(undefined, undefined, {
      delay: { min: 200, max: 200 },
    });
    const battle = await repo.generateReport();
    expect(battle).toBeTruthy();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
