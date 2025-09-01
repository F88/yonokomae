import type { FC } from 'react';
import type { Neta } from '@/types/types';
import { NetaView } from '@/components/battle/Neta';
import { Skeleton } from '@/components/ui/skeleton';

export type FieldProps = {
  yono?: Neta;
  komae?: Neta;
};

export const Field: FC<FieldProps> = ({ yono, komae }) => {
  // Loading placeholder using shadcn/ui Skeleton
  const Placeholder: FC = () => (
    <div
      data-testid="placeholder"
      className="flex h-full flex-1 flex-col items-stretch rounded-lg border bg-card p-6"
    >
      <div className="w-full space-y-4">
        <div className="text-center">
          <Skeleton className="mx-auto h-6 w-32" />
          <Skeleton className="mx-auto mt-2 h-4 w-24" />
        </div>
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {/* Full-width band; stretch cards to edges so side strips are hidden */}
      <div className="flex w-full items-stretch justify-between gap-2 md:gap-3 px-0">
        {/* YONO */}
        <div
          data-testid="slot-yono"
          className="flex flex-1 flex-col items-stretch space-y-4"
        >
          {yono ? <NetaView {...yono} fluid fullHeight /> : <Placeholder />}
        </div>
        {/* KOMAE */}
        <div
          data-testid="slot-komae"
          className="flex flex-1 flex-col items-stretch space-y-4"
        >
          {komae ? <NetaView {...komae} fluid fullHeight /> : <Placeholder />}
        </div>
      </div>
    </div>
  );
};
