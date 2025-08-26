import { useEffect, useMemo, useState } from 'react';
import type { PlayMode } from '@/yk/play-mode';
import { playMode as defaultPlayModes } from '@/yk/play-mode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type TitleContanerProps = {
  modes?: PlayMode[];
  onSelect: (mode: PlayMode) => void;
  title?: string;
  subtitle?: string;
};

/**
 * TitleContaner
 * - Shows a simple title screen with vertically stacked play modes.
 * - Users can navigate with ArrowUp/ArrowDown and confirm with Enter/Space.
 * - Clicking an item also selects and confirms.
 */
export function TitleContaner({
  modes,
  onSelect,
  title = 'YONOKOMAE',
  subtitle = 'Select a play mode',
}: TitleContanerProps) {
  const options = useMemo(() => modes ?? defaultPlayModes, [modes]);
  const [index, setIndex] = useState(0);

  // Keep index within range if modes change
  useEffect(() => {
    if (index >= options.length) {
      setIndex(0);
    }
  }, [options, index]);

  const handleConfirm = () => {
    const chosen = options[index];
    if (chosen) onSelect(chosen);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (i + 1) % options.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
      <Card className="w-full max-w-xl text-center">
        <CardHeader className="gap-2 py-4">
          <CardTitle className="text-3xl font-bold tracking-wide">
            {/* {title} */}
          </CardTitle>
          {/* <div className="text-sm text-muted-foreground">{subtitle}</div> */}
        </CardHeader>
        <CardContent>
          <div
            role="radiogroup"
            aria-label="Play modes"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="mx-auto flex w-full max-w-md flex-col gap-2"
          >
            {options.map((m, i) => {
              const selected = i === index;
              return (
                <button
                  type="button"
                  key={m.id}
                  role="radio"
                  disabled={!m.enabled}
                  aria-checked={selected ? 'true' : 'false'}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    setIndex(i);
                    handleConfirm();
                  }}
                  className={[
                    'flex items-center justify-between rounded-md border px-4 py-3 text-left transition-colors',
                    selected
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-muted',
                  ].join(' ')}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-base font-semibold">
                      {m.title}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {m.description}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className={[
                      'ml-3 inline-flex h-5 w-5 items-center justify-center rounded-sm border text-xs',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground',
                    ].join(' ')}
                  >
                    {selected ? '★' : '☆'}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Use ↑/↓ to choose, Enter to start
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TitleContaner;
