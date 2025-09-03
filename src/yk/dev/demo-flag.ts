/** Determine whether demo mode is enabled via env or URL param. */
export function isDemoEnabled(): boolean {
  try {
    // Vite env
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env: any = (
      import.meta as unknown as { env?: Record<string, string> }
    )?.env;
    const envDemo = env?.VITE_DEMO_BATTLE;

    // URL param (browser only)
    const urlDemo =
      typeof window !== 'undefined'
        ? new URL(window.location.href).searchParams.get('demo')
        : undefined;

    return envDemo === 'true' || urlDemo === '1' || urlDemo === 'true';
  } catch {
    return false;
  }
}
