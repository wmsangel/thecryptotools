import snapshot from "./snapshot.json";

/**
 * Crypto Fear & Greed Index — reads the build-time snapshot (alternative.me)
 * synchronously so the page server-renders real values. The 0–100 index and its
 * five bands are alternative.me's own definitions; we present and explain them.
 */

export interface FngPoint {
  value: number;
  classification: string;
  /** Unix seconds. */
  timestamp: number;
}

interface Snapshot {
  updated: string;
  source: string;
  data: FngPoint[];
}

const snap = snapshot as Snapshot;

/** alternative.me's five bands. */
export function classify(v: number): string {
  if (v <= 24) return "Extreme Fear";
  if (v <= 44) return "Fear";
  if (v <= 54) return "Neutral";
  if (v <= 74) return "Greed";
  return "Extreme Greed";
}

/** Band colour, red (fear) → green (greed). Tokens kept literal: the gauge is a
 *  data viz where red=fear/green=greed is the meaning, not the site theme. */
export function colorFor(v: number): string {
  if (v <= 24) return "#e5484d";
  if (v <= 44) return "#f2830a";
  if (v <= 54) return "#e0b400";
  if (v <= 74) return "#7bbf3a";
  return "#16a34a";
}

export interface FngData {
  current: FngPoint;
  previous: FngPoint | null;
  lastWeek: FngPoint | null;
  lastMonth: FngPoint | null;
  /** Oldest → newest, up to a year, for the trend chart. */
  history: FngPoint[];
  updated: string;
  source: string;
}

export function getFearGreed(): FngData {
  const data = [...snap.data].sort((a, b) => b.timestamp - a.timestamp); // newest first
  return {
    current: data[0],
    previous: data[1] ?? null,
    lastWeek: data[7] ?? null,
    lastMonth: data[30] ?? null,
    history: [...data].slice(0, 365).reverse(),
    updated: snap.updated,
    source: snap.source,
  };
}

/** ISO date (UTC) for a point, e.g. "2026-09-30". */
export function dayOf(p: FngPoint): string {
  return new Date(p.timestamp * 1000).toISOString().slice(0, 10);
}
