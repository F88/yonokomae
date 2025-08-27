import React from 'react';
import '@/components/UserVoicesMarquee.css';
export type UserVoicesMarqueeProps = {
  shuffle?: boolean;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
};
export declare const UserVoicesMarquee: React.FC<UserVoicesMarqueeProps>;
export default UserVoicesMarquee;
