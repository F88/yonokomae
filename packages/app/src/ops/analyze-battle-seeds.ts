/**
 * Usage: Analyze battle seeds JSON and print summary statistics.
 *
 * 実行方法:
 * - 直接解析 (dist からロード): `pnpm run ops:analyze-battle-seeds`
 * - 事前に JSON をファイル出力して解析: `pnpm run ops:export-battle-seeds-to-json -- out/battles.json && pnpm run ops:analyze-battle-seeds -- out/battles.json`
 * - 手動実行: `pnpm run build:packages && pnpm run ops:build && node dist/ops/analyze-battle-seeds.js [infile] [--format=json]`
 *
 * 引数:
 * - `[infile]` (任意): `export-battle-seeds-to-json` で生成した JSON ファイルパス。未指定時は dist の battle modules を直接ロード。
 * - `--format=json` (任意): 出力を JSON 形式にする (デフォルトは human-readable テキスト)。
 * - `-h|--help`: ヘルプを表示
 *
 * 出力(テキストモード):
 * - 総件数
 * - テーマ別件数・割合
 * - 重要度( significance )別件数・割合
 * - power の統計 (komae / yono / combined min max avg)
 * - 上位5件 (combined power) の battle id と title
 *
 * 出力(JSONモード): 上記を 1 つのオブジェクトにまとめた JSON
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Battle } from '@yonokomae/types';
import chalk from 'chalk';

interface StatsSummary {
  total: number;
  byTheme: Record<string, { count: number; ratio: number }>;
  bySignificance: Record<string, { count: number; ratio: number }>;
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
}

function locateBattleDistDir(currentDir: string): string {
  const candidates = [
    // If emitted at dist/ops/*.js (current behavior in repo prior to nested rootDir)
    path.resolve(currentDir, '../..', 'data/battle-seeds/dist/battle'),
    // If emitted at dist/ops/ops/*.js (rootDir inferred as packages/app/src)
    path.resolve(currentDir, '../../..', 'data/battle-seeds/dist/battle'),
    // Extra defensive (one more level) in case of further nesting
    path.resolve(currentDir, '../../../..', 'data/battle-seeds/dist/battle'),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error(
    'Battle seeds dist directory not found. Tried:\n' +
      candidates.map((c) => '  - ' + c).join('\n') +
      '\nHave you executed: pnpm run build:packages ?',
  );
}

async function loadAllBattlesFromDist(): Promise<Battle[]> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const battleDir = locateBattleDistDir(currentDir);
  const files = readdirSync(battleDir).filter((f) => f.endsWith('.js'));
  const imports = files.map(async (file) => {
    const filePath = path.join(battleDir, file);
    const src = readFileSync(filePath, 'utf8');
    const sanitized = src.replaceAll('import.meta.env.BASE_URL', "''");
    const dataUrl = `data:text/javascript;base64,${Buffer.from(sanitized, 'utf8').toString('base64')}`;
    const mod = await import(dataUrl);
    return (mod.default ?? mod) as Battle;
  });
  return Promise.all(imports);
}

function calcStats(battles: Battle[]): StatsSummary {
  const total = battles.length;
  const byTheme: StatsSummary['byTheme'] = {};
  const bySignificance: StatsSummary['bySignificance'] = {};
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

  return {
    total,
    byTheme,
    bySignificance,
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
  lines.push('');
  lines.push(chalk.bold('By Significance:'));
  const sigEntries = Object.entries(stats.bySignificance).sort(
    (a, b) => b[1].count - a[1].count,
  );
  for (const [sig, v] of sigEntries) {
    lines.push(
      `  ${sig.padEnd(10, ' ')} ${v.count.toString().padStart(3, ' ')}  ${formatPercent(v.ratio)}%`,
    );
  }
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
  return lines.join('\n');
}

async function main() {
  const started = Date.now();
  const args = process.argv.slice(2);
  if (args.includes('-h') || args.includes('--help')) {
    process.stdout.write(
      `Analyze battle seeds.\n\nUsage: pnpm run ops:analyze-battle-seeds [infile] [--format=json]\n  If [infile] is omitted, battles are loaded from dist modules.\n\nExamples:\n  pnpm run ops:analyze-battle-seeds\n  pnpm run ops:export-battle-seeds-to-json -- out/battles.json && pnpm run ops:analyze-battle-seeds -- out/battles.json\n  pnpm run ops:analyze-battle-seeds -- out/battles.json --format=json\n`,
    );
    return;
  }
  const formatJson = args.includes('--format=json');
  const filteredArgs = args.filter((a) => a !== '--format=json');
  let battles: Battle[] = [];
  if (filteredArgs.length === 0) {
    battles = await loadAllBattlesFromDist();
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
  const stats = calcStats(battles);
  if (formatJson) {
    process.stdout.write(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - started,
          ...stats,
        },
        null,
        2,
      ),
    );
    return;
  }
  process.stdout.write(renderText(stats) + '\n');
  process.stderr.write(
    chalk.dim(`Duration(ms): ${Date.now() - started}`) + '\n',
  );
}

main();
