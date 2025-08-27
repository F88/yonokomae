import type {
  ScenarioRepository,
  NetaRepository,
  BattleReportRepository,
} from '../core/repositories';
import type { Battle, Neta } from '@/types/types';
// Seed loaders
import { historicalSeeds, loadSeedByFile } from './seed-system';
import { uid } from '@/lib/id';

export class HistoricalScenarioRepository implements ScenarioRepository {
  async generateTitle(): Promise<string> {
    const seed = await pickAnySeed();
    return seed?.title ?? 'Random Joke Data';
  }
  async generateSubtitle(): Promise<string> {
    const seed = await pickAnySeed();
    return seed?.subtitle ?? '';
  }
  async generateOverview(): Promise<string> {
    const seed = await pickAnySeed();
    return seed?.overview ?? '';
  }
  async generateNarrative(): Promise<string> {
    const seed = await pickAnySeed();
    return seed?.narrative ?? '';
  }
}

export class HistoricalNetaRepository implements NetaRepository {
  async getKomaeBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    const options = await loadNetaOptions('komae');
    return options[Math.floor(Math.random() * options.length)];
  }
  async getYonoBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    const options = await loadNetaOptions('yono');
    return options[Math.floor(Math.random() * options.length)];
  }
}

/**
 * BattleReportRandomDataRepository
 * Minimal seed-backed implementation that produces a Battle with provenance.
 */
export class BattleReportRandomDataRepository
  implements BattleReportRepository
{
  private readonly seedFile?: string;
  constructor(opts?: { seedFile?: string }) {
    this.seedFile = opts?.seedFile;
  }
  async generateReport(): Promise<Battle> {
    // Prefer a specific seed if provided, else pick randomly from discovered seeds.
    let overview = '';
    let title = '';
    let subtitle = '';
    let scenario = '';
    let provenance: NonNullable<Battle['provenance']> = [];

    if (this.seedFile || historicalSeeds.length > 0) {
      try {
        const file =
          this.seedFile ??
          historicalSeeds[Math.floor(Math.random() * historicalSeeds.length)]
            ?.file;
        if (file) {
          const seed = (await loadSeedByFile(file)).default;
          title = seed.title;
          subtitle = seed.subtitle;
          overview = seed.overview;
          scenario = seed.narrative;
          provenance = seed.provenance ?? [];
        }
      } catch {
        // On any failure, gracefully fall back to built-in humorous scenarios
      }
    }

    // If still empty (no seeds), create a minimal stub to avoid breaking UI
    if (!title) {
      title = 'Random Joke Data';
      subtitle = '';
      overview = '';
      scenario = '';
      provenance = [];
    }

    // Build basic Netas using historical base repos (titles/images can remain placeholders)
    const netaRepo = new HistoricalNetaRepository();
    const [komaeBase, yonoBase] = await Promise.all([
      netaRepo.getKomaeBase(),
      netaRepo.getYonoBase(),
    ]);
    // Strengthen attribution: include a short note in descriptions
    const cfg = await loadReportConfig();
    const attribution = cfg.attribution;
    return {
      id: uid('battle'),
      title,
      subtitle,
      overview,
      scenario,
      komae: {
        ...komaeBase,
        description: `${komaeBase.description} — ${attribution}`,
        power: cfg.defaultPower,
      },
      yono: {
        ...yonoBase,
        description: `${yonoBase.description} — ${attribution}`,
        power: cfg.defaultPower,
      },
      provenance: [
        ...(this.seedFile
          ? [
              {
                label: 'Selected seed (ignored for humor mode)',
                note: this.seedFile,
              },
            ]
          : []),
        ...provenance,
      ],
      status: 'success',
    } satisfies Battle;
  }
}

// Helpers
type HistoricalSeed = {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  narrative: string;
  provenance?: Array<{ label: string; url?: string; note?: string }>;
};

async function pickAnySeed(): Promise<HistoricalSeed | undefined> {
  if (historicalSeeds.length === 0) return undefined;
  const file =
    historicalSeeds[Math.floor(Math.random() * historicalSeeds.length)]?.file;
  if (!file) return undefined;
  return (await loadSeedByFile(file)).default;
}

type NetaBase = Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>;

async function loadNetaOptions(kind: 'komae' | 'yono'): Promise<NetaBase[]> {
  const jsonKeyNew = `/seeds/random-data/neta/${kind}.json`;
  const tsKeyNew = `/src/seeds/random-data/neta/${kind}.en.ts`;
  const tsKeyOld = `/src/seeds/random-data/neta/${kind}.ts`;
  type NetaModule = {
    default?: { options?: NetaBase[] };
    options?: NetaBase[];
  };
  const mods = {
    ...import.meta.glob('/seeds/random-data/neta/*.json', { eager: true }),
    ...import.meta.glob('/src/seeds/random-data/neta/*.ts', { eager: true }),
  } as Record<string, NetaModule>;
  const mod = mods[jsonKeyNew] ?? mods[tsKeyNew] ?? mods[tsKeyOld];
  const options: NetaBase[] = mod?.default?.options ?? mod?.options ?? [];
  if (options.length > 0) return options;
  // Minimal default to avoid empty options
  return [
    {
      imageUrl: 'about:blank',
      title: kind === 'komae' ? 'Komae' : 'Yono',
      subtitle: 'Default',
      description: 'No neta seeds found.',
    },
  ];
}

type ReportConfig = { attribution: string; defaultPower: number };
async function loadReportConfig(): Promise<ReportConfig> {
  const jsonKeyNew = '/seeds/random-data/report/config.json';
  const tsKeyNew = '/src/seeds/random-data/report/config.en.ts';
  const tsKeyOld = '/src/seeds/random-data/report/config.ts';
  type CfgModule = { default?: Partial<ReportConfig> } | Partial<ReportConfig>;
  const mods = {
    ...import.meta.glob('/seeds/random-data/report/*', { eager: true }),
    ...import.meta.glob('/src/seeds/random-data/report/*', { eager: true }),
  } as Record<string, CfgModule>;
  const mod = mods[jsonKeyNew] ?? mods[tsKeyNew] ?? mods[tsKeyOld];
  let cfgObj: Partial<ReportConfig> = {};
  if (mod != null) {
    const maybeDefault = mod as { default?: Partial<ReportConfig> };
    const hasDefault =
      typeof mod === 'object' && mod !== null && 'default' in maybeDefault;
    cfgObj = hasDefault
      ? (maybeDefault.default ?? {})
      : (mod as Partial<ReportConfig>);
  }
  return {
    attribution:
      cfgObj.attribution ?? 'Images: placeholders (https://placehold.co/)',
    defaultPower:
      typeof cfgObj.defaultPower === 'number' ? cfgObj.defaultPower : 50,
  } satisfies ReportConfig;
}
