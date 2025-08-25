import type { FC } from "react";
import type { Battle } from "../types/types";
import { Judge } from "../libs/judge";

export type Props = {
  battle: Battle;
};

export const ConsiderationsAndJudgments: FC<Props> = ({ battle }) => {
  // Create a judge instance
  const o = new Judge("O");
  const u = new Judge("U");
  const s = new Judge("S");
  const c = new Judge("C");
  const juedges: Judge[] = [o, u, s, c];

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
      Judge's comments
      <div className="w-full flex flex-col items-center">
        {juedges.map((judge) => (
          <div key={judge.name} className="my-2">
            {judge.name}:{" "}
            {Judge.determineWinner({
              yono: battle.yono,
              komae: battle.komae,
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
