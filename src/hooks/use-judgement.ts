import { useEffect, useMemo, useState } from 'react';
import type { Battle } from '@yonokomae/types';
import type { PlayMode } from '@/yk/play-mode';
import { getJudgementRepository } from '@/yk/repo/core/repository-provider';
import type { Verdict } from '@/yk/repo/core/repositories';
import { findJudgeByCodeName } from '@/yk/judges';
import { useRepositoriesOptional } from '@/yk/repo/core/repository-context';

export type JudgementState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: Verdict; error: null }
  | { status: 'error'; data: null; error: Error };

export function useJudgement(
  codeNameOfJudge: string,
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
    () => ({
      codeNameOfJudge,
      battleId: battle.id,
      yono: battle.yono,
      komae: battle.komae,
    }),
    [codeNameOfJudge, battle.id, battle.yono, battle.komae],
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | null = null;
      try {
        setState({ status: 'loading', data: null, error: null });
        const repo =
          provided?.judgement ?? (await getJudgementRepository(mode));
        timer = setTimeout(() => controller.abort(), 10_000);
        const judgeIdentity = findJudgeByCodeName(codeNameOfJudge) ?? {
          id: `judge-${codeNameOfJudge}`,
          name: `Judge ${codeNameOfJudge}`,
          codeName: codeNameOfJudge,
        };
        const result = await repo.determineWinner(
          {
            battle: { ...battle, yono: inputs.yono, komae: inputs.komae },
            judge: judgeIdentity,
          },
          { signal: controller.signal },
        );
        if (timer) clearTimeout(timer);
        timer = null;
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
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [inputs, mode, provided, battle, codeNameOfJudge]);

  return state;
}
