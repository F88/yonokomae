/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Battle } from '@yonokomae/types';

// Mock seeds with varied themeId, significance, publishState to exercise composite filtering
vi.mock('@yonokomae/data-battle-seeds', () => {
  const base = (
    id: string,
    themeId: Battle['themeId'],
    significance: Battle['significance'],
    publishState: Battle['publishState'],
  ): Battle => ({
    id,
    title: id,
    subtitle: '',
    narrative: { overview: '', scenario: '' },
    themeId,
    significance,
    publishState,
    komae: {
      imageUrl: 'about:blank',
      title: '',
      subtitle: '',
      description: '',
      power: 10,
    },
    yono: {
      imageUrl: 'about:blank',
      title: '',
      subtitle: '',
      description: '',
      power: 20,
    },
    provenance: [],
    status: 'success',
  });
  const pubHistoryLow = base('pub-history-low', 'history', 'low', 'published');
  const reviewTechMedium = base(
    'rev-tech-medium',
    'technology',
    'medium',
    'review',
  );
  const draftCultureHigh = base(
    'draft-culture-high',
    'culture',
    'high',
    'draft',
  );
  const pubTechHigh = base('pub-tech-high', 'technology', 'high', 'published');
  return {
    battleSeeds: [
      pubHistoryLow,
      reviewTechMedium,
      draftCultureHigh,
      pubTechHigh,
    ],
    battleSeedsByFile: {
      'pub-history-low.js': pubHistoryLow,
      'rev-tech-medium.js': reviewTechMedium,
      'draft-culture-high.js': draftCultureHigh,
      'pub-tech-high.js': pubTechHigh,
    },
    publishStateKeys: ['draft', 'review', 'published', 'archived'],
  };
});

import { HistoricalEvidencesBattleReportRepository } from './repositories.historical-evidences';

describe('HistoricalEvidencesBattleReportRepository composite filters', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic: always first candidate
  });

  it('filters by publishState + themeId (review + technology)', async () => {
    const repo = new HistoricalEvidencesBattleReportRepository();
    const battle = await repo.generateReport({
      filter: { battle: { publishState: 'review', themeId: 'technology' } },
    });
    expect(battle.id).toBe('rev-tech-medium');
    expect(battle.publishState).toBe('review');
    expect(battle.themeId).toBe('technology');
  });

  it('filters by publishState + significance (published + high)', async () => {
    const repo = new HistoricalEvidencesBattleReportRepository();
    const battle = await repo.generateReport({
      filter: { battle: { publishState: 'published', significance: 'high' } },
    });
    // Two published battles exist: pub-history-low (low) and pub-tech-high (high) -> only high remains
    expect(battle.id).toBe('pub-tech-high');
    expect(battle.publishState).toBe('published');
    expect(battle.significance).toBe('high');
  });

  it('filters by themeId + significance + publishState (technology + high + published)', async () => {
    const repo = new HistoricalEvidencesBattleReportRepository();
    const battle = await repo.generateReport({
      filter: {
        battle: {
          themeId: 'technology',
          significance: 'high',
          publishState: 'published',
        },
      },
    });
    expect(battle.id).toBe('pub-tech-high');
  });

  it('returns not found when composite filters mismatch (history + review)', async () => {
    const repo = new HistoricalEvidencesBattleReportRepository();
    await expect(
      repo.generateReport({
        filter: { battle: { themeId: 'history', publishState: 'review' } },
      }),
    ).rejects.toMatchObject({ name: 'BattleSeedNotFoundError' });
  });
});
