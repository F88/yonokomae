import type { Battle } from '@yonokomae/types';

const battle = {
  id: 'battle_civic_will',
  publishState: 'draft',
  themeId: 'community',
  significance: 'medium',
  title: '民意の不在 vs. 首長の信念のバトル',
  subtitle: '住民の無関心か、リーダーの強い意志か',
  narrative: {
    overview:
      '狛江市では合併問題への市民の関心が薄い中、首長の信念が独立を決定づけた。一方、与野市では市民による住民投票が実施されず、政治的判断が優先された。市民の意思表示のあり方が問われる対決。',
    scenario:
      '狛江市では、合併への市民の関心が低いという状況下で、当時の町長が「まちのアイデンティティが失われる」という明確な信念のもと、独立を貫き通した。' +
      'これは、リーダーシップが地域の運命を決定づけた事例だ。' +
      '対する与野市では、合併に異議を唱える市民団体があったにもかかわらず、住民投票は実施されず、行政主導で合併が推進された。' +
      'これは、政治的判断が民意の直接的な表明を上回った事例だ。' +
      'この戦いは、市民民主主義において、住民の「無関心」と首長の「信念」が、地域の未来をどう形作るかという根源的な問いを投げかける。',
  },
  komae: {
    imageUrl: `${import.meta.env.BASE_URL}KOMAE-SYMBOL.png`,
    title: '首長の明確な信念',
    subtitle: '市民の無関心を乗り越えた独立への意志',
    description:
      '合併に無関心な市民が多い中で、当時の首長が「狛江のアイデンティティを失う」として明確に反対の立場を取り、独立を主導した。これは、強力なリーダーシップが地域の運命を決定づけた象徴だ。',
    power: 80,
  },
  yono: {
    imageUrl: `${import.meta.env.BASE_URL}YONO-SYMBOL.png`,
    title: '住民投票なき政治的決断',
    subtitle: '民意の直接表明を待たずに進められた合併',
    description:
      '浦和、大宮、与野の合併において、住民投票は実施されず、行政が主導して合併が決定された。これは、市民の直接的な意思表示よりも、政治的・構造的な判断が優先された経緯を象徴している。',
    power: 89,
  },
  provenance: [
    {
      label: 'さいたま市合併と住民投票について',
      url: 'http://www.jcp-hirakata.com/ganbattemasu/ganba_030823-2.html',
      note: '出典: ',
    },
  ],
  status: 'success',
} satisfies Battle;

export default battle;
