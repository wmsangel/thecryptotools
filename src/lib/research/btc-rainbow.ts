import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * ============================================================================
 * Bitcoin Rainbow Chart — a logarithmic-regression band chart. SERVER ONLY.
 * ============================================================================
 * Fits a log-time regression to our own daily BTC closes — ln(price) against
 * ln(day) — then lays colour bands at fixed multiples around that centre line.
 * The bands are a long-term valuation heuristic ("fire sale" … "maximum
 * bubble"), NOT a prediction: they are drawn from the price history itself and
 * re-fit every build as new closes arrive. Everything is bounded by, and dated
 * to, the window we hold.
 */

const HISTORY_DIR = join(process.cwd(), "public", "data", "history");
const DAY_MS = 86400000;

interface RawHistory {
  slug: string;
  symbol: string;
  start: string;
  end: string;
  prices: number[];
}

function dateAt(start: string, i: number): string {
  return new Date(Date.parse(`${start}T00:00:00Z`) + i * DAY_MS).toISOString().slice(0, 10);
}

/** The nine rainbow bands, cheapest → most expensive. Colours are the chart's
 *  own meaning (blue = undervalued → red = overvalued), not the site theme. */
export const RAINBOW_BANDS = [
  { label: "Basically a fire sale", color: "#2563eb" },
  { label: "BUY!", color: "#2f8fd6" },
  { label: "Accumulate", color: "#30a7a0" },
  { label: "Still cheap", color: "#3fae5a" },
  { label: "HODL", color: "#9bbf3c" },
  { label: "Is this a bubble?", color: "#e6b800" },
  { label: "FOMO intensifies", color: "#f08a24" },
  { label: "Sell. Seriously, SELL!", color: "#e5601f" },
  { label: "Maximum bubble territory", color: "#dc2626" },
] as const;

export interface RainbowPoint {
  date: string;
  price: number;
  /** Lower boundary of each of the 9 bands at this date (ascending). */
  bounds: number[];
}

export interface RainbowStudy {
  symbol: string;
  start: string;
  end: string;
  /** Downsampled series for the chart (oldest → newest). */
  series: RainbowPoint[];
  /** Current price and which band it sits in. */
  price: number;
  bandIndex: number;
  bandLabel: string;
  bandColor: string;
  /** Regression fit quality, 0–1. */
  r2: number;
  priceMin: number;
  priceMax: number;
}

function loadHistory(slug: string): RawHistory | null {
  try {
    return JSON.parse(readFileSync(join(HISTORY_DIR, `${slug}.json`), "utf8")) as RawHistory;
  } catch {
    return null;
  }
}

/**
 * Band offsets in natural-log space, evenly spaced around the regression centre.
 * Nine bands need ten boundaries; we keep the lower boundary of each band and
 * spread them by a fixed step so the ribbon widens on the log-price axis the way
 * the classic rainbow does.
 */
const BAND_STEP = 0.45; // ln units between band boundaries
const CENTER_OFFSET = 4; // which boundary the regression line runs through

export function getRainbowStudy(): RainbowStudy | null {
  const h = loadHistory("bitcoin");
  if (!h || !h.prices.length) return null;

  // Least-squares fit of ln(price) = a + b * ln(dayIndex + 1), over positive days.
  let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < h.prices.length; i++) {
    const p = h.prices[i];
    if (!(p > 0)) continue;
    const x = Math.log(i + 1);
    const y = Math.log(p);
    n++; sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  if (n < 100) return null;
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;

  // r² for the fit.
  const meanY = sy / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < h.prices.length; i++) {
    const p = h.prices[i];
    if (!(p > 0)) continue;
    const y = Math.log(p);
    const yhat = a + b * Math.log(i + 1);
    ssTot += (y - meanY) ** 2;
    ssRes += (y - yhat) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  // Ten evenly-spaced boundaries (one per band edge) at day i, ascending, so the
  // nine bands are equal-width ribbons on the log-price axis.
  const NB = RAINBOW_BANDS.length; // 9 bands → 10 boundaries
  const boundsAt = (i: number): number[] => {
    const center = a + b * Math.log(i + 1);
    return Array.from({ length: NB + 1 }, (_, k) => Math.exp(center + (k - CENTER_OFFSET) * BAND_STEP));
  };
  // Which band a price falls in (0..8): the stripe [bounds[k], bounds[k+1]).
  const bandOf = (price: number, bounds: number[]): number => {
    let idx = 0;
    for (let k = 0; k < NB; k++) if (price >= bounds[k]) idx = k;
    return idx;
  };

  // Downsample to ~1 point/week for a light, readable chart.
  const stepDays = Math.max(1, Math.round(h.prices.length / 540));
  const series: RainbowPoint[] = [];
  let priceMin = Infinity, priceMax = -Infinity;
  for (let i = 0; i < h.prices.length; i += stepDays) {
    const p = h.prices[i];
    if (!(p > 0)) continue;
    const bounds = boundsAt(i);
    series.push({ date: dateAt(h.start, i), price: p, bounds });
    priceMin = Math.min(priceMin, p, bounds[0]);
    priceMax = Math.max(priceMax, p, bounds[bounds.length - 1]);
  }
  // Always include the very last close.
  const lastI = h.prices.length - 1;
  const lastP = h.prices[lastI];
  if (series.length && series[series.length - 1].date !== dateAt(h.start, lastI) && lastP > 0) {
    const bounds = boundsAt(lastI);
    series.push({ date: dateAt(h.start, lastI), price: lastP, bounds });
    priceMax = Math.max(priceMax, lastP, bounds[bounds.length - 1]);
  }

  const curBounds = boundsAt(lastI);
  const bandIndex = bandOf(lastP, curBounds);

  return {
    symbol: h.symbol,
    start: h.start,
    end: h.end,
    series,
    price: lastP,
    bandIndex,
    bandLabel: RAINBOW_BANDS[bandIndex].label,
    bandColor: RAINBOW_BANDS[bandIndex].color,
    r2,
    priceMin,
    priceMax,
  };
}
