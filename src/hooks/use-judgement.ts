import { useEffect, useMemo, useState } from 'react';
import type { Battle } from '@/types/types';
import type { PlayMode } from '@/yk/play-mode';
import { getJudgementRepository } from '@/yk/repo/repository-provider';
import type { Winner } from '@/yk/repo/repositories';
import { useRepositoriesOptional } from '@/yk/repo/repository-context';

export type JudgementState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: Winner; error: null }
  | { status: 'error'; data: null; error: Error };

export function useJudgement(
  nameOfJudge: string,
  battle: Battle,
  mode: PlayMode,
): JudgementState {
  const provided = useRepositoriesOptional();
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
        const repo =
          provided?.judgement ?? (await getJudgementRepository(mode));
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10_000);
        const result = await repo.determineWinner(
          {
            mode,
            yono: inputs.yono,
            komae: inputs.komae,
          },
          { signal: controller.signal },
        );
        clearTimeout(timer);
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
  }, [inputs, mode, provided]);

  return state;
}
