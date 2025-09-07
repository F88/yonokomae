import { battleSeedsByFile } from '@yonokomae/data-battle-seeds';
import { battleThemeCatalog } from '@yonokomae/catalog';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { ThemeChip } from '@/components/battle/ThemeChip';
import { BattleTitleChip } from '@/components/battle/BattleTitleChip';
import type { Battle } from '@yonokomae/types';

/**
 * BattleFilter
 * Repository-level filter UI (dev utility) allowing narrowing of battle generation
 * by theme before requesting a report from a BattleReportRepository.
 *
 * Differences from former BattleSeedFilter:
 * - Semantics: communicates intent to filter repository generation pool, not just seed list.
 * - Still limited to theme filtering (extensible later: significance, id, etc.).
 */
export type BattleFilterProps = {
  /** Limit available themes to this allow-list (undefined => all). */
  themeIdsFilter?: string[];
  /** Selected theme id (undefined => all themes). */
  selectedThemeId?: string;
  onSelectedThemeIdChange?: (id: string | undefined) => void;
  className?: string;
  show?: boolean;
  showBattleCount?: boolean; // Whether to show the battle count next to "テーマ" (default true)
  showBattleChips?: boolean; // Whether to show the battle chips below the filter (default true)
};

export function BattleFilter({
  themeIdsFilter,
  selectedThemeId,
  onSelectedThemeIdChange,
  className,
  show = true,
  showBattleCount = true,
  showBattleChips = true,
}: BattleFilterProps) {
  interface BattleShape {
    title?: string;
    themeId?: string;
  }

  const seeds = useMemo(() => {
    const allowedSet =
      themeIdsFilter && themeIdsFilter.length > 0
        ? new Set(themeIdsFilter)
        : undefined;
    return Object.entries(battleSeedsByFile)
      .map(([file, battle]) => {
        const b = battle as unknown as BattleShape;
        return { file, title: b.title || file, themeId: b.themeId };
      })
      .filter((s) =>
        allowedSet ? (s.themeId ? allowedSet.has(s.themeId) : false) : true,
      )
      .sort((a, b) => {
        // Sort by battleThemeCatalog order first, then by title
        const aIndex = a.themeId
          ? battleThemeCatalog.findIndex((t) => t.id === a.themeId)
          : battleThemeCatalog.length;
        const bIndex = b.themeId
          ? battleThemeCatalog.findIndex((t) => t.id === b.themeId)
          : battleThemeCatalog.length;
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        return a.title.localeCompare(b.title);
      });
  }, [themeIdsFilter]);

  // Unified local mirror state for immediate (optimistic) UI feedback.
  // Rationale: When parent controls the value, the first click triggers parent state update
  // but the render with the new prop arrives on the next tick; without a local mirror the
  // user must click twice to see ALL highlighted. We therefore always keep a local copy
  // and sync it via effect when the external prop changes.
  const [localTheme, setLocalTheme] = useState<string | undefined>(
    selectedThemeId,
  );
  // Sync local state whenever the controlled prop changes (including becoming undefined)
  useEffect(() => {
    setLocalTheme(selectedThemeId);
  }, [selectedThemeId]);
  const themeId = localTheme;

  const themeOptions = useMemo(() => {
    const ids = new Set<string>();
    seeds.forEach((s) => {
      if (s.themeId) ids.add(s.themeId);
    });
    // Display in the same order as battleThemeCatalog array
    return battleThemeCatalog
      .filter((t) => ids.has(t.id))
      .map((t) => ({ id: t.id, name: t.name, icon: t.icon }));
  }, [seeds]);

  const filtered = useMemo(() => {
    if (!themeId) return seeds;
    return seeds.filter((s) => (s.themeId ? s.themeId === themeId : false));
  }, [seeds, themeId]);

  const selectThemeId = useCallback(
    (id: string | undefined) => {
      // Optimistically reflect in UI
      setLocalTheme(id);
      onSelectedThemeIdChange?.(id);
    },
    [onSelectedThemeIdChange],
  );
  if (!show) return null;

  return (
    <div
      className={[
        'flex flex-col gap-2 rounded border p-2 text-xs',
        className || '',
      ].join(' ')}
      data-testid="battle-filter-wrapper"
    >
      <div className="flex flex-wrap items-center gap-2">
        <strong>テーマ</strong>
        {showBattleCount && (
          <span className="rounded bg-muted px-2 py-0.5" title="Filtered count">
            {filtered.length}
          </span>
        )}
      </div>
      <div
        className="flex flex-wrap items-center gap-2"
        data-testid="battle-filter-chips"
        aria-label="Theme selection"
      >
        <button
          type="button"
          data-selected={!themeId ? 'true' : 'false'}
          data-testid="battle-filter-chip-all"
          onClick={() => selectThemeId(undefined)}
          className={[
            'rounded-full border px-2 py-0.5 text-[11px] sm:text-xs',
            'transition-colors',
            !themeId
              ? 'bg-muted border-ring ring-2 ring-ring/40'
              : 'bg-muted hover:brightness-105',
          ].join(' ')}
          aria-label="All Themes"
        >
          ALL
        </button>
        {themeOptions.map((t) => {
          const active = themeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              data-selected={active ? 'true' : 'false'}
              data-testid={`battle-filter-chip-${t.id}`}
              onClick={() => selectThemeId(t.id)}
              className={[
                'group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                'transition-shadow',
              ].join(' ')}
              title={t.name}
            >
              <ThemeChip
                themeId={t.id as Battle['themeId']}
                variant="outline"
                showName={false}
                className={[
                  'cursor-pointer transition-colors',
                  active
                    ? 'border-ring ring-2 ring-ring/40'
                    : 'opacity-80 group-hover:opacity-100',
                ].join(' ')}
              />
            </button>
          );
        })}
      </div>
      {showBattleChips && (
        <div
          className="flex flex-wrap gap-2 max-h-48 overflow-auto rounded border p-2"
          data-testid="battle-filter-list"
        >
          {filtered.map((seed) => (
            <BattleTitleChip
              key={seed.file}
              file={seed.file}
              variant="secondary"
              className="truncate"
              showThemeIcon
            />
          ))}
          {filtered.length === 0 && (
            <span
              className="px-2 py-1 text-muted-foreground text-[11px]"
              data-testid="battle-filter-empty"
            >
              No matches
            </span>
          )}
        </div>
      )}
    </div>
  );
}
