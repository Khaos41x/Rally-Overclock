"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "./constants";
import { dayKey, daysBetween, readStore, writeStore } from "./utils";

const EMPTY = {
  streak: 0,
  lastDate: null,
  highestWpm: 0,
  lastWpm: 0,
  sessions: 0,
  history: [],
};

export function useRallyStats() {
  const [stats, setStats] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStore(STORAGE_KEYS.stats, EMPTY);
    setStats({ ...EMPTY, ...stored });
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.stats, stats);
  }, [stats, ready]);

  const touchStreak = useCallback(() => {
    setStats((prev) => {
      const today = dayKey();
      if (prev.lastDate === today) return prev;
      const gap = daysBetween(prev.lastDate, today);
      const streak = gap === 1 ? prev.streak + 1 : 1;
      return { ...prev, streak, lastDate: today };
    });
  }, []);

  const recordWpm = useCallback((wpm) => {
    const value = Math.round(wpm);
    if (!value || value <= 0) return;
    setStats((prev) => {
      const day = dayKey();
      const history = [
        ...prev.history.filter((h) => h.day !== day),
        { day, wpm: value },
      ].slice(-30);
      return {
        ...prev,
        lastWpm: value,
        highestWpm: Math.max(prev.highestWpm, value),
        sessions: prev.sessions + 1,
        history,
      };
    });
  }, []);

  const resetAll = useCallback(() => setStats(EMPTY), []);

  return { stats, ready, touchStreak, recordWpm, resetAll };
}
