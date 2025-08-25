import type { FC } from "react";
import type { Neta } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Props = Neta;

export const NetaView: FC<Props> = ({
  imageUrl,
  title,
  subtitle,
  description,
  power,
}) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground italic">{subtitle}</p>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            {description}
          </p>

          <div className="flex justify-center">
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <span className="text-lg">💥</span>
              <span className="font-bold">Power: {power}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
