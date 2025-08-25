import type { FC } from "react";
import { Field } from "@/components/field/Field";
import type { Battle } from "@/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type Props = {
  battle: Battle;
};

export const HistoricalScene: FC<Props> = ({ battle }) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Overview
            </div>
            <CardDescription className="text-base">
              {battle.overview}
            </CardDescription>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold lg:text-4xl">
              {battle.title}
            </CardTitle>
            <CardDescription className="text-lg italic">
              {battle.subtitle}
            </CardDescription>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Scenario
            </div>
            <CardDescription className="text-base">
              {battle.scenario}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Field yono={battle.yono} komae={battle.komae} />
      </CardContent>
    </Card>
  );
};
