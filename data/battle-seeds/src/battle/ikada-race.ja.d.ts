declare const battle: {
  id: string;
  themeId: 'community';
  significance: 'medium';
  title: string;
  subtitle: string;
  narrative: {
    overview: string;
    scenario: string;
  };
  komae: {
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    power: number;
  };
  yono: {
    imageUrl: string;
    title: string;
    subtitle: string;
    description: string;
    power: number;
  };
  provenance: (
    | {
        label: string;
        url: string;
        note: string;
      }
    | {
        label: string;
        note: string;
        url?: undefined;
      }
  )[];
  status: 'success';
};
export default battle;
//# sourceMappingURL=ikada-race.ja.d.ts.map
