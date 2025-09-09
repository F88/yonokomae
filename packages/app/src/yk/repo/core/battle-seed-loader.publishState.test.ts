/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Battle } from '@yonokomae/types';

// Mock seed data with mixed publishState values
vi.mock('@yonokomae/data-battle-seeds', () => {
  const base = (id: string, publishState: Battle['publishState']): Battle => ({
    id,
    title: id + ' title',
    subtitle: '',
    narrative: { overview: '', scenario: '' },
    themeId: 'history',
    significance: 'low',
    publishState,
    komae: {
      imageUrl: 'about:blank',
      title: '',
      subtitle: '',
      description: '',
      power: 40,
    },
    yono: {
      imageUrl: 'about:blank',
      title: '',
      subtitle: '',
      description: '',
      power: 60,
    },
    provenance: [],
    status: 'success',
  });
  const draft = base('draft-1', 'draft');
  const published = base('pub-1', 'published');
  const review = base('rev-1', 'review');
  return {
    battleSeeds: [draft, published, review],
    battleSeedsByFile: {
      '001-draft.js': draft,
      '002-published.js': published,
      '003-review.js': review,
    },
    publishStateKeys: ['draft', 'review', 'published', 'archived'],
  };
});

// Import after mocks
import {
  loadBattleFromSeeds,
  BattleSeedNotFoundError,
} from './battle-seed-loader';

describe('battle-seed-loader publishState support', () => {
  beforeEach(() => {
    // Stabilize randomness so tests relying on random path are deterministic.
    vi.spyOn(Math, 'random').mockReturnValue(0); // always pick first candidate
  });

  it('loads explicit draft seed when publishedOnly=false (using dual roots)', async () => {
    // The loader maps each battle to two virtual file paths under both roots.
    const battle = await loadBattleFromSeeds({
      roots: [
        '@yonokomae/data-battle-seeds',
        '/seeds/historical-evidences/battle/',
      ],
      file: '001-draft.js',
      publishedOnly: false,
    });
    expect(battle.id).toBe('draft-1');
    expect(battle.publishState).toBe('draft');
  });

  it('rejects loading draft seed when publishedOnly=true', async () => {
    await expect(
      loadBattleFromSeeds({
        roots: ['@yonokomae/data-battle-seeds'],
        file: '001-draft.js',
        publishedOnly: true,
      }),
    ).rejects.toMatchObject({ name: 'BattleSeedNotFoundError' });
  });

  it('random selection with predicate publishState="draft" returns a draft battle', async () => {
    const battle = await loadBattleFromSeeds({
      roots: ['@yonokomae/data-battle-seeds'],
      predicate: (b) => b.publishState === 'draft',
      publishedOnly: false,
    });
    expect(battle.publishState).toBe('draft');
  });

  it('publishedOnly=true removes non-published candidates from random pool', async () => {
    // With Math.random=0, first candidate of published-only pool should be a published battle.
    const battle = await loadBattleFromSeeds({
      roots: ['@yonokomae/data-battle-seeds'],
      publishedOnly: true,
    });
    expect(battle.publishState).toBe('published');
  });

  it('publishedOnly=true combined with predicate for draft yields not found error', async () => {
    await expect(
      loadBattleFromSeeds({
        roots: ['@yonokomae/data-battle-seeds'],
        predicate: (b) => b.publishState === 'draft',
        publishedOnly: true,
      }),
    ).rejects.toBeInstanceOf(BattleSeedNotFoundError);
  });
});
