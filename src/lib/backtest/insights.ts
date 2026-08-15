import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PriceHistory } from "./types";

/**
 * ============================================================================
 * Per-coin facts derived from that coin's own price history. SERVER ONLY.
 * ============================================================================
 * Why this exists: `/investment-calculator/<coin>/` was carrying about 355
 * words of static text, ~90 of which is header and footer chrome, and roughly
 * 70% of the rest was identical to its 62 sibling pages. Search Console
 * responded exactly as you would expect — a handful flagged as duplicates and
 * 344 pages sitting in "discovered, not indexed". The value of those pages
 * lives in a JavaScript backtest that a crawler never runs.
 *
 * So the fix is not more pages. It is giving each page something true that is
 * only true of that coin, computed from the same daily closes the calculator
 * replays. A page about Curve now talks about Curve's actual drawdowns and
 * Curve's actual worst year, not about crypto in general with the ticker
 * swapped in.
 *
 * THE HONESTY RULE THIS MODULE IS BUILT AROUND: every figure is bounded by the
 * window we actually hold, and every sentence says so. Our Bitcoin series
 * starts in 2011 and our Curve series does not, so "the deepest fall" means
 * "the deepest fall in the data we have", never "the deepest fall ever". Do not
 * reword these into all-time claims.
 */

const HISTORY_DIR = join(process.cwd(), "public", "data", "history");
const DAY_MS = 86_400_000;

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

export interface Drawdown {
  /** Percentage fall from peak to trough, as a positive number. */
  depthPct: number;
  peakDate: string;
  troughDate: string;
  peakPrice: number;
  troughPrice: number;
  daysToTrough: number;
  /** Days from the trough back to the old peak, or null if never recovered. */
  daysToRecover: number | null;
  recoveredOn: string | null;
}

export interface YearReturn {
  year: number;
  pct: number;
  /** True where the year is incomplete at either end of our window. */
  partial: boolean;
}

export interface CoinInsights {
  symbol: string;
  source: string;
  start: string;
  end: string;
  days: number;
  years: number;
  firstPrice: number;
  lastPrice: number;
  /** Multiple on a lump sum held from the first day to the last. */
  holdMultiple: number;
  high: { price: number; date: string };
  /** How far below the window high the last close sits, as a positive %. */
  belowHighPct: number;
  worst: Drawdown;
  /** Falls of 50%+ from a running peak, counted as distinct episodes. */
  crashCount: number;
  /** Share of days spent more than 20% below the running peak. */
  underwaterPct: number;
  best: YearReturn | null;
  worstYear: YearReturn | null;
  /** Every calendar year in the window, oldest first. */
  years_: YearReturn[];
  /** Annualised standard deviation of daily returns, in %. */
  volatilityPct: number;
}

/** One drawdown episode, before recovery has been looked up. */
interface RawEpisode {
  depthPct: number;
  peakIdx: number;
  troughIdx: number;
}

/**
 * Every peak-to-trough episode, in a single pass.
 *
 * Recovery is deliberately NOT resolved here. Looking it up needs a forward
 * scan, and a long series contains well over a thousand episodes — doing that
 * for all of them is quadratic and would show up in the build time for 63
 * coins. We resolve it once, for the one episode we actually report.
 */
function episodes(prices: number[]): RawEpisode[] {
  const out: RawEpisode[] = [];
  let peak = prices[0];
  let peakIdx = 0;
  let troughIdx = -1;

  const flush = () => {
    if (troughIdx < 0) return;
    out.push({ depthPct: (1 - prices[troughIdx] / peak) * 100, peakIdx, troughIdx });
    troughIdx = -1;
  };

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] >= peak) {
      flush();
      peak = prices[i];
      peakIdx = i;
    } else if (troughIdx < 0 || prices[i] < prices[troughIdx]) {
      troughIdx = i;
    }
  }
  flush();
  return out;
}

