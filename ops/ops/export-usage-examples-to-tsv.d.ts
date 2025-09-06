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
export {};
//# sourceMappingURL=export-usage-examples-to-tsv.d.ts.map