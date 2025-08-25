import type { FC, ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

export type IntroProps = {
  children?: ReactNode;
};

const title = "Yono vs Komae Battle Simulator";
const desc =
  `Experience legendary battles between Yono and Komae.` +
  "Roll the dice and see what's next";

export const Intro: FC<IntroProps> = ({ children }) => {
  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-7xl font-extrabold text-center bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg mb-2 flex items-center justify-center gap-3">
            <span role="img" aria-label="battle">
              ⚔️
            </span>
            {title}
            <span role="img" aria-label="battle">
              ⚔️
            </span>
          </CardTitle>
          <CardDescription className="text-3xl text-center text-gray-700 font-medium mb-2">
            {desc}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
};
