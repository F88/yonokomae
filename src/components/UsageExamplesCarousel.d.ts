import React from 'react';
import '@/components/UsageExamplesCarousel.css';
export type UsageExamplesCarouselProps = {
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  intervalMs?: number;
  startIndex?: number;
  pauseOnHover?: boolean;
  orientation?: 'horizontal' | 'vertical';
};
export declare const UsageExamplesCarousel: React.FC<UsageExamplesCarouselProps>;
export default UsageExamplesCarousel;
