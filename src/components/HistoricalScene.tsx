import type { FC } from "react";
import { Field } from "./field/Field";
import type { Battle } from "../types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Separator } from "./ui/separator";

export type Props = {
  battle: Battle;
};

export const HistoricalScene: FC<Props> = ({ battle }) => {
  return (
    <Card className="max-w-3xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center text-indigo-600 flex items-center justify-center gap-2 mb-2">
          <span role="img" aria-label="overview">
            📜
          </span>
          Overview
        </CardTitle>
        <CardDescription className="mb-6 text-center text-lg text-gray-700">
          {battle.overview}
        </CardDescription>
        <Separator className="my-4" />
        <CardTitle className="text-3xl font-extrabold text-center text-pink-600 mb-1">
          {battle.title}
        </CardTitle>
        <CardDescription className="text-xl text-center mb-2 text-gray-500 italic">
          {battle.subtitle}
        </CardDescription>
        <Separator className="my-4" />
        <CardTitle className="text-4xl font-bold text-center text-yellow-600 flex items-center justify-center gap-2 mb-2">
          <span role="img" aria-label="scenario">
            🎲
          </span>
          Scenario
        </CardTitle>
        <CardDescription className="mb-8 text-center text-lg text-gray-700">
          {battle.scenario}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-row justify-center items-start gap-10">
          <Field yono={battle.yono} komae={battle.komae} />
        </div>
      </CardContent>
    </Card>
  );
};
