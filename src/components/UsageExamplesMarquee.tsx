import React, { useMemo } from 'react';
import { USAGE_EXAMPLES } from '@/data/usage-examples';
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from '@/components/ui/simple-marquee';
import '@/components/UsageExamplesMarquee.css';

export type UsageExamplesMarqueeProps = {
  shuffle?: boolean;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const UsageExamplesMarquee: React.FC<UsageExamplesMarqueeProps> = ({
  shuffle = false,
  className,
  speed = 20,
  pauseOnHover = true,
}) => {
  const examples = useMemo(
    () => (shuffle ? shuffleArray(USAGE_EXAMPLES) : USAGE_EXAMPLES),
    [shuffle],
  );

  if (!examples.length) return null;

  return (
    <Marquee className={className}>
      <MarqueeFade side="left" />
      <MarqueeContent speed={speed} pauseOnHover={pauseOnHover}>
        {examples.map((example, index) => (
          <MarqueeItem key={index}>
            <article className="yk-uem-item">
              <div className="yk-uem-card">
                <h3 className="yk-uem-title">{example.title}</h3>
                <p className="yk-uem-description">{example.description}</p>
              </div>
            </article>
          </MarqueeItem>
        ))}
      </MarqueeContent>
      <MarqueeFade side="right" />
    </Marquee>
  );
};

export default UsageExamplesMarquee;
