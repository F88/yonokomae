import { GiInvertedDice3 } from 'react-icons/gi';
import { Square } from 'lucide-react';
import { useCallback, useEffect, type FC } from 'react';
import { Button } from '@/components/ui/button';

interface ControllerProps {
  onGenerateReport: () => void | Promise<void>;
  onClearReports: () => void | Promise<void>;
}

export const Controller: FC<ControllerProps> = ({
  onGenerateReport,
  onClearReports,
}) => {
  const handleGenerate = useCallback(() => {
    void onGenerateReport();
  }, [onGenerateReport]);

  const handleReset = useCallback(() => {
    void onClearReports();
  }, [onClearReports]);

  useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      if (el.isContentEditable) return true;
      return tag === 'input' || tag === 'textarea' || tag === 'select';
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;
      if (key === 'Enter' || key === ' ' || key === 'b' || key === 'B') {
        e.preventDefault();
        handleGenerate();
      } else if (key === 'r' || key === 'R' || key === 'Escape') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleGenerate, handleReset]);

  return (
    <div className="flex w-full justify-center gap-8">
      {/* Reset block */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="destructive"
          onClick={handleReset}
          className="gap-2"
          title="Reset (R or Esc)"
          aria-label="Reset (R or Esc)"
        >
          <Square className="h-4 w-4" />
          RESET
        </Button>
        <div className="text-xs text-muted-foreground">[Esc / R]</div>
      </div>

      {/* Battle block */}
      <div className="flex flex-col items-center gap-1">
        <Button
          onClick={handleGenerate}
          className="gap-2"
          title="Battle (Enter, Space, or B)"
          aria-label="Battle (Enter, Space, or B)"
        >
          <GiInvertedDice3 className="h-5 w-5" />
          BATTLE
        </Button>
        <div className="text-xs text-muted-foreground">[Enter / Space / B]</div>
      </div>
    </div>
  );
};
