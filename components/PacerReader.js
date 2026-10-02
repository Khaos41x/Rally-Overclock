"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Gauge, Pause, Play, RotateCcw, SquarePen } from "lucide-react";
import { Btn, Panel, Slider } from "./ui";
import { tokenize } from "../lib/utils";
import { useRsvp } from "../lib/useRsvp";

export default function PacerReader({
  text,
  setText,
  onRecall,
  initialWpm = 400,
  embeddedTitle = "Cruise",
}) {
  const [wpm, setWpm] = useState(initialWpm);
  const [cruising, setCruising] = useState(false);
  const words = useMemo(() => tokenize(text), [text]);
  const scrollRef = useRef(null);
  const spansRef = useRef([]);

  const { index, playing, play, pause, reset, seek } = useRsvp(words, wpm);

  useEffect(() => {
    const container = scrollRef.current;
    const el = spansRef.current[index];
    if (!container || !el) return;
    const target = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top: target, behavior: "auto" });
  }, [index, cruising]);

  useEffect(() => {
    const onKey = (e) => {
      if (!cruising) return;
      if (e.code === "Space") {
        e.preventDefault();
        playing ? pause() : play();
      }
      if (e.key === "r") reset();
      if (e.key === "Escape") {
        pause();
        setCruising(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cruising, playing, play, pause, reset]);

  const handlePlay = () => {
    if (!words.length) return;
    setCruising(true);
    play();
  };

  const handleReset = () => {
    reset();
    setCruising(false);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
  };

  const progress = words.length ? ((index + (playing ? 1 : 0)) / words.length) * 100 : 0;

  return (
    <Panel
      title={embeddedTitle}
      icon={BookOpen}
      right={
        <div className="flex items-center gap-2">
          <span className="tnum text-xs tracking-tight text-faint">
            {words.length} words
          </span>
          <Btn size="sm" variant="danger" onClick={() => onRecall?.(wpm)} disabled={!words.length}>
            <SquarePen size={12} />
            Finish &amp; Recall
          </Btn>
        </div>
      }
      bodyClass="flex flex-col"
    >
      {!cruising ? (
        <div className="flex min-h-0 flex-1 flex-col p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste study text here. The highlight will drag your eyes forward."
            spellCheck={false}
            className="min-h-0 flex-1 resize-none rounded-xl border border-edge bg-ink p-5 text-sm leading-relaxed text-neutral-300 outline-none placeholder:text-faint focus:border-white/25"
          />
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-24 text-[17px] leading-[2]"
        >
          <div className="mx-auto max-w-3xl">
            {words.map((w, i) => (
              <span
                key={`${w}-${i}`}
                ref={(el) => {
                  spansRef.current[i] = el;
                }}
                className={`transition-colors duration-100 ${
                  i === index
                    ? "rounded bg-accent/20 px-1 font-semibold text-accent"
                    : i < index
                    ? "text-neutral-700"
                    : "text-neutral-300"
                }`}
              >
                {w}{" "}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-edge p-5">
        <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-soft">
          <div
            className="h-full bg-accent transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Btn variant="primary" size="md" onClick={playing ? pause : handlePlay} disabled={!words.length}>
              {playing ? <Pause size={13} /> : <Play size={13} />}
              {playing ? "Pause" : "Play"}
            </Btn>
            <Btn variant="ghost" size="md" onClick={handleReset}>
              <RotateCcw size={13} />
              Reset
            </Btn>
            <Btn
              variant="ghost"
              size="md"
              active={cruising}
              onClick={() => {
                pause();
                setCruising((c) => !c);
              }}
            >
              <Gauge size={13} />
              Cruise
            </Btn>
            <input
              type="range"
              min={0}
              max={Math.max(0, words.length - 1)}
              value={index}
              onChange={(e) => seek(Number(e.target.value))}
              className="hidden h-1 w-32 cursor-pointer md:block"
            />
          </div>
          <div className="sm:w-80">
            <Slider label="Speed" value={wpm} min={100} max={1200} step={10} onChange={setWpm} />
          </div>
        </div>
      </div>
    </Panel>
  );
}
