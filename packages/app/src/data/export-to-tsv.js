import { USER_VOICES } from './users-voice.js';
import { USAGE_EXAMPLES } from './usage-examples.js';
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
export function userVoicesToTSV(voices = USER_VOICES) {
    const header = ['name', 'age', 'voice'].join('\t');
    const rows = voices.map((v) => [v.name, v.age, (v.voice ?? '').replace(/\n/g, ' ')].join('\t'));
    return [header, ...rows].join('\n');
}
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
export function usageExamplesToTSV(examples = USAGE_EXAMPLES) {
    const header = ['title', 'description'].join('\t');
    const rows = examples.map((e) => [e.title, (e.description ?? '').replace(/\n/g, ' ')].join('\t'));
    return [header, ...rows].join('\n');
}
