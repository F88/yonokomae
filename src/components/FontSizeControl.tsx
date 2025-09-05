import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('userFontSize');
    return saved ? parseFloat(saved) : 100;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('userFontSize', fontSize.toString());
  }, [fontSize]);

  const handleReset = () => {
    setFontSize(100);
  };

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(75, Math.min(200, prev + delta)));
  };

  return (
    <div className="flex items-center gap-0 sm:gap-0 whitespace-nowrap">
      <button
        onClick={() => adjustFontSize(-10)}
        className="px-1.5 py-0.5 text-xs border rounded hover:bg-muted sm:px-2 sm:py-1 sm:text-sm"
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        A-
      </button>
      {/* Hide percentage label on very narrow screens */}
      <span className="hidden sm:inline-block text-sm min-w-[3rem] text-center tabular-nums">
        {fontSize}%
      </span>

      {fontSize !== 100 && (
        <>
          {/* Icon-only reset on small screens */}
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center p-1 text-muted-foreground hover:text-foreground"
            aria-label="Reset font size"
            title="Reset font size"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </>
      )}

      <button
        onClick={() => adjustFontSize(10)}
        className="px-1.5 py-0.5 text-xs border rounded hover:bg-muted sm:px-2 sm:py-1 sm:text-sm"
        aria-label="Increase font size"
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
