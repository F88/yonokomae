import React from 'react';
import '@/components/UserVoicesMarquee.css';
export type SimpleVerticalCarouselProps = {
  shuffle?: boolean;
  className?: string;
  intervalMs?: number;
  pauseOnHover?: boolean;
  height?: string;
};
export declare const SimpleVerticalCarousel: React.FC<SimpleVerticalCarouselProps>;
export default SimpleVerticalCarousel;
