import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { battleSeedsByFile } from '@yonokomae/data-battle-seeds';
import type { PlayMode } from '@/yk/play-mode';
import { playMode as defaultPlayModes } from '@/yk/play-mode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyChip } from '@/components/KeyChip';
import { isEditable } from '@/lib/dom-utils';
import { BattleSeedSelector } from '@/components/BattleSeedSelector';
import { BattleFilter } from '@/components/BattleFilter';

// ---------------------------------------------------------------------------
// Batched debug logging helper
// 目的: 短時間に大量の console 出力でブラウザ/端末がログを切り捨てたり順序崩壊するのを防ぐ。
// 方針: 呼び出し毎にバッファへ push → setTimeout(0) / フレーム終端でまとめて1行(JSON)出力。
// メリット: 出力量(行数)を大幅削減し時系列も保持。欠点: リアルタイム性わずかに低下。
// 必要なら FLUSH_INTERVAL_MS や IMMEDIATE_FLUSH_COUNT を調整。
// ---------------------------------------------------------------------------
interface DebugEntry {
  label: string;
  tsMs: number;
  tsISO: string;
  data?: unknown;
}

interface AggregatedEntry {
  label: string;
  count: number;
  firstTsMs: number;
  lastTsMs: number;
  firstTsISO: string;
  lastTsISO: string;
  data?: unknown; // representative (first)
}

const LOG_BATCHING_ENABLED = true;
const IMMEDIATE_FLUSH_COUNT = 25; // これを超えたら即フラッシュ
const MAX_BATCH_SIZE = 200; // これを超えそうなら切り分けて出力
const FLUSH_INTERVAL_MS = 0; // 0 → setTimeout(0) 相当 (フレーム終端)
const NAV_BATCH_IDLE_MS = 300; // 連続キー操作終了とみなすアイドル時間 (長めにしてまとめ率向上)
const NAV_MIN_LOGGED_STEPS = 2; // これ未満の移動はノイズとして summary を出さない
let debugBuffer: DebugEntry[] = [];
let flushScheduled = false;

const flushDebugLogs = () => {
  if (!LOG_BATCHING_ENABLED) return;
  if (debugBuffer.length === 0) {
    flushScheduled = false;
    return;
  }
  const batch = debugBuffer;
  debugBuffer = [];
  flushScheduled = false;
  const emit = (slice: DebugEntry[], part?: number, parts?: number) => {
    if (slice.length === 0) return;
    // 集約: 連続し、label + data(安定化JSON) が同一のものをまとめ count++
    const aggregated: AggregatedEntry[] = [];
    let prevKey: string | undefined;
    for (const entry of slice) {
      let dataKey = '';
      if (entry.data !== undefined) {
        try {
          dataKey = JSON.stringify(entry.data);
        } catch {
          dataKey = '[unserializable]';
        }
      }
      const key = entry.label + '|' + dataKey;
      if (aggregated.length > 0 && key === prevKey) {
        const agg = aggregated[aggregated.length - 1];
        if (agg) {
          agg.count += 1;
          agg.lastTsMs = entry.tsMs;
          agg.lastTsISO = entry.tsISO;
        }
      } else {
        aggregated.push({
          label: entry.label,
          count: 1,
          firstTsMs: entry.tsMs,
          lastTsMs: entry.tsMs,
          firstTsISO: entry.tsISO,
          lastTsISO: entry.tsISO,
          data: entry.data,
        });
        prevKey = key;
      }
    }
    const first = slice[0];
    const last = slice[slice.length - 1];
    try {
      console.log(
        '[DEBUG][BATCH]',
        JSON.stringify({
          part,
          parts,
          rawCount: slice.length,
          aggregatedCount: aggregated.reduce((a, b) => a + b.count, 0),
          uniqueSequences: aggregated.length,
          tsFirst: first?.tsISO,
          tsLast: last?.tsISO,
          items: aggregated,
        }),
      );
    } catch {
      console.log('[DEBUG][BATCH][FALLBACK]', { slice, aggregated });
    }
  };

  if (batch.length > MAX_BATCH_SIZE) {
    const parts = Math.ceil(batch.length / MAX_BATCH_SIZE);
    for (let i = 0; i < batch.length; i += MAX_BATCH_SIZE) {
      const slice = batch.slice(i, i + MAX_BATCH_SIZE);
      emit(slice, i / MAX_BATCH_SIZE + 1, parts);
    }
  } else {
    emit(batch, 1, 1);
  }
};

