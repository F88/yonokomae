import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Battle } from '@/types/types';
import { useJudgement } from '@/hooks/use-judgement';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Winner } from '@/yk/repo/core/repositories';
import type { PlayMode } from '@/yk/play-mode';
import { prefersReducedMotion } from '@/lib/reduced-motion';

// Base reveal delay to avoid all Judges appearing at once (in milliseconds).
const REVEAL_DELAY_BASE_MS = 1_000;
// Maximum random jitter added to the base to randomize reveal order per Judge.
// Effective random delay range becomes [BASE, BASE + JITTER_MAX].
const REVEAL_DELAY_JITTER_MAX_MS = 3_000;

export type JudgeCardProps = {
  codeNameOfJudge: string;
  battle: Battle;
  mode: PlayMode;
};

export const JudgeCard: FC<JudgeCardProps> = ({
  codeNameOfJudge: codeNameOfJudge,
  battle,
  mode,
}) => {
  const judgement = useJudgement(codeNameOfJudge, battle, mode);
  // Staggered reveal per Judge to display results at different times.
  const reduced = prefersReducedMotion();
  const delayMs = useMemo(() => {
    if (reduced) return 0;
    // Randomized per mount; reveal resets on battle/name change.
    const jitter = Math.floor(Math.random() * REVEAL_DELAY_JITTER_MAX_MS);
    return REVEAL_DELAY_BASE_MS + jitter;
  }, [reduced]);

  const [revealed, setRevealed] = useState(false);
  // Reset reveal when context changes (new battle or judge name)
  useEffect(() => {
    setRevealed(false);
  }, [battle.id, codeNameOfJudge]);

  // When we have a result, reveal it after a randomized delay.
  useEffect(() => {
    if (judgement.status === 'success') {
      if (delayMs === 0) {
        setRevealed(true);
        return;
      }
      const id = setTimeout(() => setRevealed(true), delayMs);
      return () => clearTimeout(id);
    }
    // For loading/error states keep revealed=false so UI shows spinner/error immediately.
    setRevealed(false);
  }, [judgement.status, delayMs]);

  return (
    <Card className="h-full min-w-0 overflow-hidden text-center gap-2 px-0 py-0">
      <CardHeader className="px-0 pt-4">
        <CardTitle className="text-xs font-medium">
          Judge {codeNameOfJudge}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 pt-0 pb-2 flex items-center justify-center">
        <div className="min-w-0 font-semibold break-words whitespace-normal">
          <div className="min-h-[28px] flex items-center justify-center">
            {judgement.status === 'loading' && '…'}
            {judgement.status === 'error' && (
              <span className="text-destructive">Failed</span>
            )}
            {judgement.status === 'success' &&
              (revealed ? <WinnerBadge winner={judgement.data} /> : '…')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function WinnerBadge({ winner }: { winner: Winner }) {
  switch (winner) {
    case 'YONO':
      return (
        <Badge
          variant="secondary"
          aria-label="Winner: YONO"
          className="px-2 py-0.5 text-xs"
        >
          YONO
        </Badge>
      );
    case 'KOMAE':
      return (
        <Badge
          variant="secondary"
          aria-label="Winner: KOMAE"
          className="px-2 py-0.5 text-xs"
        >
          KOMAE
        </Badge>
      );
    case 'DRAW':
      return (
        <Badge
          variant="outline"
          aria-label="Result: DRAW"
          className="px-2 py-0.5 text-xs border-muted-foreground/40 text-muted-foreground"
        >
          DRAW
        </Badge>
      );
  }
}
