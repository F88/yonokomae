import React from 'react';
import '@/components/UserVoicesMarquee.css';
export type UserVoicesCarouselProps = {
  shuffle?: boolean;
  className?: string;
  slidesToShow?: number;
  intervalMs?: number;
  pauseOnHover?: boolean;
  orientation?: 'horizontal' | 'vertical';
  containerHeight?: string;
  showControls?: boolean;
};
export declare const UserVoicesCarousel: React.FC<UserVoicesCarouselProps>;
export default UserVoicesCarousel;
