import React, { useEffect, useMemo, useRef, useState } from 'react';
import '@/components/UserVoicesMarquee.css';
import { USER_VOICES } from '@/data/users-voice';

export type UserVoicesProps = {
  intervalMs?: number;
  startIndex?: number;
  shuffle?: boolean;
  className?: string;
  ariaLabel?: string;
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const UserVoices: React.FC<UserVoicesProps> = ({
  intervalMs = 3000,
  startIndex = 0,
  shuffle = false,
  className,
  ariaLabel = 'User voices marquee',
}) => {
  const source = useMemo(
    () => (shuffle ? shuffleArray(USER_VOICES) : USER_VOICES),
    [shuffle],
  );
  const [index, setIndex] = useState(() =>
    source.length ? Math.max(0, Math.min(startIndex, source.length - 1)) : 0,
  );
  const timerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!source.length) return;
    const tick = () => setIndex((i) => (i + 1) % source.length);
    timerRef.current = window.setInterval(
      () => {
        if (!pausedRef.current) tick();
      },
      Math.max(800, intervalMs),
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs, source.length]);

  if (!source.length) return null;
  const current = source[index];

  return (
    <section
      className={['yk-uvm-root', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="yk-uvm-track" role="list" aria-live="polite">
        <figure className="yk-uvm-item-enter" role="listitem">
          <blockquote style={{ margin: 0 }}>
            &ldquo;{current.voice}&rdquo;
          </blockquote>
          <figcaption style={{ marginTop: 4, opacity: 0.8 }}>
            {current.name}（{current.age}）
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default UserVoices;
