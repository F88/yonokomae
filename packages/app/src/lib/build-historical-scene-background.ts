/**
 * @file HistoricalScene background builder and related types.
 *
 * This module centralizes how the decorative background for the
 * `HistoricalScene` component is described and constructed. It intentionally
 * separates the scene-level background (an image layer rendered behind the
 * entire card content) from the card-level background propagated to
 * `NetaCard` via `Field`.
 *
 * Design goals:
 * - Provide a single place to evolve heuristics (e.g., pick different images
 *   by theme or significance) without touching component code.
 * - Use explicit rendering intent (`hasImage`) rather than inferring solely
 *   from URL presence, to keep tests and behavior unambiguous.
 * - Allow scene background and per-card background to be toggled
 *   independently.
 * - Prefer class-based styling instructions (e.g. `opacity-10`) over numeric
 *   values to avoid Tailwind JIT rounding/purging pitfalls.
 *
 * Reduced Motion (RM): Callers should skip invoking the builder when RM is
 * active (e.g. `const bg = rm ? null : buildHistoricalSceneBackground(...)`).
 * This keeps decorative layers and shimmer effects disabled consistently.
 *
 * Tailwind notes:
 * - When emitting dynamic classes (e.g. `opacity-10`, `aspect-[16/7]`), make
 *   sure your Tailwind config safelists the patterns used by strategies so
 *   that classes are generated in production.
 */
import type { Battle } from '@yonokomae/types';

/**
 * Background configuration forwarded to `Field` and then to `NetaCard`.
 *
 * This shape controls the optional decorative image layer rendered inside
 * each card (Yono/Komae). It is distinct from the scene-level background
 * that spans the entire `HistoricalScene` container.
 */
export type NetaCardBackground = {
  /**
   * Optional background image URL for the card layer. When omitted or an empty
   * string, the card renders with its default surface styling only.
   */
  imageUrl?: string;
  /**
   * Optional Tailwind opacity utility class (e.g., `opacity-20`).
   *
   * Rationale: We intentionally do not carry numeric opacity here. The
   * strategy should decide the exact class string so that the UI layer can
   * apply it directly without mapping or rounding. This avoids Tailwind JIT
   * step rounding and class purging issues.
   */
  opacityClass?: string;
  /**
   * Enables a mild backdrop blur on top of the image layer to improve text
   * legibility against busy images. When `true`, a small blur is applied.
   */
  backdropBlur?: boolean;
};

/**
 * Foreground image settings for `NetaCard` (optional alternative shape).
 *
 * Mirrors the minimal shape used for card backgrounds so callers can express
 * foreground image controls in a consistent way if needed.
 */
export type NetaCardImage = {
  imageUrl?: string;
  /**
   * Optional Tailwind opacity utility class (e.g., `opacity-10`).
   *
   * Rationale: Numeric opacity was removed to keep rendering deterministic
   * and to align with Tailwind's utility-first approach. Strategies should
   * provide a ready-to-use class string, and renderers should prefer it.
   */
  opacityClass?: string;
  /** Apply a mild backdrop blur overlay for readability. */
  backdropBlur?: boolean;
};

/**
 * Configuration for the `HistoricalScene` decorative background layer.
 *
 * The scene background is a single image layer rendered behind all card
 * content inside `HistoricalScene`. Its presence is controlled by an explicit
 * boolean flag rather than the implicit existence of a URL.
 */
export type HistoricalSceneBackground = {
  /**
   * Explicit rendering intent for the scene image layer.
   *
   * - `true`: the scene should render an image using `sceneBgUrl`.
   * - `false`: the scene should not render the decorative image layer even if
   *   a URL is provided (future heuristics may compute a URL but decide not to
   *   render).
   */
  hasImage: boolean;
  /**
   * Optional URL for the scene background image. When `hasImage === true`, the
   * renderer will use this URL to display the image behind content.
   */
  sceneBgUrl?: string;
  /** Tailwind opacity utilities, e.g. 'opacity-30 sm:opacity-40' */
  opacityClass: string;
  /** HistoricalScene overlay blur toggle */
  blur: boolean;
  /** Optional foreground image settings forwarded to Field -> NetaCard */
  netaCardImage?: NetaCardImage;
  /** Optional: background settings forwarded to Field -> NetaCard */
  netaCardBackground?: NetaCardBackground;
};

/** Context passed to a background selection strategy. Extend conservatively. */
export type BackgroundContext = {
  /** Optional play mode id used for themeing (future use). */
  modeId?: string;
  /** Coarse viewport hint for opacity/blur tuning (future use). */
  viewport?: 'mobile' | 'desktop';
  /** Whether the scene is in cropped top banner mode (future use). */
  cropTopBanner?: boolean;
  /** Feature flags for experiments (future use). */
  flags?: Record<string, boolean>;
};

