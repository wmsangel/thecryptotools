import { readFileSync } from "node:fs";
import { join } from "node:path";
import { historyThrough } from "@/lib/backtest/history-index";

/**
 * ============================================================================
 * "Crypto seasonality" — average return by calendar month. SERVER ONLY.
 * ============================================================================
 * A fourth link-bait study, built from the same daily closes the backtester
 * replays. It answers the evergreen, endlessly-quoted question — "is September
 * really bad for crypto, is Q4 really good?" — with the actual monthly numbers
 * rather than folklore.
 *
 * Method: reduce each coin's daily series to month-end closes, take the return
 * between consecutive month-ends, and group those returns by calendar month.
 * A partial first or last calendar month is dropped so no return is measured
 * from a mid-month baseline. Every figure is bounded by the window we hold and
 * dated — averages are skewed upward by crypto's early explosive years, which
 * is exactly why the positive-rate (how often the month was green) is reported
 * alongside the mean.
 */

const HISTORY_DIR = join(process.cwd(), "public", "data", "history");
const DAY_MS = 86_400_000;

interface PriceHistory {
  slug: string;
  symbol: string;
  start: string;
  end: string;
  prices: number[];
}

function loadHistory(slug: string): PriceHistory | null {
  try {
    return JSON.parse(readFileSync(join(HISTORY_DIR, `${slug}.json`), "utf8")) as PriceHistory;
  } catch {
    return null;
  }
}

/** ISO date of the entry `i` days after the series start. */
function dateAt(start: string, i: number): string {
  return new Date(Date.parse(`${start}T00:00:00Z`) + i * DAY_MS).toISOString().slice(0, 10);
}

/** Same ten majors as the correlation and drawdown studies. */
const STUDY_ASSETS = [
  "bitcoin", "ethereum", "xrp", "bnb", "solana",
  "dogecoin", "cardano", "chainlink", "litecoin", "polkadot",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthStat {
  /** 1–12. */
  month: number;
  name: string;
  short: string;
  /** Mean month-over-month return for this calendar month, %. */
  avgReturn: number;
  /** Share of years this month closed higher than the last, %. */
  positiveRate: number;
  /** Number of observations (years) behind the figure. */
  samples: number;
}

interface Seasonality {
  months: MonthStat[];
  best: MonthStat;
  worst: MonthStat;
}

export interface SeasonalityStudy {
  through: string;
  /** Length of the Bitcoin series in years (the longest we hold). */
  years: number;
  bitcoin: Seasonality & { symbol: string };
  majors: Seasonality & { assetCount: number };
}

/** Ordered last-close of each fully-covered calendar month in the series. */
function monthEndCloses(h: PriceHistory): { key: string; close: number }[] {
  const out: { key: string; close: number }[] = [];
  let prevKey: string | null = null;
  let prevClose = 0;
  for (let i = 0; i < h.prices.length; i++) {
    const key = dateAt(h.start, i).slice(0, 7); // YYYY-MM
    if (prevKey !== null && key !== prevKey) out.push({ key: prevKey, close: prevClose });
    prevKey = key;
    prevClose = h.prices[i];
  }
  // Include the final month only if `end` is genuinely its last day.
  const dayAfterEnd = new Date(Date.parse(`${h.end}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10);
  if (dayAfterEnd.slice(0, 7) !== h.end.slice(0, 7) && prevKey !== null) {
    out.push({ key: prevKey, close: prevClose });
  }
  // Drop the first month-end when the series starts mid-month, so no return is
  // measured from a partial-month baseline.
  if (h.start.slice(8, 10) !== "01") out.shift();
  return out;
}

/** Monthly returns grouped by calendar month, from a coin's month-end closes. */
function returnsByMonth(h: PriceHistory): number[][] {
  const ends = monthEndCloses(h);
  const buckets: number[][] = Array.from({ length: 12 }, () => []);
  for (let k = 1; k < ends.length; k++) {
    const month = Number(ends[k].key.slice(5, 7)); // 1–12
    buckets[month - 1].push(ends[k].close / ends[k - 1].close - 1);
  }
  return buckets;
}

function summarise(buckets: number[][]): Seasonality {
  const months: MonthStat[] = buckets.map((rets, idx) => {
    const n = rets.length;
    const avg = n ? rets.reduce((s, x) => s + x, 0) / n : 0;
    const pos = n ? rets.filter((x) => x > 0).length / n : 0;
    return {
      month: idx + 1,
      name: MONTH_NAMES[idx],
      short: MONTH_SHORT[idx],
      avgReturn: avg * 100,
      positiveRate: pos * 100,
      samples: n,
    };
  });
  const ranked = [...months].filter((m) => m.samples > 0).sort((a, b) => b.avgReturn - a.avgReturn);
  return { months, best: ranked[0], worst: ranked[ranked.length - 1] };
}

let cache: SeasonalityStudy | null | undefined;

export function getSeasonalityStudy(): SeasonalityStudy | null {
  if (cache !== undefined) return cache;

  const btcHistory = loadHistory("bitcoin");
  if (!btcHistory) return (cache = null);

  const btc = summarise(returnsByMonth(btcHistory));

  // Pool every coin's monthly returns into one set of 12 buckets — a robustness
  // check that the pattern is not a Bitcoin quirk.
  const pooled: number[][] = Array.from({ length: 12 }, () => []);
  let assetCount = 0;
  for (const slug of STUDY_ASSETS) {
    const h = loadHistory(slug);
    if (!h) continue;
    assetCount++;
    const buckets = returnsByMonth(h);
    for (let m = 0; m < 12; m++) pooled[m].push(...buckets[m]);
  }
  const majors = summarise(pooled);

  const years =
    (Date.parse(btcHistory.end) - Date.parse(btcHistory.start)) / (365.25 * DAY_MS);

  cache = {
    through: historyThrough,
    years: Math.round(years),
    bitcoin: { symbol: btcHistory.symbol, ...btc },
    majors: { assetCount, ...majors },
  };
  return cache;
}
