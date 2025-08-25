import { BattleContainer } from "@/components/BattleContainer";
import { Controller } from "@/components/Controller";
import { TheStartOfTheWar } from "@/components/TheStartOfTheWar";
import { Intro } from "@/components/Intro";
import { useGenerateReport } from "@/libs/use-generate-report";
import { Placeholders } from "@/libs/placeholder";
import type { Battle } from "@/types/types";
import { useState } from "react";
import { Header } from "./components/Header";

function App() {
  const [reports, setReports] = useState<Battle[]>([]);

  const { generateReport } = useGenerateReport();

  const handleGenerateReport = async () => {
    // Insert a loading placeholder immediately
    let insertedIndex = -1;
    const loadingBattle: Battle = {
      title: "Generating report...",
      subtitle: "Please wait",
      overview: "Preparing a new battle report.",
      scenario: "Loading...",
      komae: { ...Placeholders.Komae },
      yono: { ...Placeholders.Yono },
    };

    setReports((prev) => {
      insertedIndex = prev.length;
      return [...prev, loadingBattle];
    });

    try {
      const next = await generateReport("John Doe");
      // Replace the placeholder at the captured index
      setReports((prev) =>
        prev.map((b, i) => (i === insertedIndex ? next : b))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const errorBattle: Battle = {
        title: "Failed to generate report",
        subtitle: "Error",
        overview: "An error occurred while generating the report.",
        scenario: message,
        komae: { ...Placeholders.Komae },
        yono: { ...Placeholders.Yono },
      };
      setReports((prev) =>
        prev.map((b, i) => (i === insertedIndex ? errorBattle : b))
      );
    }
  };

  const handleClearReports = () => {
    setReports([]);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <div className="container flex flex-col gap-8 py-8 pb-32">
        {/* Intro Section */}
        <section className="flex flex-col items-center text-center">
          <Intro />
          <TheStartOfTheWar />
        </section>

        {/* Battle Reports */}
        {reports.length > 0 && (
          <section className="mx-auto w-full max-w-6xl space-y-8">
            {reports.map((battle: Battle, idx: number) => (
              <BattleContainer key={idx} battle={battle} />
            ))}
          </section>
        )}
      </div>

      {/* Fixed Controller */}
      <footer className="sticky bottom-0 mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <Controller
            onGenerateReport={handleGenerateReport}
            onClearReports={handleClearReports}
          />
        </div>
      </footer>
    </main>
  );
}

export default App;
