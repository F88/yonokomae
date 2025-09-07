import { battleSeedsByFile } from '@yonokomae/data-battle-seeds';
import { battleThemeCatalog } from '@yonokomae/catalog';
import { useMemo, useState } from 'react';
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
  /** Deprecated multi-select props kept for backward compatibility (first element used). */
  selectedThemeIds?: string[]; // deprecated
  onSelectedThemeIdsChange?: (ids: string[]) => void; // deprecated
  show?: boolean;
  className?: string;
};

export function BattleFilter({
  themeIdsFilter,
  selectedThemeId,
  onSelectedThemeIdChange,
  selectedThemeIds, // deprecated
  onSelectedThemeIdsChange, // deprecated
  show = true,
  className,
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
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [themeIdsFilter]);

  const [internalTheme, setInternalTheme] = useState<string | undefined>(
    selectedThemeIds && selectedThemeIds.length > 0
      ? selectedThemeIds[0]
      : undefined,
  );
  const themeId = onSelectedThemeIdChange
    ? selectedThemeId
    : (selectedThemeId ?? internalTheme);

  const themeOptions = useMemo(() => {
    const ids = new Set<string>();
    seeds.forEach((s) => {
      if (s.themeId) ids.add(s.themeId);
    });
    return Array.from(ids)
      .map((id) => {
        const t = battleThemeCatalog.find((tt) => tt.id === id);
        return { id, name: t?.name || id, icon: t?.icon };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [seeds]);

  const filtered = useMemo(() => {
    if (!themeId) return seeds;
    return seeds.filter((s) => (s.themeId ? s.themeId === themeId : false));
  }, [seeds, themeId]);

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
        <strong>Battle Repository Filter (theme)</strong>
        <span className="rounded bg-muted px-2 py-0.5" title="Filtered count">
          {filtered.length}
        </span>
      </div>
      <div
        className="flex flex-wrap items-center gap-2"
        data-testid="battle-filter-chips"
        role="radiogroup"
        aria-label="Theme selection"
      >
        <button
          type="button"
          data-selected={!themeId ? 'true' : 'false'}
          data-testid="battle-filter-chip-all"
          onClick={() => {
            setInternalTheme(undefined);
            if (onSelectedThemeIdChange) onSelectedThemeIdChange(undefined);
            if (onSelectedThemeIdsChange) onSelectedThemeIdsChange([]);
          }}
          className={[
            'rounded-full border px-2 py-0.5 text-[11px] sm:text-xs',
            'transition-colors',
            !themeId
              ? 'bg-primary text-primary-foreground border-primary'
              : 'hover:bg-muted',
          ].join(' ')}
        >
          All
        </button>
        {themeOptions.map((t) => {
          const active = themeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              data-selected={active ? 'true' : 'false'}
              data-testid={`battle-filter-chip-${t.id}`}
              onClick={() => {
                if (onSelectedThemeIdChange) onSelectedThemeIdChange(t.id);
                else setInternalTheme(t.id);
                if (onSelectedThemeIdsChange) onSelectedThemeIdsChange([t.id]);
              }}
              className={[
                'group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                'transition-shadow',
              ].join(' ')}
              title={t.name}
            >
              <ThemeChip
                themeId={t.id as Battle['themeId']}
                variant={active ? 'default' : 'outline'}
                showName={true}
                className={[
                  'cursor-pointer',
                  active
                    ? 'ring-2 ring-primary/70'
                    : 'opacity-80 group-hover:opacity-100',
                ].join(' ')}
              />
            </button>
          );
        })}
      </div>
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
    </div>
  );
}
