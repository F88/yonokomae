import { BattleContainer } from '@/components/battle/BattleContainer';
import { Controller } from '@/components/Controller';
import { Intro } from '@/components/Intro';
import { TheStartOfTheWar } from '@/components/TheStartOfTheWar';
import { useGenerateReport } from '@/hooks/use-generate-report';
import { uid } from '@/lib/id';
import { Placeholders } from '@/yk/placeholder';
import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { TitleContainer } from './components/TitleContainer';
import UserVoicesMarquee from './components/UserVoicesMarquee';
import type { Battle } from './types/types';
import { playMode, type PlayMode } from './yk/play-mode';
import { isEditable } from '@/lib/dom-utils';
import { scrollByY, scrollToY } from '@/lib/reduced-motion';

function App() {
  const [mode, setMode] = useState<PlayMode | undefined>(undefined);
  const [reports, setReports] = useState<Battle[]>([]);
  const shouldScrollAfterAppendRef = useRef(false);
  const scrollTargetIdRef = useRef<string | null>(null);
  const modeSelectionRef = useRef<HTMLDivElement | null>(null);
  const [gridCols, setGridCols] = useState('grid-cols-1 lg:grid-cols-2');

  const { generateReport } = useGenerateReport(mode);

  // Handle responsive grid columns based on window width
  useEffect(() => {
    const updateGridCols = () => {
      const width = window.innerWidth;

      if (width > 2560) {
        // Custom breakpoint for 3 columns
        setGridCols('grid grid-cols-3');
      } else if (width >= 1280) {
        // xl
        setGridCols('grid grid-cols-2');
      } else {
        // sm, md, lg
        setGridCols('grid grid-cols-1');
      }
    };

    updateGridCols();
    window.addEventListener('resize', updateGridCols);
    return () => window.removeEventListener('resize', updateGridCols);
  }, []);

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
      scrollByY(delta);
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

  // Faster animated scroll for keyboard navigation
  // === Speed knob ===
  // Adjust the duration below to change KB navigation scroll speed.
  // Smaller is faster, larger is slower. Typical range: 150–350ms.
  // Note: Respects prefers-reduced-motion (falls back to instant scroll).
  // const NAV_SCROLL_DURATION_MS = 220; // ms — decrease to speed up (e.g., 180), increase to slow down (e.g., 300)
  const NAV_SCROLL_DURATION_MS = 0; // Fastest
  const scrollByAnimated = (
    deltaY: number,
    duration = NAV_SCROLL_DURATION_MS, // ms — lower = faster, higher = slower
  ) => {
    if (Math.abs(deltaY) <= 1) return;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced || duration <= 0) {
      scrollByY(deltaY, { behavior: 'auto' });
      return;
    }
    const startY = window.scrollY;
    const targetY = startY + deltaY;
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3); // Quick finish feel
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const nextY = startY + (targetY - startY) * eased;
      scrollToY(nextY, { behavior: 'auto' });
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Keyboard navigation between BattleContainers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!mode || reports.length === 0) return;

      const key = e.key;
      const isNext =
        key === 'j' ||
        key === 'J' ||
        key === 'ArrowDown' ||
        key === 'ArrowRight';
      const isPrev =
        key === 'k' || key === 'K' || key === 'ArrowUp' || key === 'ArrowLeft';
      if (!isNext && !isPrev) return;

      const header = document.querySelector(
        'header.sticky',
      ) as HTMLElement | null;
      const headerRect = header?.getBoundingClientRect();
      const headerBottom = headerRect ? headerRect.bottom : 0;
      const isWide = window.matchMedia('(min-width: 1024px)').matches;
      const extraGap = isWide ? 20 : 12;

      const getDelta = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return rect.top - headerBottom - extraGap;
      };

      const elements: HTMLElement[] = reports
        .map((b) => document.getElementById(b.id) as HTMLElement | null)
        .filter((el): el is HTMLElement => Boolean(el));

      if (elements.length === 0) return;

      if (isNext) {
        // Next: first element below the header area
        const next = elements.find((el) => getDelta(el) > 1);
        if (next) {
          e.preventDefault();
          const delta = getDelta(next);
          scrollByAnimated(delta);
        }
      } else if (isPrev) {
        // Prev: last element above the header area
        const above = elements.filter((el) => getDelta(el) < -1);
        const prev = above.length > 0 ? above[above.length - 1] : undefined;
        if (prev) {
          e.preventDefault();
          const delta = getDelta(prev);
          scrollByAnimated(delta);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, reports]);

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
    // Scroll to top after clearing
    // scrollToY(0, { behavior: 'smooth' });
    // Scroll to top of mode selection
    // After mode resets, TitleContainer re-mounts; defer scroll until it exists and layout stabilizes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = modeSelectionRef.current;
        if (!target) return;
        const header = document.querySelector(
          'header.sticky',
        ) as HTMLElement | null;
        const headerRect = header?.getBoundingClientRect();
        const headerBottom = headerRect ? headerRect.bottom : 0;
        const isWide = window.matchMedia('(min-width: 1024px)').matches;
        const extraGap = isWide ? 20 : 12; // breathing space under header
        const rect = target.getBoundingClientRect();
        const delta = rect.top - headerBottom - extraGap;
        if (Math.abs(delta) > 1) {
          scrollByY(delta);
        }
      });
    });
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
        <UserVoicesMarquee
          shuffle={true}
          speed={60}
          pauseOnHover={true}
          fadeWidth={'w-24'}
        />
        {/* <UserVoicesCarousel
          intervalMs={3000}
          pauseOnHover
          orientation="vertical"
        /> */}
        {/* <UserVoicesCarousel intervalMs={3000} pauseOnHover orientation="vertical" /> */}
        {/* <UsageExamplesCarousel intervalMs={3000} pauseOnHover orientation="vertical"/> */}
        {/* <UsageExamplesMarquee speed={60} /> */}
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-0 py-0 pb-32 px-4">
        {/* Intro Section */}
        <section className="flex flex-col items-center text-center m-2">
          <Intro />
          <TheStartOfTheWar />
        </section>

        {/* Title Container (shown only before a mode is selected) */}
        {!mode && (
          <div
            ref={modeSelectionRef}
            id="mode-selection"
            className="scroll-mt-[72px] lg:scroll-mt-[96px]"
          >
            <TitleContainer
              modes={playMode}
              onSelect={(mode) => setMode(mode)}
            />
          </div>
        )}

        {/* Battle Reports */}
        {mode != null && reports.length > 0 && (
          <section className="mx-auto w-full max-w-[2800px]">
            <div className={`${gridCols} gap-4 lg:gap-6`}>
              {reports.map((battle: Battle) => (
                <div
                  key={battle.id}
                  id={battle.id}
                  className="scroll-mt-[72px] lg:scroll-mt-[96px]"
                >
                  <BattleContainer battle={battle} mode={mode} />
                </div>
              ))}
            </div>
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
