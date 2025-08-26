const title = 'Yono vs Komae Battle Simulator';
const desc =
  'This game is a thought-provoking game that examines from multiple angles what happened to two countries that experienced "The World Merger Battle of the Heisei era" ("平成の大合併大戦")';

export const Intro = () => {
  return (
    <div className="space-y-6 pt-8 pb-2">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
        {desc}
      </p>
    </div>
  );
};
