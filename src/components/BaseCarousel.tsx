import React, { useEffect, useMemo, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import '@/components/BaseCarousel.css';

export type BaseCarouselProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  intervalMs?: number;
  startIndex?: number;
  pauseOnHover?: boolean;
  orientation?: 'horizontal' | 'vertical';
  carouselClassName?: string;
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function BaseCarousel<T>({
  data,
  renderItem,
  shuffle = false,
  className,
  ariaLabel = 'Carousel',
  intervalMs = 3000,
  startIndex = 0,
  pauseOnHover = true,
  orientation = 'horizontal',
  carouselClassName = 'base-carousel',
}: BaseCarouselProps<T>) {
  const source = useMemo(
    () => (shuffle ? shuffleArray(data) : data),
    [shuffle, data],
  );
  const autoplay = useMemo(
    () => Autoplay({ delay: Math.max(800, intervalMs) }),
    [intervalMs],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, axis: orientation === 'vertical' ? 'y' : 'x' },
    [autoplay],
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const safe = Math.max(0, Math.min(startIndex, source.length - 1));
    emblaApi.scrollTo(safe, true);
  }, [emblaApi, startIndex, source.length]);

  useEffect(() => {
    if (!pauseOnHover) return;
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => autoplay && autoplay.stop && autoplay.stop();
    const onLeave = () => autoplay && autoplay.play && autoplay.play();
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [autoplay, pauseOnHover]);

  if (!source.length) return null;

  return (
    <section className={className} aria-label={ariaLabel} ref={containerRef}>
      <div
        className={`${carouselClassName}-embla`}
        ref={emblaRef}
        data-orientation={orientation}
      >
        <div className={`${carouselClassName}-embla__container`}>
          {source.map((item, i) => (
            <div className={`${carouselClassName}-embla__slide`} key={i}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BaseCarousel;
