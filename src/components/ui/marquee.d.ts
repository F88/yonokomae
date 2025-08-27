import React from 'react';
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
export declare const Marquee: React.FC<MarqueeProps>;
export default Marquee;
