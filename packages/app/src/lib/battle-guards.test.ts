import { describe, expect, it } from 'vitest';
import type { Battle } from '@yonokomae/types';
import { Placeholders } from '@/yk/placeholder';
import { isRenderableBattle } from './battle-guards';

describe('battle-guards', () => {
  const base: Omit<Battle, 'id'> = {
    themeId: 'history',
    significance: 'low',
    publishState: 'published',
    title: 't',
    subtitle: 's',
    narrative: { overview: 'o', scenario: 'x' },
    komae: { ...Placeholders.Komae },
    yono: { ...Placeholders.Yono },
    status: 'loading',
  };

  it('returns false for null/undefined', () => {
    expect(isRenderableBattle(null as unknown as Battle)).toBe(false);
    expect(isRenderableBattle(undefined as unknown as Battle)).toBe(false);
  });

  it('returns false for empty id', () => {
    const b = { id: '', ...base } as Battle;
    expect(isRenderableBattle(b)).toBe(false);
  });

  it('returns true for valid id', () => {
    const b = { id: 'abc', ...base } as Battle;
    expect(isRenderableBattle(b)).toBe(true);
  });
});