/** Fill in the recovery leg for a single episode. */
function resolve(e: RawEpisode, prices: number[], start: string): Drawdown {
  const peakPrice = prices[e.peakIdx];
  let recoverIdx: number | null = null;
  for (let k = e.troughIdx + 1; k < prices.length; k++) {
    if (prices[k] >= peakPrice) {
      recoverIdx = k;
      break;
    }
  }
  return {
    depthPct: e.depthPct,
    peakDate: dateAt(start, e.peakIdx),
    troughDate: dateAt(start, e.troughIdx),
    peakPrice,
    troughPrice: prices[e.troughIdx],
    daysToTrough: e.troughIdx - e.peakIdx,
    daysToRecover: recoverIdx === null ? null : recoverIdx - e.troughIdx,
    recoveredOn: recoverIdx === null ? null : dateAt(start, recoverIdx),
  };
}

/**
 * Calendar-year returns. A year clipped by the edge of our window is marked
 * `partial` rather than dropped — dropping it silently would hide the year a
 * coin launched, which is usually its most dramatic.
 */
function yearReturns(prices: number[], start: string, end: string): YearReturn[] {
  const startYear = Number(start.slice(0, 4));
  const endYear = Number(end.slice(0, 4));
  const out: YearReturn[] = [];

  for (let y = startYear; y <= endYear; y++) {
    const from = Math.max(0, Math.round((Date.parse(`${y}-01-01T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY_MS));
    const toRaw = Math.round((Date.parse(`${y}-12-31T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY_MS);
    const to = Math.min(prices.length - 1, toRaw);
    if (to <= from) continue;
    const a = prices[from];
    const b = prices[to];
    if (!(a > 0) || !(b > 0)) continue;
    out.push({ year: y, pct: (b / a - 1) * 100, partial: y === startYear || to < toRaw });
  }
  return out;
}

export function coinInsights(slug: string): CoinInsights | null {
  const h = loadHistory(slug);
  if (!h || !Array.isArray(h.prices) || h.prices.length < 120) return null;

  const prices = h.prices.filter((p) => typeof p === "number" && isFinite(p) && p > 0);
  if (prices.length < 120) return null;

  const first = prices[0];
  const last = prices[prices.length - 1];

  let highPrice = prices[0];
  let highIdx = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > highPrice) {
      highPrice = prices[i];
      highIdx = i;
    }
  }

  const eps = episodes(prices);
  if (eps.length === 0) return null;
  const worst = resolve(
    eps.reduce((a, b) => (b.depthPct > a.depthPct ? b : a)),
    prices,
    h.start,
  );

  // Days more than 20% below the running peak — "underwater" in the sense a
  // holder would recognise, rather than any dip at all.
  let peak = prices[0];
  let under = 0;
  for (const p of prices) {
    if (p > peak) peak = p;
    if (p < peak * 0.8) under++;
  }

  const years = prices.length / 365.25;
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) returns.push(prices[i] / prices[i - 1] - 1);
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1);
  const volatilityPct = Math.sqrt(variance) * Math.sqrt(365) * 100;

  const yrs = yearReturns(prices, h.start, h.end);
  const complete = yrs.filter((y) => !y.partial);
  const pool = complete.length > 0 ? complete : yrs;

  return {
    symbol: h.symbol,
    source: h.source,
    start: h.start,
    end: h.end,
    days: prices.length,
    years,
    firstPrice: first,
    lastPrice: last,
    holdMultiple: last / first,
    high: { price: highPrice, date: dateAt(h.start, highIdx) },
    belowHighPct: (1 - last / highPrice) * 100,
    worst,
    crashCount: eps.filter((e) => e.depthPct >= 50).length,
    underwaterPct: (under / prices.length) * 100,
    years_: yrs,
    best: pool.reduce<YearReturn | null>((a, b) => (!a || b.pct > a.pct ? b : a), null),
    worstYear: pool.reduce<YearReturn | null>((a, b) => (!a || b.pct < a.pct ? b : a), null),
    volatilityPct,
  };
}
