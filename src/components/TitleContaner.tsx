import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PlayMode } from '@/yk/play-mode';
import { playMode as defaultPlayModes } from '@/yk/play-mode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyChip } from '@/components/ui/key-chip';
import { isEditable } from '@/lib/dom-utils';

export type TitleContanerProps = {
  modes?: PlayMode[];
  onSelect: (mode: PlayMode) => void;
  title?: string;
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
  title = 'SELECT MODE',
}: TitleContanerProps) {
  const options = useMemo(() => modes ?? defaultPlayModes, [modes]);
  const [index, setIndex] = useState(0);

  // Keep index within range if modes change
  useEffect(() => {
    if (index >= options.length) {
      setIndex(0);
      return;
    }
    // If current points to disabled, move to first enabled
    const firstEnabled = options.findIndex((o) => o.enabled !== false);
    if (
      options[index] &&
      options[index].enabled === false &&
      firstEnabled >= 0
    ) {
      setIndex(firstEnabled);
    }
  }, [options, index]);

  const handleConfirm = useCallback(() => {
    const chosen = options[index];
    if (chosen && chosen.enabled !== false) onSelect(chosen);
  }, [index, onSelect, options]);

  // Shared keyboard navigation handler. Returns true if the key was handled.
  const handleNavigationKey = useCallback(
    (key: string): boolean => {
      if (
        key === 'ArrowUp' ||
        key === 'k' ||
        key === 'K' ||
        key === 'w' ||
        key === 'W'
      ) {
        setIndex((i) => {
          let next = i;
          for (let step = 0; step < options.length; step++) {
            next = (next - 1 + options.length) % options.length;
            if (options[next]?.enabled !== false) return next;
          }
          return i;
        });
        return true;
      }
      if (
        key === 'ArrowDown' ||
        key === 'j' ||
        key === 'J' ||
        key === 's' ||
        key === 'S'
      ) {
        setIndex((i) => {
          let next = i;
          for (let step = 0; step < options.length; step++) {
            next = (next + 1) % options.length;
            if (options[next]?.enabled !== false) return next;
          }
          return i;
        });
        return true;
      }
      if (key === 'Home') {
        setIndex(() => {
          const idx = options.findIndex((o) => o.enabled !== false);
          return idx >= 0 ? idx : 0;
        });
        return true;
      }
      if (key === 'End') {
        setIndex(() => {
          for (let i = options.length - 1; i >= 0; i--) {
            if (options[i]?.enabled !== false) return i;
          }
          return 0;
        });
        return true;
      }
      if (key === 'Enter' || key === ' ') {
        handleConfirm();
        return true;
      }
      return false;
    },
    [options, handleConfirm],
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (handleNavigationKey(e.key)) {
      e.preventDefault();
    }
  };

  // Global keydown support (works without focusing the component)
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return; // ignore typing in inputs
      if (e.metaKey || e.ctrlKey || e.altKey) return; // ignore modified keys

      const handled = handleNavigationKey(e.key);
      if (handled) e.preventDefault();
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [handleNavigationKey]);

  return (
    <div className="flex w-full justify-center p-6">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="gap-2 pt-2">
          <CardTitle className="text-3xl font-bold tracking-wide">
            {title}
          </CardTitle>
          {/* <div className="text-sm text-muted-foreground">{subtitle}</div> */}
        </CardHeader>
        <CardContent>
          {/** Key hint chips (>= sm) */}
          <div className="mb-4 hidden flex-col items-center gap-1 text-xs text-muted-foreground sm:flex">
            <div className="flex items-center gap-1">
              <KeyChip label="↓" />
              <KeyChip label="↑" />
              <KeyChip label="J" />
              <KeyChip label="K" />
              <KeyChip label="S" />
              <KeyChip label="W" />
              <KeyChip label="Space" />
              <KeyChip label="Enter" />
            </div>
          </div>

          {/** Compact hint (< sm) */}
          <div className="mb-2 text-[10px] text-muted-foreground sm:hidden">
            Use ↓/↑ to choose, Enter to start (or j/k, s/w)
          </div>
          <div
            role="radiogroup"
            aria-label="Play modes"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="mx-auto flex w-full flex-col gap-2"
          >
            {options.map((m, i) => {
              const selected = i === index;
              const inputId = `play-mode-${m.id}`;
              return (
                <label
                  key={m.id}
                  htmlFor={inputId}
                  onMouseEnter={() => {
                    if (m.enabled !== false) setIndex(i);
                  }}
                  onClick={() => {
                    if (m.enabled !== false) {
                      // Confirm immediately on mouse click
                      setIndex(i);
                      onSelect(m);
                    }
                  }}
                  title={`${m.title} — ${m.description}${m.enabled === false ? ' (disabled)' : ''}`}
                  className={[
                    'flex cursor-pointer items-center justify-start gap-3 rounded-md border px-4 py-3 text-left transition-colors',
                    selected
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-muted',
                  ].join(' ')}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name="play-mode"
                    className="sr-only"
                    disabled={m.enabled === false}
                    checked={selected}
                    onChange={() => {
                      if (m.enabled !== false) {
                        // Only update selection; click handler confirms to avoid double firing
                        setIndex(i);
                      }
                    }}
                  />
                  <span
                    aria-hidden
                    className={[
                      'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border text-xs',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground',
                    ].join(' ')}
                  >
                    {selected ? '>' : ''}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className=" text-base font-semibold">{m.title}</span>
                    <span className=" text-sm text-muted-foreground">
                      {m.description}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
          {/* trailing spacing kept minimal; chips/text shown above */}
        </CardContent>
      </Card>
    </div>
  );
}

export default TitleContaner;
