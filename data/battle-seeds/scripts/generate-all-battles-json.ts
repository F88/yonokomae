/**
 * Generate a consolidated sanitized all-battles.json for ops tools.
 *
 * Rationale:
 *  - Ops analyzers should not dynamically execute each battle module (safer, faster, deterministic).
 *  - We already have an index generator; this complements it with a pre-sanitized JSON artifact.
 *  - Removes `${import.meta.env.BASE_URL}` occurrences up-front.
 *
 * Output: dist/battle/__generated/all-battles.json
 */
import { promises as fs } from 'fs';
import * as path from 'path';

// Lazy local minimal type (avoid circular dependency on compiled dist types during build sequencing)
interface BattleLike {
  id: string;
  publishState?: string;
  themeId: string;
  significance: string;
  title: string;
  subtitle: string;
  komae: {
    title: string;
    subtitle: string;
    description: string;
    power: number;
    imageUrl?: string;
  };
  yono: {
    title: string;
    subtitle: string;
    description: string;
    power: number;
    imageUrl?: string;
  };
  // Allow additional unknown fields without using 'any'
  [k: string]: unknown;
}

const DIST_BATTLE_DIR = path.resolve(process.cwd(), 'dist/battle');
const OUTPUT_JSON = path.join(
  DIST_BATTLE_DIR,
  '__generated',
  'all-battles.json',
);

async function readRecursive(dir: string): Promise<string[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(dir);
  } catch (e) {
    // ENOENT は想定され得る(まだ dist が生成されていない)ので静かに空扱い。
    // それ以外 (EACCES など) は潜在的な問題なので警告を出して気付きやすくする。
    const code = (e as NodeJS.ErrnoException)?.code;
    if (code !== 'ENOENT') {
      console.warn(
        `[generate-all-battles-json] warn: failed to read dir ${dir} code=${code} msg=${e instanceof Error ? e.message : e}`,
      );
    }
    return [];
  }
  const out: string[] = [];
  for (const name of entries) {
    const full = path.join(dir, name);
    let stat;
    try {
      stat = await fs.stat(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      if (name === '__generated') continue; // skip generated
      out.push(...(await readRecursive(full)));
    } else if (stat.isFile() && name.endsWith('.js')) {
      if (/index\.generated\.js$/.test(name)) continue; // skip index aggregator
      out.push(full);
    }
  }
  return out;
}

function sanitizeSource(src: string): string {
  return src.replace(/\$\{import\.meta\.env\.BASE_URL\}/g, '');
}

async function loadBattleModule(abs: string): Promise<BattleLike | null> {
  const code = await fs.readFile(abs, 'utf8');
  const sanitized = sanitizeSource(code);
  const dataUrl =
    'data:text/javascript;base64,' +
    Buffer.from(sanitized, 'utf8').toString('base64');
  try {
    const mod = (await import(dataUrl)) as { default?: unknown };
    const battle = mod.default;
    if (!battle || typeof battle !== 'object') return null;
    // Basic structural guards
    const anyBattle = battle as Record<string, unknown>;
    if (
      typeof anyBattle.id !== 'string' ||
      typeof anyBattle.themeId !== 'string'
    )
      return null;
    return anyBattle as unknown as BattleLike;
  } catch {
    return null;
  }
}

function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  return url.replace(/^undefined/, '');
}

function normalizeBattle(b: BattleLike): BattleLike {
  return {
    ...b,
    komae: { ...b.komae, imageUrl: normalizeImageUrl(b.komae.imageUrl) ?? '' },
    yono: { ...b.yono, imageUrl: normalizeImageUrl(b.yono.imageUrl) ?? '' },
  };
}

async function main() {
  const started = Date.now();
  const files = await readRecursive(DIST_BATTLE_DIR);
  const loaded: BattleLike[] = [];
  for (const f of files.sort()) {
    const b = await loadBattleModule(f);
    if (b) loaded.push(normalizeBattle(b));
  }
  await fs.mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
  const json = JSON.stringify(loaded, null, 2) + '\n';
  await fs.writeFile(OUTPUT_JSON, json, 'utf8');
  process.stdout.write(
    `[generate-all-battles-json] battles=${loaded.length} files=${files.length} out=${path.relative(process.cwd(), OUTPUT_JSON)} durationMs=${Date.now() - started}\n`,
  );
}

main().catch((err) => {
  console.error('[generate-all-battles-json] failed', err);
  process.exit(1);
});
