"use client";

import { useMemo, useState } from "react";
import { Pill, Timer, Zap } from "lucide-react";
import RsvpReader from "./RsvpReader";
import SchulteTable from "./SchulteTable";
import { PLACEHOLDER_TEXT } from "../lib/constants";
import { tokenize } from "../lib/utils";

const PHASE_ONE = 30;
const PHASE_TWO = 120;
const MAINT_WPM = 600;

export default function MaintenanceSequence({ onComplete, onExit }) {
  const [phase, setPhase] = useState("schulte");

  const text = useMemo(() => {
    const base = tokenize(PLACEHOLDER_TEXT);
    const needed = MAINT_WPM * (PHASE_TWO / 60);
    const repeated = [];
    while (repeated.length < needed) repeated.push(...base);
    return repeated.slice(0, needed).join(" ");
  }, []);

  const finish = () => {
    onComplete?.(MAINT_WPM);
    onExit?.();
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-1 pb-5">
        <div className="flex items-center gap-2.5 text-[13px] font-semibold tracking-tight text-neutral-100">
          <Pill size={15} strokeWidth={1.9} />
          Maintenance Protocol
        </div>
        <div className="flex items-center gap-5 text-[12px] tracking-tight text-faint">
          <span className={phase === "schulte" ? "font-medium text-neutral-100" : ""}>
            1. Schulte 30s
          </span>
          <span className={phase === "rsvp" ? "font-medium text-neutral-100" : ""}>
            2. RSVP 120s @ 600 WPM
          </span>
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 text-faint transition-colors hover:text-red-400"
          >
            <Timer size={12} /> Abort
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {phase === "schulte" ? (
          <SchulteTable
            key="maint-schulte"
            title="Maintenance - Peripheral Ignition"
            countdown={PHASE_ONE}
            autoStart
            onComplete={() => setPhase("rsvp")}
          />
        ) : (
          <RsvpReader
            key="maint-rsvp"
            embeddedTitle="Maintenance - Overload 600 WPM"
            text={text}
            setText={() => {}}
            lockText
            autoStart
            autoPlay
            initialWpm={MAINT_WPM}
            onFinish={finish}
            onRecall={() => finish()}
          />
        )}
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-edge bg-card px-4 py-2 text-[12px] tracking-tight text-neutral-300">
        <Zap size={12} />
        Macro running
      </div>
    </div>
  );
}
