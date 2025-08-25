import "./App.css";
import { HistoricalScene } from "./components/HistoricalScene";
import { Intro } from "./components/Intro";
import { FrontlineJournalist } from "./libs/frontline-journalist";
import { useState } from "react";
import { GiInvertedDice3 } from "react-icons/gi";
import { Button } from "./components/ui/button";
import type { Battle } from "./types/types";
import { ConsiderationsAndJudgments } from "./components/ConsiderationsAndJudgments";

function App() {
  const [report, setReport] = useState<Battle | null>(null);

  const handleGenerateReport = () => {
    const j = new FrontlineJournalist("John Doe");
    setReport(j.report());
  };

  if (report == null) {
    handleGenerateReport();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <Intro />
      <hr />
      {report && (
        <>
          <HistoricalScene battle={report} />
          <hr />
          <ConsiderationsAndJudgments battle={report} />
          <hr />
          <Button
            className="flex items-center gap-2 mt-6 mb-6 text-base font-bold"
            onClick={handleGenerateReport}
            variant="default"
          >
            <GiInvertedDice3 size={24} aria-label="dice" />
          </Button>
        </>
      )}
    </div>
  );
}

export default App;
