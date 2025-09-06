import React, { useMemo } from 'react';
import { USER_VOICES } from '@/data/users-voice';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import '@/components/UserVoicesMarquee.css';
import { prefersReducedMotion } from '@/lib/reduced-motion';
import { shuffleArray } from '@/lib/shuffle';

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


export const UserVoicesCarousel: React.FC<UserVoicesCarouselProps> = ({
  shuffle = false,
  className,
  slidesToShow = 3,
  intervalMs = 3000,
  pauseOnHover = true,
  orientation = 'horizontal',
  containerHeight = '400px',
  showControls = true,
}) => {
  const voices = useMemo(
    () => (shuffle ? shuffleArray(USER_VOICES) : USER_VOICES),
    [shuffle],
  );

  const autoplayPlugin = React.useMemo(() => {
    if (prefersReducedMotion()) return undefined;
    return Autoplay({
      delay: intervalMs,
      stopOnInteraction: false,
      stopOnMouseEnter: pauseOnHover,
    });
  }, [intervalMs, pauseOnHover]);

  if (!voices.length) return null;

  return (
    <Carousel
      className={className}
      orientation={orientation}
      plugins={autoplayPlugin ? [autoplayPlugin] : []}
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent
        className={orientation === 'vertical' ? '-mt-1' : ''}
        style={
          orientation === 'vertical' ? { height: containerHeight } : undefined
        }
      >
        {voices.map((voice, index) => (
          <CarouselItem
            key={index}
            className={
              orientation === 'vertical'
                ? 'pt-1 basis-full'
                : `basis-1/${slidesToShow}`
            }
          >
            <div className="p-1">
              <figure className="yk-uvm-item">
                <blockquote className="yk-uvm-blockquote">
                  {voice.voice}
                  <span className="yk-uvm-meta">
                    {voice.name}（{voice.age}）
                  </span>
                </blockquote>
              </figure>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showControls && <CarouselPrevious />}
      {showControls && <CarouselNext />}
    </Carousel>
  );
};

export default UserVoicesCarousel;
