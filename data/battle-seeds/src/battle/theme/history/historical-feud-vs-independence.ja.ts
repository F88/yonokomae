import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_old_feud_vs_new_path',
  themeId: 'history',
  publishState: 'published',
  significance: 'legendary',
  title: 'むかしのケンカをなかなおりするか、ひとりでがんばるか',
  subtitle: 'みんなで一つになるか、自分たちの町を守るか',
  narrative: {
    overview:
      '与野市は、浦和市と大宮市が長いあいだ仲がわるかったので、みんなで一つになることをえらびました。' +
      'いっぽう狛江市は、となりの町と一緒にならずに、自分たちの町を大切にしてきました。' +
      'どちらが町のみらいにいいのかをくらべます。',
    scenario:
      'むかし、浦和市と大宮市は、どちらがえらいかで長いあいだ言い合いをしていました。' +
      '与野市はまんなかの町で、ふたりの間に入って話をまとめ、さいごは三つの町で一つになることにしました。' +
      'それは、けんかをやめて、仲よくするためのえらいきめごとでした。' +
      'いっぽう、狛江市は、となりの町と合併すると「狛江らしさ」がなくなると思って、合併をしませんでした。' +
      '自分たちの町を自分たちでまもって、これからの歴史をつくっていく道をえらびました。' +
      'どちらのえらび方が、みんなが安心してくらせる町づくりになるのか、よくかんがえてみましょう。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '自分の町を大切にする',
    subtitle: 'となりと合併しないえらいきめ',
    description:
      '狛江市は、となりの町と一緒にならず、むかしからの自分の町の名前やよさをたいせつにしました。' +
      'みんなで力をあわせて、これからも「狛江」という町らしさをまもっていこうとしています。',
    power: 83,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'みんなで一つになった',
    subtitle: '長いけんかをおわらせるために',
    description:
      '与野市は、浦和市と大宮市と力をあわせて、一つの大きな市になりました。' +
      'むずかしい歴史があったけれど、話し合ってなかなおりをして、新しいまちをつくりました。',
    power: 88,
  },
  provenance: [
    {
      label: '狛江市が合併しなかった理由について',
      url: 'https://www.komae-jimin.jp/post/%E5%B9%BB%E3%81%A8%E6%B6%88%E3%81%88%E3%81%9F%E8%AA%BF%E5%B8%83%E3%80%81%E4%B8%96%E7%94%B0%E8%B0%B7%E3%81%A8%E3%81%AE%E5%90%88%E4%BD%B5',
      note: '幻と消えた調布、世田谷との合併',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
