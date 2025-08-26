import { ThemeToggle } from '@/components/ThemeToggle';
import { Swords } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PlayMode } from '@/yk/play-mode';

export const Header = ({ mode }: { mode?: PlayMode }) => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
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
        <ThemeToggle />
      </div>
    </div>
  );
};
