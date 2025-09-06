import React, { useMemo } from 'react';
import { USER_VOICES } from '@/data/users-voice';
import { shuffleArray } from '@/lib/shuffle';
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@/components/ui/simple-marquee';
import '@/components/UserVoicesMarquee.css';

export type UserVoicesMarqueeProps = {
  shuffle?: boolean;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  fadeWidth?: string;
};

export const UserVoicesMarquee: React.FC<UserVoicesMarqueeProps> = ({
  shuffle = false,
  className,
  speed = 20,
  pauseOnHover = true,
  fadeWidth,
}) => {
  const voices = useMemo(
    () => (shuffle ? shuffleArray(USER_VOICES) : USER_VOICES),
    [shuffle],
  );

  if (!voices.length) return null;

  return (
    <Marquee className={className}>
      <MarqueeFade side="left" width={fadeWidth} />
      <MarqueeContent speed={speed} pauseOnHover={pauseOnHover}>
        {voices.map((voice, index) => (
          <MarqueeItem key={index}>
            <figure className="yk-uvm-item">
              <blockquote className="yk-uvm-blockquote yk-uvm-one-line">
                {voice.voice}
                <span className="yk-uvm-meta">
                  {voice.name}（{voice.age}）
                </span>
              </blockquote>
            </figure>
          </MarqueeItem>
        ))}
      </MarqueeContent>
      <MarqueeFade side="right" width={fadeWidth} />
    </Marquee>
  );
};

export default UserVoicesMarquee;
