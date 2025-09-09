/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Battle } from '@yonokomae/types';

// Dedicated mock for repository tests (separate so counts don't interfere with other test file caching)
vi.mock('@yonokomae/data-battle-seeds', () => {
  const base = (id: string, publishState: Battle['publishState']): Battle => ({
    id,
    title: id,
    subtitle: '',
    narrative: { overview: '', scenario: '' },
    themeId: 'history',
    significance: 'low',
    publishState,
    komae: { imageUrl: 'about:blank', title: '', subtitle: '', description: '', power: 10 },
    yono: { imageUrl: 'about:blank', title: '', subtitle: '', description: '', power: 20 },
    provenance: [],
    status: 'success',
  });
  const published = base('pub-A', 'published');
  const review = base('rev-A', 'review');
  const draft = base('draft-A', 'draft');
  return {
    battleSeeds: [published, review, draft],
    battleSeedsByFile: {
      'pub-A.js': published,
      'rev-A.js': review,
      'draft-A.js': draft,
    },
    publishStateKeys: ['draft', 'review', 'published', 'archived'],
  };
});

import { HistoricalEvidencesBattleReportRepository } from './repositories.historical-evidences';

describe('HistoricalEvidencesBattleReportRepository publishState filtering', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic
  });

  it('respects publishState filter (review)', async () => {
    const repo = new HistoricalEvidencesBattleReportRepository();
    const battle = await repo.generateReport({
      filter: { battle: { publishState: 'review' } },
    });
    expect(battle.publishState).toBe('review');
  });

  it('publishedOnly=true rejects non-published publishState filter (draft)', async () => {
    const repo = new HistoricalEvidencesBattleReportRepository({ publishedOnly: true });
    await expect(
      repo.generateReport({ filter: { battle: { publishState: 'draft' } } }),
    ).rejects.toMatchObject({ name: 'BattleSeedNotFoundError' });
  });

  it('publishedOnly=true without publishState filter still returns a published battle', async () => {
    const repo = new HistoricalEvidencesBattleReportRepository({ publishedOnly: true });
    const battle = await repo.generateReport();
    expect(battle.publishState).toBe('published');
  });
});
