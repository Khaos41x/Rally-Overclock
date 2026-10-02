"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard } from "lucide-react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import WarmupView from "../components/WarmupView";
import RsvpReader from "../components/RsvpReader";
import PacerReader from "../components/PacerReader";
import RecallPanel from "../components/RecallPanel";
import MaintenanceSequence from "../components/MaintenanceSequence";
import { DEFAULT_TEXT, STORAGE_KEYS } from "../lib/constants";
import { dayKey, readStore, tokenize, writeStore } from "../lib/utils";
import { useRallyStats } from "../lib/useRallyStats";

export default function Page() {
  const { stats, ready, touchStreak, recordWpm, resetAll } = useRallyStats();
  const [module, setModule] = useState("warmup");
  const [text, setText] = useState(DEFAULT_TEXT);
  const [recall, setRecall] = useState(null);
  const [maintenance, setMaintenance] = useState(false);
  const [schulte, setSchulte] = useState({ log: [], best: 0 });

  useEffect(() => {
    const stored = readStore(STORAGE_KEYS.schulte, { log: [], best: 0 });
    setSchulte({ log: stored.log || [], best: stored.best || 0 });
  }, []);

  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.schulte, schulte);
  }, [schulte, ready]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const map = { 1: "warmup", 2: "overload", 3: "cruise", 4: "recall" };
      if (map[e.key]) setModule(map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSchulte = useCallback(
    (time, meta) => {
      touchStreak();
      if (!meta?.finished) return;
      setSchulte((prev) => ({
        best: prev.best ? Math.min(prev.best, time) : time,
        log: [{ time, day: dayKey() }, ...prev.log].slice(0, 30),
      }));
    },
    [touchStreak]
  );

  const startRecall = useCallback(
    (wpm) => {
      touchStreak();
      recordWpm(wpm);
      setRecall({ wpm, wordCount: tokenize(text).length });
      setModule("recall");
    },
    [text, touchStreak, recordWpm]
  );

  const saveRecall = useCallback(
    (notes) => {
      const prior = readStore(STORAGE_KEYS.recall, []);
      const entry = {
        day: dayKey(),
        ts: Date.now(),
        wpm: recall?.wpm || 0,
        wordCount: recall?.wordCount || 0,
        notes,
      };
      writeStore(STORAGE_KEYS.recall, [entry, ...prior].slice(0, 100));
    },
    [recall]
  );

  const handleMaintenance = useCallback(() => setMaintenance(true), []);

  const completeMaintenance = useCallback(
    (wpm) => {
      touchStreak();
      recordWpm(wpm);
    },
    [touchStreak, recordWpm]
  );

  const handleReset = useCallback(() => {
    resetAll();
    setSchulte({ log: [], best: 0 });
    writeStore(STORAGE_KEYS.recall, []);
    setRecall(null);
    setModule("warmup");
  }, [resetAll]);

  const view = useMemo(() => {
    if (maintenance) {
      return (
        <MaintenanceSequence
          onComplete={completeMaintenance}
          onExit={() => setMaintenance(false)}
        />
      );
    }
    if (module === "warmup") {
      return <WarmupView log={schulte.log} onComplete={handleSchulte} />;
    }
    if (module === "overload") {
      return <RsvpReader text={text} setText={setText} onRecall={startRecall} />;
    }
    if (module === "cruise") {
      return <PacerReader text={text} setText={setText} onRecall={startRecall} />;
    }
    return (
      <RecallPanel
        wpm={recall?.wpm || 0}
        wordCount={recall?.wordCount || tokenize(text).length}
        onSave={saveRecall}
        onExit={() => setModule("overload")}
      />
    );
  }, [
    maintenance,
    module,
    text,
    recall,
    schulte.log,
    handleSchulte,
    startRecall,
    saveRecall,
    completeMaintenance,
  ]);

  return (
    <div className="app-shell flex h-screen w-screen flex-col overflow-hidden bg-ink">
      <TopBar stats={stats} />

      <div className="app-body flex min-h-0 flex-1">
        <Sidebar
          module={module}
          setModule={setModule}
          stats={stats}
          schulteBest={schulte.best}
          onMaintenance={handleMaintenance}
          onReset={handleReset}
          disabled={maintenance}
        />

        <main className="app-main flex min-h-0 flex-1 flex-col">
          <div className="app-stage flex min-h-0 flex-1 flex-col overflow-hidden p-8">{view}</div>
          <footer className="flex shrink-0 items-center justify-between border-t border-edge bg-panel px-8 py-3 text-[11px] tracking-tight text-faint">
            <span className="flex items-center gap-2">
              <Keyboard size={13} strokeWidth={1.8} />
              1-4 switch modules · Space play/pause · R reset · Esc exit
            </span>
            <span>Local-first · data stays on this device</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
