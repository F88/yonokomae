import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Swords, ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserManual } from '@/components/UserManual';
import type { PlayMode } from '@/yk/play-mode';

export const Header = ({ mode }: { mode?: PlayMode }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleScrollTop}
            aria-label="Scroll to top"
            title="Scroll to top"
            className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted/50"
          >
            <Swords className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">yonokomae</h1>
        </div>
        <div className="flex items-center gap-2">
          {mode ? (
            <Badge
              variant="secondary"
              className="inline-flex max-w-[45vw] truncate sm:max-w-none"
              title={mode.title}
              aria-label={`Mode: ${mode.title}`}
            >
              {mode.title}
            </Badge>
          ) : null}
          <button
            type="button"
            onClick={() => setIsManualOpen(true)}
            aria-label="Open user manual"
            title="取扱説明書"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <ScrollText className="h-4 w-4" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* User Manual */}
      <UserManual
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />
    </>
  );
};
