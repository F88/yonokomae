import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PublishState } from '@yonokomae/types';

/**
 * Debug Logging Strategy (TitleContainer & ModeOption)
 * ---------------------------------------------------------------------------
 * OVERVIEW
 * This component provides an opt-in, low-noise debug instrumentation system to
 * analyze user interaction on title mode selection (touch vs click paths,
 * coordinate correction on iOS, navigation batching, and selection timing).
 * All debug logic is fully tree-shakeable and excluded from production bundles
 * when not explicitly enabled at build time.
 *
 * GOALS
 * 1. Zero runtime / bundle cost in production (DCE via compile-time env).
 * 2. High-fidelity interaction traces without flooding the console.
 * 3. Compact mode for routine field verification; verbose mode for deep dives.
 * 4. Deterministic, JSON-friendly batch emissions suitable for log ingestion.
 * 5. Simple developer ergonomics: enable by supplying an env flag, no code edits.
 *
 * ENVIRONMENT VARIABLES (evaluated by Vite at build time)
 * - VITE_TITLE_DEBUG=1           Enable debug logging (default off)
 * - VITE_TITLE_DEBUG_MODE=verbose  Use verbose mode (default: compact)
 * - VITE_TITLE_DEBUG_MODE=compact  Explicit compact (optional; default)
 *
 * COMPILE-TIME & TREE SHAKING
 * Vite replaces `import.meta.env.*` with literals. The helper `readBoolEnv`
 * converts values to boolean. When VITE_TITLE_DEBUG is absent the constant
 * `DEBUG_LOG_ENABLED` becomes `false` and the IIFE that defines `debugLog`
 * returns a noop. All guarded branches (if (DEBUG_LOG_ENABLED) { ... }) are
 * then eliminated by minification + dead code elimination (Rollup/esbuild/Terser).
 *
 * MODES
 * - Compact (default): Only emits a summarized selection line (and mandatory
 *   batch meta) capturing essential fields: timing deltas, classification,
 *   coordinate correction, environment, and instanceId.
 * - Verbose: Adds granular per-event diagnostics: pointer down/up, click
 *   guard skips, navigation batch summaries, option set changes, mount/unmount.
 *   All verbose-only emissions are guarded by `IS_VERBOSE`.
 *
 * BATCHING MODEL
 * A lightweight in-memory buffer accumulates debug entries. A microtask-ish
 * timeout (0ms) coalesces bursts. Consecutive identical label+data entries are
 * aggregated (count + first/last timestamps). Emission structure:
 * {
 *   version, part, parts, rawCount, aggregatedCount, uniqueSequences,
 *   tsFirst, tsLast, items: [{ label, count, firstTsMs, lastTsMs, data }]
 * }
 * This is emitted via a single console.log starting with `[DEBUG][BATCH]`.
 *
 * KEY SYMBOLS
 * - VERSION_FOR_TEST: Manual or build-injected version string stamped into
 *   every batch for trace attribution.
 * - DEBUG_LOG_ENABLED / DEBUG_LOG_MODE / IS_VERBOSE: Compile-time flags.
 * - debugLog(): Public logging function (noop when disabled).
 * - emitSelectionSummary(): Emits the unified selection summary line in both
 *   modes (so downstream parsers do not need mode branching).
 *
 * SELECTION SUMMARY FIELDS (compact payload)
 * modeId, source, classification, usedY, pointerMs, guardMs, clickY,
 * mapIndex, isIOS, platform, touchPoints, vp [w,h], minDistance, closest,
 * corrected, targetIndex, finalModeId, instanceId, tsISO.
 *
 * ENABLE / DISABLE WORKFLOW
 * 1. Disabled (default): Build normally; no env flags => all debug code removed.
 * 2. Enable compact:  VITE_TITLE_DEBUG=1 pnpm run dev
 * 3. Enable verbose:  VITE_TITLE_DEBUG=1 VITE_TITLE_DEBUG_MODE=verbose pnpm run dev
 * 4. Production sanity check: grep built dist for "[DEBUG]" / "[BATCH]".
 *
 * VERIFICATION (manual quick check)
 *   # After a production build without the env flag
 *   grep -R "\[DEBUG\]" packages/app/dist || echo "(none)"
 *   grep -R "\[BATCH\]" packages/app/dist || echo "(none)"
 * Should produce no matches when disabled.
 *
 * PERFORMANCE NOTES
 * - When disabled: Only the boolean constants + inert references remain
 *   until minifier phase; final output removes the closure entirely.
 * - When enabled (compact): Extremely low log volume; selection + occasional
 *   batch lines.
 * - When enabled (verbose): Still bounded; navigation batching combines rapid
 *   index changes; repeated identical events are aggregated.
 *
 * TESTING STRATEGY
 * - Unit / integration tests can run with VITE_TITLE_DEBUG unset (fast path).
 * - Snapshot or exploratory tests may re-run with the env flag to verify that
 *   summary shape remains stable (avoid asserting timestamps).
 *
 * EXTENSION GUIDELINES
 * - New debug events: Gate with `if (IS_VERBOSE)` unless absolutely required
 *   for compact mode analytics. Keep labels stable; treat label strings as an
 *   external contract for parsers.
 * - High-frequency instrumentation should aggregate locally or piggyback on
 *   existing batch cycles to avoid console flood.
 * - Do not add dynamic user data (PII) into debug payloads.
 *
 * MIGRATION / CHANGE CONTROL
 * - Changing field names in selection summary is a potential breaking change
 *   for downstream log parsers; document in CHANGELOG with clear rationale.
 *
 * @remarks The design favors deterministic, parse-friendly output while
 * imposing negligible production cost.
 * @see DEBUG_LOG_ENABLED
 * @see DEBUG_LOG_MODE
 * @see debugLog
 */

