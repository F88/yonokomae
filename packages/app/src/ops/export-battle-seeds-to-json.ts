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
  const currentDir = path.dirname(fileURLToPath(import.meta.url)); // dist/ops
  const battleDir = path.resolve(
    currentDir,
    '../..',
    'data/battle-seeds/dist/battle',
  );
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
  const args = process.argv.slice(2);
  if (args.includes('-h') || args.includes('--help')) {
    process.stdout.write(
      `Export battle seeds as JSON.\n\nUsage: pnpm run ops:export-battle-seeds-to-json [outfile]\\n  If [outfile] is omitted, JSON is written to stdout.\\n\nExamples:\n  pnpm run ops:export-battle-seeds-to-json\\n  pnpm run ops:export-battle-seeds-to-json -- out/battles.json\\n`,
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
