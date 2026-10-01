import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * ============================================================================
 * Pi Cycle Top indicator — 111-day SMA vs 2× the 350-day SMA. SERVER ONLY.
 * ============================================================================
 * A cycle-top timing indicator: when the 111-day moving average crosses ABOVE
 * twice the 350-day moving average, it has historically landed within days of
 * Bitcoin's major market-cycle tops (2013, 2017, 2021). Computed from our own
 * daily closes; every crossover and distance is bounded to the window we hold.
 * It has fired only a handful of times, so treat it as one coarse signal, not a
 * forecast.
 */

const HISTORY_DIR = join(process.cwd(), "public", "data", "history");
const DAY_MS = 86400000;

interface RawHistory { slug: string; symbol: string; start: string; end: string; prices: number[]; }

function dateAt(start: string, i: number): string {
  return new Date(Date.parse(`${start}T00:00:00Z`) + i * DAY_MS).toISOString().slice(0, 10);
}

function loadHistory(slug: string): RawHistory | null {
  try { return JSON.parse(readFileSync(join(HISTORY_DIR, `${slug}.json`), "utf8")) as RawHistory; }
  catch { return null; }
}

/** Simple moving average; sma[i] = mean of the window ending at i, else null. */
function sma(prices: number[], window: number): (number | null)[] {
  const out: (number | null)[] = new Array(prices.length).fill(null);
  let sum = 0;
  for (let i = 0; i < prices.length; i++) {
    sum += prices[i];
    if (i >= window) sum -= prices[i - window];
    if (i >= window - 1) out[i] = sum / window;
  }
  return out;
}

export interface PiCyclePoint {
  date: string;
  price: number;
  ma111: number;
  ma350x2: number;
}

export interface PiCycleStudy {
  symbol: string;
  start: string;
  end: string;
  series: PiCyclePoint[]; // downsampled, oldest → newest
  /** Dates the 111-DMA crossed above 2× the 350-DMA (top signals). */
  crossovers: string[];
  price: number;
  ma111: number;
  ma350x2: number;
  /** 111-DMA ÷ 2×350-DMA, ×100. ≥100 = signal firing. */
  ratioPct: number;
  firing: boolean;
  priceMin: number;
  priceMax: number;
}

export function getPiCycleStudy(): PiCycleStudy | null {
  const h = loadHistory("bitcoin");
  if (!h || h.prices.length < 400) return null;
  const p = h.prices;
  const ma111 = sma(p, 111);
  const ma350 = sma(p, 350);

  // Crossovers: 111-DMA rising above 2×350-DMA.
  const crossovers: string[] = [];
  for (let i = 1; i < p.length; i++) {
    const a0 = ma111[i - 1], b0 = ma350[i - 1], a1 = ma111[i], b1 = ma350[i];
    if (a0 == null || b0 == null || a1 == null || b1 == null) continue;
    if (a0 < 2 * b0 && a1 >= 2 * b1) crossovers.push(dateAt(h.start, i));
  }

  // Downsample for the chart, keeping only days where both MAs exist.
  const firstValid = p.findIndex((_, i) => ma111[i] != null && ma350[i] != null);
  const stepDays = Math.max(1, Math.round((p.length - firstValid) / 540));
  const series: PiCyclePoint[] = [];
  let priceMin = Infinity, priceMax = -Infinity;
  for (let i = firstValid; i < p.length; i += stepDays) {
    if (ma111[i] == null || ma350[i] == null || !(p[i] > 0)) continue;
    const m111 = ma111[i] as number, m350x2 = (ma350[i] as number) * 2;
    series.push({ date: dateAt(h.start, i), price: p[i], ma111: m111, ma350x2: m350x2 });
    priceMin = Math.min(priceMin, p[i], m111, m350x2);
    priceMax = Math.max(priceMax, p[i], m111, m350x2);
  }
  const lastI = p.length - 1;
  const m111Last = ma111[lastI] as number;
  const m350x2Last = (ma350[lastI] as number) * 2;

  return {
    symbol: h.symbol,
    start: h.start,
    end: h.end,
    series,
    crossovers,
    price: p[lastI],
    ma111: m111Last,
    ma350x2: m350x2Last,
    ratioPct: (m111Last / m350x2Last) * 100,
    firing: m111Last >= m350x2Last,
    priceMin,
    priceMax,
  };
}
