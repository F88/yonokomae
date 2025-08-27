import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FakeJudgementRepository } from '@/yk/repo/mock/repositories.fake';
import { playMode } from '@/yk/play-mode';

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
      messages.some((m) => m.includes('Delay range capped to <= 5000ms')),
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
});
