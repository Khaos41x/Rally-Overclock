"use client";

import { Timer } from "lucide-react";
import SchulteTable from "./SchulteTable";
import { formatSeconds } from "../lib/utils";

function Metric({ label, value, accent = false }) {
  return (
    <div className="rounded-xl border border-edge bg-soft px-4 py-3">
      <div className="text-[11px] tracking-tight text-faint">{label}</div>
      <div
        className={`tnum mt-1 text-2xl font-semibold tracking-tight ${
          accent ? "text-accent" : "text-neutral-100"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function WarmupView({ log, onComplete }) {
  const times = log.map((l) => l.time);
  const best = times.length ? Math.min(...times) : 0;
  const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
      <SchulteTable onComplete={onComplete} />

      <div className="flex min-h-0 flex-col gap-6">
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Best" value={best ? formatSeconds(best) : "--"} accent />
          <Metric label="Average" value={avg ? formatSeconds(avg) : "--"} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-edge bg-card">
          <div className="flex items-center gap-2.5 border-b border-edge px-6 py-4">
            <Timer size={16} className="text-accent" strokeWidth={1.8} />
            <h2 className="text-[13px] font-semibold tracking-tight text-neutral-100">
              Recent Runs
            </h2>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
            {log.length === 0 ? (
              <div className="px-3 py-5 text-[13px] tracking-tight text-faint">
                Your completed runs will appear here.
              </div>
            ) : (
              log.map((l, i) => (
                <div
                  key={`${l.time}-${i}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors odd:bg-soft"
                >
                  <span className="text-xs tracking-tight text-faint">
                    Run {log.length - i}
                  </span>
                  <span className="tnum font-semibold tracking-tight text-neutral-100">
                    {formatSeconds(l.time)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
