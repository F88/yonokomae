import React from 'react';
import '../../ui/marquee.css';

export type MarqueeProps = React.ComponentProps<'div'> & {
  pauseOnHover?: boolean;
};

export const Marquee: React.FC<MarqueeProps> = ({
  className,
  pauseOnHover = true,
  children,
  ...rest
}) => {
  return (
    <div
      className={['yk-marquee', className].filter(Boolean).join(' ')}
      data-pause-on-hover={pauseOnHover ? 'true' : 'false'}
      {...rest}
    >
      {children}
    </div>
  );
};

export type MarqueeContentProps = React.ComponentProps<'div'> & {
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

export const MarqueeContent: React.FC<MarqueeContentProps> = ({
  className,
  speed = 'normal',
  gap = 'md',
  reverse = false,
  children,
  ...rest
}) => {
  const speedClass = (() => {
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
  })();
  const gapClass = `yk-marquee-gap-${gap}`;

  return (
    <div
      className={['yk-marquee-track', speedClass, gapClass, className]
        .filter(Boolean)
        .join(' ')}
      data-reverse={reverse ? 'true' : 'false'}
      {...rest}
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
  );
};

export type MarqueeItemProps = React.ComponentProps<'div'>;

export const MarqueeItem: React.FC<MarqueeItemProps> = ({
  className,
  children,
  ...rest
}) => (
  <div
    className={['yk-marquee-item', className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);

export default Marquee;
