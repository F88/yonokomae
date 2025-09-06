const title = 'How to play';
const desc =
  '' +
  // ` Roll the dice to decide your fate.` +
  // `Experience legendary battles.` +
  // `(Endless analysis via Keyboard!!)`;

  // 'The dice decide your fate.' +
  // ' Legendary battles await.' +
  // ' Endless analysis via KB.' +

  'The 🎲 decide your fate.' +
  ' Legendary ⚔️️ await.' +
  ' Endless analysis via ⌨️';

export const TheStartOfTheWar = () => {
  return (
    <div className="space-y-3 pt-1 pb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
};
