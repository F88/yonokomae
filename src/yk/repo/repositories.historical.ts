import type { ScenarioRepository, NetaRepository, BattleReportRepository } from './repositories';
import type { Battle, Neta } from '@/types/types';
import { uid } from '@/lib/id';

export class HistoricalScenarioRepository implements ScenarioRepository {
  async generateTitle(): Promise<string> {
    return 'Battle of Tama River';
  }
  async generateSubtitle(): Promise<string> {
    return 'A Turning Point in Regional History';
  }
  async generateOverview(): Promise<string> {
    return 'Based on documented events and testimonies.';
  }
  async generateNarrative(): Promise<string> {
    return 'Eyewitness accounts describe a fierce clash near the river banks.';
  }
}

export class HistoricalNetaRepository implements NetaRepository {
  async getKomaeBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    return {
      imageUrl: 'https://placehold.co/200x100?text=K',
      title: 'Komae Battalion',
      subtitle: 'Veterans of the East',
      description: 'Local militia with strong defensive tactics.',
    };
  }
  async getYonoBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    return {
      imageUrl: 'https://placehold.co/200x100?text=Y',
      title: 'Yono Guard',
      subtitle: 'Defenders of the West',
      description: 'Organized unit trained in river crossing maneuvers.',
    };
  }
}

/**
 * HistoricalBattleReportRepository
 * Minimal seed-backed implementation that produces a Battle with provenance.
 */
export class HistoricalBattleReportRepository implements BattleReportRepository {
  async generateReport(): Promise<Battle> {
    // Static import of local seed (keeps deterministic output)
    const seed = await import('@/../seeds/historical/tama-river.json');
    // Build basic Netas using historical base repos (titles/images can remain placeholders)
    const netaRepo = new HistoricalNetaRepository();
    const [komaeBase, yonoBase] = await Promise.all([
      netaRepo.getKomaeBase(),
      netaRepo.getYonoBase(),
    ]);
    return {
      id: uid('battle'),
      title: seed.default.title,
      subtitle: seed.default.subtitle,
      overview: seed.default.overview,
      scenario: seed.default.narrative,
      komae: { ...komaeBase, power: 50 },
      yono: { ...yonoBase, power: 50 },
      provenance: seed.default.provenance,
      status: 'success',
    } satisfies Battle;
  }
}
