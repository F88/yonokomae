import { battleSeedsByFile } from '@yonokomae/data-battle-seeds';
import { battleThemeCatalog } from '@yonokomae/catalog';
import { useMemo, useState } from 'react';

export type BattleSeedSelectorProps = {
  value?: string;
  onChange: (file: string | undefined) => void;
  show?: boolean; // Parent decides visibility (e.g. dev + mode condition)
  className?: string;
  /** Enable built-in filtering UI (search + theme). Defaults to true for forward compatibility. */
  enableFilters?: boolean;
  /** Controlled search text (optional). */
  searchText?: string;
  onSearchTextChange?: (text: string) => void;
  /** Controlled themeId filter (optional). */
  themeIdFilter?: string;
  onThemeIdFilterChange?: (themeId: string | undefined) => void;
  /** Show underlying battle seed id (battle.id inside the seed) next to the title. */
  showIds?: boolean;
};

/**
 * BattleSeedSelector
 * - Small dev utility to deterministically choose a battle seed file.
 * - Hidden in production (parent passes show=false).
 * - Offers rotate & clear actions for quick cycling.
 */
export function BattleSeedSelector({
  value,
  onChange,
  show = true,
  className,
  enableFilters = true,
  searchText,
  onSearchTextChange,
  themeIdFilter,
  onThemeIdFilterChange,
  showIds = false,
}: BattleSeedSelectorProps) {
  // Build seed metadata once (stable unless battleSeedsByFile changes at build time)
  type SeedMeta = {
    file: string;
    title: string;
    id?: string;
    themeId?: string;
    themeName?: string;
  };
  interface BattleShape {
    id?: string;
    title?: string;
    themeId?: string;
  }
  const themeNameById = useMemo(() => {
    const map = new Map<string, string>();
    battleThemeCatalog.forEach((t) => map.set(t.id, t.name));
    return map;
  }, []);
  const seeds: SeedMeta[] = useMemo(
    () =>
      Object.entries(battleSeedsByFile).map(([file, battle]) => {
        const b = battle as unknown as BattleShape;
        return {
          file,
          title: b.title || file,
          id: b.id,
          themeId: b.themeId,
          themeName: b.themeId ? themeNameById.get(b.themeId) : undefined,
        } satisfies SeedMeta;
      }),
    [themeNameById],
  );

  // Uncontrolled internal states (search/theme), if not externally controlled
  const [internalSearch, setInternalSearch] = useState('');
  const [internalTheme, setInternalTheme] = useState<string | undefined>(
    undefined,
  );
  const effectiveSearch = searchText ?? internalSearch;
  const effectiveTheme = themeIdFilter ?? internalTheme;

  const themeOptions = useMemo(() => {
    // Collect unique themeIds actually present in current seeds, then map to catalog for icon + name
    const uniqueIds = new Set<string>();
    seeds.forEach((s) => {
      if (s.themeId) uniqueIds.add(s.themeId);
    });
    const options = Array.from(uniqueIds).map((id) => {
      const theme = battleThemeCatalog.find((t) => t.id === id);
      return {
        id,
        name: theme?.name ?? id,
        icon: theme?.icon,
      };
    });
    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [seeds]);

  const filtered = useMemo(() => {
    const needle = effectiveSearch.trim().toLowerCase();
    return seeds
      .filter((s) => (effectiveTheme ? s.themeId === effectiveTheme : true))
      .filter((s) =>
        needle
          ? s.title.toLowerCase().includes(needle) ||
            s.file.toLowerCase().includes(needle)
          : true,
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [seeds, effectiveSearch, effectiveTheme]);

  const files = filtered.map((f) => f.file);

  if (!show) return null; // after hooks

  const handleSearchChange = (text: string) => {
    if (onSearchTextChange) onSearchTextChange(text);
    else setInternalSearch(text);
  };
  const handleThemeChange = (theme: string | undefined) => {
    if (onThemeIdFilterChange) onThemeIdFilterChange(theme);
    else setInternalTheme(theme);
  };

  return (
    <div
      className={[
        'mt-2 flex flex-col items-center gap-2 text-xs text-muted-foreground',
        className ?? '',
      ].join(' ')}
      data-testid="battle-seed-selector-wrapper"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span>Battle Seed:</span>
        {enableFilters && (
          <>
            <input
              type="text"
              placeholder="filter by name"
              className="w-32 rounded border px-2 py-1"
              value={effectiveSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Battle seed name filter"
              data-testid="battle-seed-filter-text"
            />
            <select
              className="rounded border px-2 py-1"
              aria-label="Battle seed theme filter"
              value={effectiveTheme ?? ''}
              onChange={(e) => handleThemeChange(e.target.value || undefined)}
              data-testid="battle-seed-filter-theme"
            >
              <option value="">(all themes)</option>
              {themeOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon ? `${t.icon} ${t.name}` : t.name}
                </option>
              ))}
            </select>
          </>
        )}
        <select
          aria-label="Battle seed selector"
          className="rounded border px-2 py-1"
          onChange={(e) => onChange(e.target.value || undefined)}
          value={value ?? ''}
          data-testid="battle-seed-selector"
          disabled={files.length === 0}
        >
          <option value="">(auto)</option>
          {files.map((file) => {
            const meta = seeds.find((s) => s.file === file);
            return (
              <option key={file} value={file}>
                {meta
                  ? `${meta.title}${showIds && meta.id ? ` [${meta.id}]` : ''}`
                  : file}
              </option>
            );
          })}
        </select>
        <button
          type="button"
          className="rounded border px-2 py-1 hover:bg-muted"
          title="Rotate battle seed"
          onClick={() => {
            if (files.length === 0) return;
            const current = value ? files.indexOf(value) : -1;
            const next = (current + 1) % files.length;
            onChange(files[next]);
          }}
          data-testid="battle-seed-rotate"
          disabled={files.length === 0}
        >
          Rotate
        </button>
        {value && (
          <button
            type="button"
            className="rounded border px-2 py-1 hover:bg-muted"
            title="Clear battle seed (random)"
            onClick={() => onChange(undefined)}
            data-testid="battle-seed-clear"
          >
            Clear
          </button>
        )}
        {files.length === 0 && (
          <span
            className="text-muted-foreground"
            data-testid="battle-seed-empty"
          >
            No matches
          </span>
        )}
      </div>
    </div>
  );
}
