/**
 * Unified Battle Index Generator (publishState-driven)
 *
 * Goals:
 *  - Eliminate manual imports in src/index.ts
 *  - Classify each battle seed by its explicit publishState property
 *  - Provide three maps: publishedBattleMap, draftBattleMap, allBattleMap
 *  - Keep file-name based keys (basename) for backward compat while
 *    higher-level code moves toward ID-based lookups.
 *  - Be resilient to arbitrary directory nesting under src/battle
 *  - Avoid relying on directory names (no __drafts semantic coupling)
 *
 * Implementation details:
 *  - Recursively scan src/battle for *.ja.ts (excluding any auto-generated dir)
 *  - Use a light AST parse (TypeScript compiler API) to find publishState within
 *    the default-exported object literal. Fall back to regex if needed.
 *  - Missing publishState => treat as 'published' (backward compat) but emit a warning
 *  - Generate src/battle/__generated/index.generated.(ts|d.ts)
 *  - The generated module only performs static imports (tree-shakeable)
 *
 * Safety / Diagnostics:
 *  - Warn on duplicate basenames (risk of overwriting keys)
 *  - Summarize counts by state
 */
import { promises as fs } from 'fs';
import * as path from 'path';
import ts from 'typescript';

const SCAN_ROOT = path.resolve(process.cwd(), 'src/battle');
const GEN_DIR = path.join(SCAN_ROOT, '__generated');
const OUT_FILE = path.join(GEN_DIR, 'index.generated.ts');

async function listJaFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (full.includes('/__generated/')) continue; // skip previous outputs
    if (e.isDirectory()) {
      out.push(...(await listJaFiles(full)));
    } else if (e.isFile() && e.name.endsWith('.ja.ts')) {
      out.push(full);
    }
  }
  return out;
}

