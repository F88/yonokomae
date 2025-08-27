import { BattleContainer } from '@/components/battle/BattleContainer';
import { Controller } from '@/components/Controller';
import { TheStartOfTheWar } from '@/components/TheStartOfTheWar';
import { Intro } from '@/components/Intro';
import { useGenerateReport } from '@/hooks/use-generate-report';
import { Placeholders } from '@/yk/placeholder';
import { useEffect, useRef, useState } from 'react';
import { uid } from '@/lib/id';
import { Header } from './components/Header';
import type { Battle } from './types/types';
import { playMode, type PlayMode } from './yk/play-mode';
import { TitleContainer } from './components/TitleContainer';
import UserVoicesMarquee from './components/UserVoicesMarquee';
import UserVoicesCarousel from './components/UserVoicesCarousel';
import UsageExamplesCarousel from './components/UsageExamplesCarousel';
import { UsageExamplesMarquee } from './components/UsageExamplesMarquee';

function App() {
  const [mode, setMode] = useState<PlayMode | undefined>(undefined);
  const [reports, setReports] = useState<Battle[]>([]);
  const shouldScrollAfterAppendRef = useRef(false);
  const scrollTargetIdRef = useRef<string | null>(null);

  const { generateReport } = useGenerateReport(mode);

  // Removed dynamic CSS variable; using static responsive scroll margins instead.

  // Smoothly scroll the newly inserted report to the top of the viewport
  const scrollInsertedToTop = () => {
    const id = scrollTargetIdRef.current;
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    // Measure sticky header and scroll to exact offset to avoid overlap
    const header = document.querySelector(
      'header.sticky',
    ) as HTMLElement | null;
    const headerRect = header?.getBoundingClientRect();
    const headerBottom = headerRect ? headerRect.bottom : 0;
    const isWide = window.matchMedia('(min-width: 1024px)').matches;
    const extraGap = isWide ? 20 : 12; // breathing space under header
    const rect = el.getBoundingClientRect();
    // Scroll by the difference between the element's top and the header's bottom
    const delta = rect.top - headerBottom - extraGap;
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  // After the list grows (i.e., a new report is appended), scroll the new item to the top once
  useEffect(() => {
    if (shouldScrollAfterAppendRef.current) {
      // Defer to next frame to ensure DOM is painted
      requestAnimationFrame(() => {
        // Defer one more frame to ensure layout settles (sticky header, fonts, etc.)
        requestAnimationFrame(() => {
          scrollInsertedToTop();
          shouldScrollAfterAppendRef.current = false;
          scrollTargetIdRef.current = null;
        });
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
    scrollTargetIdRef.current = loadingBattle.id;
    setReports((prev) => {
      insertedIndex = prev.length;
      return [...prev, loadingBattle];
    });
    // Scrolling will occur in the effect after DOM updates

    try {
      const next = await generateReport();
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

      <br />

      {/* Information */}
      <div className="grid gap-3 py-0 border-0 border-orange-400 ">
        <UserVoicesMarquee speed="molasses" gap="md" reverse={false} />
        {/* <UserVoicesCarousel intervalMs={3000} pauseOnHover orientation="vertical" /> */}
        {/* <UsageExamplesCarousel intervalMs={3000} pauseOnHover orientation="vertical"/> */}
        {/* <UsageExamplesMarquee speed="molasses" gap="md" reverse={false} /> */}
      </div>

      {/* Main Content */}
      <div className="container flex flex-col gap-0 py-0 pb-32">
        {/* Intro Section */}
        <section className="flex flex-col items-center text-center m-2">
          <Intro />
          <TheStartOfTheWar />
        </section>

        {/* Title Container (shown only before a mode is selected) */}
        {!mode && (
          <TitleContainer modes={playMode} onSelect={(mode) => setMode(mode)} />
        )}

        {/* Battle Reports */}
        {mode != null && reports.length > 0 && (
          <section className="mx-auto w-full max-w-6xl space-y-8">
            {reports.map((battle: Battle) => (
              <div
                key={battle.id}
                id={battle.id}
                className="scroll-mt-[72px] lg:scroll-mt-[96px]"
              >
                <BattleContainer battle={battle} mode={mode} />
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Fixed Controller */}
      {mode && (
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
