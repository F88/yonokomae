/**
 * USER_VOICES を TSV 文字列に変換します。
 *
 * - ヘッダー: `name\tage\tvoice`
 * - 本文: 各行は `name\tage\tvoice` の順にタブ区切り
 * - 改行はスペースに置換します（voice 内の `\n` → ` `）
 *
 * 入力:
 * - voices?: 配列を上書きする場合に指定（既定は USER_VOICES）
 *
 * 出力:
 * - TSV 文字列（UTF-8）
 *
 * 例:
 * ```ts
 * import { userVoicesToTSV } from '@/data/export-to-tsv';
 * console.log(userVoicesToTSV());
 * ```
 */
export declare function userVoicesToTSV(voices?: {
    name: string;
    age: string;
    voice: string;
}[]): string;
/**
 * USAGE_EXAMPLES を TSV 文字列に変換します。
 *
 * - ヘッダー: `title\tdescription`
 * - 本文: 各行は `title\tdescription` の順にタブ区切り
 * - 改行はスペースに置換します（description 内の `\n` → ` `）
 *
 * 入力:
 * - examples?: 配列を上書きする場合に指定（既定は USAGE_EXAMPLES）
 *
 * 出力:
 * - TSV 文字列（UTF-8）
 *
 * 例:
 * ```ts
 * import { usageExamplesToTSV } from '@/data/export-to-tsv';
 * console.log(usageExamplesToTSV());
 * ```
 */
export declare function usageExamplesToTSV(examples?: {
    title: string;
    description: string;
}[]): string;
//# sourceMappingURL=export-to-tsv.d.ts.map