// Visibility 変化やページ離脱前に残りを吐き出す
if (typeof window !== 'undefined') {
  const finalFlush = () => flushDebugLogs();
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') finalFlush();
  });
  window.addEventListener('pagehide', finalFlush);
  window.addEventListener('beforeunload', finalFlush);
}

const scheduleFlush = () => {
  if (flushScheduled) return;
  flushScheduled = true;
  setTimeout(flushDebugLogs, FLUSH_INTERVAL_MS);
};

// Public debug log function (同じシグネチャ維持)
const debugLog = (label: string, payload?: unknown) => {
  // テスト環境などで一括抑止したい場合は LOG_BATCHING_ENABLED を false に
  const now = Date.now();
  const entry: DebugEntry = {
    label,
    tsMs: now,
    tsISO: new Date(now).toISOString(),
    data: payload,
  };
  if (!LOG_BATCHING_ENABLED) {
    // フォールバック: 旧逐次出力
    try {
      console.log('[DEBUG][NO-BATCH]', label, entry);
    } catch {
      console.log('[DEBUG][NO-BATCH][FALLBACK]', label, payload);
    }
    return;
  }
  debugBuffer.push(entry);
  if (debugBuffer.length >= IMMEDIATE_FLUSH_COUNT) {
    flushDebugLogs();
    return;
  }
  scheduleFlush();
};

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
  // Detect touch-capable (iPad/iPhone etc.)
  const isTouchDevice = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    // Prefer maxTouchPoints for modern iPadOS (desktop UA でも区別可能)
    if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0)
      return true;
    const ua = navigator.userAgent;
    return /iP(ad|hone|od)|Android|Mobile|Tablet|Touch/i.test(ua);
  }, []);

  // Store last pointer Y so change-based fallback can still use coordinate correction path
  const lastPointerYRef = useRef<number | undefined>(undefined);
  const selectGuardRef = useRef<number | undefined>(undefined); // timestamp to suppress double fire
  const lastConfirmSourceRef = useRef<string | undefined>(undefined);

  const confirmSelect = useCallback(
    (y: number | undefined, source: string) => {
      const now = performance.now();
      selectGuardRef.current = now;
      lastConfirmSourceRef.current = source;
      debugLog('[DEBUG] ModeOption confirmSelect:', {
        modeId: mode.id,
        source,
        usedY: y,
        isSelectedProp: isSelected,
      });
      onSelect(mode, y);
    },
    [mode, onSelect, isSelected],
  );

  const handlePointerDown: React.PointerEventHandler<HTMLLabelElement> = (
    e,
  ) => {
    if (e.pointerType === 'touch') {
      lastPointerYRef.current = e.clientY;
    }
  };

  // Fallback: some iPad Safari cases suppress label click; ensure confirmation on pointerup
  const handlePointerUp: React.PointerEventHandler<HTMLLabelElement> = (e) => {
    if (!isTouchDevice) return;
    if (mode.enabled === false) return;
    const now = performance.now();
    if (selectGuardRef.current && now - selectGuardRef.current < 120) {
      return; // already confirmed very recently
    }
    // Always confirm on pointerup if not yet confirmed (prop may not have updated yet)
    confirmSelect(lastPointerYRef.current ?? e.clientY, 'pointerup-fallback');
  };

  const handleClick: React.MouseEventHandler<HTMLLabelElement> = (e) => {
    debugLog('[DEBUG] ModeOption handleClick START:', {
      componentModeId: mode.id,
      componentModeTitle: mode.title,
      clickY: e.clientY,
      eventType: e.type,
    });

    // If we already selected via touch change fallback very recently, skip duplicate
    const now = performance.now();
    if (selectGuardRef.current && now - selectGuardRef.current < 120) {
      debugLog('[DEBUG] ModeOption click skipped (guard):', {
        modeId: mode.id,
      });
      return;
    }

    if (mode.enabled === false) return;

    // Pass click Y coordinate for iOS WebKit position-based fix
    confirmSelect(e.clientY, 'click');
    debugLog('[DEBUG] ModeOption handleClick END:', {
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
      // Touch 環境では label+radio の最初のタップで click が遅延/抑止され確定しない事象対策として
      // change (選択) のタイミングで確定も行う。重複防止ガードで click 2重発火を抑制。
      if (isTouchDevice) {
        confirmSelect(lastPointerYRef.current, 'change-auto');
        // 追加保証: microtask で click 未発火なら再確認
        queueMicrotask(() => {
          const now = performance.now();
          if (selectGuardRef.current && now - selectGuardRef.current < 60)
            return;
          confirmSelect(lastPointerYRef.current, 'change-microtask-fallback');
        });
      }
    }
  };

  return (
    <label
      key={mode.id}
      data-mode-id={mode.id}
      htmlFor={inputId}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
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
    debugLog('[DEBUG] *** VERSION: 2025-09-08-v5 - DEPLOY CHECK ***');
    debugLog(
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

  // (moved) summary effect placed after all dependent variables are declared
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
  // ---------------------------------------------------------------------
  // Aggregated navigation logging (batch rapid index changes into 1 line)
  // ---------------------------------------------------------------------
  const navBatchRef = useRef<
    | {
        startIndex: number;
        lastIndex: number;
        path: number[];
        startTs: number;
        timer: number | undefined;
      }
    | undefined
  >(undefined);
  useEffect(() => {
    // 初期化 (初回マウント)
    if (!navBatchRef.current) {
      navBatchRef.current = {
        startIndex: index,
        lastIndex: index,
        path: [index],
        startTs: performance.now(),
        timer: undefined,
      };
      // 初期状態は別途 summary として 1 回だけ出す
      debugLog('[DEBUG] TitleContainer initial state:', {
        optionsCount: options.length,
        optionIds: options.map((o) => o.id),
        index,
        modeId: options[index]?.id,
        showBattleFilter,
        themeId,
      });
      return;
    }
    const batch = navBatchRef.current;
    if (batch.lastIndex !== index) {
      batch.lastIndex = index;
      // 重複連続防止 (理論上不要だが保険)
      if (batch.path[batch.path.length - 1] !== index) batch.path.push(index);
    }
    if (batch.timer !== undefined) window.clearTimeout(batch.timer);
    batch.timer = window.setTimeout(() => {
      const durationMs = performance.now() - batch.startTs;
      const path = batch.path;
      const steps = path.length - 1;
      const uniqueVisited = Array.from(new Set(path)).length;
      // 単独/微小移動は出力抑制 (初回 state は別途初期ログで把握可能)
      if (steps >= NAV_MIN_LOGGED_STEPS) {
        debugLog('[DEBUG] navigation batch summary:', {
          startIndex: batch.startIndex,
          endIndex: batch.lastIndex,
          steps,
          uniqueVisited,
          pathTruncated: path.slice(0, 15),
          truncated: path.length > 15 ? path.length - 15 : 0,
          durationMs: Math.round(durationMs),
          finalModeId: options[batch.lastIndex]?.id,
        });
      }
      // 次回バッチへリセット（最後の状態を開始点として継続）
      navBatchRef.current = {
        startIndex: batch.lastIndex,
        lastIndex: batch.lastIndex,
        path: [batch.lastIndex],
        startTs: performance.now(),
        timer: undefined,
      };
    }, NAV_BATCH_IDLE_MS);
  }, [index, options, showBattleFilter, themeId]);

  // Log option set changes (IDs) separately; hash by join(',')
  const prevOptionIdsRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const ids = options.map((o) => o.id).join(',');
    if (prevOptionIdsRef.current !== ids) {
      debugLog('[DEBUG] options changed summary:', {
        optionsCount: options.length,
        optionIds: options.map((o) => o.id),
      });
      prevOptionIdsRef.current = ids;
    }
  }, [options]);

  // BattleFilter toggle logging (single line per visibility change)
  const prevShowBattleFilterRef = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (prevShowBattleFilterRef.current !== showBattleFilter) {
      if (prevShowBattleFilterRef.current !== undefined) {
        debugLog('[DEBUG] showBattleFilter toggled:', {
          now: showBattleFilter,
          modeId: options[index]?.id,
        });
      }
      prevShowBattleFilterRef.current = showBattleFilter;
    }
  }, [showBattleFilter, options, index]);

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
              const handleModeSelect = (selectedMode: PlayMode) => {
                debugLog('[DEBUG] handleModeSelect called:', {
                  selectedModeId: selectedMode.id,
                  selectedModeTitle: selectedMode.title,
                  currentIndex: index,
                  currentModeId: options[index]?.id,
                  currentModeTitle: options[index]?.title,
                });
                const targetIndex = options.findIndex(
                  (opt) => opt.id === selectedMode.id,
                );
                debugLog('[DEBUG] targetIndex found:', {
                  targetIndex,
                  expectedMode: selectedMode.id,
                  foundMode: options[targetIndex]?.id,
                });
                if (targetIndex >= 0) {
                  setIndex(targetIndex);
                  debugLog('[DEBUG] calling onSelect with:', {
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
                    debugLog('[DEBUG] Parent onSelect received:', {
                      selectedMode: selectedMode.id,
                      clickY,
                      mapIndex,
                    });

                    debugLog('[DEBUG] *** DEPLOYMENT CHECK: 2025-09-08-v4 ***');
                    // Improved iOS-only coordinate-based correction.
                    // Desktopで誤って常に先頭モードになる問題: 旧実装は stale な index を参照して intendedMode を比較していた。
                    // 対策: iOS Safari (タッチ環境) かつ clickY がある場合のみ補正を試み、
                    // 比較対象は "ユーザがクリックした (selectedMode)" と座標最近傍(closestMode)。
                    const nav =
                      typeof navigator !== 'undefined' ? navigator : undefined;
                    const ua = nav?.userAgent ?? '';
                    const platform =
                      nav && 'platform' in nav ? nav.platform : '';
                    const touchPoints =
                      nav && 'maxTouchPoints' in nav ? nav.maxTouchPoints : 0;
                    const isIOS =
                      /iPad|iPhone|iPod/.test(ua) ||
                      (platform === 'MacIntel' && touchPoints > 1);

                    if (process.env.NODE_ENV !== 'test') {
                      debugLog('[DEBUG] environment detection:', {
                        isIOS,
                        platform,
                        touchPoints,
                        uaSnippet: ua.slice(0, 80),
                        viewport: {
                          w:
                            typeof window !== 'undefined'
                              ? window.innerWidth
                              : undefined,
                          h:
                            typeof window !== 'undefined'
                              ? window.innerHeight
                              : undefined,
                        },
                      });
                    }

                    if (
                      isIOS &&
                      typeof clickY === 'number' &&
                      process.env.NODE_ENV !== 'test'
                    ) {
                      debugLog('[DEBUG] iOS coordinate correction start:', {
                        clickY,
                        isIOS,
                        platform,
                        touchPoints,
                      });
                      const modeElements =
                        document.querySelectorAll('[data-mode-id]');
                      let closestMode: PlayMode = selectedMode;
                      let minDistance = Infinity;
                      modeElements.forEach((el) => {
                        const rect = el.getBoundingClientRect();
                        const centerY = rect.top + rect.height / 2;
                        const distance = Math.abs(clickY - centerY);
                        const modeId = el.getAttribute('data-mode-id');
                        if (distance < minDistance) {
                          const found = options.find((o) => o.id === modeId);
                          if (found) {
                            minDistance = distance;
                            closestMode = found;
                          }
                        }
                      });
                      debugLog('[DEBUG] iOS coordinate correction result:', {
                        selectedMode: selectedMode.id,
                        closestMode: closestMode.id,
                        minDistance,
                      });
                      // もし closure 問題等で渡された selectedMode がズレていたら最近傍を採用
                      const finalMode =
                        closestMode.id !== selectedMode.id
                          ? closestMode
                          : selectedMode;
                      handleModeSelect(finalMode);
                    } else {
                      // それ以外 (PC含む) は直接確定
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
