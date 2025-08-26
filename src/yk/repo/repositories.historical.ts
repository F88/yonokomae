import type {
  ScenarioRepository,
  NetaRepository,
  BattleReportRepository,
} from './repositories';
import type { Battle, Neta } from '@/types/types';
import { uid } from '@/lib/id';
import { historicalSeeds, loadSeedByFile } from './historical-seeds';

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
export class HistoricalBattleReportRepository
  implements BattleReportRepository
{
  private readonly seedFile?: string;
  constructor(opts?: { seedFile?: string }) {
    this.seedFile = opts?.seedFile;
  }
  async generateReport(): Promise<Battle> {
    // Load selected or default seed
    const chosen = this.seedFile ?? historicalSeeds[0]?.file;
    if (!chosen) {
      throw new Error(
        'No historical seeds available. Provide a seedFile or add entries to historicalSeeds.',
      );
    }
    const seed = await loadSeedByFile(chosen);
    // Build basic Netas using historical base repos (titles/images can remain placeholders)
    const netaRepo = new HistoricalNetaRepository();
    const [komaeBase, yonoBase] = await Promise.all([
      netaRepo.getKomaeBase(),
      netaRepo.getYonoBase(),
    ]);
    // Strengthen attribution: include a short note in descriptions
    const attribution = 'Images: placeholders (https://placehold.co/)';
    return {
      id: uid('battle'),
      title: seed.default.title,
      subtitle: seed.default.subtitle,
      overview: seed.default.overview,
      scenario: seed.default.narrative,
      komae: {
        ...komaeBase,
        description: `${komaeBase.description} — ${attribution}`,
        power: 50,
      },
      yono: {
        ...yonoBase,
        description: `${yonoBase.description} — ${attribution}`,
        power: 50,
      },
      provenance: seed.default.provenance,
      status: 'success',
    } satisfies Battle;
  }
}
