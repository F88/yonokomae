import { faker } from '@faker-js/faker';
import { Placeholders } from '@/yk/placeholder';
import { uid } from '@/lib/id';
import type { Battle, Neta } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';
import type {
  BattleReportRepository,
  JudgementRepository,
  NetaRepository,
  ScenarioRepository,
  Winner,
} from '@/yk/repositories';

export class FakeScenarioRepository implements ScenarioRepository {
  async generateTitle(): Promise<string> {
    const year = faker.number.int({ min: 1990, max: 2050 });
    return `The Great Battle of ${year}`;
    
  }
  async generateSubtitle(): Promise<string> {
    return faker.lorem.words({ min: 2, max: 5 });
  }
  async generateOverview(): Promise<string> {
    return 'An epic battle that changed the course of history.';
  }
  async generateNarrative(): Promise<string> {
    return faker.lorem.paragraph();
  }
}

export class FakeNetaRepository implements NetaRepository {
  async getKomaeBase(): Promise<Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>> {
    const { imageUrl, title, subtitle, description } = Placeholders.Komae;
    return { imageUrl, title, subtitle, description };
  }
  async getYonoBase(): Promise<Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>> {
    const { imageUrl, title, subtitle, description } = Placeholders.Yono;
    return { imageUrl, title, subtitle, description };
  }
}

export class FakeBattleReportRepository implements BattleReportRepository {
  private scenarioRepo: ScenarioRepository;
  private netaRepo: NetaRepository;
  constructor(
    scenarioRepo?: ScenarioRepository,
    netaRepo?: NetaRepository,
  ) {
    this.scenarioRepo = scenarioRepo ?? new FakeScenarioRepository();
    this.netaRepo = netaRepo ?? new FakeNetaRepository();
  }

  async generateReport(): Promise<Battle> {
    const [title, subtitle, overview, narrative, komaeBase, yonoBase] = await Promise.all([
      this.scenarioRepo.generateTitle(),
      this.scenarioRepo.generateSubtitle(),
      this.scenarioRepo.generateOverview(),
      this.scenarioRepo.generateNarrative(),
      this.netaRepo.getKomaeBase(),
      this.netaRepo.getYonoBase(),
    ]);

    const komae: Neta = { ...komaeBase, power: faker.number.int({ min: 0, max: 100 }) } as Neta;
    const yono: Neta = { ...yonoBase, power: faker.number.int({ min: 0, max: 100 }) } as Neta;

    return {
      id: uid('battle'),
      title,
      subtitle,
      overview,
      scenario: narrative,
      komae,
      yono,
      status: 'success',
    } satisfies Battle;
  }
}

export class FakeJudgementRepository implements JudgementRepository {
  async determineWinner(input: { mode: PlayMode; yono: Neta; komae: Neta }): Promise<Winner> {
    const { yono, komae } = input;
    if (yono.power > komae.power) return 'YONO';
    if (yono.power < komae.power) return 'KOMAE';
    return 'DRAW';
  }
}
