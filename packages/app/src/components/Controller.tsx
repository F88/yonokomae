import { GiInvertedDice3 } from 'react-icons/gi';
import { Square } from 'lucide-react';
import { useCallback, useEffect, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { KeyChip } from '@/components/KeyChip';
import { isEditable } from '@/lib/dom-utils';

interface ControllerProps {
  onGenerateReport: () => void | Promise<void>;
  onClearReports: () => void | Promise<void>;
  /** Whether the user can trigger a new battle. Defaults to true. */
  canBattle?: boolean;
}

export const Controller: FC<ControllerProps> = ({
  onGenerateReport,
  onClearReports,
  canBattle = true,
}) => {
  const disabled = !canBattle;
  const handleGenerate = useCallback(() => {
    if (disabled) return;
    void onGenerateReport();
  }, [onGenerateReport, disabled]);

  // Using shared <KeyChip /> from ui and shared isEditable util

  const handleReset = useCallback(() => {
    void onClearReports();
  }, [onClearReports]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;
      if (key === 'Enter' || key === 'b' || key === 'B') {
        e.preventDefault();
        if (!disabled) handleGenerate();
      } else if (key === 'r' || key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleGenerate, handleReset, disabled]);

  return (
    <div className="flex w-full justify-center gap-8">
      {/* Reset block */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="destructive"
          onClick={handleReset}
          className="gap-2"
          title="Reset (R)"
          aria-label="Reset"
        >
          <Square className="h-4 w-4" />
          RESET
        </Button>
        {/* Chips on >= sm, compact text on small screens */}
        <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <KeyChip label="R" />
        </div>
      </div>

      {/* Navigation hint block */}
      <div className="hidden sm:flex flex-col items-center gap-1">
        <div className="text-xs text-muted-foreground">Navigate</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <KeyChip label="←" />
          <KeyChip label="↑" />
          <KeyChip label="K" />
          {/* <span className="mx-1">prev</span> */}|
          {/* <span className="mx-1">next</span> */}
          <KeyChip label="J" />
          <KeyChip label="↓" />
          <KeyChip label="→" />
        </div>
      </div>

      {/* Battle block */}
      <div className="flex flex-col items-center gap-1 pb-6 sm:pb-0">
        <Button
          onClick={handleGenerate}
          className="gap-2"
          title="Battle (Enter or B)"
          aria-label="Battle"
          aria-describedby="kbd-battle-hint"
          disabled={disabled}
        >
          <GiInvertedDice3 className="h-5 w-5" />
          BATTLE
        </Button>
        <span id="kbd-battle-hint" className="sr-only">
          Shortcut: B, Enter
        </span>
        <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <KeyChip label="B" />
          <KeyChip label="Enter" />
        </div>
      </div>
    </div>
  );
};
