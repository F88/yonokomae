import React from 'react';
import '@/components/UserVoicesMarquee.css';
import '@/components/UserVoicesCarousel.css';
export type UserVoicesCarouselProps = {
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  intervalMs?: number;
  startIndex?: number;
  pauseOnHover?: boolean;
  orientation?: 'horizontal' | 'vertical';
};
export declare const UserVoicesCarousel: React.FC<UserVoicesCarouselProps>;
export default UserVoicesCarousel;
