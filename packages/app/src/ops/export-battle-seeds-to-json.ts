/**
 * Export battle seeds (built artifacts) as JSON.
 *
 * 概要:
 * data/battle-seeds のビルド成果 (`data/battle-seeds/dist/battle/*.js`) を動的 import し
 * 正規化後 (不要な `undefined` 接頭辞除去) に Battle[] を JSON 出力する CLI。
 *
 * 主な用途:
 * - データ検査 / diff 用スナップショット生成
 * - 後続解析 (`ops:analyze-battle-seeds`) への入力ファイル作成
 *
 * 実行方法 (推奨):
 *   pnpm run ops:export-battle-seeds-to-json                # 標準出力へ
 *   pnpm run ops:export-battle-seeds-to-json out/battles.json
 *   pnpm run ops:export-battle-seeds-to-json -- out/battles.json  # pnpm 形式
 *
 * 手動実行 (直接 Node 実行する場合):
 *   pnpm run build:packages && pnpm run ops:build \\
 *     && node dist/ops-build/ops/export-battle-seeds-to-json.js [outfile]
 *
 * 引数:
 *   [outfile] (任意)  出力先 JSON パス。省略時は stdout。
 *   -h | --help       ヘルプ表示。
 *
 * 出力仕様:
 * - 2 スペースインデント, 末尾改行付き UTF-8 JSON
 * - stderr (stdout 出力時) / stdout (ファイル出力時) に統計サマリ行
 *   Files read / Elements / Output / Bytes / Duration(ms)
 *
 * 実装メモ:
 * - Battle モジュールは Vite ビルド生成物を文字列読込後、`import.meta.env.BASE_URL` を空文字に置換し
 *   data: URL として ESM 動的 import。これにより Node ランタイムでブラウザ向け bundle を安全ロード。
 * - 探索パスは固定 (process.cwd()/data/battle-seeds/dist/battle)。
 *
 * @param [outfile] optional target file path (stdout if omitted)
 * @example pnpm run ops:export-battle-seeds-to-json
 * @example pnpm run ops:export-battle-seeds-to-json out/battles.json
 */

import { writeFileSync, readdirSync, readFileSync, mkdirSync } from 'fs';
import * as path from 'path';
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
  // Battle seeds built output (absolute from repo root)
  const battleDir = path.join(process.cwd(), 'data/battle-seeds/dist/battle');
  try {
    readdirSync(battleDir);
  } catch {
    throw new Error(
      `Battle dist directory not found at ${battleDir}\nDid you run 'pnpm run build:packages'?`,
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
  const json = JSON.stringify(battles, null, 2) + '\n';
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
