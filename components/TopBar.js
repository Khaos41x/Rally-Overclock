"use client";

import { Activity, Flame, Gauge } from "lucide-react";

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-faint" strokeWidth={1.8} />
      <div className="leading-tight">
        <div className="tnum text-sm font-semibold tracking-tight text-neutral-100">
          {value}
        </div>
        <div className="text-[11px] tracking-tight text-faint">{label}</div>
      </div>
    </div>
  );
}

export default function TopBar({ stats }) {
  return (
    <header className="flex items-center justify-between border-b border-edge bg-panel px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent">
          <Activity size={20} className="text-black" strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <div className="text-lg font-semibold tracking-tight text-neutral-100">
            Rally Overclock
          </div>
          <div className="text-xs tracking-tight text-faint">
            Speed-reading &amp; neuroplasticity training
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <Metric
          icon={Gauge}
          value={stats.highestWpm || "--"}
          label="Peak WPM"
        />
        <Metric
          icon={Flame}
          value={`${stats.streak || 0} ${stats.streak === 1 ? "day" : "days"}`}
          label="Current streak"
        />
      </div>
    </header>
  );
}