// ---------------------------------------------------------------------------
// Build / Deployment version identifier (bump manually or inject via build)
// ---------------------------------------------------------------------------
// NOTE: This version will be automatically included in every batched debug log
// object (JSON) and a dedicated first entry will be emitted before any other
// debug entries so that log slices can always be attributed to an exact build.
// If you automate, consider replacing the literal with an env injection.
import { battleSeedsByFile } from '@yonokomae/data-battle-seeds';
import type { PlayMode } from '@/yk/play-mode';
import { playMode as defaultPlayModes } from '@/yk/play-mode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyChip } from '@/components/KeyChip';
import { isEditable } from '@/lib/dom-utils';
import { BattleSeedSelector } from '@/components/BattleSeedSelector';
import { BattleFilter } from '@/components/BattleFilter';

// ---------------------------------------------------------------------------
// Debug logging toggle (compile-time). Set to false to strip logic via DCE.
// NOTE: Setting to false should allow bundler (Vite/Rollup/ESBuild) to drop the
// entire logging closure since only the noop export remains referenced.
// ---------------------------------------------------------------------------
const VERSION_FOR_TEST = '2025-09-09-v1';
// ---------------------------------------------------------------------------
// Production-safe debug toggle strategy
//  - No runtime flag flipping; rely on Vite's compile-time replacement so dead
//    branches are eliminated during minification (tree-shaking + DCE).
//  - Enable by running build/dev with: VITE_TITLE_DEBUG=1 (optionally set
//    VITE_TITLE_DEBUG_MODE=verbose)
//  - In production (no env provided) the value becomes `false` literal.
//  - We intentionally do NOT auto-enable in dev: explicit opt-in keeps the
//    default console clean while still allowing quick activation.
//  - If you ever need to force-on in a specific environment, inject the env
//    variable via your deployment platform build settings.
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readBoolEnv = (v: any): boolean => v === '1' || v === 'true';
// Vite replaces import.meta.env.* at build time; when undefined they become `undefined`.
// Cast through boolean helper so minifier can fold conditions.
const DEBUG_LOG_ENABLED: boolean = readBoolEnv(
  import.meta.env.VITE_TITLE_DEBUG,
);
// Compact vs verbose logging (analysis parity preserved). Default compact.
const DEBUG_LOG_MODE: string =
  (import.meta.env.VITE_TITLE_DEBUG_MODE as string) || 'compact';
const IS_VERBOSE: boolean = DEBUG_LOG_ENABLED && DEBUG_LOG_MODE === 'verbose';

