import React from 'react';
import '@/components/BaseCarousel.css';
export type BaseCarouselProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  intervalMs?: number;
  startIndex?: number;
  pauseOnHover?: boolean;
  orientation?: 'horizontal' | 'vertical';
  carouselClassName?: string;
};
export declare function BaseCarousel<T>({
  data,
  renderItem,
  shuffle,
  className,
  ariaLabel,
  intervalMs,
  startIndex,
  pauseOnHover,
  orientation,
  carouselClassName,
}: BaseCarouselProps<T>): import('react/jsx-runtime').JSX.Element | null;
export default BaseCarousel;
