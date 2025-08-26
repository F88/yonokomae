 */
export function useRotateHistoricalSeed() {
  const ctx = useHistoricalSeedSelection();
  return useCallback(() => ctx.rotateSeed(), [ctx.rotateSeed]);
}