// ---------------------------------------------------------------------------
// Selection summary (compact mode) support
// We accumulate granular instrumentation (from ModeOption.confirmSelect + parent
// onSelect path) into a single concise line when in compact mode so that
// analytical fidelity is preserved while reducing log volume.
// ---------------------------------------------------------------------------
interface PendingSelectionMeta {
  modeId: string;
  source: string;
  classification: string;
  usedY?: number;
  isSelectedProp: boolean;
  pointerElapsedMs?: number;
  guardElapsedSincePrevMs?: number;
  tsMs: number;
}
let pendingSelectionMeta: PendingSelectionMeta | undefined; // module-level (short-lived)

interface SelectionSummaryExtra {
  clickY?: number;
  mapIndex?: number;
  isIOS?: boolean;
  platform?: string;
  touchPoints?: number;
  viewportW?: number;
  viewportH?: number;
  correction?: {
    minDistance?: number;
    closestMode?: string;
    corrected?: boolean;
  };
  targetIndex?: number;
  finalModeId?: string;
  instanceId?: number;
}

const emitSelectionSummary = (extra: SelectionSummaryExtra): void => {
  if (!DEBUG_LOG_ENABLED) return;
  if (!pendingSelectionMeta) return; // nothing to summarize
  const base = pendingSelectionMeta;
  const summary = {
    modeId: base.modeId,
    source: base.source,
    classification: base.classification,
    usedY: base.usedY,
    pointerMs: base.pointerElapsedMs,
    guardMs: base.guardElapsedSincePrevMs,
    clickY: extra.clickY,
    mapIndex: extra.mapIndex,
    isIOS: extra.isIOS,
    platform: extra.platform,
    touchPoints: extra.touchPoints,
    vp:
      extra.viewportW && extra.viewportH
        ? [extra.viewportW, extra.viewportH]
        : undefined,
    minDistance: extra.correction?.minDistance,
    closest: extra.correction?.closestMode,
    corrected: extra.correction?.corrected,
    targetIndex: extra.targetIndex,
    finalModeId: extra.finalModeId,
    instanceId: extra.instanceId,
    tsISO: new Date(base.tsMs).toISOString(),
  };
  // Always emit summary (both modes) so downstream parsing can unify.
  // Guard so the call (and string literal) is fully removed when DEBUG_LOG_ENABLED is false.
  if (DEBUG_LOG_ENABLED) {
    debugLog('[DEBUG] select summary:', summary);
  }
  pendingSelectionMeta = undefined; // reset
};

// Navigation batch constants (used only when enabled)
const NAV_BATCH_IDLE_MS = 300;
const NAV_MIN_LOGGED_STEPS = 2;

// Public debugLog; replaced by noop if disabled so call sites need no guards.
// Implementation isolated in an IIFE for tree-shaking.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debugLog: (label: string, payload?: any) => void = (() => {
  if (!DEBUG_LOG_ENABLED) return () => {};

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
    data?: unknown;
  }
  const IMMEDIATE_FLUSH_COUNT = 25;
  const MAX_BATCH_SIZE = 200;
  const FLUSH_INTERVAL_MS = 0;
  let debugBuffer: DebugEntry[] = [];
  let flushScheduled = false;

  const flushDebugLogs = () => {
    if (debugBuffer.length === 0) {
      flushScheduled = false;
      return;
    }
    const batch = debugBuffer;
    debugBuffer = [];
    flushScheduled = false;
    const emit = (slice: DebugEntry[], part?: number, parts?: number) => {
      if (slice.length === 0) return;
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
            version: VERSION_FOR_TEST,
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

  const scheduleFlush = () => {
    if (flushScheduled) return;
    flushScheduled = true;
    setTimeout(flushDebugLogs, FLUSH_INTERVAL_MS);
  };

  if (typeof window !== 'undefined') {
    const finalFlush = () => flushDebugLogs();
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') finalFlush();
    });
    window.addEventListener('pagehide', finalFlush);
    window.addEventListener('beforeunload', finalFlush);
  }

  return (label: string, payload?: unknown) => {
    const now = Date.now();
    debugBuffer.push({
      label,
      tsMs: now,
      tsISO: new Date(now).toISOString(),
      data: payload,
    });
    if (debugBuffer.length >= IMMEDIATE_FLUSH_COUNT) {
      flushDebugLogs();
      return;
    }
    scheduleFlush();
  };
})();

