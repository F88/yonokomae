import React, { useMemo } from 'react';
import './marquee.css';

export type MarqueeProps = {
  className?: string;
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
  pauseOnHover?: boolean;
  reverse?: boolean;
  children: React.ReactNode;
};

export const Marquee: React.FC<MarqueeProps> = ({
  className,
  speed = 'normal',
  gap = 'md',
  pauseOnHover = true,
  reverse = false,
  children,
}) => {
  const speedClass = useMemo(() => {
    switch (speed) {
      case 'molasses':
        return 'yk-marquee-speed-molasses';
      case 'glacial':
        return 'yk-marquee-speed-glacial';
      case 'ultra-slow':
        return 'yk-marquee-speed-ultra-slow';
      case 'very-slow':
        return 'yk-marquee-speed-very-slow';
      case 'slowest':
        return 'yk-marquee-speed-slowest';
      case 'slower':
        return 'yk-marquee-speed-slower';
      case 'slow':
        return 'yk-marquee-speed-slow';
      case 'fast':
        return 'yk-marquee-speed-fast';
      default:
        return 'yk-marquee-speed-normal';
    }
  }, [speed]);
  const gapClass = useMemo(() => `yk-marquee-gap-${gap}`, [gap]);

  return (
    <div
      className={['yk-marquee', className].filter(Boolean).join(' ')}
      data-pause-on-hover={pauseOnHover ? 'true' : 'false'}
    >
      <div
        className={['yk-marquee-track', speedClass, gapClass].join(' ')}
        data-reverse={reverse ? 'true' : 'false'}
      >
        <div className="yk-marquee-track-inner">
          {React.Children.map(children, (child, idx) => (
            <div className="yk-marquee-item-gap" key={`a-${idx}`}>
              {child}
            </div>
          ))}
        </div>
        <div className="yk-marquee-track-inner" aria-hidden>
          {React.Children.map(children, (child, idx) => (
            <div className="yk-marquee-item-gap" key={`b-${idx}`}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
