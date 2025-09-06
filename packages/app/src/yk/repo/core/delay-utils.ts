/**
 * Delay utility functions for repository implementations.
 *
 * **Purpose**:
 * - Provides configurable artificial delays to simulate realistic processing times
 * - Supports both single value and range-based delays
 * - Includes safety limits and test environment detection
 *
 * **Usage**:
 * Repository implementations can use these utilities to add realistic latency
 * for better UX demonstration while maintaining fast test execution.
 */

export type DelayOption = number | { min: number; max: number };

const MAX_DELAY_MS = 5_000; // 5 seconds

/**
 * Detect if running in test environment to skip delays.
 * @returns True if NODE_ENV is 'test'
 */
function isTestEnv(): boolean {
  type Env = { NODE_ENV?: string };
  const env: Env | undefined =
    typeof process !== 'undefined'
      ? (process as unknown as { env?: Env }).env
      : undefined;
  return env?.NODE_ENV === 'test';
}

/**
 * Sleep for specified milliseconds with AbortSignal support.
 * @param ms Milliseconds to sleep
 * @param signal Optional AbortSignal for cancellation
 */
export async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted)
      return reject(new DOMException('Aborted', 'AbortError'));
    const id = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

/**
 * Compute delay milliseconds from DelayOption with safety limits.
 *
 * **Features**:
 * - Accepts single number or {min, max} range
 * - Caps delays at MAX_DELAY_MS (10 seconds)
 * - Warns when capping is applied
 * - Clamps negative values to 0
 *
 * @param option Delay configuration
 * @returns Computed delay in milliseconds
 */
export function computeDelayMs(option?: DelayOption): number {
  if (!option) return 0;
  if (typeof option === 'number') {
    let v = Math.max(0, Math.floor(option));
    if (v > MAX_DELAY_MS) {
      console.warn(
        `[DelayUtils] Delay capped at ${MAX_DELAY_MS}ms (requested: ${v}ms)`,
      );
      v = MAX_DELAY_MS;
    }
    return v;
  }
  // Object form { min, max }
  let min = Math.max(0, Math.floor(option.min));
  let max = Math.max(min, Math.floor(option.max));
  const needCap = min > MAX_DELAY_MS || max > MAX_DELAY_MS;
  if (needCap) {
    const original = { min, max };
    min = Math.min(min, MAX_DELAY_MS);
    max = Math.min(Math.max(min, max), MAX_DELAY_MS);
    console.warn(
      `[DelayUtils] Delay range capped to <= ${MAX_DELAY_MS}ms (requested: min=${original.min}ms, max=${original.max}ms; capped: min=${min}ms, max=${max}ms)`,
    );
  }
  const span = max - min;
  if (span <= 0) return min;
  return min + Math.floor(Math.random() * (span + 1)); // inclusive of max
}

/**
 * Apply delay if not in test environment.
 *
 * Convenience function that combines delay computation and sleep,
 * automatically skipping delays in test environment.
 *
 * @param option Delay configuration
 * @param signal Optional AbortSignal for cancellation
 */
export async function applyDelay(
  option?: DelayOption,
  signal?: AbortSignal,
): Promise<void> {
  const ms = computeDelayMs(option);
  if (ms > 0 && !isTestEnv()) {
    await sleep(ms, signal);
  }
}
