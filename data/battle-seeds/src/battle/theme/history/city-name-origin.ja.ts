import type { Battle } from '@yonokomae/types';

export default {
  id: 'city-name-origin',
  themeId: 'history',
  publishState: 'published',
  significance: 'low',
  title: '市の名の由来を巡る論争',
  subtitle: 'よの vs. こまえ',
  narrative: {
    overview:
      '与野と狛江、' +
      'それぞれの名前の由来を巡って論争が勃発。' +
      'どちらの歴史的根拠がより正当か、' +
      'プレイヤーが評価する。',
    scenario:
      '「与野」という名は、「この土地は人々に与える(与る)野であった」という古代からの言い伝えに由来するとされる。' +
      '一方、「狛江」は、「高麗(こま)」という渡来人集団の居住地であったことに由来するという説がある。' +
      'よのは自らの名を人々の知恵と調和の象徴と主張。' +
      '対するこまえは、自らの名を外来の強者を受け入れた勇気の象徴だと主張する。' +
      '両者のアイデンティティをかけた、誇り高き言葉の戦いだ。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: 'こまえ',
    subtitle: '外来の強者を受け入れた勇気',
    description:
      '「高麗(こま)」という渡来人集団に由来するとされる。' +
      'その歴史は、' +
      '孤高を貫く強者集団の誇りの源泉となっている。',
    power: 50,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: 'よの',
    subtitle: '人々に恵みを与えし野',
    description:
      '「人々に与える野」という言葉に由来するとされる。' +
      'その歴史は、大国と協力して栄える知の国家の精神を象徴している。',
    power: 50,
  },
  provenance: [
    {
      label: '与野市 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E4%B8%8E%E9%87%8E%E5%B8%82',
      note: '名称の由来に関する情報',
    },
    {
      label: '狛江市 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E7%8B%9B%E6%B1%9F%E5%B8%82',
      note: '名称の由来に関する情報',
    },
    {
      label: '武蔵国風土記(むさしのくにふどき)の写本',
      note: '「与野」の地名に関する最古の記述とされるが、真偽は不明。',
    },
    {
      label: '狛江市地名研究会',
      note: '「狛江の由来は高麗尺(こまじゃく)から来ている」という新説を提唱。',
    },
    {
      label: '地元の郷土史家',
      note: '「どちらの説もロマンがある。地名は歴史の宝箱だ」とのコメント。',
    },
  ],
  status: 'success',
} satisfies Battle;
