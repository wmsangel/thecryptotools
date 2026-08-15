import { readFileSync } from "node:fs";
import { join } from "node:path";
import { correlationMatrix } from "./engine";
import type { CorrelationMatrix, PriceHistory } from "./types";

/**
 * ============================================================================
 * Build-time reads of the price snapshot. SERVER ONLY.
 * ============================================================================
 * Uses `node:fs`, so importing this from a client component breaks the build —
 * which is the intended guard rail. The point is that the default correlation
 * matrix is computed while the site is being generated and ends up as real
 * numbers inside the HTML, rather than as a fetch the visitor's browser has to
 * make and a crawler will never run. The interactive version on top of it can
 * then be a progressive enhancement instead of the only way to see anything.
 *
 * The files it reads are the same ones the browser fetches, so the static table
 * and the interactive one cannot disagree.
 */

const HISTORY_DIR = join(process.cwd(), "public", "data", "history");

export function loadHistory(slug: string): PriceHistory | null {
  try {
    return JSON.parse(readFileSync(join(HISTORY_DIR, `${slug}.json`), "utf8")) as PriceHistory;
  } catch {
    return null;
  }
}

export function loadHistories(slugs: string[]): PriceHistory[] {
  return slugs.map(loadHistory).filter((h): h is PriceHistory => h !== null);
}

/** ISO date `years` before `iso`, keeping the day of month. */
export function yearsBefore(iso: string, years: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y - years, m - 1, d)).toISOString().slice(0, 10);
}

export interface CorrelationWindow {
  id: string;
  label: string;
  /** Sentence the page uses to say what this window is for. */
  note: string;
  years: number;
}

/**
 * Three windows, because one correlation number is a half-truth.
 *
 * Correlations move — assets that looked independent over five years often
 * spent the last twelve months moving in lockstep, and the recent figure is the
 * one that describes the portfolio someone holds today. Showing all three makes
 * that drift visible instead of hiding it behind whichever window flattered the
 * point being made.
 */
export const CORRELATION_WINDOWS: CorrelationWindow[] = [
  { id: "1y", label: "Last year", years: 1, note: "How these assets are behaving now." },
  { id: "3y", label: "Last 3 years", years: 3, note: "Long enough to cover a full swing in sentiment." },
  { id: "5y", label: "Last 5 years", years: 5, note: "A whole cycle, for the assets old enough to have one." },
];

export interface WindowedCorrelation {
  window: CorrelationWindow;
  matrix: CorrelationMatrix;
  /** Assets left out because they are younger than the window. */
  excluded: { symbol: string; start: string }[];
}

/**
 * A matrix for one window, over the assets that actually existed for all of it.
 *
 * A young asset must be dropped rather than measured over the shorter stretch it
 * does have: a five-year table where one column secretly covers eighteen months
 * is not a five-year table, and the pair that looks least correlated in it is
 * usually just the one measured over a different period. Whatever gets dropped
 * is returned so the page can name it.
 */
export function buildCorrelation(
  slugs: string[],
  through: string,
  window: CorrelationWindow,
): WindowedCorrelation | null {
  const start = yearsBefore(through, window.years);
  const histories = loadHistories(slugs);
  const eligible = histories.filter((h) => h.start <= start);
  const excluded = histories
    .filter((h) => h.start > start)
    .map((h) => ({ symbol: h.symbol, start: h.start }));
  if (eligible.length < 2) return null;
  const matrix = correlationMatrix(eligible, start, through);
  return matrix ? { window, matrix, excluded } : null;
}
