import React from 'react';
import { USER_VOICES } from '@/data/users-voice';
import BaseCarousel from '@/components/BaseCarousel';
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

export const UserVoicesCarousel: React.FC<UserVoicesCarouselProps> = (
  props,
) => {
  return (
    <BaseCarousel
      data={USER_VOICES}
      carouselClassName="uv-carousel"
      renderItem={(voice) => (
        <div className="yk-uvm-root">
          <div className="yk-uvm-track" role="list" aria-live="polite">
            <figure className="yk-uvm-item" role="listitem">
              <blockquote className="yk-uvm-blockquote">
                {voice.voice}
                <span className="yk-uvm-meta">
                  {voice.name}（{voice.age}）
                </span>
              </blockquote>
            </figure>
          </div>
        </div>
      )}
      {...props}
    />
  );
};

export default UserVoicesCarousel;
