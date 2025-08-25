import type { FC } from "react";
import type { Battle } from "@/types/types";
import { Judge } from "@/yk/judge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type Props = {
  battle: Battle;
};

export const ConsiderationsAndJudgments: FC<Props> = ({ battle }) => {
  // Create a judge instance
  const judges = [
    new Judge("O"),
    new Judge("U"),
    new Judge("S"),
    new Judge("C"),
  ];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Judge's Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {judges.map((judge) => (
            <div
              key={judge.name}
              className="rounded-lg border p-4 text-center"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Judge {judge.name}
              </div>
              <div className="font-semibold">
                {Judge.determineWinner({
                  yono: battle.yono,
                  komae: battle.komae,
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
