declare const seed: {
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
export default seed;
//# sourceMappingURL=bridge-skirmish.en.d.ts.map
