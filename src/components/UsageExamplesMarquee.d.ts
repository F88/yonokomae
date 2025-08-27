import React from 'react';
import '@/components/UsageExamplesMarquee.css';
export type UsageExamplesMarqueeProps = {
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
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
export declare const UsageExamplesMarquee: React.FC<UsageExamplesMarqueeProps>;
export default UsageExamplesMarquee;
