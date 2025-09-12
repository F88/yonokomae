import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'great-heisei-amalgamations',
  publishState: 'review',
  themeId: 'history',
  significance: 'legendary',
  title: '平成の大合併',
  subtitle: '3,232 (1999) -> 1,727 (2010)',
  narrative: {
    overview:
      '平成の大合併は、1999年から2010年頃にかけて全国の市町村の広域合併を進め、市町村数を1999年の3,232から2010年には1,727へと大幅に減少させた政策である。',
    scenario:
      '目的は、行財政基盤の強化（安定した財源と専門性の高い人材の確保）、地方分権への対応、人口減少・高齢化が進む小規模市町村の存続にあった。' +
      '合併により1市あたりの面積は広域化し、中山間地域を抱える自治体も誕生。町役場や村役場の統廃合で身近な行政機能が失われた地域や、学校統廃合を背景に地域の独自性・担い手が弱まる懸念も指摘された。' +
      '地域差も大きく、財政力のある大都市圏では合併が相対的に進まなかった一方、広島県などでは市町村数が大幅に減少。政府は合併特例債等の財政支援で推進し、2005年には長野県山口村が岐阜県中津川市と合併する全国唯一の越県合併も実現した。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '合近せず',
    subtitle: '',
    description: '',
    power: 85,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '大合併(さいたま市)',
    subtitle: '',
    description: '',
    power: 90,
  },
  provenance: [
    {
      label: '日本の市町村の廃置分合 - Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E5%B8%82%E7%94%BA%E6%9D%91%E3%81%AE%E5%BB%83%E7%BD%AE%E5%88%86%E5%90%88#%E5%B9%B3%E6%88%90%E3%81%AE%E5%A4%A7%E5%90%88%E4%BD%B5',
      note: '平成の大合併',
    },
    {
      label: 'Municipal mergers and dissolutions in Japan - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Municipal_mergers_and_dissolutions_in_Japan#Great_Heisei_Amalgamations',
      note: 'Great Heisei Amalgamations',
    },
    {
      label: '総務省｜市町村合併資料集｜平成11年度以降の市町村合併の実績',
      url: 'https://www.soumu.go.jp/gapei/gapei_h11iko.html',
      note: '平成11年度以降の市町村合併の実績',
    },
    {
      label: '[PDF]「『平成の合併』について」の公表 (平成22年3月5日)',
      url: 'https://www.soumu.go.jp/gapei/pdf/100311_1.pdf',
      note: '総務省は、これまでの平成の合併について現時点において総括するために取りまとめた「『平成の合併』について」を公表します。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
