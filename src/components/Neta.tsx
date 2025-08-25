import type { FC } from "react";
import type { Neta } from "../types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

export type Props = Neta;

export const NetaView: FC<Props> = ({
  imageUrl,
  title,
  subtitle,
  description,
  power,
}) => {
  return (
    <Card className="w-full max-w-xs bg-gray-900 text-white">
      <CardHeader>
        <div className="w-full h-32 flex items-center justify-center mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="h-full object-cover rounded-lg border-4 border-indigo-400 shadow-lg"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-pink-300 drop-shadow mb-1">
          {title}
        </CardTitle>
        <CardDescription className="text-md text-center text-yellow-200 italic mb-2">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 text-gray-400 text-center">{description}</p>
        <p className="font-extrabold text-lg text-center text-indigo-300 flex items-center justify-center gap-2">
          <span role="img" aria-label="power">
            💥
          </span>
          Power: {power}
        </p>
      </CardContent>
    </Card>
  );
};
