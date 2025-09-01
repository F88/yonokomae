import type { FC } from 'react';
import type { Neta } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type Props = Neta & {
  /**
   * When true, card stretches to container width (no max-width cap).
   */
  fluid?: boolean;
  /**
   * When true, remove top border radius so adjacent cards meet with no notch.
   */
  squareTop?: boolean;
  /**
   * When true, makes the card take full available height to match siblings.
   */
  fullHeight?: boolean;
};

export const NetaView: FC<Props> = ({
  imageUrl,
  title,
  subtitle,
  description,
  power,
  fluid = false,
  squareTop = false,
  fullHeight = false,
}) => {
  const hasImage = typeof imageUrl === 'string' && imageUrl.trim() !== '';
  return (
    <Card
      className={[
        'w-full overflow-hidden',
        fluid ? 'max-w-none' : 'max-w-sm',
        squareTop ? 'rounded-t-none' : '',
        fullHeight ? 'h-full' : '',
      ].join(' ')}
    >
      {hasImage && (
        <div className="w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex h-full flex-col gap-3">
          <div className="text-center">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground italic">{subtitle}</p>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            {description}
          </p>

          <div className="mt-auto flex justify-center">
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
