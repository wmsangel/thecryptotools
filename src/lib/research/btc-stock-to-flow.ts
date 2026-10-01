import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * ============================================================================
 * Bitcoin Stock-to-Flow (S2F) model. SERVER ONLY.
 * ============================================================================
 * Stock-to-flow = circulating supply ÷ annual issuance. Bitcoin's issuance
 * halves every ~4 years, so S2F roughly doubles at each halving. The S2F "model
 * price" fits a log-log line — ln(price) = a + b·ln(S2F) — through our daily
 * closes, which is what PlanB's original model does.
 *
 * Honest framing: supply is modelled from the known halving schedule (exact at
 * each halving height, interpolated between), and the model price is a
 * regression on past data, not a forecast. It tracked price reasonably until
 * 2021 and then diverged sharply — we show model and actual together so the gap
 * is visible rather than hidden.
 */

const HISTORY_DIR = join(process.cwd(), "public", "data", "history");
const DAY_MS = 86400000;
const BLOCKS_PER_DAY = 144; // ~10-minute blocks
const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365;

interface RawHistory { slug: string; symbol: string; start: string; end: string; prices: number[]; }

function dateAt(start: string, i: number): string {
  return new Date(Date.parse(`${start}T00:00:00Z`) + i * DAY_MS).toISOString().slice(0, 10);
}
function loadHistory(slug: string): RawHistory | null {
  try { return JSON.parse(readFileSync(join(HISTORY_DIR, `${slug}.json`), "utf8")) as RawHistory; }
  catch { return null; }
}

/** Halving eras: cumulative supply is EXACT at each halving height (210,000
 *  blocks × reward), with linear interpolation between. */
const ERAS = [
  { from: "2009-01-03", supply: 0, reward: 50 },
  { from: "2012-11-28", supply: 10_500_000, reward: 25 },
  { from: "2016-07-09", supply: 15_750_000, reward: 12.5 },
  { from: "2020-05-11", supply: 18_375_000, reward: 6.25 },
  { from: "2024-04-20", supply: 19_687_500, reward: 3.125 },
  { from: "2028-05-01", supply: 20_343_750, reward: 1.5625 }, // estimated next
].map((e) => ({ ...e, ms: Date.parse(`${e.from}T00:00:00Z`) }));

function supplyAndReward(ms: number): { supply: number; reward: number } {
  let idx = 0;
  for (let i = 0; i < ERAS.length; i++) if (ms >= ERAS[i].ms) idx = i;
  const e = ERAS[idx];
  const next = ERAS[idx + 1];
  if (next) {
    // Linear interpolation between two known cumulative-supply anchors.
    const frac = Math.min(1, Math.max(0, (ms - e.ms) / (next.ms - e.ms)));
    return { supply: e.supply + frac * (next.supply - e.supply), reward: e.reward };
  }
  const days = (ms - e.ms) / DAY_MS;
  return { supply: e.supply + days * BLOCKS_PER_DAY * e.reward, reward: e.reward };
}

export interface S2FPoint {
  date: string;
  price: number;
  model: number;
  s2f: number;
}

export interface S2FStudy {
  symbol: string;
  start: string;
  end: string;
  series: S2FPoint[]; // downsampled, oldest → newest
  price: number;
  model: number;
  s2f: number;
  /** Actual ÷ model, ×100. <100 = price below the model line. */
  ratioPct: number;
  r2: number;
  priceMin: number;
  priceMax: number;
}

export function getStockToFlowStudy(): S2FStudy | null {
  const h = loadHistory("bitcoin");
  if (!h || h.prices.length < 200) return null;

  // Precompute S2F per day and fit ln(price) = a + b·ln(S2F).
  const startMs = Date.parse(`${h.start}T00:00:00Z`);
  const s2fByDay: number[] = new Array(h.prices.length);
  let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < h.prices.length; i++) {
    const ms = startMs + i * DAY_MS;
    const { supply, reward } = supplyAndReward(ms);
    const flow = reward * BLOCKS_PER_YEAR;
    const s2f = flow > 0 ? supply / flow : 0;
    s2fByDay[i] = s2f;
    const price = h.prices[i];
    if (price > 0 && s2f > 0) {
      const x = Math.log(s2f), y = Math.log(price);
      n++; sx += x; sy += y; sxx += x * x; sxy += x * y;
    }
  }
  if (n < 100) return null;
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;

  const meanY = sy / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < h.prices.length; i++) {
    const price = h.prices[i], s2f = s2fByDay[i];
    if (!(price > 0) || !(s2f > 0)) continue;
    const y = Math.log(price), yhat = a + b * Math.log(s2f);
    ssTot += (y - meanY) ** 2; ssRes += (y - yhat) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  const modelOf = (s2f: number) => Math.exp(a + b * Math.log(s2f));

  const stepDays = Math.max(1, Math.round(h.prices.length / 540));
  const series: S2FPoint[] = [];
  let priceMin = Infinity, priceMax = -Infinity;
  for (let i = 0; i < h.prices.length; i += stepDays) {
    const price = h.prices[i], s2f = s2fByDay[i];
    if (!(price > 0) || !(s2f > 0)) continue;
    const model = modelOf(s2f);
    series.push({ date: dateAt(h.start, i), price, model, s2f });
    priceMin = Math.min(priceMin, price, model);
    priceMax = Math.max(priceMax, price, model);
  }

  const lastI = h.prices.length - 1;
  const lastS2f = s2fByDay[lastI];
  const lastModel = modelOf(lastS2f);
  return {
    symbol: h.symbol,
    start: h.start,
    end: h.end,
    series,
    price: h.prices[lastI],
    model: lastModel,
    s2f: lastS2f,
    ratioPct: (h.prices[lastI] / lastModel) * 100,
    r2,
    priceMin,
    priceMax,
  };
}
