import { useEffect, useMemo, useState } from 'react';
import type { Battle } from '@/types/types';
import { Judge as JudgeClass } from '@/yk/judge';
import type { PlayMode } from '@/yk/play-mode';

export type JudgementState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: string; error: null }
  | { status: 'error'; data: null; error: Error };

export function useJudgement(
  nameOfJudge: string,
  battle: Battle,
  mode: PlayMode,
): JudgementState {
  const [state, setState] = useState<JudgementState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const inputs = useMemo(
    () => ({ nameOfJudge, yono: battle.yono, komae: battle.komae }),
    [nameOfJudge, battle.yono, battle.komae],
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setState({ status: 'loading', data: null, error: null });
        // In the future this can be a fetch to an API endpoint.
        // Simulate async to keep API shape stable.
        await Promise.resolve();
        const result = await new JudgeClass(
          inputs.nameOfJudge,
          mode,
        ).determineWinner({
          yono: inputs.yono,
          komae: inputs.komae,
        });
        if (!cancelled) {
          setState({ status: 'success', data: result, error: null });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            status: 'error',
            data: null,
            error: e instanceof Error ? e : new Error(String(e)),
          });
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [inputs, mode]);

  return state;
}
