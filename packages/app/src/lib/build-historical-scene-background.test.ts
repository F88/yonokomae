import { describe, it, expect } from 'vitest';
import { buildHistoricalSceneBackground } from './build-historical-scene-background';
import type { Battle } from '@yonokomae/types';

const makeBattle = (overrides: Partial<Battle> = {}): Battle => ({
  id: 'b1',
  themeId: 'history',
  significance: 'low',
  publishState: 'published',
  title: 'T',
  subtitle: 'S',
  narrative: { overview: 'O', scenario: 'N' },
  komae: {
    imageUrl: 'k',
    title: 'K',
    subtitle: 'k',
    description: 'k',
    power: 1,
  },
  yono: {
    imageUrl: 'y',
    title: 'Y',
    subtitle: 'y',
    description: 'y',
    power: 1,
  },
  status: 'success',
  ...overrides,
});

describe('buildHistoricalSceneBackground', () => {
  it('returns no background by default', () => {
    const bg = buildHistoricalSceneBackground(makeBattle());
    expect(bg.hasImage).toBe(false);
    expect(bg.sceneBgUrl).toBeUndefined();
    expect(bg.opacityClass).toBe('opacity-30 sm:opacity-40');
    expect(bg.blur).toBe(false);
    expect(bg.netaCardBackground).toBeUndefined();
  });

  it('is resilient to undefined battle', () => {
    const bg = buildHistoricalSceneBackground(undefined);
    expect(bg.hasImage).toBe(false);
  });

  it('uses a deterministic legendary background image when significance is legendary', () => {
    const bg = buildHistoricalSceneBackground(
      makeBattle({ id: 'legend-1', significance: 'legendary' }),
    );
    expect(bg.hasImage).toBe(true);
    expect(typeof bg.sceneBgUrl).toBe('string');
    expect(bg.sceneBgUrl).toBeTruthy();
    // BASE_URL may prefix path; only assert that the tail is one of the known images.
    const tail = bg.sceneBgUrl!.split('/').pop();
    expect([
      'showdown-on-the-great-river.png',
      'crossroads-of-destiny.png',
      'ninja-cat-ancient-playground.png',
    ]).toContain(tail);
    // Deterministic: same input yields identical URL.
    const bg2 = buildHistoricalSceneBackground(
      makeBattle({ id: 'legend-1', significance: 'legendary' }),
    );
    expect(bg2.sceneBgUrl).toBe(bg.sceneBgUrl);
    // NetaCard background should be set (transparent surface) for legendary,
    // and hint banner behavior.
    expect(bg.netaCardBackground).toBeDefined();
    expect(typeof bg.netaCardBackground).toBe('object');
  });
});
