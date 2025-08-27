import React from 'react';
export type BaseMarqueeSpeed =
  | 'molasses'
  | 'glacial'
  | 'ultra-slow'
  | 'very-slow'
  | 'slowest'
  | 'slower'
  | 'slow'
  | 'normal'
  | 'fast';
export type BaseMarqueeGap = 'sm' | 'md' | 'lg';
export type BaseMarqueeProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  speed?: BaseMarqueeSpeed;
  gap?: BaseMarqueeGap;
  reverse?: boolean;
  pauseOnHover?: boolean;
  marqueeClassName?: string;
  contentClassName?: string;
};
export declare function BaseMarquee<T>({
  data,
  renderItem,
  shuffle,
  className,
  ariaLabel,
  speed,
  gap,
  reverse,
  pauseOnHover,
  marqueeClassName,
  contentClassName,
}: BaseMarqueeProps<T>): import('react/jsx-runtime').JSX.Element | null;
export default BaseMarquee;
