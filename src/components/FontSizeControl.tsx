import { useEffect, useState } from 'react';

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
    setFontSize((prev) => Math.max(75, Math.min(150, prev + delta)));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => adjustFontSize(-10)}
        className="px-2 py-1 text-sm border rounded hover:bg-muted"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <span className="text-sm min-w-[3rem] text-center">{fontSize}%</span>
      <button
        onClick={() => adjustFontSize(10)}
        className="px-2 py-1 text-sm border rounded hover:bg-muted"
        aria-label="Increase font size"
      >
        A+
      </button>
      {fontSize !== 100 && (
        <button
          onClick={handleReset}
          className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Reset font size"
        >
          Reset
        </button>
      )}
    </div>
  );
}
