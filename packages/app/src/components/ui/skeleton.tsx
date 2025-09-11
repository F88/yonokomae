import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** When false, disables pulsing animation. Default: true */
  animated?: boolean;
};

export function Skeleton({
  className,
  animated = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        animated ? 'animate-pulse' : 'animate-none',
        'rounded-md bg-muted',
        className,
      )}
      {...props}
    />
  );
}
