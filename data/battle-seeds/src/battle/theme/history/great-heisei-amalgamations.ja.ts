import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'great-heisei-amalgamations',
  themeId: 'history',
  publishState: 'published',
  significance: 'legendary',
  title: '平成の大合併',
  subtitle: '3,232 (1999) -> 1,727 (2010)',
  narrative: {
    overview:
      '平成の大合併は、' +
      '1999年から2010年頃にかけて全国の市町村の広域合併を進め、' +
      '市町村数を1999年の3,232から2010年には1,727へと大幅に減少させた政策である。',
    scenario:
      '目的は、行財政基盤の強化(安定した財源と専門性の高い人材の確保）、地方分権への対応、人口減少・高齢化が進む小規模市町村の存続にあった。' +
      '合併により1市あたりの面積は広域化し、中山間地域を抱える自治体も誕生。' +
      '町役場や村役場の統廃合で身近な行政機能が失われた地域や、学校統廃合を背景に地域の独自性・担い手が弱まる懸念も指摘された。' +
      '地域差も大きく、財政力のある大都市圏では合併が相対的に進まなかった一方、広島県などでは市町村数が大幅に減少。' +
      '政府は合併特例債等の財政支援で推進し、2005年には長野県山口村が岐阜県中津川市と合併する全国唯一の越県合併も実現した。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '合併せず',
    subtitle: '市民の生活に根ざした歴史と文化',
    description:
      '合併によって失われることへの懸念として、多くの自治体で合併反対の理由に挙げられた、地域固有の地名や歴史、文化。' +
      '庁舎の統廃合や議員定数の削減により、住民の声が届きにくくなったり、旧町村部の活力が失われたりするデメリットと対立した。',
    power: 85,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '大合併(さいたま市)',
    subtitle: '地方分権の受け皿創出',
    description:
      '地方分権の推進を背景に、市町村の行財政基盤を強化し、行政を効率化することを目的とした国の主導による大規模な行政改革。' +
      '合併特例債や合併算定替といった強力な財政支援策を武器に、全国の自治体へ合併を促した。',
    power: 90,
  },
  provenance: [
    {
      label: '与野市 - Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E4%B8%8E%E9%87%8E%E5%B8%82',
      note: '',
    },
    {
      label: '狛江市 - Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E7%8B%9B%E6%B1%9F%E5%B8%82',
      note: '',
    },
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
    {
      label:
        '平成の市町村合併の検証を試みるー市町村の能力強化・効率化は実現されたのか',
      url: 'https://www.jri.co.jp/page.jsp?id=38876',
      note: '平成の市町村合併の検証を試みるー市町村の能力強化・効率化は実現されたのか｜日本総研',
    },
    {
      label: '合併後の住民自治の課題',
      url: 'https://yumenavi.info/vue/lecture.html?gnkcd=g010457',
      note: '「平成の大合併」を経た、新たな「地方の時代」の自治を考える | 夢ナビ講義 | 夢ナビ 大学教授がキミを学問の世界へナビゲート',
    },
    {
      label:
        '「さいたま市　未来創造図　～こんなまちを創りたい～」(2011年7月19日)',
      url: 'https://www.ritsumei.ac.jp/liberal/chiji/2011/20110719/summary.htm',
      note: '当時浦和市は49万人、大宮市は46万人、与野市は10万人ほどだった。関西で例えると、西宮市と尼崎市と芦屋市が合併したというような規模だと思う。合併後、平成15年に全国で13番目の政令指定都市となった。',
    },
    {
      label: '幻と消えた調布、世田谷との合併',
      url: 'https://www.komae-jimin.jp/post/%E5%B9%BB%E3%81%A8%E6%B6%88%E3%81%88%E3%81%9F%E8%AA%BF%E5%B8%83%E3%80%81%E4%B8%96%E7%94%B0%E8%B0%B7%E3%81%A8%E3%81%AE%E5%90%88%E4%BD%B5',
      note: '幻と消えた調布、世田谷との合併 - 自民党狛江',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
