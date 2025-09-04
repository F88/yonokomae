/**
 * Usage: Export USAGE_EXAMPLES as TSV from CLI.
 *
 * 実行方法:
 * - 標準出力に出す: `pnpm run ops:export-usage-examples-to-tsv`
 * - ファイルへ出す: `pnpm run ops:export-usage-examples-to-tsv -- out/usage-examples.tsv`
 * - 手動実行: `pnpm run ops:build && node dist/ops/export-usage-examples-to-tsv.js [outfile]`
 *
 * 引数:
 * - `[outfile]` (任意): 出力先 TSV ファイルパス。未指定時は stdout に出力。
 *
 * 出力:
 * - ヘッダー `title\tdescription` を含む TSV 文字列（UTF-8）
 *
 * 例:
 * ```bash
 * pnpm run ops:export-usage-examples-to-tsv -- out/usage-examples.tsv
 * ```
 */

import { usageExamplesToTSV } from '../data/export-to-tsv.js';
import { writeFileSync } from 'fs';
import * as path from 'path';

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    // 引数がなければ標準出力に出力
    process.stdout.write(usageExamplesToTSV());
    return;
  }
  const outFile = args[0];
  const tsv = usageExamplesToTSV();
  writeFileSync(path.resolve(outFile), tsv, 'utf8');
  console.log('TSV exported to', outFile);
}

main();
