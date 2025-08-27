import React from 'react';
import { USAGE_EXAMPLES } from '@/data/usage-examples';
import BaseCarousel from '@/components/BaseCarousel';
import '@/components/UsageExamplesCarousel.css';

export type UsageExamplesCarouselProps = {
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
  intervalMs?: number;
  startIndex?: number;
  pauseOnHover?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export const UsageExamplesCarousel: React.FC<UsageExamplesCarouselProps> = (
  props,
) => {
  return (
    <BaseCarousel
      data={USAGE_EXAMPLES}
      carouselClassName="ue-carousel"
      renderItem={(example) => (
        <div className="yk-uec-root">
          <div className="yk-uec-track" role="list" aria-live="polite">
            <article className="yk-uec-item" role="listitem">
              <h3 className="yk-uec-title">{example.title}</h3>
              <p className="yk-uec-description">{example.description}</p>
            </article>
          </div>
        </div>
      )}
      {...props}
    />
  );
};

export default UsageExamplesCarousel;
