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
} from './repositories';

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
  async getKomaeBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    const { imageUrl, title, subtitle, description } = Placeholders.Komae;
    return { imageUrl, title, subtitle, description };
  }
  async getYonoBase(): Promise<
    Pick<Neta, 'imageUrl' | 'title' | 'subtitle' | 'description'>
  > {
    const { imageUrl, title, subtitle, description } = Placeholders.Yono;
    return { imageUrl, title, subtitle, description };
  }
}

type DelayOption = number | { min: number; max: number };

function isTestEnv(): boolean {
  type Env = { NODE_ENV?: string };
  const env: Env | undefined =
    typeof process !== 'undefined'
      ? (process as unknown as { env?: Env }).env
      : undefined;
  return env?.NODE_ENV === 'test';
}

async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted)
      return reject(new DOMException('Aborted', 'AbortError'));
    const id = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

const MAX_DELAY_MS = 10_000; // 10 seconds

function computeDelayMs(option?: DelayOption): number {
  if (!option) return 0;
  if (typeof option === 'number') {
    let v = Math.max(0, Math.floor(option));
    if (v > MAX_DELAY_MS) {
      console.warn(
        `[FakeRepo] Delay capped at ${MAX_DELAY_MS}ms (requested: ${v}ms)`,
      );
      v = MAX_DELAY_MS;
    }
    return v;
  }
  // Object form { min, max }
  let min = Math.max(0, Math.floor(option.min));
  let max = Math.max(min, Math.floor(option.max));
  const needCap = min > MAX_DELAY_MS || max > MAX_DELAY_MS;
  if (needCap) {
    const original = { min, max };
    min = Math.min(min, MAX_DELAY_MS);
    max = Math.min(Math.max(min, max), MAX_DELAY_MS);
    console.warn(
      `[FakeRepo] Delay range capped to <= ${MAX_DELAY_MS}ms (requested: min=${original.min}ms, max=${original.max}ms; capped: min=${min}ms, max=${max}ms)`,
    );
  }
  const span = max - min;
  if (span <= 0) return min;
  return min + Math.floor(Math.random() * (span + 1)); // inclusive of max
}

export class FakeBattleReportRepository implements BattleReportRepository {
  private scenarioRepo: ScenarioRepository;
  private netaRepo: NetaRepository;
  private delay?: DelayOption;
  constructor(
    scenarioRepo?: ScenarioRepository,
    netaRepo?: NetaRepository,
    options?: { delay?: DelayOption },
  ) {
    this.scenarioRepo = scenarioRepo ?? new FakeScenarioRepository();
    this.netaRepo = netaRepo ?? new FakeNetaRepository();
    this.delay = options?.delay;
  }

  async generateReport(options?: { signal?: AbortSignal }): Promise<Battle> {
    const ms = computeDelayMs(this.delay);
    if (ms > 0 && !isTestEnv()) {
      await sleep(ms, options?.signal);
    }
    const [title, subtitle, overview, narrative, komaeBase, yonoBase] =
      await Promise.all([
        this.scenarioRepo.generateTitle(),
        this.scenarioRepo.generateSubtitle(),
        this.scenarioRepo.generateOverview(),
        this.scenarioRepo.generateNarrative(),
        this.netaRepo.getKomaeBase(),
        this.netaRepo.getYonoBase(),
      ]);

    const komae: Neta = {
      ...komaeBase,
      power: faker.number.int({ min: 0, max: 100 }),
    } as Neta;
    const yono: Neta = {
      ...yonoBase,
      power: faker.number.int({ min: 0, max: 100 }),
    } as Neta;

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
  private delay?: DelayOption;
  constructor(options?: { delay?: DelayOption }) {
    this.delay = options?.delay;
  }
  async determineWinner(
    input: { mode: PlayMode; yono: Neta; komae: Neta },
    options?: { signal?: AbortSignal },
  ): Promise<Winner> {
    const ms = computeDelayMs(this.delay);
    if (ms > 0 && !isTestEnv()) {
      await sleep(ms, options?.signal);
    }
    const { yono, komae } = input;
    if (yono.power > komae.power) return 'YONO';
    if (yono.power < komae.power) return 'KOMAE';
    return 'DRAW';
  }
}
