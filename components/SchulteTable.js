"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Crosshair, Play, RotateCcw, Target } from "lucide-react";
import { Btn, Panel } from "./ui";
import { formatSeconds, shuffle } from "../lib/utils";

const INITIAL_ORDER = Array.from({ length: 25 }, (_, i) => i + 1);

export default function SchulteTable({
  onComplete,
  countdown = null,
  autoStart = false,
  title = "Warmup",
}) {
  const [order, setOrder] = useState(INITIAL_ORDER);
  const [next, setNext] = useState(1);
  const [errors, setErrors] = useState(0);
  const [wrongCell, setWrongCell] = useState(null);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const errorsRef = useRef(errors);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  const stop = useCallback(() => {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const start = useCallback(() => {
    finishedRef.current = false;
    setOrder(shuffle(25));
    setNext(1);
    setErrors(0);
    setElapsed(0);
    setWrongCell(null);
    startRef.current = performance.now();
    setRunning(true);
  }, []);

  useEffect(() => {
    if (autoStart) start();
  }, [autoStart, start]);

  useEffect(() => {
    if (!running) return undefined;
    const loop = () => {
      const e = performance.now() - startRef.current;
      setElapsed(e);
      if (countdown && e >= countdown * 1000) {
        stop();
        if (!finishedRef.current) {
          finishedRef.current = true;
          onCompleteRef.current?.(countdown, { errors: errorsRef.current, finished: false });
        }
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, countdown, stop]);

  const handleClick = (value) => {
    if (!running || finishedRef.current) return;
    if (value === next) {
      if (next === 25) {
        stop();
        finishedRef.current = true;
        onComplete?.(elapsed / 1000, { errors, finished: true });
        setNext(26);
        return;
      }
      setNext(next + 1);
    } else {
      setErrors((e) => e + 1);
      setWrongCell(value);
      window.setTimeout(() => setWrongCell((c) => (c === value ? null : c)), 220);
    }
  };

  const timeLeft = countdown ? Math.max(0, countdown * 1000 - elapsed) : elapsed;

  return (
    <Panel
      title={title}
      icon={Target}
      right={
        <div className="flex items-center gap-3">
          <span className="tnum text-xs tracking-tight text-faint">
            errors <span className="font-semibold text-neutral-200">{errors}</span>
          </span>
          <span className="tnum text-sm font-semibold text-accent">
            {formatSeconds(Math.max(0, countdown ? timeLeft : elapsed) / 1000)}
          </span>
          <Btn size="sm" variant={running ? "ghost" : "primary"} onClick={start}>
            {running ? <RotateCcw size={12} /> : <Play size={12} />}
            {running ? "Restart" : "Start"}
          </Btn>
        </div>
      }
      bodyClass="flex flex-col items-center justify-center p-6"
    >
      <div className="mb-5 flex w-full max-w-[min(64vh,100%)] items-center justify-between text-[12px] tracking-tight text-faint">
        <span className="tnum">
          Next <span className="font-semibold text-neutral-200">{next <= 25 ? next : 25}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Crosshair size={11} /> Keep gaze on the center
        </span>
        <span className="tnum">
          {Math.min(next - 1, 25)} / 25
        </span>
      </div>

      <div className="schulte-grid relative grid aspect-square w-full max-w-[min(64vh,100%)] grid-cols-5 grid-rows-5 gap-2">
        {order.map((value) => {
          const isDone = value < next;
          const isWrong = wrongCell === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              className={`schulte-cell tnum flex items-center justify-center rounded-md border text-lg font-semibold transition-colors sm:text-2xl ${
                isWrong
                  ? "border-red-500 bg-red-500/20 text-red-300"
                  : isDone
                  ? "border-edge bg-ink text-neutral-800"
                  : "border-edge bg-panel text-neutral-100 hover:border-accent/50 hover:bg-neutral-900"
              }`}
            >
              {value}
            </button>
          );
        })}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_rgba(255,255,255,0.85)]" />
      </div>

      {!running && next > 25 ? (
        <div className="mt-4 text-sm font-semibold tracking-tight text-accent">
          Complete &middot; {formatSeconds(elapsed / 1000)}
        </div>
      ) : null}
    </Panel>
  );
}
