import { useCallback, useEffect, useMemo, useState } from 'react';
import { battleSeedsByFile } from '@yonokomae/data-battle-seeds';
import type { PlayMode } from '@/yk/play-mode';
import { playMode as defaultPlayModes } from '@/yk/play-mode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyChip } from '@/components/KeyChip';
import { isEditable } from '@/lib/dom-utils';
import { BattleSeedSelector } from '@/components/BattleSeedSelector';
import { BattleFilter } from '@/components/BattleFilter';

interface ModeOptionProps {
  mode: PlayMode;
  isSelected: boolean;
  inputId: string;
  onSelect: (mode: PlayMode, clickY?: number) => void;
  onHover: (mode: PlayMode) => void;
}

const ModeOption = ({
  mode,
  isSelected,
  inputId,
  onSelect,
  onHover,
}: ModeOptionProps) => {
  // Debug: log the mode prop received by this component
  console.log('[DEBUG] ModeOption received mode prop:', {
    modeId: mode.id,
    modeTitle: mode.title,
  });
  const handleClick: React.MouseEventHandler<HTMLLabelElement> = (e) => {
    console.log('[DEBUG] ModeOption handleClick START:', {
      componentModeId: mode.id,
      componentModeTitle: mode.title,
      clickY: e.clientY,
      eventType: e.type,
      timestamp: Date.now(),
    });

    if (mode.enabled === false) return;

    // Pass click Y coordinate for iOS WebKit position-based fix
    onSelect(mode, e.clientY);
    console.log('[DEBUG] ModeOption handleClick END:', {
      modeId: mode.id,
      modeTitle: mode.title,
    });
  };

  const handleMouseEnter = () => {
    if (mode.enabled === false) return;
    onHover(mode);
  };

  const handleChange = () => {
    if (mode.enabled !== false) {
      onHover(mode);
    }
  };

  return (
    <label
      key={mode.id}
      data-mode-id={mode.id}
      htmlFor={inputId}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      title={`${mode.title} — ${mode.description}${mode.enabled === false ? ' (disabled)' : ''}`}
      className={[
        'flex cursor-pointer items-center justify-start gap-3 rounded-md border px-4 py-3 text-left transition-colors',
        isSelected ? 'border-primary bg-primary/10' : 'hover:bg-muted',
      ].join(' ')}
    >
      <input
        id={inputId}
        type="radio"
        name="play-mode"
        className="sr-only"
        disabled={mode.enabled === false}
        checked={isSelected}
        onChange={handleChange}
      />
      <span
        aria-hidden
        className={[
          'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border text-xs',
          isSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30 text-muted-foreground',
        ].join(' ')}
      >
        {isSelected ? '>' : ''}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className=" text-base font-semibold">{mode.title}</span>
        <span className=" text-sm text-muted-foreground">
          {mode.description}
        </span>
      </div>
    </label>
  );
};

export type TitleContainerProps = {
  modes?: PlayMode[];
  onSelect: (mode: PlayMode) => void;
  title?: string;
  battleSeedFile?: string;
  onBattleSeedChange?: (file: string | undefined) => void;
  /**
   * Currently selected theme id coming from parent (BattleFilter). When provided this component
   * operates in a controlled mode for theme selection and emits changes through
   * `onSelectedThemeIdChange`.
   */
  selectedThemeId?: string;
  /** Notify parent when the active theme filter changes (undefined => all). */
  onSelectedThemeIdChange?: (id: string | undefined) => void;
};

/**
 * TitleContainer
 * - Shows a simple title screen with vertically stacked play modes.
 * - Users can navigate with ArrowUp/ArrowDown and confirm with Enter or B.
 * - Clicking an item also selects and confirms.
 */
