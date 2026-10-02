"use client";

export function Panel({ title, icon: Icon, right, children, className = "", bodyClass = "" }) {
  return (
    <section
      className={`panel flex min-h-0 flex-col overflow-hidden rounded-2xl border border-edge bg-card ${className}`}
    >
      <header className="flex items-center justify-between gap-4 border-b border-edge px-6 py-4">
        <div className="flex items-center gap-2.5">
          {Icon ? <Icon size={16} className="text-accent" strokeWidth={1.8} /> : null}
          <h2 className="text-[13px] font-semibold tracking-tight text-neutral-100">
            {title}
          </h2>
        </div>
        {right}
      </header>
      <div className={`min-h-0 flex-1 ${bodyClass}`}>{children}</div>
    </section>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  size = "md",
  active = false,
  disabled = false,
  className = "",
  title,
}) {
  const base =
    "btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-35 select-none";
  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2 text-[13px]",
    lg: "px-6 py-2.5 text-sm",
  };
  const variants = {
    primary: "bg-accent text-black hover:bg-white",
    solid: "bg-neutral-200 text-black hover:bg-white",
    ghost: "border border-edge bg-transparent text-neutral-300 hover:bg-soft",
    danger: "border border-edge bg-transparent text-faint hover:text-red-400 hover:border-red-500/30",
    active: "bg-soft text-neutral-100 ring-1 ring-inset ring-white/15",
  };
  const v = active ? "active" : variant;
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[v]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Stat({ label, value, unit, accent = false }) {
  return (
    <div className="rounded-xl border border-edge bg-soft px-4 py-3">
      <div className="text-[11px] font-medium tracking-tight text-faint">{label}</div>
      <div
        className={`tnum mt-1 text-2xl font-semibold leading-none tracking-tight ${
          accent ? "text-accent" : "text-neutral-100"
        }`}
      >
        {value}
        {unit ? <span className="ml-1 text-xs font-normal text-faint">{unit}</span> : null}
      </div>
    </div>
  );
}

export function Slider({ label, value, min, max, step = 10, onChange, suffix = "WPM" }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 text-xs font-medium tracking-tight text-faint">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer"
      />
      <div className="tnum w-20 text-right text-sm font-semibold text-neutral-100">
        {value}
        <span className="ml-1 text-[11px] font-normal text-faint">{suffix}</span>
      </div>
    </div>
  );
}
