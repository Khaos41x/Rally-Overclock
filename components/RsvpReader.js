"use client";

import { useEffect, useMemo, useState } from "react";
import { Brain, Pause, Play, RotateCcw, SquarePen, Zap } from "lucide-react";
import { Btn, Panel, Slider } from "./ui";
import { splitOrp, tokenize } from "../lib/utils";
import { useRsvp } from "../lib/useRsvp";

function WordStage({ word }) {
  const { left, focus, right } = splitOrp(word);
  return (
    <div className="flex w-full items-center justify-center">
      <span className="flex-1 break-all text-right text-4xl font-semibold tracking-tight text-neutral-500 sm:text-5xl">
        {left}
      </span>
      <span className="text-4xl font-bold tracking-tight text-accent sm:text-5xl">
        {focus}
      </span>
      <span className="flex-1 break-all text-left text-4xl font-semibold tracking-tight text-neutral-200 sm:text-5xl">
        {right}
      </span>
    </div>
  );
}

export default function RsvpReader({
  text,
  setText,
  onRecall,
  autoStart = false,
  autoPlay = false,
  onFinish,
  initialWpm = 800,
  lockText = false,
  embeddedTitle = "Overload",
}) {
  const [wpm, setWpm] = useState(initialWpm);
  const [focus, setFocus] = useState(autoStart);
  const words = useMemo(() => tokenize(text), [text]);

  const { index, playing, play, pause, reset, seek } = useRsvp(words, wpm, () => {
    setFocus(true);
    onFinish?.();
  });

  useEffect(() => {
    if (autoPlay && words.length) {
      setFocus(true);
      play();
    }
  }, [autoPlay, words.length, play]);

  useEffect(() => {
    const onKey = (e) => {
      if (!focus) return;
      if (e.code === "Space") {
        e.preventDefault();
        playing ? pause() : play();
      }
      if (e.key === "r") reset();
      if (e.key === "Escape") {
        pause();
        setFocus(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, playing, play, pause, reset]);

  useEffect(() => {
    if (autoStart) setFocus(true);
  }, [autoStart]);

  const handlePlay = () => {
    if (!words.length) return;
    setFocus(true);
    play();
  };

  const handleReset = () => {
    reset();
    setFocus(false);
  };

  const progress = words.length ? ((index + (playing ? 1 : 0)) / words.length) * 100 : 0;

  return (
    <Panel
      title={embeddedTitle}
      icon={Brain}
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
      {!focus ? (
        <div className="flex min-h-0 flex-1 flex-col p-6">
          <textarea
            value={text}
            readOnly={lockText}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste study text here. Subvocalization dies at 800 WPM."
            spellCheck={false}
            className="min-h-0 flex-1 resize-none rounded-xl border border-edge bg-ink p-5 text-sm leading-relaxed text-neutral-300 outline-none placeholder:text-faint focus:border-white/25"
          />
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-accent/25 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-[28%] h-px w-4 -translate-x-1/2 bg-accent/60" />
          <div className="pointer-events-none absolute left-1/2 bottom-[28%] h-px w-4 -translate-x-1/2 bg-accent/60" />
          <div className="w-full max-w-4xl" key={index}>
            {words.length ? (
              <WordStage word={words[index]} />
            ) : (
              <div className="text-center text-sm text-muted">No text loaded.</div>
            )}
          </div>
          <div className="tnum mt-8 text-xs tracking-tight text-faint">
            {index + 1} / {words.length}
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
              active={focus}
              onClick={() => {
                pause();
                setFocus((f) => !f);
              }}
            >
              <Zap size={13} />
              Focus Mode
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
            <Slider label="Speed" value={wpm} min={200} max={1000} step={10} onChange={setWpm} />
          </div>
        </div>
      </div>
    </Panel>
  );
}
