import { GiInvertedDice3 } from 'react-icons/gi';
import { Square } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';

interface ControllerProps {
  onGenerateReport: () => void | Promise<void>;
  onClearReports: () => void | Promise<void>;
}

export const Controller: FC<ControllerProps> = ({
  onGenerateReport,
  onClearReports,
}) => (
  <div className="flex w-full justify-center gap-4">
    {/* Red square button */}
    <Button
      variant="destructive"
      onClick={() => {
        void onClearReports();
      }}
      className="gap-2"
    >
      <Square className="h-4 w-4" />
      RESET
    </Button>
    <Button
      onClick={() => {
        void onGenerateReport();
      }}
      className="gap-2"
    >
      <GiInvertedDice3 className="h-5 w-5" />
      Next
    </Button>
  </div>
);
