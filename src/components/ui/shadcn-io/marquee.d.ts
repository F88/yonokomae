import React from 'react';
import '../../ui/marquee.css';
export type MarqueeProps = React.ComponentProps<'div'> & {
  pauseOnHover?: boolean;
};
export declare const Marquee: React.FC<MarqueeProps>;
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
export declare const MarqueeContent: React.FC<MarqueeContentProps>;
export type MarqueeItemProps = React.ComponentProps<'div'>;
export declare const MarqueeItem: React.FC<MarqueeItemProps>;
export default Marquee;
