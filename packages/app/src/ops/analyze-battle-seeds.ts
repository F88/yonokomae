/**
 * Analyze battle seeds (either live from built modules or a previously exported JSON file).
 *
 * 概要:
 * - `@yonokomae/data-battle-seeds` が提供する `battleSeeds` (全 publishState 含む) を直接利用
 * - もしくは `ops:export-battle-seeds-to-json` で生成した JSON を入力
 * - 出力は human-readable テキストまたは `--format=json` による JSON サマリ
 *
 * 主な指標 (テキストモード):
 * - 総件数 / テーマ別件数比率 / 重要度別件数比率
 * - Theme × Significance クロスタブ
 * - Power 統計 (min/max/avg for komae, yono, combined)
 * - Combined Power 上位5件 (id/title/theme/significance/内訳)
 * - Battle Index (theme,title,id ソート) – 回帰 / grep 補助
 *
 * 実行方法 (推奨):
 *   pnpm run ops:analyze-battle-seeds
 *   pnpm run ops:export-battle-seeds-to-json -- out/battles.json && pnpm run ops:analyze-battle-seeds -- out/battles.json
 *   pnpm run ops:analyze-battle-seeds -- out/battles.json --format=json
 *
 * 手動実行 (直接 Node):
 *   pnpm run build:packages && pnpm run ops:build \\
 *     && node dist/ops-build/ops/analyze-battle-seeds.js [infile] [--format=json]
 *
 * 引数:
 *   [infile]       (任意) export JSON パス。省略時はビルド済み battle modules を読む。
 *   --format=json  JSON 出力。
 *   -h | --help    ヘルプ表示。
 *
 * JSON 出力フィールド例:
 *   {
 *     generatedAt, durationMs, total,
 *     byTheme: { themeId: { count, ratio } },
 *     bySignificance: { significance: { count, ratio } },
 *     crossTab: { themeId: { significance: count } },
 *     power: { komae:{min,max,avg}, yono:{...}, combined:{...} },
 *     topCombined: [{ id,title,combined,... }],
 *     index: [{ themeId,id,title }]
 *   }
 *
 * 実装メモ:
 * - export CLI と同様に `import.meta.env.BASE_URL` を空文字へ置換し data: URL 経由で ESM import。
 * - battle ディレクトリ探索は固定パス (process.cwd()/data/battle-seeds/dist/battle)。
 *
 * @example pnpm run ops:analyze-battle-seeds
 * @example pnpm run ops:analyze-battle-seeds -- out/battles.json --format=json
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import * as path from 'path';
import type { Battle } from '@yonokomae/types';
import chalk from 'chalk';
// NOTE: Direct import of battleSeeds was reverted because individual battle seed
// modules reference `${import.meta.env.BASE_URL}` in template literals. Under
// plain Node (ops build) `import.meta.env` is undefined causing a runtime crash.
// Instead we now:
//   1. Recursively scan data/battle-seeds/dist/battle for .js files (including drafts in subdirs)
//   2. Read each file as text and sanitize occurrences of `${import.meta.env.BASE_URL}` -> ''
//   3. Dynamically import via a data: URL so no intermediate temp files are needed.
// This guarantees ALL publishState entries (published + draft + future states) are loaded.

interface StatsSummary {
  total: number;
  byTheme: Record<string, { count: number; ratio: number }>;
  bySignificance: Record<string, { count: number; ratio: number }>;
  crossTab: Record<string, Record<string, number>>; // themeId -> significance -> count
  byPublishState: Record<string, { count: number; ratio: number }>; // published / draft / review / archived etc.
  power: {
    komae: { min: number; max: number; avg: number };
    yono: { min: number; max: number; avg: number };
    combined: { min: number; max: number; avg: number };
  };
  topCombined: Array<{
    id: string;
    title: string;
    significance: string;
    themeId: string;
    komaePower: number;
    yonoPower: number;
    combined: number;
  }>;
  index: Array<{
    themeId: string;
    publishState: string;
    id: string;
    title: string;
    subtitle: string;
  }>;
  draftIds: string[]; // convenience for quick diff / triage
}

// NOTE: パッケージ API 直接 import 方式は Node 実行時の `import.meta.env` 未定義エラーのため撤回。
//       現在は dist ファイル再走査 (再帰) → 動的 import により publishState 全件を取得。

async function loadBattlesFromDist(): Promise<Battle[]> {
  // Fast path: if prebuilt consolidated JSON exists, use it.
  const prebuiltJson = path.resolve(
    process.cwd(),
    'data/battle-seeds/dist/battle/__generated/all-battles.json',
  );
  if (existsSync(prebuiltJson)) {
    try {
      const raw = readFileSync(prebuiltJson, 'utf8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return arr as Battle[];
      }
    } catch {
      // fall through to dynamic scan
    }
  }
  const root = path.resolve(process.cwd(), 'data/battle-seeds/dist/battle');
  const files: string[] = [];
  const walk = (dir: string) => {
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return; // silently ignore missing path
    }
    for (const entry of entries) {
      const full = path.join(dir, entry);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        if (entry === '__generated') {
          // Skip auto-generated aggregation modules; analyzer wants only raw battle definitions.
          continue;
        }
        walk(full);
      } else if (st.isFile()) {
        if (entry.endsWith('.js')) {
          // Exclude aggregate generated index modules – we only want raw battle definitions.
          if (!/index\.generated\.js$/.test(entry)) {
            files.push(full);
          }
        }
      }
    }
  };
  walk(root);
  files.sort();
  const battles: Battle[] = [];
  for (const file of files) {
    let src: string;
    try {
      src = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    // Remove problematic Vite-only placeholder usage.
    const sanitized = src.replace(/\$\{import\.meta\.env\.BASE_URL\}/g, '');
    // data URL import keeps relative source mapping irrelevant for analysis.
    const dataUrl =
      'data:text/javascript;base64,' +
      Buffer.from(sanitized, 'utf8').toString('base64');
    try {
      const mod = (await import(dataUrl)) as { default?: unknown };
      const battle = mod.default as Partial<Battle> | undefined;
      if (battle && typeof battle === 'object') {
        // Coerce minimal shape safeguards
        if (!battle.id || !battle.themeId) continue;
        battles.push(battle as Battle);
      }
    } catch {
      // Skip modules that fail to import; log minimal diagnostic.
      console.error(
        chalk.red('[analyze-battle-seeds] failed to import:'),
        path.basename(file),
      );
    }
  }
  return battles;
}

function calcStats(battles: Battle[]): StatsSummary {
  const total = battles.length;
  const byTheme: StatsSummary['byTheme'] = {};
  const bySignificance: StatsSummary['bySignificance'] = {};
  const crossTab: StatsSummary['crossTab'] = {};
  const byPublishState: StatsSummary['byPublishState'] = {};
  let komaeMin = Infinity,
    komaeMax = -Infinity,
    komaeSum = 0;
  let yonoMin = Infinity,
    yonoMax = -Infinity,
    yonoSum = 0;
  let combinedMin = Infinity,
    combinedMax = -Infinity,
    combinedSum = 0;

  for (const b of battles) {
    if (!byTheme[b.themeId]) {
      byTheme[b.themeId] = { count: 0, ratio: 0 };
    }
    byTheme[b.themeId]!.count += 1;
    if (!bySignificance[b.significance]) {
      bySignificance[b.significance] = { count: 0, ratio: 0 };
    }
    bySignificance[b.significance]!.count += 1;
    const ps = b.publishState ?? 'published';
    if (!byPublishState[ps]) {
      byPublishState[ps] = { count: 0, ratio: 0 };
    }
    byPublishState[ps]!.count += 1;
    if (!crossTab[b.themeId]) crossTab[b.themeId] = {};
    const ctRow = crossTab[b.themeId]!;
    ctRow[b.significance] = (ctRow[b.significance] ?? 0) + 1;
    const kp = b.komae.power;
    const yp = b.yono.power;
    const cp = kp + yp;
    komaeMin = Math.min(komaeMin, kp);
    komaeMax = Math.max(komaeMax, kp);
    komaeSum += kp;
    yonoMin = Math.min(yonoMin, yp);
    yonoMax = Math.max(yonoMax, yp);
    yonoSum += yp;
    combinedMin = Math.min(combinedMin, cp);
    combinedMax = Math.max(combinedMax, cp);
    combinedSum += cp;
  }

  const ratio = (count: number) => (total === 0 ? 0 : count / total);
  Object.values(byTheme).forEach((v) => {
    v.ratio = ratio(v.count);
  });
  Object.values(bySignificance).forEach((v) => {
    v.ratio = ratio(v.count);
  });
  Object.values(byPublishState).forEach((v) => {
    v.ratio = ratio(v.count);
  });

  const avg = (sum: number) => (total === 0 ? 0 : sum / total);

  const topCombined = battles
    .map((b) => ({
      id: b.id,
      title: b.title,
      significance: b.significance,
      themeId: b.themeId,
      komaePower: b.komae.power,
      yonoPower: b.yono.power,
      combined: b.komae.power + b.yono.power,
    }))
    .sort((a, b) => b.combined - a.combined)
    .slice(0, 5);

  const index = battles
    .map((b) => ({
      themeId: b.themeId,
      publishState: b.publishState ?? 'published',
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
    }))
    // Order by themeId, then title, then id (as requested: theme,title,id)
    .sort((a, b) => {
      if (a.themeId !== b.themeId) return a.themeId.localeCompare(b.themeId);
      if (a.title !== b.title) return a.title.localeCompare(b.title);
      return a.id.localeCompare(b.id);
    });

  const draftIds = battles
    .filter((b) => (b.publishState ?? 'published') !== 'published')
    .map((b) => b.id)
    .sort();

  return {
    total,
    byTheme,
    bySignificance,
    crossTab,
    byPublishState,
    power: {
      komae: {
        min: komaeMin === Infinity ? 0 : komaeMin,
        max: komaeMax === -Infinity ? 0 : komaeMax,
        avg: avg(komaeSum),
      },
      yono: {
        min: yonoMin === Infinity ? 0 : yonoMin,
        max: yonoMax === -Infinity ? 0 : yonoMax,
        avg: avg(yonoSum),
      },
      combined: {
        min: combinedMin === Infinity ? 0 : combinedMin,
        max: combinedMax === -Infinity ? 0 : combinedMax,
        avg: avg(combinedSum),
      },
    },
    topCombined,
    index,
    draftIds,
  };
}

function formatPercent(ratio: number): string {
  return (ratio * 100).toFixed(1).padStart(6, ' ');
}

function renderText(stats: StatsSummary): string {
  const lines: string[] = [];
  const label = (s: string) => chalk.dim(s);
  const num = (n: number) => chalk.cyan(String(n));
  lines.push(chalk.bold(`Battle Seeds Analysis`));
  lines.push('');
  lines.push(`${label('Total Battles:')} ${num(stats.total)}`);
  if (stats.byPublishState.published) {
    const published = stats.byPublishState.published.count;
    const publishedPct = formatPercent(stats.byPublishState.published.ratio);
    const drafts = Object.entries(stats.byPublishState)
      .filter(([k]) => k !== 'published')
      .reduce((a, [, v]) => a + v.count, 0);
    lines.push(
      `${label('Published:')} ${published} (${publishedPct}%)  ${label('Unpublished Total:')} ${drafts}`,
    );
  }
  lines.push('');
  lines.push(chalk.bold('By Theme:'));
  const themeEntries = Object.entries(stats.byTheme).sort(
    (a, b) => b[1].count - a[1].count,
  );
  for (const [theme, v] of themeEntries) {
    lines.push(
      `  ${theme.padEnd(12, ' ')} ${v.count.toString().padStart(3, ' ')}  ${formatPercent(v.ratio)}%`,
    );
  }

  // Significance
  lines.push('');
  lines.push(chalk.bold('By Significance:'));
  // Publish State distribution
  lines.push('');
  lines.push(chalk.bold('By Publish State:'));
  const psEntries = Object.entries(stats.byPublishState).sort(
    (a, b) => b[1].count - a[1].count,
  );
  for (const [ps, v] of psEntries) {
    lines.push(
      `  ${ps.padEnd(12, ' ')} ${v.count.toString().padStart(3, ' ')}  ${formatPercent(v.ratio)}%`,
    );
  }

  const sigEntries = Object.entries(stats.bySignificance).sort(
    (a, b) => b[1].count - a[1].count,
  );
  for (const [sig, v] of sigEntries) {
    lines.push(
      `  ${sig.padEnd(10, ' ')} ${v.count.toString().padStart(3, ' ')}  ${formatPercent(v.ratio)}%`,
    );
  }

  // Cross-tab (Theme x Significance)
  lines.push('');
  lines.push(chalk.bold('Theme x Significance:'));
  const SIGNIFICANCE_ORDER = ['low', 'medium', 'high', 'legendary'] as const;
  const themeTotals: Array<{ theme: string; total: number }> = Object.entries(
    stats.byTheme,
  ).map(([theme, v]) => ({ theme, total: v.count }));
  themeTotals.sort((a, b) => b.total - a.total);
  const themeColWidth =
    Math.max(5, ...themeTotals.map((t) => t.theme.length)) + 2;
  lines.push(
    '  ' +
      'Theme'.padEnd(themeColWidth) +
      SIGNIFICANCE_ORDER.map((s) => s.slice(0, 3).padStart(5, ' ')).join('') +
      '  total',
  );
  const colTotals: Record<string, number> = {};
  for (const { theme } of themeTotals) {
    const rowCounts = SIGNIFICANCE_ORDER.map(
      (sig) => stats.crossTab[theme]?.[sig] ?? 0,
    );
    rowCounts.forEach((c, i) => {
      const key = SIGNIFICANCE_ORDER[i];
      colTotals[key as string] = (colTotals[key as string] ?? 0) + c;
    });
    const row =
      '  ' +
      theme.padEnd(themeColWidth) +
      rowCounts.map((c) => String(c).padStart(5, ' ')).join('') +
      '  ' +
      String(rowCounts.reduce((a, b) => a + b, 0)).padStart(5, ' ');
    lines.push(row);
  }
  if (themeTotals.length > 0) {
    const totalRow =
      '  ' +
      label('TOTAL'.padEnd(themeColWidth)) +
      SIGNIFICANCE_ORDER.map((s) =>
        String(colTotals[s] ?? 0).padStart(5, ' '),
      ).join('') +
      '  ' +
      String(stats.total).padStart(5, ' ');
    lines.push(totalRow);
  }

  // Power stats
  lines.push('');
  lines.push(chalk.bold('Power Stats:'));
  lines.push(
    `  komae    min=${stats.power.komae.min} max=${stats.power.komae.max} avg=${stats.power.komae.avg.toFixed(1)}`,
  );
  lines.push(
    `  yono     min=${stats.power.yono.min} max=${stats.power.yono.max} avg=${stats.power.yono.avg.toFixed(1)}`,
  );
  lines.push(
    `  combined min=${stats.power.combined.min} max=${stats.power.combined.max} avg=${stats.power.combined.avg.toFixed(1)}`,
  );

  // Top 5 Battles by combined power
  lines.push('');
  lines.push(chalk.bold('Top 5 Battles (by combined power):'));
  for (const b of stats.topCombined) {
    lines.push(
      `  - ${b.id.padEnd(28, ' ')} ${String(b.combined).padStart(6, ' ')}  (${b.komaePower}+${b.yonoPower})  ${b.themeId}/${b.significance}  ${b.title}`,
    );
  }
  if (stats.topCombined.length === 0) {
    lines.push('  (no battles)');
  }

  // Battle Index (TSV)
  lines.push('');
  lines.push(chalk.bold('Battle Index (TSV)'));
  lines.push(['Theme', 'Publish State', 'Title', 'Subtitle', 'ID'].join('\t'));
  for (const row of stats.index) {
    lines.push(
      [row.themeId, row.publishState, row.title, row.subtitle, row.id].join(
        '\t',
      ),
    );
  }
  // Draft / unpublished list
  lines.push('');
  lines.push(chalk.bold('Unpublished (non-published) Battle IDs:'));
  if (stats.draftIds.length === 0) {
    lines.push('  (none)');
  } else {
    for (const id of stats.draftIds) lines.push(`  - ${id}`);
  }
  return lines.join('\n');
}

async function main() {
  const started = Date.now();
  // Strip the standalone "--" argument that npm/pnpm inserts before user flags.
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const showHelp = args.includes('-h') || args.includes('--help');
  const formatJson = args.includes('--format=json');
  const hasPublishedOnly = args.includes('--published-only');
  const hasDraftsOnly = args.includes('--drafts-only');
  if (hasPublishedOnly && hasDraftsOnly) {
    throw new Error(
      'Flags --published-only and --drafts-only are mutually exclusive',
    );
  }
  const filteredArgs = args.filter(
    (a) =>
      a !== '--format=json' &&
      a !== '--published-only' &&
      a !== '--drafts-only',
  );
  if (showHelp) {
    process.stdout.write(
      `Analyze battle seeds.\n\n` +
        `Usage: pnpm run ops:analyze-battle-seeds [infile] [--format=json] [--published-only|--drafts-only]\n` +
        `  If [infile] is omitted, battles are loaded from dist modules.\n` +
        `  Filtering flags narrow the in-memory set prior to statistics.\n\n` +
        `Examples:\n` +
        `  pnpm run ops:analyze-battle-seeds\n` +
        `  pnpm run ops:export-battle-seeds-to-json -- out/battles.json && pnpm run ops:analyze-battle-seeds -- out/battles.json\n` +
        `  pnpm run ops:analyze-battle-seeds -- out/battles.json --format=json\n` +
        `  pnpm run ops:analyze-battle-seeds -- --format=json --published-only\n` +
        `  pnpm run ops:analyze-battle-seeds -- --format=json --drafts-only\n`,
    );
    return;
  }
  let battles: Battle[] = [];
  if (filteredArgs.length === 0) {
    // dist/battle 再帰走査で全 publishState 取得
    battles = await loadBattlesFromDist();
  } else {
    const inFile = filteredArgs[0];
    if (typeof inFile !== 'string' || inFile.length === 0) {
      throw new Error('Input file path argument must be a non-empty string');
    }
    const raw = readFileSync(path.resolve(inFile), 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Input JSON must be an array of Battle objects');
    }
    battles = parsed as Battle[];
  }
  // Apply filtering flags AFTER loading but BEFORE stats computation.
  let filterLabel: 'published-only' | 'drafts-only' | 'all' = 'all';
  if (hasPublishedOnly) {
    battles = battles.filter(
      (b) => (b.publishState ?? 'published') === 'published',
    );
    filterLabel = 'published-only';
  } else if (hasDraftsOnly) {
    battles = battles.filter(
      (b) => (b.publishState ?? 'published') !== 'published',
    );
    filterLabel = 'drafts-only';
  }
  const stats = calcStats(battles);
  if (formatJson) {
    process.stdout.write(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - started,
          source:
            filteredArgs.length === 0 ? 'package:battleSeeds' : 'json:file',
          filter: filterLabel,
          ...stats,
        },
        null,
        2,
      ),
    );
    return;
  }
  const durationMs = Date.now() - started;
  const outText =
    renderText(stats) +
    '\n\n' +
    chalk.dim(`Duration(ms): ${durationMs}`) +
    '\n';
  process.stdout.write(outText);
}

main();
