import type { HTMLAttributes } from 'react';
import type { MarqueeProps as FastMarqueeProps } from 'react-fast-marquee';
export type MarqueeProps = HTMLAttributes<HTMLDivElement>;
export declare const Marquee: ({
  className,
  ...props
}: MarqueeProps) => import('react/jsx-runtime').JSX.Element;
export type MarqueeContentProps = FastMarqueeProps;
export declare const MarqueeContent: ({
  loop,
  autoFill,
  pauseOnHover,
  ...props
}: MarqueeContentProps) => import('react/jsx-runtime').JSX.Element;
export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
  side: 'left' | 'right';
  width?: string;
};
export declare const MarqueeFade: ({
  className,
  side,
  width,
  ...props
}: MarqueeFadeProps) => import('react/jsx-runtime').JSX.Element;
export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>;
export declare const MarqueeItem: ({
  className,
  ...props
}: MarqueeItemProps) => import('react/jsx-runtime').JSX.Element;
