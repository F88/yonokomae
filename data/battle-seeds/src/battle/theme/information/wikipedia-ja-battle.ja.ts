import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'wikipedia-ja-battle',
  publishState: 'published',
  themeId: 'information',
  significance: 'medium',
  title: '百科事典の真実',
  subtitle: '情報量か、物語の深さか。どちらの歴史が正当か?',
  narrative: {
    overview:
      'よのとこまえ、それぞれの歴史を記した百科事典のページが激突。' +
      '合併によって失われた物語か、それとも独立を貫くことで紡がれた物語か。' +
      'どちらの歴史的根拠がより正当かをプレイヤーが評価する。',
    scenario:
      'よのの百科事典のページは、合併という壮大な出来事を軸に、歴史的な変遷と行政区画の変更を詳細に記録している。' +
      'それは、よのという存在が、より大きな都市へと昇華した英雄的な物語だ。' +
      '一方、こまえの百科事典のページは、先史時代からの集落の変遷や、多摩川沿いで起きた水害の歴史、そして近年起きた事件に至るまで、独立した一つの都市としての生き様を克明に記録している。' +
      'これは、絶えず変化し、困難に立ち向かいながらも、自らの手で歴史を紡ぎ続けているこまえの誇り高き物語だ。' +
      'どちらの百科事典が真実の歴史を伝えているか?',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '狛江市 - Wikipedia',
    subtitle: '現在進行形の物語',
    description:
      '先史時代からの集落の歴史、多摩川の治水、そして現代の事件に至るまで、独立した一つの都市としての歴史が克明に記録されている。' +
      'その物語は、人々の暮らしに根ざし、今もなお紡がれ続けている。',
    power: 64,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '与野市 - Wikipedia',
    subtitle: '完結した英雄譚',
    description:
      '浦和・大宮との合併によって、その名は歴史から消えた。' +
      'しかし、百科事典のページには、合併という偉業を成し遂げた英雄的な物語が記されており、その功績は今も色褪せることはない。',
    power: 64,
  },
  provenance: [
    {
      label: '与野市 - Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E4%B8%8E%E9%87%8E%E5%B8%82',
      note: '合併による行政区画の変更や歴史的経緯に関する情報。ページの長さ: 14,759バイト, 30日間のページビュー数: 2,028。',
    },
    {
      label: '狛江市 - Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E7%8B%9B%E6%B1%9F%E5%B8%82',
      note: '先史時代からの歴史や現代の事件に関する情報。ページの長さ: 165,290バイト, 30日間のページビュー数: 6,046。',
    },
    {
      label: 'Wikipedia編集者のノート',
      note: '「与野市のページは、もはや更新されることが少ない。歴史の1ページとなった」との記述。',
    },
    {
      label: 'こまえ市民からの情報提供',
      note: '「うちのじいちゃんが、昔の多摩川の洪水のことを話してくれた」という情報が、Wikipediaに追記された。',
    },
    {
      label: '情報学研究者の論文',
      note: '「集合知の観点から見るWikipedia：消滅した自治体と現存する自治体の比較」で両市が分析された。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
