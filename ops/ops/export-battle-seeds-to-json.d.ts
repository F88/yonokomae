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
export {};
//# sourceMappingURL=export-battle-seeds-to-json.d.ts.map