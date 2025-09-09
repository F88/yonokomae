import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_financial_philosophy',
  publishState: 'draft',
  themeId: 'finance',
  significance: 'high',
  title: '将来負担 vs. 財政力指数のバトル',
  subtitle: '健全な将来への備えか、現在の財源の豊かさか',
  narrative: {
    overview:
      '将来負担の健全性で全国上位の狛江市と、財政力指数で埼玉県の平均を上回るさいたま市(旧与野市)。財政の「健全さ」に対する異なる評価軸が対立する。',
    scenario:
      '狛江市は、財政健全度ランキングで東京都内10位、全国32位と非常に高く評価されている。特に、将来の借金返済能力を示す「将来負担」の項目では全国19位と、その健全性は際立っている。これは、将来世代にツケを回さないという堅実な財政哲学の勝利だ。一方、合併によって誕生したさいたま市は、財政力指数が埼玉県の平均を大きく上回り、国からの地方交付税交付金に頼らない財源の豊かさを誇っている。これは、現在の財政基盤の強さを示す勝利だ。果たして、未来を見据えた健全な財政運営と、現在の財源の豊かさ、どちらが持続可能な都市の姿を保証するのか。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '将来負担の健全性',
    subtitle: '未来へのツケをなくす堅実な財政',
    description:
      '狛江市は、財政健全度ランキングの「将来負担」の項目で全国19位と、非常に高い評価を得ている。これは、将来世代に過度な負担をかけない、堅実で長期的な財政運営の哲学を象徴している。',
    power: 87,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '財政力指数の高さ',
    subtitle: '豊かな財源が支える大都市の力',
    description:
      'さいたま市の財政力指数は埼玉県の平均を上回っており、国からの地方交付税交付金に頼らない財政的な自立度を示している。これは、大都市が持つ経済力の強みを象徴している。',
    power: 91,
  },
  provenance: [
    {
      label: '狛江市の財政健全度について',
      url: 'https://www.seikatsu-guide.com/info/13/13219/2/',
      note: '出典: ',
    },
    {
      label: 'さいたま市の財政力指数について',
      url: 'https://www.pref.saitama.lg.jp/documents/256147/04zaiseiryokusisuu_saisantei6.xlsx',
      note: '出典: ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
