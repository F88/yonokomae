import { uid } from '@/lib/id';
import { BattleSchema } from '@/schema/schema';
import type { Battle, Neta } from '@/types/types';

export type BattleModule = { default?: Partial<Battle> } | Partial<Battle>;

export async function loadBattleFromSeeds(params: {
  roots: string[]; // e.g., ['/seeds/news/', '/src/seeds/news/']
  file?: string; // optional relative file name to load
}): Promise<Battle> {
  const { roots, file } = params;
  // Note: Vite requires literal strings for import.meta.glob. We load a superset
  // of seed modules from known roots and filter by the provided roots below.
  const mods = mergeGlobs();
  const files = listRelativeFiles(mods, roots);
  if (files.length === 0) {
    throw new Error(`No battle seeds found under: ${roots.join(', ')}`);
  }
  const target = file ?? files[Math.floor(Math.random() * files.length)];
  const mod = getModuleFor(mods, roots, target);
  if (!mod) throw new Error(`Battle not found: ${target}`);
  const data = normalizeBattle(mod);
  const result = BattleSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      'Invalid Battle data: ' +
        result.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; '),
    );
  }
  return result.data;
}

function mergeGlobs(): Record<string, unknown> {
  // Load seed modules (code/data) and avoid globs that pick up README.md etc.
  // Keep patterns as literals as required by Vite.
  return {
    ...(import.meta.glob('/seeds/**/*.{ts,js,json}', {
      eager: true,
    }) as Record<string, unknown>),
    ...(import.meta.glob('/src/seeds/**/*.{ts,js,json}', {
      eager: true,
    }) as Record<string, unknown>),
  };
}

function listRelativeFiles(
  mods: Record<string, unknown>,
  roots: string[],
): string[] {
  const out: string[] = [];
  for (const abs of Object.keys(mods)) {
    for (const root of roots) {
      if (abs.startsWith(root)) {
        out.push(abs.replace(root, ''));
        break;
      }
    }
  }
  return out.sort();
}

function getModuleFor(
  mods: Record<string, unknown>,
  roots: string[],
  file: string,
): BattleModule | undefined {
  for (const root of roots) {
    const key = `${root}${file}`;
    const mod = mods[key] as BattleModule | undefined;
    if (mod) return mod;
  }
  return undefined;
}

export function normalizeBattle(mod: BattleModule): Battle {
  const raw: Partial<Battle> = hasDefault(mod)
    ? (mod.default ?? {})
    : (mod as Partial<Battle>);
  const id = raw.id ?? uid('battle');
  const title = raw.title ?? '';
  const subtitle = raw.subtitle ?? '';
  const overview = raw.overview ?? '';
  const scenario = raw.scenario ?? '';
  const komae = normalizeNeta(raw.komae);
  const yono = normalizeNeta(raw.yono);
  const provenance = Array.isArray(raw.provenance) ? raw.provenance : [];
  const status = raw.status ?? 'success';
  return {
    id,
    title,
    subtitle,
    overview,
    scenario,
    komae,
    yono,
    provenance,
    status,
  } satisfies Battle;
}

function normalizeNeta(n?: Partial<Neta> | undefined): Neta {
  const imageUrl = n?.imageUrl ?? 'about:blank';
  const title = n?.title ?? '';
  const subtitle = n?.subtitle ?? '';
  const description = n?.description ?? '';
  const power = typeof n?.power === 'number' ? n.power : 50;
  return { imageUrl, title, subtitle, description, power } satisfies Neta;
}

function hasDefault(x: unknown): x is { default?: Partial<Battle> } {
  return (
    !!x && typeof x === 'object' && 'default' in (x as Record<string, unknown>)
  );
}
