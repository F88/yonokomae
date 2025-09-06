import React, { useState, useEffect, useMemo } from 'react';
import { USER_VOICES } from '@/data/users-voice';
import '@/components/UserVoicesMarquee.css';
import { shuffleArray } from '@/lib/shuffle';

export type SimpleVerticalCarouselProps = {
  shuffle?: boolean;
  className?: string;
  intervalMs?: number;
  pauseOnHover?: boolean;
  height?: string;
};


export const SimpleVerticalCarousel: React.FC<SimpleVerticalCarouselProps> = ({
  shuffle = false,
  className,
  intervalMs = 3000,
  pauseOnHover = true,
  height = '120px',
}) => {
  const voices = useMemo(
    () => (shuffle ? shuffleArray(USER_VOICES) : USER_VOICES),
    [shuffle],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!pauseOnHover || !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % voices.length);
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [intervalMs, pauseOnHover, isHovered, voices.length]);

  if (!voices.length) return null;

  return (
    <div
      className={`relative overflow-hidden ${className || ''}`}
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
        }}
      >
        {voices.map((voice, index) => (
          <div
            key={index}
            className="w-full flex items-center justify-center p-2"
            style={{ height, minHeight: height }}
          >
            <figure className="yk-uvm-item max-w-full">
              <blockquote className="yk-uvm-blockquote text-center text-sm">
                <span className="block">{voice.voice}</span>
                <span className="yk-uvm-meta block mt-2 text-xs">
                  {voice.name}（{voice.age}）
                </span>
              </blockquote>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleVerticalCarousel;