/** Strategy function that selects a scene/card background given inputs. */
export type BackgroundStrategy = (
  battle?: Battle | null,
  context?: BackgroundContext,
) => HistoricalSceneBackground;

/**
 * Default, hardcoded strategy (暫定)。
 *
 * 現状の方針:
 * - 基本は装飾背景なし(安全フォールバック)
 * - battle.significance が 'legendary' のときのみ、決定的(擬似ランダム)に
 *   公開アセットから1枚選択してシーン背景に適用
 * - RM 対応は呼び出し側(HistoricalScene)で行う
 *
 * 将来拡張:
 * - 画像候補の追加やテーマ別分岐、コンテキスト(viewport 等)によるゲーティング
 * - resolveAsset の導入
 *
 * スタイリングに関する注意:
 * - 透過度などは numeric 値ではなく Tailwind の utility class をこの戦略から
 *   直接返す(opacityClass)ことで、JIT の丸めやパージ問題を回避します。
 * - 本ファイルの型は numeric opacity を持ちません。必要な表示は
 *   `opacityClass` に確定値(例: 'opacity-10')を設定してください。
 */
const LEGENDARY_IMAGES = [
  // Served from packages/app/public at the app base URL
  'showdown-on-the-great-river.png',
  'crossroads-of-destiny.png',
] as const;

function seededIndex(seed: string, mod: number): number {
  // Simple deterministic hash (djb2-ish). Not cryptographic.
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) + h + seed.charCodeAt(i);
    h |= 0; // force 32-bit
  }
  const n = Math.abs(h);
  return mod > 0 ? n % mod : 0;
}

const defaultSceneBackgroundStrategy: BackgroundStrategy = (battle) => {
  const isLegendary = battle?.significance === 'legendary';

  if (isLegendary) {
    const idx = seededIndex(battle?.id ?? '', LEGENDARY_IMAGES.length);
    const picked = LEGENDARY_IMAGES[idx] ?? LEGENDARY_IMAGES[0];
    // Respect Vite base path; import.meta.env.BASE_URL always ends with '/'
    const base = import.meta.env.BASE_URL ?? '/';
    const url = `${base}${picked.replace(/^\//, '')}`;

    const netaCardImage: NetaCardImage = {
      // imageUrl: `${base}/icon.png`,
      opacityClass: 'opacity-20',
      // backdropBlur: true,
    };

    const netaCardBackground: NetaCardBackground = {
      // imageUrl: url,
      // imageUrl: 'ykw-icon-4.png',
      opacityClass: 'opacity-20',
      // backdropBlur: true,
    };

    return {
      hasImage: true,
      sceneBgUrl: url,
      opacityClass: 'opacity-30',
      blur: false,
      netaCardImage: netaCardImage,
      netaCardBackground: netaCardBackground,
    };
  }

  // Fallback: no decorative scene background
  return {
    hasImage: false,
    sceneBgUrl: undefined,
    opacityClass: 'opacity-30 sm:opacity-40',
    blur: false,
    netaCardBackground: undefined,
    netaCardImage: undefined,
  };
};

/**
 * Build decorative background settings for the HistoricalScene.
 *
 * Current behavior: No background image by default. The function is the single
 * place where future heuristics should be implemented (e.g., based on
 * battle.themeId or significance).
 *
 * @remarks
 * - This function does not itself read reduced-motion preferences. The caller
 *   (e.g., `HistoricalScene`) is expected to skip invoking the builder when
 *   reduced motion is active.
 * - The result intentionally distinguishes between `hasImage` and
 *   `sceneBgUrl`: a URL may exist while rendering remains off.
 *
 * @param battle Optional battle used for future heuristic-based image
 *   selection (theme, significance, etc.). Currently unused.
 * @param options Optional strategy and context to influence selection.
 * @returns A complete `HistoricalSceneBackground` object with conservative
 *   defaults (no scene image, no card background).
 *
 * @example
 * // Inside HistoricalScene
 * const bg = reducedMotion
 *   ? null
 *   : buildHistoricalSceneBackground(battle, { context: { cropTopBanner } });
 * return (
 *   bg?.hasImage && bg.sceneBgUrl ? <img src={bg.sceneBgUrl} alt="" /> : null
 * );
 */
export function buildHistoricalSceneBackground(
  battle?: Battle | null,
  options?: { strategy?: BackgroundStrategy; context?: BackgroundContext },
): HistoricalSceneBackground {
  const strategy = options?.strategy ?? defaultSceneBackgroundStrategy;
  return strategy(battle, options?.context);
}
