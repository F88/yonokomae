import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'showa-superstar-battle',
  themeId: 'figures',
  significance: 'medium',
  title: '昭和の夜空に輝く双星',
  subtitle:
    '反骨のロック・スターが叫び、知性の光が優しく降り注ぐ、まばゆい夜空の物語',
  narrative: {
    overview:
      '時代を築いた昭和の大スターたちが、それぞれの故郷の誇りをかけて激突する。反骨のロックンロールか、知性の朗読か。どちらが勝利を掴むか。',
    scenario:
      'よのは、伝説のロック・スター、萩原健一を擁し、その反骨精神と型破りな生き方で観客を魅了する。一方、こまえは、不世出の女優、紺野美沙子を代表とし、朗読や知性的な魅力で静かに人々を惹きつける。熱狂で勝るよのか、深みと知性で勝るこまえか。世代を超えた伝説のスターたちが、故郷の名誉をかけて戦う。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '紺野美沙子',
    subtitle: '深みと知性の表現者',
    description:
      '紺野美沙子。こまえ市出身の女優で、朗読や国際協力活動でも知られる。彼女の持つ知的な魅力は、こまえの市民が誇る精神の豊かさそのものである。',
    power: 40000,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '萩原健一',
    subtitle: '反骨のロック・スター',
    description:
      '萩原健一。よの市（現さいたま市中央区）出身の伝説的ロック・スター。その型破りで個性的な生き方は、よのの持つ先進性と知性を象徴している。新都心のライトに最も似合う男、それが彼の正体だ。',
    power: 40000,
  },
  provenance: [
    {
      label: '萩原健一 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E8%90%A9%E5%8E%9F%E5%81%A5%E4%B8%80',
      note: 'よの市（現さいたま市中央区）出身',
    },
    {
      label: '紺野美沙子 Wikipedia',
      url: 'https://ja.wikipedia.org/wiki/%E7%B4%BA%E9%87%8E%E7%BE%8E%E6%B2%99%E5%AD%90',
      note: 'こまえ市出身',
    },
    {
      label: '伝説の音楽番組「夜のヒットスタジオ」',
      note: '萩原健一が「神様お願い！」を熱唱した際の映像記録。',
    },
    {
      label: '紺野美沙子の朗読会「言の葉のしらべ」',
      note: '満員の観客が、彼女の語りに静かに涙したという逸話。',
    },
    {
      label: '昭和カルチャー雑誌「平凡パンチ」',
      note: '「ショーケンと美沙子、対極の魅力」という特集記事が組まれたことがある。',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