const PUBLISH_STATE_REGEX = /publishState\s*:\s*['"]([a-zA-Z0-9_-]+)['"]/;

interface ClassifiedFile {
  abs: string;
  relImport: string; // relative import path from GEN_DIR (without .ts extension)
  basename: string; // file name with extension
  publishState: string; // normalized publish state
  battleId?: string; // extracted battle id (default export object id property)
}

function extractObjectStringProperty(
  sourceText: string,
  abs: string,
  propName: string,
): string | null {
  try {
    const sf = ts.createSourceFile(
      abs,
      sourceText,
      ts.ScriptTarget.ES2022,
      true,
    );
    let result: string | null = null;
    const visit = (node: ts.Node) => {
      if (result) return; // early exit
      if (ts.isExportAssignment(node)) {
        let expr: ts.Expression = node.expression;
        // Unwrap parentheses, type assertions, satisfies expressions until base object literal.
        while (true) {
          if (ts.isParenthesizedExpression(expr)) {
            expr = expr.expression;
            continue;
          }
          if (expr.kind === ts.SyntaxKind.SatisfiesExpression) {
            // SatisfiesExpression: access its 'expression' property via structural typing.
            interface SatisfiesLike {
              expression: ts.Expression;
            }
            expr = (expr as unknown as SatisfiesLike).expression;
            continue;
          }
          if (ts.isAsExpression(expr)) {
            expr = expr.expression;
            continue;
          }
          break;
        }
        if (ts.isObjectLiteralExpression(expr)) {
          for (const prop of expr.properties) {
            if (
              ts.isPropertyAssignment(prop) &&
              ((ts.isIdentifier(prop.name) && prop.name.text === propName) ||
                (ts.isStringLiteral(prop.name) && prop.name.text === propName))
            ) {
              const init = prop.initializer;
              if (ts.isStringLiteral(init)) {
                result = init.text;
                return;
              }
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return result;
  } catch {
    return null;
  }
}

async function classify(files: string[]): Promise<ClassifiedFile[]> {
  const out: ClassifiedFile[] = [];
  for (const abs of files) {
    const text = await fs.readFile(abs, 'utf8');
    let state = extractObjectStringProperty(text, abs, 'publishState');
    if (!state) {
      const m = text.match(PUBLISH_STATE_REGEX);
      state = m ? m[1] : 'published';
    }
    const battleId = extractObjectStringProperty(text, abs, 'id') || undefined;
    const basename = path.basename(abs);
    const relFromGen = path.relative(GEN_DIR, abs).replace(/\\/g, '/');
    const relNoExt = relFromGen.replace(/\.ts$/, '');
    const importPath = relNoExt.startsWith('.') ? relNoExt : `./${relNoExt}`;
    out.push({
      abs,
      relImport: importPath,
      basename,
      publishState: state,
      battleId,
    });
  }
  return out;
}

async function generate() {
  const rootExists = await fs
    .access(SCAN_ROOT)
    .then(() => true)
    .catch(() => false);
  if (!rootExists) throw new Error(`Scan root missing: ${SCAN_ROOT}`);
  await fs.mkdir(GEN_DIR, { recursive: true });
  const all = await listJaFiles(SCAN_ROOT);
  const classified = await classify(all);

  // Group and gather warnings
  const byBase: Record<string, ClassifiedFile[]> = {};
  classified.forEach((c) => {
    byBase[c.basename] = byBase[c.basename] || [];
    byBase[c.basename].push(c);
  });
  const duplicateBasenames = Object.entries(byBase)
    .filter(([, arr]) => arr.length > 1)
    .map(([n, arr]) => `${n}(${arr.length})`);

  const published: ClassifiedFile[] = [];
  const drafts: ClassifiedFile[] = [];
  const byState: Record<string, ClassifiedFile[]> = {};
  const missingPublishExplicit: string[] = [];
  const byBattleId: Record<string, ClassifiedFile[]> = {};
  for (const c of classified) {
    if (!PUBLISH_STATE_REGEX.test(await fs.readFile(c.abs, 'utf8'))) {
      // could be only AST extraction, but easier: we already read text above; for simplicity re-read; acceptable small overhead.
      if (c.publishState === 'published')
        missingPublishExplicit.push(c.basename);
    }
    if (!byState[c.publishState]) byState[c.publishState] = [];
    byState[c.publishState].push(c);
    if (c.battleId) {
      byBattleId[c.battleId] = byBattleId[c.battleId] || [];
      byBattleId[c.battleId]!.push(c);
    }
    if (c.publishState === 'published') published.push(c);
    else drafts.push(c);
  }

  // Stable ordering for git diff friendliness
  published.sort((a, b) => a.basename.localeCompare(b.basename));
  drafts.sort((a, b) => a.basename.localeCompare(b.basename));

  // Build import lines & map entries
  const importLines: string[] = [];
  const publishedEntries: string[] = [];
  const draftEntries: string[] = [];
  let importIndex = 0;
  function addImport(c: ClassifiedFile): string {
    const varName = `b${importIndex++}`;
    // Append .js for Node ESM resolution (tsc removes .ts and we target type:module)
    const runtimeImport = c.relImport.endsWith('.ts')
      ? c.relImport.replace(/\.ts$/, '.js')
      : c.relImport + '.js';
    importLines.push(`import ${varName} from '${runtimeImport}';`);
    return varName;
  }
  for (const c of published) {
    const id = addImport(c);
    publishedEntries.push(`  '${c.basename}': ${id},`);
  }
  for (const c of drafts) {
    const id = addImport(c);
    draftEntries.push(`  '${c.basename}': ${id},`);
  }
  // Add imports for any other (non published/draft) states discovered.
  for (const state of Object.keys(byState)) {
    if (state === 'published' || state === 'draft') continue;
    for (const cf of byState[state]) {
      const alreadyImported = importLines.some((l) => l.includes(cf.relImport));
      if (!alreadyImported) addImport(cf);
    }
  }

  // Prepare per-state maps (generalized)
  // We want to ALWAYS expose the full canonical set of publish states, even if
  // currently unused (empty maps). This makes downstream code stable and
  // future-proof (e.g. auto-complete, exhaustive switches).
  const canonicalStates = ['published', 'draft', 'review', 'archived'];
  const discoveredStates = Object.keys(byState);
  // Merge while preserving desired ordering: published, draft, review, archived.
  const stateKeys = canonicalStates.slice(); // clone
  // Add any unexpected/experimental states (should be rare) after canonical ones, sorted.
  const extraStates = discoveredStates.filter(
    (s) => !canonicalStates.includes(s),
  );
  extraStates.sort();
  stateKeys.push(...extraStates);
  const perStateMapDecls: string[] = [];
  const perStateMapEntries: string[] = [];
  // Rebuild import variable association deterministically to map basenames -> variable names
  // (Simpler than tracking individually above)
  const importVariableByBasename: Record<string, string> = {};
  importLines.forEach((line) => {
    // pattern: import b12 from './path';
    const m = line.match(/import\s+(\w+)\s+from/);
    if (!m) return;
    const varName = m[1];
    // Find file whose relImport matches
    const imp = line.match(/from\s+'([^']+)'/);
    if (!imp) return;
    const rel = imp[1];
    const cf = classified.find((c) => c.relImport === rel);
    if (cf) importVariableByBasename[cf.basename] = varName;
  });
  // genericStateMapBlocks removed (no longer needed)
  for (const state of stateKeys) {
    const filesForState = byState[state] ?? [];
    const entries = filesForState
      .sort((a, b) => a.basename.localeCompare(b.basename))
      .map((c) => `  '${c.basename}': ${importVariableByBasename[c.basename]},`)
      .join('\n');
    let varName: string;
    if (state === 'published') {
      varName = 'publishedBattleMap';
    } else if (state === 'draft') {
      varName = 'draftBattleMap';
    } else {
      varName = `${state.replace(/[^a-zA-Z0-9_]/g, '_')}BattleMap`;
      perStateMapDecls.push(
        `export const ${varName}: Record<string, Battle> = {${entries ? `\n${entries}\n` : ''}};`,
      );
    }
    perStateMapEntries.push(`  '${state}': ${varName},`);
  }

  const publishStateKeysLiteral = stateKeys.map((s) => `'${s}'`).join(', ');

  const banner = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated by scripts/generate-battle-index.ts
// Source of truth: publishState property inside each battle seed file.
// Timestamp: ${new Date().toISOString()}`;

  const body = `${banner}
import type { Battle } from '@yonokomae/types';
${importLines.join('\n')}

// Backward compatible named maps
export const publishedBattleMap: Record<string, Battle> = {\n${publishedEntries.join('\n')}\n};
export const draftBattleMap: Record<string, Battle> = {\n${draftEntries.join('\n')}\n};
${perStateMapDecls.join('\n')}
export const battleMapsByPublishState = {\n${perStateMapEntries.join('\n')}\n} as const;
export const publishStateKeys = [${publishStateKeysLiteral}] as const;
export type PublishStateKey = typeof publishStateKeys[number];
export const allBattleMap: Record<string, Battle> = Object.values(battleMapsByPublishState).reduce((acc, m) => Object.assign(acc, m), {} as Record<string, Battle>);
export const battleSeedsByPublishState: Record<PublishStateKey, Battle[]> =
  (Object.keys(battleMapsByPublishState) as PublishStateKey[]).reduce(
    (acc, key) => {
      acc[key] = Object.values(battleMapsByPublishState[key]);
      return acc;
    },
    {} as Record<PublishStateKey, Battle[]>,
  );
// Grouping by themeId (stable ordering by battle id) for UI layer convenience
export const battlesByThemeId: Record<string, Battle[]> = Object.values(allBattleMap).reduce(
  (acc, b) => {
    (acc[b.themeId] ||= []).push(b);
    return acc;
  },
  {} as Record<string, Battle[]>,
);
for (const key of Object.keys(battlesByThemeId)) {
  const list = battlesByThemeId[key];
  if (list) {
    list.sort((a, b) => a.id.localeCompare(b.id));
  }
}
export const themeIds = Object.keys(battlesByThemeId).sort();
export type ThemeId = keyof typeof battlesByThemeId;
`;

  // Duplicate detection (basename & battle id) -> hard error now.
  const duplicateIdList = Object.entries(byBattleId)
    .filter(([, arr]) => arr.length > 1)
    .map(([id, arr]) => `${id}(${arr.length})`);
  if (duplicateBasenames.length || duplicateIdList.length) {
    const lines = [
      '[generate-battle-index][error] duplicate entries detected:',
    ];
    if (duplicateBasenames.length)
      lines.push('  basenames: ' + duplicateBasenames.join(', '));
    if (duplicateIdList.length)
      lines.push('  battleIds: ' + duplicateIdList.join(', '));
    // Write partial output (helpful for debugging) then exit with failure.
    await fs.writeFile(OUT_FILE, body, 'utf8');
    console.error(lines.join('\n'));
    process.exit(1);
  }

  await fs.writeFile(OUT_FILE, body, 'utf8');
  const dts = `${banner}
import type { Battle } from '@yonokomae/types';
export declare const publishedBattleMap: Record<string, Battle>;
export declare const draftBattleMap: Record<string, Battle>;
export declare const battleMapsByPublishState: Record<string, Record<string, Battle>>;
export declare const publishStateKeys: readonly string[];
export declare type PublishStateKey = typeof publishStateKeys[number];
export declare const allBattleMap: Record<string, Battle>;
export declare const battleSeedsByPublishState: Record<PublishStateKey, Battle[]>;
export declare const battlesByThemeId: Record<string, Battle[]>;
export declare const themeIds: readonly string[];
export declare type ThemeId = keyof typeof battlesByThemeId;
`;
  await fs.writeFile(OUT_FILE.replace(/\.ts$/, '.d.ts'), dts, 'utf8');

  const summary: Record<string, number> = {};
  classified.forEach((c) => {
    summary[c.publishState] = (summary[c.publishState] ?? 0) + 1;
  });
  process.stdout.write(
    `[generate-battle-index] total=${classified.length} published=${published.length} drafts=${drafts.length}\n` +
      `[generate-battle-index] states=${JSON.stringify(summary)}\n` +
      (duplicateBasenames.length
        ? `[generate-battle-index][warning] duplicate basenames: ${duplicateBasenames.join(', ')}\n`
        : '') +
      (missingPublishExplicit.length
        ? `[generate-battle-index][warning] missing explicit publishState (treated published): ${missingPublishExplicit.join(', ')}\n`
        : ''),
  );
}

generate().catch((err) => {
  console.error('[generate-battle-index] failed', err);
  process.exit(1);
});
