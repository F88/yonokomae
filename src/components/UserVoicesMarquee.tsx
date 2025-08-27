import React, { useMemo } from 'react';
import { USER_VOICES } from '@/data/users-voice';
import { BaseMarquee } from '@/components/BaseMarquee';
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

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const UserVoicesMarquee: React.FC<UserVoicesMarqueeProps> = ({
  shuffle = false,
  className,
  ariaLabel = 'User voices marquee (marquee)',
  speed = 'glacial',
  gap = 'md',
  reverse = false,
}) => {
  const source = useMemo(
    () => (shuffle ? shuffleArray(USER_VOICES) : USER_VOICES),
    [shuffle],
  );
  if (!source.length) return null;

  return (
    <BaseMarquee
      data={source}
      shuffle={false}
      className={className}
      ariaLabel={ariaLabel}
      speed={speed}
      gap={gap}
      reverse={reverse}
      marqueeClassName="yk-marquee--fade-edges"
      renderItem={(v) => (
        <figure className="yk-uvm-item">
          <blockquote className="yk-uvm-blockquote yk-uvm-one-line">
            {v.voice}
            <span className="yk-uvm-meta">
              {v.name}（{v.age}）
            </span>
          </blockquote>
        </figure>
      )}
    />
  );
};

export default UserVoicesMarquee;