export function TitleContainer({
  modes,
  onSelect,
  title = 'SELECT MODE',
  battleSeedFile,
  onBattleSeedChange,
  selectedThemeId,
  onSelectedThemeIdChange,
}: TitleContainerProps) {
  // Local (controlled/uncontrolled) battle seed file selection
  const [internalBattleSeedFile, setInternalBattleSeedFile] = useState<
    string | undefined
  >(battleSeedFile);
  const effectiveBattleSeedFile = battleSeedFile ?? internalBattleSeedFile;
  const updateBattleSeedFile = useCallback(
    (file: string | undefined) => {
      if (battleSeedFile === undefined) {
        setInternalBattleSeedFile(file); // uncontrolled mode
      }
      onBattleSeedChange?.(file);
    },
    [battleSeedFile, onBattleSeedChange],
  );
  // Battle seed filtering (dev utility) — locally controlled
  const [battleSeedSearch, setBattleSeedSearch] = useState('');
  // Theme selection unified: BattleFilter drives the theme filter used by BattleSeedSelector
  // Removed separate battleSeedTheme state; we derive active theme from poolThemes[0]
  const options = useMemo(() => {
    const result = modes ?? defaultPlayModes;
    console.log('[DEBUG] *** VERSION: 2025-09-08-v5 - DEPLOY CHECK ***');
    console.log(
      '[DEBUG] options computed:',
      result.map((m, i) => ({
        index: i,
        id: m.id,
        title: m.title,
      })),
    );
    return result;
  }, [modes]);
  const [index, setIndex] = useState(0);

  // Debug index changes
  useEffect(() => {
    console.log('[DEBUG] index changed:', {
      newIndex: index,
      modeAtIndex: options[index]?.id,
      modeTitle: options[index]?.title,
      timestamp: Date.now(),
    });
  }, [index, options]);
  // Theme filter state (single selection). Keep historical array shape for downstream (poolThemes[0]).
  const [internalTheme, setInternalTheme] = useState<string | undefined>(
    undefined,
  );
  const themeId =
    selectedThemeId !== undefined ? selectedThemeId : internalTheme;
  const poolThemes = useMemo(() => (themeId ? [themeId] : []), [themeId]);
  const updateTheme = useCallback(
    (id: string | undefined) => {
      if (selectedThemeId === undefined) {
        setInternalTheme(id);
      }
      onSelectedThemeIdChange?.(id);
    },
    [selectedThemeId, onSelectedThemeIdChange],
  );

  // Stabilize BattleFilter visibility to prevent iOS WebKit re-render issues
  const showBattleFilter = useMemo(
    () => options[index]?.id === 'historical-research',
    [index, options],
  );

  // Keep selected battle seed consistent with active theme filter: if theme changes and current
  // selection doesn't belong to that theme, clear it so downstream consumers don't see stale data.
  useEffect(() => {
    const activeTheme = poolThemes[0];
    if (!activeTheme || !effectiveBattleSeedFile) return;
    const seed = battleSeedsByFile[effectiveBattleSeedFile] as
      | { themeId?: string }
      | undefined;
    if (seed && seed.themeId !== activeTheme) {
      updateBattleSeedFile(undefined);
    }
  }, [poolThemes, effectiveBattleSeedFile, updateBattleSeedFile]);

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

  // Shared event-level handler to avoid duplication between local/global key handling
  type AnyKeyEvent = Pick<
    KeyboardEvent,
    'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'target' | 'preventDefault'
  >;
  const handleKeyEvent = useCallback(
    (e: AnyKeyEvent, opts?: { isGlobal?: boolean }) => {
      const isGlobal = opts?.isGlobal === true;
      if (isGlobal) {
        if (isEditable(e.target)) return; // ignore typing in inputs
        if (e.metaKey || e.ctrlKey || e.altKey) return; // ignore modified keys
      }

      const handled = handleNavigationKey(e.key);
      if (handled) e.preventDefault();
    },
    [handleNavigationKey],
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    handleKeyEvent(e);
  };

  // Global keydown support (works without focusing the component)
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      handleKeyEvent(e, { isGlobal: true });
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [handleKeyEvent]);

  return (
    <div className="flex w-full justify-center px-6 pb-6 pt-0">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="gap-2 pt-2">
          <CardTitle className="text-3xl font-bold tracking-wide">
            {title}
          </CardTitle>

          {/* BattleSeedSelector: Development-only tool for seed selection testing */}
          <BattleSeedSelector
            showIds
            show={
              import.meta.env.DEV &&
              options[index]?.id === 'historical-research'
            }
            value={effectiveBattleSeedFile}
            onChange={updateBattleSeedFile}
            enableFilters={true}
            searchText={battleSeedSearch}
            onSearchTextChange={setBattleSeedSearch}
            themeIdFilter={poolThemes[0]}
            onThemeIdFilterChange={(id) => updateTheme(id)}
          />

          {/* BattleFilter: Shows when 'historical-research' mode is selected (production + dev) */}
          <BattleFilter
            show={showBattleFilter}
            showBattleChips={import.meta.env.DEV}
            showBattleCount={import.meta.env.DEV}
            themeIdsFilter={undefined}
            selectedThemeId={poolThemes[0]}
            onSelectedThemeIdChange={(id) => updateTheme(id)}
            className="mt-2"
          />
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
              {/* Space removed from shortcuts */}
              <KeyChip label="Enter" />
            </div>
          </div>

          {/** Compact hint (< sm) */}
          {/* <div className="mb-2 text-[10px] text-muted-foreground sm:hidden"> */}
          {/* Use ↓/↑ to choose, Enter to start (or j/k, s/w) */}
          {/* </div> */}
          <div
            role="radiogroup"
            aria-label="Play modes"
            aria-describedby="play-modes-hint"
            aria-activedescendant={
              options[index] ? `play-mode-${options[index].id}` : undefined
            }
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="mx-auto flex w-full flex-col gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {/* SR-only hint for keyboard interaction */}
            <div id="play-modes-hint" className="sr-only">
              Use Arrow keys to choose a mode and press Enter or B to start.
            </div>
            {options.map((m, mapIndex) => {
              console.log('[DEBUG] mapping mode:', {
                mapIndex,
                modeId: m.id,
                modeTitle: m.title,
              });
              console.log('[DEBUG] passing mode to ModeOption:', {
                mapIndex,
                passingModeId: m.id,
                passingModeTitle: m.title,
              });
              const handleModeSelect = (selectedMode: PlayMode) => {
                console.log('[DEBUG] handleModeSelect called:', {
                  selectedModeId: selectedMode.id,
                  selectedModeTitle: selectedMode.title,
                  currentIndex: index,
                  currentModeId: options[index]?.id,
                  currentModeTitle: options[index]?.title,
                });
                const targetIndex = options.findIndex(
                  (opt) => opt.id === selectedMode.id,
                );
                console.log('[DEBUG] targetIndex found:', {
                  targetIndex,
                  expectedMode: selectedMode.id,
                  foundMode: options[targetIndex]?.id,
                });
                if (targetIndex >= 0) {
                  setIndex(targetIndex);
                  console.log('[DEBUG] calling onSelect with:', {
                    modeId: selectedMode.id,
                    modeTitle: selectedMode.title,
                  });
                  onSelect(selectedMode);
                }
              };

              const handleModeHover = (hoveredMode: PlayMode) => {
                const targetIndex = options.findIndex(
                  (opt) => opt.id === hoveredMode.id,
                );
                if (targetIndex >= 0) {
                  setIndex(targetIndex);
                }
              };

              return (
                <ModeOption
                  key={m.id}
                  mode={m}
                  isSelected={m.id === options[index]?.id}
                  inputId={`play-mode-${m.id}`}
                  onSelect={(selectedMode, clickY) => {
                    console.log('[DEBUG] Parent onSelect received:', {
                      selectedMode: selectedMode.id,
                      clickY,
                      mapIndex,
                    });
                    
                    console.log('[DEBUG] *** DEPLOYMENT CHECK: 2025-09-08-v4 ***');

                    // iOS WebKit fix: Find correct mode based on click position
                    // Skip coordinate-based fix in test environment
                    if (
                      typeof clickY === 'number' &&
                      process.env.NODE_ENV !== 'test'
                    ) {
                      console.log(
                        '[DEBUG] Entering coordinate-based fix, clickY:',
                        clickY,
                      );

                      // Get all mode option elements
                      const modeElements =
                        document.querySelectorAll('[data-mode-id]');
                      console.log(
                        '[DEBUG] Found mode elements count:',
                        modeElements.length,
                      );

                      let closestMode = selectedMode;
                      let minDistance = Infinity;

                      modeElements.forEach((el, elIndex) => {
                        const rect = el.getBoundingClientRect();
                        const elementCenterY = rect.top + rect.height / 2;
                        const distance = Math.abs(clickY - elementCenterY);
                        const modeId = el.getAttribute('data-mode-id');

                        console.log(`[DEBUG] Element ${elIndex}:`, {
                          modeId,
                          elementCenterY,
                          distance,
                          rect: {
                            top: rect.top,
                            height: rect.height,
                          },
                        });

                        if (distance < minDistance) {
                          minDistance = distance;
                          const foundMode = options.find(
                            (opt) => opt.id === modeId,
                          );
                          if (foundMode) {
                            console.log(
                              '[DEBUG] New closest mode found:',
                              foundMode.id,
                            );
                            closestMode = foundMode;
                          }
                        }
                      });

                      console.log(
                        '[DEBUG] Final closest mode:',
                        closestMode.id,
                      );

                      console.log(
                        '[DEBUG] *** CODE VERSION: 2025-09-08-v3 ***',
                      );

                      // iOS WebKit fix: Compare with current index state instead of selectedMode
                      const intendedMode = options[index];
                      console.log('[DEBUG] Current index points to:', {
                        index: index,
                        intendedMode: intendedMode?.id,
                        intendedTitle: intendedMode?.title,
                      });

                      if (intendedMode && closestMode.id !== intendedMode.id) {
                        console.log('[DEBUG] iOS WebKit offset detected:', {
                          coordinateBasedMode: closestMode.id,
                          indexBasedMode: intendedMode.id,
                          usingIndexBased: true,
                        });
                        handleModeSelect(intendedMode);
                      } else {
                        console.log(
                          '[DEBUG] No offset detected, using coordinate-based result',
                        );
                        handleModeSelect(closestMode);
                      }
                    } else {
                      // In test environment or when clickY is not available, use direct selection
                      console.log(
                        '[DEBUG] Using direct selection (test env or no clickY)',
                      );
                      handleModeSelect(selectedMode);
                    }
                  }}
                  onHover={() => handleModeHover(m)}
                />
              );
            })}
          </div>
          {/* trailing spacing kept minimal; chips/text shown above */}
        </CardContent>
      </Card>
    </div>
  );
}
