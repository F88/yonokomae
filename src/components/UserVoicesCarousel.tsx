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

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

  const plugin = React.useRef(
    Autoplay({
      delay: intervalMs,
      stopOnInteraction: false,
      stopOnMouseEnter: pauseOnHover,
    }),
  );

  if (!voices.length) return null;

  return (
    <Carousel
      className={className}
      orientation={orientation}
      plugins={[plugin.current]}
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
