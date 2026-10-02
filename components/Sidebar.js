"use client";

import {
  BookOpen,
  Brain,
  Pill,
  RotateCcw,
  SquarePen,
  Target,
  TrendingUp,
} from "lucide-react";
import { Btn } from "./ui";
import { MODULES } from "../lib/constants";
import { formatSeconds } from "../lib/utils";

const MODULE_ICONS = {
  warmup: Target,
  overload: Brain,
  cruise: BookOpen,
  recall: SquarePen,
};

function VitalsRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between py-2.5">
      <span className="text-[13px] tracking-tight text-faint">{label}</span>
      <span className="tnum text-[15px] font-semibold tracking-tight text-neutral-100">
        {value}
      </span>
    </div>
  );
}

function Sparkline({ data }) {
  const values = data.map((d) => d.wpm);
  const max = Math.max(600, ...values);
  const bars = data.slice(-14);
  if (!bars.length) {
    return (
      <div className="flex h-14 items-center text-xs tracking-tight text-faint">
        No sessions logged yet
      </div>
    );
  }
  return (
    <div className="flex h-14 items-end gap-1.5">
      {bars.map((d, i) => (
        <div
          key={`${d.day}-${i}`}
          title={`${d.day}: ${d.wpm} WPM`}
          className="flex-1 rounded-full bg-accent/60 transition-colors hover:bg-accent"
          style={{ height: `${Math.max(8, (d.wpm / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export default function Sidebar({
  module,
  setModule,
  stats,
  schulteBest,
  onMaintenance,
  onReset,
  disabled,
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-edge bg-panel px-6 py-7">
      <div>
        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Train
        </h2>
        <nav className="flex flex-col gap-1.5">
          {MODULES.map((m) => {
            const Icon = MODULE_ICONS[m.id];
            const active = module === m.id;
            return (
              <button
                key={m.id}
                type="button"
                disabled={disabled}
                onClick={() => setModule(m.id)}
                className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition-colors disabled:opacity-40 ${
                  active ? "bg-soft" : "hover:bg-soft/60"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                    active
                      ? "border-transparent bg-accent text-black"
                      : "border-edge text-faint"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.9} />
                </span>
                <span className="leading-tight">
                  <span
                    className={`block text-[14px] font-medium tracking-tight ${
                      active ? "text-neutral-100" : "text-neutral-300"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] tracking-tight text-faint">
                    {m.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="my-7 h-px bg-edge" />

      <div>
        <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Vitals
        </h2>
        <div className="divide-y divide-edge">
          <VitalsRow
            label="Streak"
            value={`${stats.streak || 0} ${stats.streak === 1 ? "day" : "days"}`}
          />
          <VitalsRow label="Peak WPM" value={stats.highestWpm || "--"} />
          <VitalsRow label="Last WPM" value={stats.lastWpm || "--"} />
          <VitalsRow
            label="Schulte best"
            value={schulteBest ? formatSeconds(schulteBest) : "--"}
          />
        </div>
      </div>

      <div className="my-7 h-px bg-edge" />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-faint" strokeWidth={1.8} />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            WPM Trend
          </h2>
        </div>
        <Sparkline data={stats.history || []} />
      </div>

      <div className="mt-auto pt-7">
        <div className="rounded-2xl border border-edge bg-soft p-4">
          <div className="mb-2 flex items-center gap-2">
            <Pill size={14} className="text-neutral-200" strokeWidth={1.8} />
            <span className="text-[13px] font-semibold tracking-tight text-neutral-100">
              Maintenance Pill
            </span>
          </div>
          <p className="mb-3.5 text-[12px] leading-relaxed tracking-tight text-faint">
            30s Schulte, then 2 min of RSVP at 600 WPM.
          </p>
          <Btn variant="primary" size="md" className="w-full" onClick={onMaintenance}>
            Start Pill
          </Btn>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[11px] tracking-tight text-faint">
            Stored on this device only
          </span>
          <Btn variant="danger" size="sm" title="Wipe local stats" onClick={onReset}>
            <RotateCcw size={12} />
            Reset
          </Btn>
        </div>
      </div>
    </aside>
  );
}
