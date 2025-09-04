import { uid } from '@/lib/id';
import { BattleSchema } from '@yonokomae/schema';
import type { Battle, Neta } from '@yonokomae/types';
import { battleSeeds, battleSeedsByFile } from '@yonokomae/data-battle-seeds';

export type BattleModule = { default?: Partial<Battle> } | Partial<Battle>;

export async function loadBattleFromSeeds(params: {
  roots: string[]; // Legacy field - now uses static imports from @yonokomae packages
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
  const battle = getModuleFor(mods, roots, target);
  if (!battle) throw new Error(`Battle not found: ${target}`);
  const data = battle;
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

function mergeGlobs(): Record<string, Battle> {
  // Use static imports from battle-seeds package
  const battleSeedMap: Record<string, Battle> = {};

  // Map battle seeds to file paths that match the old glob patterns
  battleSeeds.forEach((battle) => {
    // Find the original file name by checking the battleSeedsByFile map
    for (const [fileName, seedBattle] of Object.entries(battleSeedsByFile)) {
      if (seedBattle.id === battle.id) {
        // Map to both possible root paths for compatibility
        // 1) Workspace package virtual root
        battleSeedMap[`@yonokomae/data-battle-seeds/${fileName}`] = battle;
        // 2) Legacy filesystem-style root
        battleSeedMap[`/seeds/historical-evidences/battle/${fileName}`] =
          battle;
        break;
      }
    }
  });

  return battleSeedMap;
}

function listRelativeFiles(
  mods: Record<string, Battle>,
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
  mods: Record<string, Battle>,
  roots: string[],
  file: string,
): Battle | undefined {
  for (const root of roots) {
    const key = `${root}${file}`;
    const battle = mods[key];
    if (battle) return battle;
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
  const overview = raw.narrative?.overview ?? (raw as any).overview ?? '';
  const scenario = raw.narrative?.scenario ?? (raw as any).scenario ?? '';
  const komae = normalizeNeta(raw.komae);
  const yono = normalizeNeta(raw.yono);
  const provenance = Array.isArray(raw.provenance) ? raw.provenance : [];
  const status = raw.status ?? 'success';
  const themeId = raw.themeId ?? 'history';
  const significance = raw.significance ?? 'low';
  return {
    id,
    title,
    subtitle,
    narrative: { overview, scenario },
    themeId,
    significance,
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
