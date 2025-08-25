import type { FC } from 'react';
import type { Neta } from '@/types/types';
import { NetaView } from '@/components/Neta';
import { Skeleton } from '@/components/ui/skeleton';

export type FieldProps = {
  yono?: Neta;
  komae?: Neta;
};

export const Field: FC<FieldProps> = ({ yono, komae }) => {
  // Loading placeholder using shadcn/ui Skeleton
  const Placeholder: FC = () => (
    <div className="flex min-w-72 max-w-80 flex-1 flex-col items-center rounded-lg border bg-card p-6">
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
      <div className="flex flex-row items-start justify-center gap-8 md:gap-12">
        {/* YONO */}
        <div className="flex flex-col items-center space-y-4">
          {yono ? <NetaView {...yono} /> : <Placeholder />}
        </div>
        {/* KOMAE */}
        <div className="flex flex-col items-center space-y-4">
          {komae ? <NetaView {...komae} /> : <Placeholder />}
        </div>
      </div>
    </div>
  );
};
