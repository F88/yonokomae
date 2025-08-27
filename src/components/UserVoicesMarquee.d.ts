import React from 'react';
import '@/components/UserVoicesMarquee.css';
export type UserVoicesMarqueeProps = {
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  speed?:
    | 'molasses'
    | 'glacial'
    | 'ultra-slow'
    | 'very-slow'
    | 'slowest'
    | 'slower'
    | 'slow'
    | 'normal'
    | 'fast';
  gap?: 'sm' | 'md' | 'lg';
  reverse?: boolean;
};
export declare const UserVoicesMarquee: React.FC<UserVoicesMarqueeProps>;
export default UserVoicesMarquee;
