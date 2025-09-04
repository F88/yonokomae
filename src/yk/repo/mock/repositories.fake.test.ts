import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FakeJudgementRepository } from '@/yk/repo/mock/repositories.fake';

describe('Fake repositories - delay capping', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('caps range delay when max > 5s and warns (Judgement)', async () => {
    const repo = new FakeJudgementRepository({
      delay: { min: 3_000, max: 8_000 },
    });
    const result = await repo.determineWinner({
      battle: {
        id: 'b-1',
        themeId: 'history',
        significance: 'low',
        title: 't',
        subtitle: 's',
        narrative: { overview: 'o', scenario: 'sc' },
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
      },
      judge: { id: 'fake-judge-1', name: 'Fake', codeName: 'FAKE' },
    });
    expect(result.winner).toBe('YONO');
    expect(warnSpy).toHaveBeenCalled();
    const messages = warnSpy.mock.calls.map((c) => String(c[0]));
    expect(
      messages.some((m) => m.includes('Delay range capped to <= 5000ms')),
    ).toBe(true);
  });

  it('does not warn when delay is negative (clamped to 0)', async () => {
    const repo = new FakeJudgementRepository({ delay: -100 });
    const res = await repo.determineWinner({
      battle: {
        id: 'b-2',
        themeId: 'history',
        significance: 'low',
        title: 't',
        subtitle: 's',
        narrative: { overview: 'o', scenario: 'sc' },
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
      },
      judge: { id: 'fake-judge-2', name: 'Fake', codeName: 'FAKE' },
    });
    expect(res.winner).toBe('KOMAE');
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
