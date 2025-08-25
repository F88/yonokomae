import { type FC } from "react";
import type { Battle } from "@/types/types";
import { JudgeCard } from "@/components/Judge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type Props = {
  battle?: Battle;
};

const judgesName: string[] = ["O", "U", "S", "C"];

export const ConsiderationsAndJudgments: FC<Props> = ({ battle }) => {
  // Filter judges based on a random condition
  const filteredJudges = judgesName.filter(() => Math.random() > 0.1);

  if (battle === undefined) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">
          Judge's Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Scenario</h3>
          <p>{battle.overview}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredJudges.map((judge) => (
            <JudgeCard key={judge} nameOfJudge={judge} battle={battle} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
