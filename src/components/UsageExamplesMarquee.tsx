import React from 'react';
import { USAGE_EXAMPLES } from '@/data/usage-examples';
import { BaseMarquee } from '@/components/BaseMarquee';
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

export const UsageExamplesMarquee: React.FC<UsageExamplesMarqueeProps> = ({
  shuffle = false,
  className,
  ariaLabel = 'Usage examples marquee',
  speed = 'glacial',
  gap = 'md',
  reverse = false,
}) => {
  return (
    <BaseMarquee
      data={USAGE_EXAMPLES}
      shuffle={shuffle}
      className={className}
      ariaLabel={ariaLabel}
      speed={speed}
      gap={gap}
      reverse={reverse}
      marqueeClassName="yk-marquee--fade-edges"
      renderItem={(example) => (
        <article className="yk-uem-item">
          <div className="yk-uem-card">
            <h3 className="yk-uem-title">{example.title}</h3>
            <p className="yk-uem-description">{example.description}</p>
          </div>
        </article>
      )}
    />
  );
};

export default UsageExamplesMarquee;
