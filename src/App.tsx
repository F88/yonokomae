import { BattleContainer } from '@/components/battle/BattleContainer';
import { Controller } from '@/components/Controller';
import { Intro } from '@/components/Intro';
import { TheStartOfTheWar } from '@/components/TheStartOfTheWar';
import { useGenerateReport } from '@/hooks/use-generate-report';
import { isEditable } from '@/lib/dom-utils';
import { uid } from '@/lib/id';
import { scrollByY, scrollToY } from '@/lib/reduced-motion';
import { Placeholders } from '@/yk/placeholder';
import { RepositoryProvider } from '@/yk/repo/core/RepositoryProvider';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BattleMetrics } from './components/BattleMetrics';
import { Header } from './components/Header';
import { TitleContainer } from './components/TitleContainer';
import UserVoicesMarquee from './components/UserVoicesMarquee';
import type { Battle, BattleReportMetrics } from './types/types';
import { playMode, type PlayMode } from './yk/play-mode';

function App() {
  const MAX_CONCURRENT = 6;
  const [mode, setMode] = useState<PlayMode | undefined>(undefined);
  const [reports, setReports] = useState<Battle[]>([]);
  // Minimal aggregated metrics for the current reports list (MVP scope)
  const [reportMetrics, setReportMetrics] = useState<BattleReportMetrics>({
    totalReports: 0,
    generatingCount: 0,
    generationSuccessCount: 0,
    generationErrorCount: 0,
  });
  const shouldScrollAfterAppendRef = useRef(false);
  const scrollTargetIdRef = useRef<string | null>(null);
  const modeSelectionRef = useRef<HTMLDivElement | null>(null);
  const [gridCols, setGridCols] = useState('grid-cols-1 lg:grid-cols-2');

  const { generateReport } = useGenerateReport(mode);

  // Helper: safe media query checks for non-browser/test envs
  const supportsMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';

  const isWideViewport = useCallback(() => {
    try {
      return supportsMatchMedia
        ? window.matchMedia('(min-width: 1024px)').matches
        : typeof window !== 'undefined'
          ? window.innerWidth >= 1024
          : false;
    } catch {
      return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
    }
  }, [supportsMatchMedia]);

  const prefersReducedMotion = useCallback(() => {
    try {
      return supportsMatchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    } catch {
      return false;
    }
  }, [supportsMatchMedia]);

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
  const scrollInsertedToTop = useCallback(() => {
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
    const isWide = isWideViewport();
    const extraGap = isWide ? 20 : 12; // breathing space under header
    const rect = el.getBoundingClientRect();
    // Scroll by the difference between the element's top and the header's bottom
    const delta = rect.top - headerBottom - extraGap;
    if (Math.abs(delta) > 1) {
      scrollByY(delta);
    }
  }, [isWideViewport]);

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
  }, [reports.length, scrollInsertedToTop]);

  // Keep BattleReportMetrics up to date when reports change
  useEffect(() => {
    const totalReports = reports.length;
    const generatingCount = reports.filter(
      (r) => r.status === 'loading',
    ).length;
    const generationErrorCount = reports.filter(
      (r) => r.status === 'error',
    ).length;
    const generationSuccessCount =
      totalReports - generatingCount - generationErrorCount;
    setReportMetrics({
      totalReports,
      generatingCount,
      generationSuccessCount,
      generationErrorCount,
    });
  }, [reports]);

  // Faster animated scroll for keyboard navigation
  // === Speed knob ===
  // Adjust the duration below to change KB navigation scroll speed.
  // Smaller is faster, larger is slower. Typical range: 150–350ms.
  // Note: Respects prefers-reduced-motion (falls back to instant scroll).
  // const NAV_SCROLL_DURATION_MS = 220; // ms — decrease to speed up (e.g., 180), increase to slow down (e.g., 300)
  const NAV_SCROLL_DURATION_MS = 0; // Fastest

  const scrollByAnimated = useCallback(
    (
      deltaY: number,
      duration = NAV_SCROLL_DURATION_MS, // ms — lower = faster, higher = slower
    ) => {
      if (Math.abs(deltaY) <= 1) return;
      const reduced = prefersReducedMotion();
      if (reduced || duration <= 0) {
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
    },
    [prefersReducedMotion],
  );

  // Scroll a specific element id so that its top sits just below the sticky header
  const scrollIdUnderStickyHeader = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const header = document.querySelector(
        'header.sticky',
      ) as HTMLElement | null;
      const headerRect = header?.getBoundingClientRect();
      const headerBottom = headerRect ? headerRect.bottom : 0;
      const isWide = isWideViewport();
      const extraGap = isWide ? 20 : 12; // breathing space under header
      const rect = el.getBoundingClientRect();
      const delta = rect.top - headerBottom - extraGap;
      if (Math.abs(delta) > 1) {
        scrollByAnimated(delta);
      }
    },
    [isWideViewport, scrollByAnimated],
  );

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
      const isWide = isWideViewport();
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
          (e as KeyboardEvent).preventDefault();
          const delta = getDelta(next);
          scrollByAnimated(delta);
        }
      } else if (isPrev) {
        // Prev: last element above the header area
        const above = elements.filter((el) => getDelta(el) < -1);
        const prev = above.length > 0 ? above[above.length - 1] : undefined;
        if (prev) {
          (e as KeyboardEvent).preventDefault();
          const delta = getDelta(prev);
          scrollByAnimated(delta);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, reports, isWideViewport, scrollByAnimated]);

  const handleGenerateReport = async () => {
    // Concurrency guard: ignore requests when pending >= MAX
    const currentPending = reports.filter((r) => r.status === 'loading').length;
    if (currentPending >= MAX_CONCURRENT) {
      return;
    }
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
      let lastIdAfterUpdate: string | undefined;
      setReports((prev) => {
        const updated = prev.map((b, i) =>
          i === insertedIndex ? { ...next, id: b.id } : b,
        );
        lastIdAfterUpdate =
          updated.length > 0 ? updated[updated.length - 1].id : undefined;
        return updated;
      });
      // If the real content is taller than the placeholder, it may end up overlapped by the header.
      // Scroll to the latest report (last item) to keep the view stable with concurrent generations.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (lastIdAfterUpdate) {
            scrollIdUnderStickyHeader(lastIdAfterUpdate);
          }
        });
      });
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
        prev.map((b, i) =>
          i === insertedIndex ? { ...errorBattle, id: b.id } : b,
        ),
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
        const isWide = isWideViewport();
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
    <RepositoryProvider mode={mode}>
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
                canBattle={reportMetrics.generatingCount < MAX_CONCURRENT}
              />
              <div className="mt-2">
                <BattleMetrics metrics={reportMetrics} />
              </div>
            </div>
          </footer>
        )}
      </main>
    </RepositoryProvider>
  );
}

export default App;
