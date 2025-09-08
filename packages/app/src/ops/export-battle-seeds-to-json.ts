/**
 * Usage: Export battle seeds as JSON from CLI.
 *
 * 実行方法:
 * - 標準出力に出す: `pnpm run ops:export-battle-seeds-to-json`
 * - ファイルへ出す: `pnpm run ops:export-battle-seeds-to-json -- out/battles.json`
 * - 手動実行: `pnpm run build:deps && pnpm run ops:build && node dist/ops/export-battle-seeds-to-json.js [outfile]`
 *
 * 引数:
 * - `[outfile]` (任意): 出力先 JSON ファイルパス。未指定時は stdout に出力。
 *
 * 出力:
 * - Battle[] を整形済みJSONで出力（UTF-8, 2スペースインデント）
 * - サマリ: 読み込みファイル数・要素数・書き込みサイズ・経過時間
 */

import { writeFileSync, readdirSync, readFileSync, mkdirSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Battle } from '@yonokomae/types';
import chalk from 'chalk';

function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  if (url.startsWith('undefined')) return url.replace(/^undefined/, '');
  return url;
}

function normalizeBattle(b: Battle): Battle {
  return {
    ...b,
    yono: { ...b.yono, imageUrl: normalizeImageUrl(b.yono.imageUrl) ?? '' },
    komae: { ...b.komae, imageUrl: normalizeImageUrl(b.komae.imageUrl) ?? '' },
  };
}

async function loadAllBattlesFromDist(): Promise<{
  battles: Battle[];
  filesRead: number;
}> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url)); // dist/ops or dist/ops/ops
  // Support multiple relative layouts depending on how TypeScript emitted output:
  // 1) dist/ops/export-battle-seeds-to-json.js  (currentDir = dist/ops)
  //    -> battle dir relative: ../data/battle-seeds/dist/battle (candidate A)
  // 2) dist/ops/ops/export-battle-seeds-to-json.js (currentDir = dist/ops/ops)
  //    -> battle dir relative: ../../data/battle-seeds/dist/battle (candidate B)
  // 3) (legacy) dist/ops/packages/app/src/ops/... (not expected now) (candidate C)
  const candidates = [
    path.resolve(currentDir, '../data/battle-seeds/dist/battle'),
    path.resolve(currentDir, '../../data/battle-seeds/dist/battle'),
    path.resolve(currentDir, '../../../data/battle-seeds/dist/battle'),
  ];
  const battleDir = candidates.find((p) => {
    try {
      return readdirSync(p).length >= 0;
    } catch {
      return false;
    }
  });
  if (!battleDir) {
    throw new Error(
      `Battle dist directory not found. Tried:\n${candidates
        .map((c) => ' - ' + c)
        .join('\n')}\nDid you run 'pnpm run build:packages'?`,
    );
  }
  const files = readdirSync(battleDir).filter((f) => f.endsWith('.js'));

  const imports = files.map(async (file) => {
    const filePath = path.join(battleDir, file);
    const src = readFileSync(filePath, 'utf8');
    const sanitized = src.replaceAll('import.meta.env.BASE_URL', "''");
    const dataUrl = `data:text/javascript;base64,${Buffer.from(sanitized, 'utf8').toString('base64')}`;
    const mod = await import(dataUrl);
    return (mod.default ?? mod) as Battle;
  });

  const battles = (await Promise.all(imports)).map(normalizeBattle);
  return { battles, filesRead: files.length };
}

function printSummary(
  to: 'stdout' | 'stderr',
  summary: {
    filesRead: number;
    elements: number;
    bytes: number;
    durationMs: number;
    output: string;
  },
) {
  const label = (s: string) => chalk.dim(s);
  const val = (s: string | number) => chalk.cyan(String(s));
  const out = chalk.green(summary.output);
  const lines = [
    `${label('Files read:')} ${val(summary.filesRead)}`,
    `${label('Elements:')} ${val(summary.elements)}`,
    `${label('Output:')} ${out}`,
    `${label('Bytes:')} ${val(summary.bytes)}`,
    `${label('Duration(ms):')} ${chalk.yellow(String(summary.durationMs))}`,
  ].join('\n');
  if (to === 'stdout') {
    process.stdout.write(`\n${lines}\n`);
  } else {
    process.stderr.write(`\n${lines}\n`);
  }
}

async function main() {
  const startedAt = Date.now();
  const rawArgs = process.argv.slice(2);
  // Support invocation patterns where pnpm inserts a standalone `--` before user args:
  // e.g. `pnpm run ops:export-battle-seeds-to-json -- out/file.json` results in args ["--", "out/file.json"].
  const args = (() => {
    const a = [...rawArgs];
    while (a[0] === '--') a.shift();
    // Extra safeguard (some environments may still pass a leading '--')
    if (a[0] === '--') a.shift();
    return a;
  })();
  if (rawArgs.includes('-h') || rawArgs.includes('--help')) {
    process.stdout.write(
      `Export battle seeds as JSON.\n\nUsage: pnpm run ops:export-battle-seeds-to-json [outfile]\n       pnpm run ops:export-battle-seeds-to-json -- [outfile]  (pnpm style)\n  If [outfile] is omitted, JSON is written to stdout.\n\nExamples:\n  pnpm run ops:export-battle-seeds-to-json\n  pnpm run ops:export-battle-seeds-to-json out/battles.json\n  pnpm run ops:export-battle-seeds-to-json -- out/battles.json\n`,
    );
    return;
  }
  const { battles, filesRead } = await loadAllBattlesFromDist();
  const json = JSON.stringify(battles, null, 2);
  const bytes = Buffer.byteLength(json, 'utf8');

  if (args.length === 0) {
    process.stdout.write(json);
    printSummary('stderr', {
      filesRead,
      elements: battles.length,
      bytes,
      durationMs: Date.now() - startedAt,
      output: 'stdout',
    });
    return;
  }

  const outFile = args[0];
  if (typeof outFile !== 'string' || outFile.length === 0) {
    throw new Error('Output file path argument must be a non-empty string');
  }
  const absOut = path.resolve(outFile);
  mkdirSync(path.dirname(absOut), { recursive: true });
  writeFileSync(absOut, json, 'utf8');
  printSummary('stdout', {
    filesRead,
    elements: battles.length,
    bytes,
    durationMs: Date.now() - startedAt,
    output: absOut,
  });
}

main();
