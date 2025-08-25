import { ThemeToggle } from '@/components/ThemeToggle';
import { Swords } from 'lucide-react';

export const Header = () => {
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
        <ThemeToggle />
      </div>
    </div>
  );
};
