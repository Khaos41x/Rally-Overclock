export function shuffle(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function tokenize(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean);
}

export function formatClock(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatSeconds(seconds) {
  return `${seconds.toFixed(2)}s`;
}

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function daysBetween(aKey, bKey) {
  if (!aKey || !bKey) return Infinity;
  const a = new Date(`${aKey}T00:00:00`);
  const b = new Date(`${bKey}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

export function splitOrp(word) {
  const clean = word || "";
  const len = clean.length;
  const pivot = Math.min(Math.max(0, Math.round(len * 0.3)), Math.max(0, len - 1));
  return {
    left: clean.slice(0, pivot),
    focus: clean.slice(pivot, pivot + 1),
    right: clean.slice(pivot + 1),
  };
}

export function readStore(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
