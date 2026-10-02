"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Clock, Pause, Play, SquarePen } from "lucide-react";
import { Btn, Panel } from "./ui";
import { formatClock } from "../lib/utils";

const DURATION = 600;

export default function RecallPanel({ wpm, wordCount, onSave, onExit }) {
  const [remaining, setRemaining] = useState(DURATION);
  const [running, setRunning] = useState(true);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const notesRef = useRef(null);

  useEffect(() => {
    notesRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const pct = ((DURATION - remaining) / DURATION) * 100;
  const done = remaining === 0;

  const handleSave = () => {
    if (saved) return;
    setSaved(true);
    onSave?.(notes);
  };

  return (
    <Panel
      title="Active Recall"
      icon={SquarePen}
      right={
        <div className="flex items-center gap-3">
          <span className="tnum text-xs tracking-tight text-faint">
            input {wordCount || 0} words @ {wpm || 0} wpm
          </span>
          <span
            className={`tnum flex items-center gap-1 text-sm font-semibold ${
              done ? "text-red-400" : "text-accent"
            }`}
          >
            <Clock size={13} />
            {formatClock(remaining * 1000)}
          </span>
        </div>
      }
      bodyClass="flex min-h-0 flex-col p-6"
    >
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-soft">
        <div
          className={`h-full transition-[width] duration-1000 ease-linear ${
            done ? "bg-red-500" : "bg-accent"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-edge bg-soft px-4 py-3">
        {done ? (
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-400" />
        ) : (
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-neutral-300" />
        )}
        <p className="text-[13px] leading-relaxed tracking-tight text-faint">
          The source text is gone. Write everything you can retrieve from memory before the
          timer expires. Do not edit for grammar. Retrieval, not review, builds the pathway.
        </p>
      </div>

      <textarea
        ref={notesRef}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Brain dump the material here..."
        spellCheck={false}
        className="min-h-0 flex-1 resize-none rounded-xl border border-edge bg-ink p-5 text-[15px] leading-relaxed text-neutral-200 outline-none placeholder:text-faint focus:border-white/25"
      />

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Btn variant="ghost" size="md" onClick={() => setRunning((r) => !r)} disabled={done}>
            {running ? <Pause size={13} /> : <Play size={13} />}
            {running ? "Pause Timer" : "Resume"}
          </Btn>
          <Btn variant="ghost" size="md" onClick={() => { setRemaining(DURATION); setRunning(true); }}>
            Restart 10:00
          </Btn>
          <span className="tnum text-xs tracking-tight text-faint">
            {notes.trim() ? notes.trim().split(/\s+/).length : 0} words recalled
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="ghost" size="md" onClick={onExit}>
            Back to Reading
          </Btn>
          <Btn variant="primary" size="md" onClick={handleSave} disabled={saved}>
            {saved ? <Check size={13} /> : <SquarePen size={13} />}
            {saved ? "Logged" : "Save Recall"}
          </Btn>
        </div>
      </div>
    </Panel>
  );
}
