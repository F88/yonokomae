import React, { useMemo } from 'react';
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from '@/components/ui/shadcn-io/marquee';

export type BaseMarqueeSpeed =
  | 'molasses'
  | 'glacial'
  | 'ultra-slow'
  | 'very-slow'
  | 'slowest'
  | 'slower'
  | 'slow'
  | 'normal'
  | 'fast';

export type BaseMarqueeGap = 'sm' | 'md' | 'lg';

export type BaseMarqueeProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  speed?: BaseMarqueeSpeed;
  gap?: BaseMarqueeGap;
  reverse?: boolean;
  pauseOnHover?: boolean;
  marqueeClassName?: string; // applied to <Marquee>
  contentClassName?: string; // applied to <MarqueeContent>
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function BaseMarquee<T>({
  data,
  renderItem,
  shuffle = false,
  className,
  ariaLabel = 'Marquee',
  speed = 'normal',
  gap = 'md',
  reverse = false,
  pauseOnHover = true,
  marqueeClassName,
  contentClassName,
}: BaseMarqueeProps<T>) {
  const source = useMemo(
    () => (shuffle ? shuffleArray(data) : data),
    [shuffle, data],
  );
  if (source.length === 0) return null;

  return (
    <section className={className} aria-label={ariaLabel}>
      <div aria-live="polite">
        <Marquee
          className={[
            'yk-marquee--fade-edges',
            'yk-marquee--fade-edges-overlay',
            marqueeClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          pauseOnHover={pauseOnHover}
        >
          <MarqueeContent
            className={contentClassName}
            speed={speed}
            gap={gap}
            reverse={reverse}
          >
            {source.map((item, i) => (
              <MarqueeItem key={i}>{renderItem(item, i)}</MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>
    </section>
  );
}

export default BaseMarquee;