interface ModeOptionProps {
  mode: PlayMode;
  isSelected: boolean;
  inputId: string;
  onSelect: (mode: PlayMode, clickY?: number) => void;
  onHover: (mode: PlayMode) => void;
  /** If true, include description in SR output (via aria-labelledby chain). */
  srIncludeDescription: boolean;
}

const ModeOption = ({
  mode,
  isSelected,
  inputId,
  onSelect,
  onHover,
  srIncludeDescription,
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
  // Instrumentation refs
  const primaryEventsRef = useRef<{ click: boolean; change: boolean }>({
    click: false,
    change: false,
  });
  const pointerDownAtMsRef = useRef<number | undefined>(undefined);

  // Helper to classify confirmation path for analysis without altering existing source field
  const classifyConfirmation = (
    source: string,
    prim: {
      click: boolean;
      change: boolean;
    },
  ) => {
    if (source.startsWith('pointerup')) {
      if (prim.click || prim.change) return 'pointerup-after-primary';
      return 'pointerup-primary';
    }
    if (source.startsWith('change'))
      return prim.click ? 'change-after-click' : 'change';
    return source;
  };

  const confirmSelect = useCallback(
    (y: number | undefined, source: string) => {
      const now = performance.now();
      const previousGuard = selectGuardRef.current;
      selectGuardRef.current = now;
      lastConfirmSourceRef.current = source;
      const pointerElapsed = pointerDownAtMsRef.current
        ? now - pointerDownAtMsRef.current
        : undefined;
      const primSnapshot = {
        click: primaryEventsRef.current.click,
        change: primaryEventsRef.current.change,
      };
      const classification = classifyConfirmation(source, primSnapshot);
      const guardElapsedSincePrevMs = previousGuard
        ? Math.round(now - previousGuard)
        : undefined;
      const pointerElapsedMs = pointerElapsed
        ? Math.round(pointerElapsed)
        : undefined;
      if (IS_VERBOSE) {
        debugLog('[DEBUG] ModeOption confirmSelect:', {
          modeId: mode.id,
          source,
          classification,
          usedY: y,
          isSelectedProp: isSelected,
          primaryEvents: primSnapshot,
          guardElapsedSincePrevMs,
          pointerElapsedMs,
        });
      }
      // Stash meta for summary emission (even in verbose we also output summary for unified parsing)
      pendingSelectionMeta = {
        modeId: mode.id,
        source,
        classification,
        usedY: y,
        isSelectedProp: isSelected,
        pointerElapsedMs,
        guardElapsedSincePrevMs,
        tsMs: Date.now(),
      };
      onSelect(mode, y);
      // Reset instrumentation for next gesture cycle
      primaryEventsRef.current.click = false;
      primaryEventsRef.current.change = false;
      pointerDownAtMsRef.current = undefined;
    },
    [mode, onSelect, isSelected],
  );

  const handlePointerDown: React.PointerEventHandler<HTMLLabelElement> = (
    e,
  ) => {
    if (e.pointerType === 'touch') {
      lastPointerYRef.current = e.clientY;
      pointerDownAtMsRef.current = performance.now();
    } else {
      pointerDownAtMsRef.current = performance.now();
    }
  };

  // Fallback: some iPad Safari cases suppress label click; ensure confirmation on pointerup
  const handlePointerUp: React.PointerEventHandler<HTMLLabelElement> = (e) => {
    if (!isTouchDevice) return;
    if (mode.enabled === false) return;
    const now = performance.now();
    if (selectGuardRef.current && now - selectGuardRef.current < 120) {
      if (IS_VERBOSE) {
        debugLog('[DEBUG] ModeOption pointerup skipped (guard):', {
          modeId: mode.id,
          guardAgeMs: Math.round(now - selectGuardRef.current),
        });
      }
      return; // already confirmed very recently
    }
    // Always confirm on pointerup if not yet confirmed (prop may not have updated yet)
    confirmSelect(lastPointerYRef.current ?? e.clientY, 'pointerup-fallback');
  };

  const handleClick: React.MouseEventHandler<HTMLLabelElement> = (e) => {
    if (IS_VERBOSE) {
      debugLog('[DEBUG] ModeOption handleClick START:', {
        componentModeId: mode.id,
        componentModeTitle: mode.title,
        clickY: e.clientY,
        eventType: e.type,
        enabled: mode.enabled !== false,
      });
    }

    // If we already selected via touch change fallback very recently, skip duplicate
    const now = performance.now();
    if (selectGuardRef.current && now - selectGuardRef.current < 120) {
      if (IS_VERBOSE) {
        debugLog('[DEBUG] ModeOption click skipped (guard):', {
          modeId: mode.id,
        });
      }
      return;
    }

    if (mode.enabled === false) return;

    // Pass click Y coordinate for iOS WebKit position-based fix
    primaryEventsRef.current.click = true; // instrumentation
    confirmSelect(e.clientY, 'click');
    if (IS_VERBOSE) {
      debugLog('[DEBUG] ModeOption handleClick END:', {
        modeId: mode.id,
        modeTitle: mode.title,
      });
    }
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
        primaryEventsRef.current.change = true; // instrumentation
        confirmSelect(lastPointerYRef.current, 'change-auto');
        // 追加保証: microtask で click 未発火なら再確認
        queueMicrotask(() => {
          const now = performance.now();
          if (selectGuardRef.current && now - selectGuardRef.current < 60)
            return;
          primaryEventsRef.current.change = true; // still true
          confirmSelect(lastPointerYRef.current, 'change-microtask-fallback');
        });
      }
    }
  };

  // Provide explicit SR-only nodes to fully control what is spoken.
  // This avoids duplication some SRs produce when combining aria-label + label text.
  const srLabelId = `${inputId}-sr-label`;
  const srDescId = `${inputId}-sr-desc`;
  const ariaLabelledBy = srIncludeDescription
    ? `${srLabelId} ${srDescId}`
    : srLabelId;
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
      <span id={srLabelId} className="sr-only">
        {mode.srLabel}
        {mode.enabled === false ? ' (無効)' : ''}
      </span>
      {srIncludeDescription && (
        <span id={srDescId} className="sr-only">
          {mode.description}
        </span>
      )}
      <input
        id={inputId}
        type="radio"
        name="play-mode"
        className="sr-only"
        disabled={mode.enabled === false}
        checked={isSelected}
        onChange={handleChange}
        aria-labelledby={ariaLabelledBy}
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
      <div className="flex min-w-0 flex-col" aria-hidden="true">
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
  /** Selected publishState (undefined => all states). Mirrors BattleFilter pass-through. */
  selectedPublishState?: PublishState;
  /** Notify parent when the active publishState filter changes. */
  onSelectedPublishStateChange?: (state: PublishState | undefined) => void;
  /** Include description text in SR announcement (default false = srLabel only). */
  srIncludeDescription?: boolean;
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
  selectedPublishState,
  onSelectedPublishStateChange,
  srIncludeDescription = false,
}: TitleContainerProps) {
  // -------------------------------------------------------------------
  // Instance tracking for remount diagnostics
  // -------------------------------------------------------------------
  // Simpler: monotonic counter kept in module via closure
  // (We cannot rely on static because of bundlers; emulate with outer variable)
  // We'll attach an incrementing number stored on window (dev only) to survive fast refresh.
  const instanceId = useMemo(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error debug slot
      if (!window.__YK_TITLE_CONTAINER_COUNTER__) {
        // @ts-expect-error debug slot
        window.__YK_TITLE_CONTAINER_COUNTER__ = 1;
      } else {
        // @ts-expect-error debug slot
        window.__YK_TITLE_CONTAINER_COUNTER__ += 1;
      }
      // @ts-expect-error debug slot
      return window.__YK_TITLE_CONTAINER_COUNTER__ as number;
    }
    return Math.floor(Math.random() * 1_000_000);
  }, []);
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
    // Removed per-render VERSION/options logs; version is included in batched header.
    // Options change is still logged via the dedicated effect (options changed summary).
    return modes ?? defaultPlayModes;
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

  // -------------------------------------------------------------------
  // publishState filter pass-through (mirrors theme filtering pattern)
  // -------------------------------------------------------------------
  const [internalPublishState, setInternalPublishState] = useState<
    PublishState | undefined
  >(undefined);
  const publishState =
    selectedPublishState !== undefined
      ? selectedPublishState
      : internalPublishState;
  const updatePublishState = useCallback(
    (state: PublishState | undefined) => {
      if (selectedPublishState === undefined) {
        setInternalPublishState(state);
      }
      onSelectedPublishStateChange?.(state);
    },
    [selectedPublishState, onSelectedPublishStateChange],
  );

  // If currently selected battle seed becomes incompatible with active publishState, clear it.
  useEffect(() => {
    if (!publishState || !effectiveBattleSeedFile) return;
    const seed = battleSeedsByFile[effectiveBattleSeedFile] as
      | { publishState?: PublishState }
      | undefined;
    const seedState = seed?.publishState ?? 'published';
    if (seedState !== publishState) {
      updateBattleSeedFile(undefined);
    }
  }, [publishState, effectiveBattleSeedFile, updateBattleSeedFile]);

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
      // Track that this navigation originated from keyboard to enable focus management
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
        lastNavViaKeyboardRef.current = true;
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
        lastNavViaKeyboardRef.current = true;
        return true;
      }
      if (key === 'Home') {
        setIndex(() => {
          const idx = options.findIndex((o) => o.enabled !== false);
          return idx >= 0 ? idx : 0;
        });
        lastNavViaKeyboardRef.current = true;
        return true;
      }
      if (key === 'End') {
        setIndex(() => {
          for (let i = options.length - 1; i >= 0; i--) {
            if (options[i]?.enabled !== false) return i;
          }
          return 0;
        });
        lastNavViaKeyboardRef.current = true;
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
  // ---------------------------------------------------------------
  // Keyboard focus management for accessibility
  // ---------------------------------------------------------------
  // Screen readers announce the focused control. With custom keyboard navigation
  // we change index state without moving DOM focus. We focus the active radio
  // input (visually hidden but accessible) after keyboard-driven index changes.
  const lastNavViaKeyboardRef = useRef(false);
  useEffect(() => {
    if (!lastNavViaKeyboardRef.current) return; // only when navigation came from keyboard
    const active = options[index];
    if (!active) return;
    const id = `play-mode-${active.id}`;
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) {
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
    }
    // Reset flag so pointer interactions won't immediately refocus.
    lastNavViaKeyboardRef.current = false;
  }, [index, options]);
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
      if (IS_VERBOSE) {
        debugLog('[DEBUG] TitleContainer initial state:', {
          optionsCount: options.length,
          optionIds: options.map((o) => o.id),
          index,
          modeId: options[index]?.id,
          showBattleFilter,
          themeId,
          instanceId,
        });
        debugLog('[DEBUG] TitleContainer instance mount:', { instanceId });
      }
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
        if (IS_VERBOSE) {
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
  }, [index, options, showBattleFilter, themeId, instanceId]);

  // Log option set changes (IDs) separately; hash by join(',')
  const prevOptionIdsRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const ids = options.map((o) => o.id).join(',');
    if (prevOptionIdsRef.current !== ids) {
      if (IS_VERBOSE) {
        debugLog('[DEBUG] options changed summary:', {
          optionsCount: options.length,
          optionIds: options.map((o) => o.id),
        });
      }
      prevOptionIdsRef.current = ids;
    }
  }, [options]);

  // BattleFilter toggle logging (single line per visibility change)
  const prevShowBattleFilterRef = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (prevShowBattleFilterRef.current !== showBattleFilter) {
      if (prevShowBattleFilterRef.current !== undefined) {
        if (IS_VERBOSE) {
          debugLog('[DEBUG] showBattleFilter toggled:', {
            now: showBattleFilter,
            modeId: options[index]?.id,
          });
        }
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

  // Unmount logging for remount diagnostics
  useEffect(() => {
    return () => {
      if (IS_VERBOSE) {
        debugLog('[DEBUG] TitleContainer unmount:', { instanceId });
      }
    };
  }, [instanceId]);

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
            publishStateFilter={publishState}
            onPublishStateFilterChange={(s) => updatePublishState(s)}
          />

          {/* BattleFilter: Shows when 'historical-research' mode is selected (production + dev) */}
          <BattleFilter
            show={showBattleFilter}
            showBattleChips={import.meta.env.DEV}
            showBattleCount={import.meta.env.DEV}
            themeIdsFilter={undefined}
            selectedThemeId={poolThemes[0]}
            onSelectedThemeIdChange={(id) => updateTheme(id)}
            selectedPublishState={publishState}
            onSelectedPublishStateChange={(s) => updatePublishState(s)}
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
                if (IS_VERBOSE) {
                  debugLog('[DEBUG] handleModeSelect called:', {
                    selectedModeId: selectedMode.id,
                    selectedModeTitle: selectedMode.title,
                    currentIndex: index,
                    currentModeId: options[index]?.id,
                    currentModeTitle: options[index]?.title,
                  });
                }
                // Pointer/click selection should suppress the next keyboard focus push.
                lastNavViaKeyboardRef.current = false;
                const targetIndex = options.findIndex(
                  (opt) => opt.id === selectedMode.id,
                );
                if (IS_VERBOSE) {
                  debugLog('[DEBUG] targetIndex found:', {
                    targetIndex,
                    expectedMode: selectedMode.id,
                    foundMode: options[targetIndex]?.id,
                  });
                }
                if (targetIndex >= 0) {
                  setIndex(targetIndex);
                  if (IS_VERBOSE) {
                    debugLog('[DEBUG] calling onSelect with:', {
                      modeId: selectedMode.id,
                      modeTitle: selectedMode.title,
                    });
                  }
                  onSelect(selectedMode);
                  // Test instrumentation: count confirmed selections (dev/test only)
                  if (
                    (import.meta.env.DEV || process.env.NODE_ENV === 'test') &&
                    typeof window !== 'undefined'
                  ) {
                    // @ts-expect-error test counter slot
                    window.__YK_TEST_ONSELECT_COUNT__ =
                      // @ts-expect-error test counter slot
                      (window.__YK_TEST_ONSELECT_COUNT__ || 0) + 1;
                  }
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
                  srIncludeDescription={srIncludeDescription}
                  onSelect={(selectedMode, clickY) => {
                    if (IS_VERBOSE) {
                      debugLog('[DEBUG] Parent onSelect received:', {
                        selectedMode: selectedMode.id,
                        clickY,
                        mapIndex,
                      });
                    }
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

                    if (process.env.NODE_ENV !== 'test' && IS_VERBOSE) {
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

                    let correction:
                      | {
                          minDistance?: number;
                          closestMode?: string;
                          corrected?: boolean;
                        }
                      | undefined;
                    if (
                      isIOS &&
                      typeof clickY === 'number' &&
                      process.env.NODE_ENV !== 'test'
                    ) {
                      if (IS_VERBOSE) {
                        debugLog('[DEBUG] iOS coordinate correction start:', {
                          clickY,
                          isIOS,
                          platform,
                          touchPoints,
                        });
                      }
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
                      if (IS_VERBOSE) {
                        debugLog('[DEBUG] iOS coordinate correction result:', {
                          selectedMode: selectedMode.id,
                          closestMode: closestMode.id,
                          minDistance,
                        });
                      }
                      // もし closure 問題等で渡された selectedMode がズレていたら最近傍を採用
                      const finalMode =
                        closestMode.id !== selectedMode.id
                          ? closestMode
                          : selectedMode;
                      correction = {
                        minDistance,
                        closestMode: closestMode.id,
                        corrected: finalMode.id !== selectedMode.id,
                      };
                      handleModeSelect(finalMode);
                      emitSelectionSummary({
                        clickY,
                        mapIndex,
                        isIOS,
                        platform,
                        touchPoints,
                        viewportW:
                          typeof window !== 'undefined'
                            ? window.innerWidth
                            : undefined,
                        viewportH:
                          typeof window !== 'undefined'
                            ? window.innerHeight
                            : undefined,
                        correction,
                        targetIndex: options.findIndex(
                          (o) => o.id === selectedMode.id,
                        ),
                        finalModeId: correction?.corrected
                          ? correction.closestMode
                          : selectedMode.id,
                        instanceId,
                      });
                    } else {
                      // それ以外 (PC含む) は直接確定
                      handleModeSelect(selectedMode);
                      emitSelectionSummary({
                        clickY,
                        mapIndex,
                        isIOS,
                        platform,
                        touchPoints,
                        viewportW:
                          typeof window !== 'undefined'
                            ? window.innerWidth
                            : undefined,
                        viewportH:
                          typeof window !== 'undefined'
                            ? window.innerHeight
                            : undefined,
                        correction,
                        targetIndex: options.findIndex(
                          (o) => o.id === selectedMode.id,
                        ),
                        finalModeId: selectedMode.id,
                        instanceId,
                      });
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
