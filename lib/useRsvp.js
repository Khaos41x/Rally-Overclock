"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useRsvp(words, wpm, onEnd) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const indexRef = useRef(0);
  const endRef = useRef(onEnd);

  useEffect(() => {
    endRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!playing) return undefined;
    if (!words.length) {
      setPlaying(false);
      return undefined;
    }

    const interval = 60000 / Math.max(1, wpm);
    let cancelled = false;
    let timer = null;
    let nextAt = performance.now() + interval;

    const step = () => {
      if (cancelled) return;
      const next = indexRef.current + 1;
      if (next >= words.length) {
        setPlaying(false);
        endRef.current?.();
        return;
      }
      indexRef.current = next;
      setIndex(next);
      nextAt += interval;
      const delay = Math.max(0, nextAt - performance.now());
      timer = window.setTimeout(step, delay);
    };

    timer = window.setTimeout(step, interval);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [playing, wpm, words]);

  const play = useCallback(() => {
    if (indexRef.current >= words.length - 1) {
      indexRef.current = 0;
      setIndex(0);
    }
    setPlaying(true);
  }, [words.length]);

  const pause = useCallback(() => setPlaying(false), []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  const reset = useCallback(() => {
    setPlaying(false);
    indexRef.current = 0;
    setIndex(0);
  }, []);

  const seek = useCallback(
    (value) => {
      const clamped = Math.min(Math.max(0, value), Math.max(0, words.length - 1));
      indexRef.current = clamped;
      setIndex(clamped);
    },
    [words.length]
  );

  return { index, playing, play, pause, toggle, reset, seek };
}
