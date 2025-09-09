/**
 * Simplified exporter: prebuilt all-battles.json (generated in data package postbuild)
 * をそのまま任意パス / stdout へコピーするだけ。重複ロジック排除のため
 * 以前の動的 import / 正規化処理は削除。
 *
 * 生成元:
 *   data/battle-seeds/scripts/generate-all-battles-json.ts
 *   => dist/battle/__generated/all-battles.json (Battle[])
 *
 * 利用:
 *   pnpm run ops:export-battle-seeds-to-json                # stdout
 *   pnpm run ops:export-battle-seeds-to-json out/battles.json
 *   pnpm run ops:export-battle-seeds-to-json -- out/battles.json
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'fs';
import * as path from 'path';
import crypto from 'crypto';

function help() {
  return `Export prebuilt battles JSON.\n\nUsage: pnpm run ops:export-battle-seeds-to-json [outfile]\n       pnpm run ops:export-battle-seeds-to-json -- [outfile]\nIf [outfile] omitted, writes to stdout.\nRequires: prebuilt all-battles.json (run data package build).\n`;
}

function loadPrebuilt(): { text: string; elements: number } {
  const p = path.join(
    process.cwd(),
    'data/battle-seeds/dist/battle/__generated/all-battles.json',
  );
  let stat;
  try {
    stat = statSync(p);
  } catch {
    throw new Error(
      `Missing prebuilt JSON: ${p}\nRun: pnpm -F @yonokomae/data-battle-seeds build`,
    );
  }
  if (!stat.isFile()) throw new Error(`Not a file: ${p}`);
  const text = readFileSync(p, 'utf8');
  let elements = 0;
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) elements = parsed.length;
  } catch {
    // ignore parse error for element counting – still allow raw copy
  }
  return { text, elements };
}

function printSummary(
  out: 'stdout' | 'stderr',
  info: {
    elements: number;
    bytes: number;
    hash: string;
    durationMs: number;
    target: string;
  },
) {
  const lines = [
    `Elements: ${info.elements}`,
    `Bytes: ${info.bytes}`,
    `SHA256: ${info.hash}`,
    `Output: ${info.target}`,
    `Duration(ms): ${info.durationMs}`,
  ].join('\n');
  const block = `\n${lines}\n`;
  if (out === 'stdout') process.stdout.write(block);
  else process.stderr.write(block);
}

async function main() {
  const started = Date.now();
  const rawArgs = process.argv.slice(2);
  if (rawArgs.includes('-h') || rawArgs.includes('--help')) {
    process.stdout.write(help());
    return;
  }
  const args = rawArgs.filter((a) => a !== '--');
  const { text, elements } = loadPrebuilt();
  const hash = crypto
    .createHash('sha256')
    .update(text)
    .digest('hex')
    .slice(0, 16);
  if (args.length === 0) {
    process.stdout.write(text);
    printSummary('stderr', {
      elements,
      bytes: Buffer.byteLength(text, 'utf8'),
      hash,
      target: 'stdout (copy)',
      durationMs: Date.now() - started,
    });
    return;
  }
  const outFile = args[0];
  if (!outFile) throw new Error('Output file path is empty');
  const abs = path.resolve(outFile);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, text, 'utf8');
  printSummary('stdout', {
    elements,
    bytes: Buffer.byteLength(text, 'utf8'),
    hash,
    target: `${abs} (copy)`,
    durationMs: Date.now() - started,
  });
}

main();
