import { BattleContainer } from '@/components/BattleContainer';
import { Controller } from '@/components/Controller';
import { TheStartOfTheWar } from '@/components/TheStartOfTheWar';
import { Intro } from '@/components/Intro';
import { useGenerateReport } from '@/hooks/use-generate-report';
import { Placeholders } from '@/yk/placeholder';
import { useEffect, useRef, useState } from 'react';
import { uid } from '@/lib/id';
import { Header } from './components/Header';
import type { Battle } from './types/types';
import TitleContaner from './components/TitleContaner';
import { playMode, type PlayMode } from './yk/play-mode';

function App() {
  const [mode, setMode] = useState<PlayMode | undefined>(undefined);
  const [reports, setReports] = useState<Battle[]>([]);
  const shouldScrollAfterAppendRef = useRef(false);

  const { generateReport } = useGenerateReport();

  // Smoothly scroll to the bottom of the page after the DOM updates
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  // After the list grows (i.e., a new report is appended), scroll to the bottom once
  useEffect(() => {
    if (shouldScrollAfterAppendRef.current) {
      // Defer to next frame to ensure DOM is painted
      requestAnimationFrame(() => {
        scrollToBottom();
        shouldScrollAfterAppendRef.current = false;
      });
    }
  }, [reports.length]);

  const handleGenerateReport = async () => {
    // Insert a loading placeholder immediately
    let insertedIndex = -1;
    const loadingBattle: Battle = {
      id: uid('battle'),
      title: 'Generating report...',
      subtitle: 'Please wait',
      overview: 'Preparing a new battle report.',
      scenario: 'Loading...',
      komae: { ...Placeholders.Komae },
      yono: { ...Placeholders.Yono },
      status: 'loading',
    };

    shouldScrollAfterAppendRef.current = true;
    setReports((prev) => {
      insertedIndex = prev.length;
      return [...prev, loadingBattle];
    });
    // Scrolling will occur in the effect after DOM updates

    try {
      const next = await generateReport('John Doe');
      // Replace the placeholder at the captured index
      setReports((prev) =>
        prev.map((b, i) => (i === insertedIndex ? next : b)),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const errorBattle: Battle = {
        id: uid('battle'),
        title: 'Failed to generate report',
        subtitle: 'Error',
        overview: 'An error occurred while generating the report.',
        scenario: message,
        komae: { ...Placeholders.Komae },
        yono: { ...Placeholders.Yono },
        status: 'error',
      };
      setReports((prev) =>
        prev.map((b, i) => (i === insertedIndex ? errorBattle : b)),
      );
    }
  };

  const handleClearReports = () => {
    setReports([]);
    setMode(undefined);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Header mode={mode} />
        </div>
      </header>

      {/* Main Content */}
      <div className="container flex flex-col gap-0 py-0 pb-32">
        {/* Intro Section */}
        <section className="flex flex-col items-center text-center m-2">
          <Intro />
          <TheStartOfTheWar />
        </section>

        {/* Title Container (shown only before a mode is selected) */}
        {!mode && (
          <TitleContaner modes={playMode} onSelect={(mode) => setMode(mode)} />
        )}

        {/* Battle Reports */}
        {mode != null && reports.length > 0 && (
          <section className="mx-auto w-full max-w-6xl space-y-8">
            {reports.map((battle: Battle) => (
              <BattleContainer key={battle.id} battle={battle} mode={mode} />
            ))}
          </section>
        )}
      </div>

      {/* Fixed Controller */}
      {!mode && (
        <footer className="sticky bottom-0 mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4">
            <Controller
              onGenerateReport={handleGenerateReport}
              onClearReports={handleClearReports}
            />
          </div>
        </footer>
      )}
    </main>
  );
}

export default App;
