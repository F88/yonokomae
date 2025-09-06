declare const seedJa: {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  narrative: string;
  provenance: (
    | {
        label: string;
        note: string;
        url?: undefined;
      }
    | {
        label: string;
        url: string;
        note: string;
      }
  )[];
};
export default seedJa;
//# sourceMappingURL=bridge-skirmish.ja.d.ts.map
