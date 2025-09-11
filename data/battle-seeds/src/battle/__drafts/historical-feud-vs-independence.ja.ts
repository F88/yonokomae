import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_old_feud_vs_new_path',
  publishState: 'draft',
  themeId: 'history',
  significance: 'medium',
  title: '歴史的確執の融和 vs. 独立のバトル',
  subtitle: '過去の対立を乗り越えるか、独自の道を歩むか',
  narrative: {
    overview:
      '長年にわたる浦和と大宮の確執を乗り越えるため合併を選択した与野市と、隣接する自治体との合併構想を拒否し、新たな歴史を築くことを選んだ狛江市が対決する。',
    scenario:
      '浦和と大宮の間には、合併を巡る70年にもわたる主導権争いの歴史があった。' +
      '与野市は、この複雑な関係性の中で仲介役も担い、最終的に両市との合併を選択した。' +
      'これは、過去の確執を「融和」させるための手段であったと言える。' +
      '一方、狛江市は、隣接する調布や神代との合併を「アイデンティティが失われる」として拒否し、歴史的な確執に縛られることなく独自の道を歩み続けている。' +
      'これは、既存の関係性を断ち切り、新たな歴史を自ら築く選択だ。' +
      '果たして、過去を乗り越えた融和の力と、独自の歴史を刻む独立の力、どちらがより強固なコミュニティを築くことができるのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '独立を貫いた歴史',
    subtitle: '隣接自治体との複雑な関係性を断ち切る',
    description:
      '隣接する自治体との合併構想を拒否し、過去のしがらみに縛られることなく、独立した「狛江市」としての歴史を歩み続けている。これは、独自のアイデンティティを確立するための明確な選択であった。',
    power: 83,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '浦和・大宮との融和',
    subtitle: '70年の確執を終わらせた合併の決断',
    description:
      '長年にわたる浦和と大宮の主導権争いの狭間にあった与野市が、合併を通じて両市の対立を融和させ、新たな大都市を誕生させた。これは、複雑な歴史的背景を乗り越えた統合の象徴だ。',
    power: 88,
  },
  provenance: [
    {
      label: '狛江市が合併しなかった理由について',
      url: 'https://www.komae-jimin.jp/post/%E5%B9%BB%E3%81%A8%E6%B6%88%E3%81%88%E3%81%9F%E8%AA%BF%E5%B8%83%E3%80%81%E4%B8%96%E7%94%B0%E8%B0%B7%E3%81%A8%E3%81%AE%E5%90%88%E4%BD%B5',
      note: '出典: [4]',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
