const title = "How to play";
const desc =
  `Experience legendary battles. Roll the dice and see what's next`;

export const TheStartOfTheWar = () => {
  return (
    <div className="space-y-4 py-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
};
