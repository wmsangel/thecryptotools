/**
 * ============================================================================
 * Grid-bot backtest — replaying a spot grid strategy against real daily closes.
 * ============================================================================
 * Shares the same static per-coin history (`/data/history/<slug>.json`) and the
 * same honesty discipline as the investment backtest in engine.ts: never invent
 * a price, always report the date the data ends, and compare against the one
 * benchmark that actually matters for a grid — buying and holding the same money.
 *
 * The model is a standard exchange spot grid (Pionex / Binance / Bitget style):
 *   • `grids` price lines are laid between `lower` and `upper`.
 *   • The pot is split equally into `grids − 1` rungs; each rung is one buy/sell
 *     pair: buy at its lower line, sell one line up.
 *   • On start the bot buys the rungs that sit ABOVE the current price (so it has
 *     coin to sell as price rises) and rests buy orders on the rungs BELOW it.
 *   • Thereafter a resting buy fills when a daily close crosses its line downward
 *     and the matching sell fills when a later close crosses the next line up.
 *
 * Fills are at the grid-line price (a limit order), fee is charged on both legs.
 * Daily closes mean intraday wicks that would have triggered extra fills are not
 * counted — the result is therefore conservative, which the page says out loud.
 */
import type { PriceHistory, ValuePoint } from "./types";
import { parseDay, toIso } from "./engine";

const DAY = 86_400_000;

export interface GridBacktestInput {
  /** Bottom of the grid range, in quote currency (USD). */
  lower: number;
  /** Top of the grid range. */
  upper: number;
  /** Number of grid lines (≥ 2). Rungs traded = grids − 1. */
  grids: number;
  /** Total quote committed to the bot. */
  investment: number;
  /** Fee per trade, as a percentage (both legs charged). */
  feePct: number;
  /** Equal-dollar ("arithmetic") or equal-percent ("geometric") spacing. */
  spacing: "arithmetic" | "geometric";
  /** ISO start date, clamped to the history. */
  from: string;
  /** ISO end date, normally the last day of history. */
  to: string;
}

export interface GridBacktestResult {
  input: GridBacktestInput;
  history: Pick<PriceHistory, "symbol" | "source" | "start" | "end">;
  actualFrom: string;
  actualTo: string;
  clampedStart: boolean;

  gridLines: number[];

  totalInvested: number;
  finalValue: number;
  profit: number;
  roi: number;

  /** Profit banked from completed buy→sell cycles (the grid's own income). */
  realizedProfit: number;
  /** Completed sell legs — how many grid cycles closed. */
  completedTrades: number;
  /** Total buy legs, including the opening position. */
  buyCount: number;
  /** Market value of coin still held at the end (open position). */
  openPositionValue: number;

  /** Buying and holding the same money at the start, one fee paid. */
  holdValue: number;
  holdRoi: number;
  /** finalValue / holdValue − 1, as a percentage. Positive = grid won. */
  vsHoldPct: number;

  daysTotal: number;
  daysInRange: number;
  inRangePct: number;
  leftRangeLow: boolean;
  leftRangeHigh: boolean;

  firstPrice: number;
  lastPrice: number;
  worstDrawdown: { from: string; to: string; pct: number };

  series: ValuePoint[];
}

const daysBetween = (a: number, b: number) => Math.round((b - a) / DAY);

function priceOn(history: PriceHistory, ms: number): number | null {
  const index = daysBetween(parseDay(history.start), ms);
  if (index < 0 || index >= history.prices.length) return null;
  return history.prices[index];
}

/** `grids` prices from lower to upper, equal $ apart or equal % apart. */
export function gridLines(lower: number, upper: number, grids: number, geometric: boolean): number[] {
  const n = Math.max(2, Math.floor(grids));
  const lines: number[] = [];
  if (geometric) {
    const ratio = Math.pow(upper / lower, 1 / (n - 1));
    for (let i = 0; i < n; i++) lines.push(lower * Math.pow(ratio, i));
  } else {
    const step = (upper - lower) / (n - 1);
    for (let i = 0; i < n; i++) lines.push(lower + step * i);
  }
  return lines;
}

function maxDrawdown(series: ValuePoint[]): { from: string; to: string; pct: number } {
  let peak = -Infinity;
  let peakDate = series[0]?.date ?? "";
  const worst = { from: peakDate, to: peakDate, pct: 0 };
  for (const point of series) {
    if (point.value > peak) {
      peak = point.value;
      peakDate = point.date;
    }
    if (peak > 0) {
      const fall = ((peak - point.value) / peak) * 100;
      if (fall > worst.pct) {
        worst.from = peakDate;
        worst.to = point.date;
        worst.pct = fall;
      }
    }
  }
  return worst;
}

/**
 * Replay a grid bot against real daily closes. Returns null for a degenerate
 * configuration rather than a misleading zero.
 */
export function runGridBacktest(history: PriceHistory, input: GridBacktestInput): GridBacktestResult | null {
  const grids = Math.max(2, Math.floor(input.grids));
  const rungs = grids - 1;
  if (!history.prices.length) return null;
  if (!(input.upper > input.lower) || !(input.lower > 0)) return null;
  if (!(input.investment > 0)) return null;

  const historyStart = parseDay(history.start);
  const historyEnd = parseDay(history.end);
  const requestedFrom = parseDay(input.from);
  const fromMs = Math.max(requestedFrom, historyStart);
  const toMs = Math.min(parseDay(input.to), historyEnd);
  if (toMs < fromMs) return null;

  const lines = gridLines(input.lower, input.upper, grids, input.spacing === "geometric");
  const fee = input.feePct / 100;
  const cashPerRung = input.investment / rungs;

  // Find the first and last day with an actual price in the window.
  let firstPrice: number | null = null;
  let firstMs = fromMs;
  for (let ms = fromMs; ms <= toMs; ms += DAY) {
    const p = priceOn(history, ms);
    if (p != null && p > 0) {
      firstPrice = p;
      firstMs = ms;
      break;
    }
  }
  if (firstPrice == null) return null;

  const inventory = new Array(rungs).fill(0);
  let cash = input.investment;
  let realized = 0;
  let buyCount = 0;
  let completedTrades = 0;

  // Opening position: rungs whose BUY line sits at/above the start price are
  // bought now (market, at the start price) so there is coin to sell as price
  // climbs. Rungs below the start rest as buy orders — no cash leaves yet.
  for (let i = 0; i < rungs; i++) {
    if (lines[i] >= firstPrice) {
      inventory[i] = (cashPerRung * (1 - fee)) / firstPrice;
      cash -= cashPerRung;
      buyCount++;
    }
  }

  const series: ValuePoint[] = [];
  const invSum = () => inventory.reduce((s, u) => s + u, 0);
  let prev = firstPrice;
  let daysInRange = 0;
  let minPrice = firstPrice;
  let maxPrice = firstPrice;
  let lastPrice = firstPrice;

  for (let ms = firstMs; ms <= toMs; ms += DAY) {
    const price = priceOn(history, ms);
    if (price == null || price <= 0) continue;

    // Sells: a held rung sells one line up when a close crosses that line upward.
    for (let i = 0; i < rungs; i++) {
      const sellLine = lines[i + 1];
      if (inventory[i] > 0 && prev < sellLine && price >= sellLine) {
        const proceeds = inventory[i] * sellLine * (1 - fee);
        cash += proceeds;
        realized += proceeds - cashPerRung;
        inventory[i] = 0;
        completedTrades++;
      }
    }
    // Buys: a resting rung fills when a close crosses its line downward.
    for (let i = 0; i < rungs; i++) {
      if (inventory[i] === 0 && price <= lines[i] && lines[i] < prev && cash >= cashPerRung - 1e-9) {
        inventory[i] = (cashPerRung * (1 - fee)) / lines[i];
        cash -= cashPerRung;
        buyCount++;
      }
    }

    prev = price;
    lastPrice = price;
    if (price < minPrice) minPrice = price;
    if (price > maxPrice) maxPrice = price;
    if (price >= input.lower && price <= input.upper) daysInRange++;

    series.push({
      day: daysBetween(firstMs, ms),
      date: toIso(ms),
      invested: input.investment,
      value: cash + invSum() * price,
    });
  }
  if (series.length === 0) return null;

  const finalValue = cash + invSum() * lastPrice;
  const openPositionValue = invSum() * lastPrice;
  const profit = finalValue - input.investment;

  // Buy & hold the same money at the start, one entry fee paid.
  const holdUnits = (input.investment * (1 - fee)) / firstPrice;
  const holdValue = holdUnits * lastPrice;

  return {
    input,
    history: { symbol: history.symbol, source: history.source, start: history.start, end: history.end },
    actualFrom: toIso(firstMs),
    actualTo: toIso(toMs),
    clampedStart: requestedFrom < historyStart,

    gridLines: lines,

    totalInvested: input.investment,
    finalValue,
    profit,
    roi: (profit / input.investment) * 100,

    realizedProfit: realized,
    completedTrades,
    buyCount,
    openPositionValue,

    holdValue,
    holdRoi: ((holdValue - input.investment) / input.investment) * 100,
    vsHoldPct: holdValue > 0 ? (finalValue / holdValue - 1) * 100 : 0,

    daysTotal: series.length,
    daysInRange,
    inRangePct: (daysInRange / series.length) * 100,
    leftRangeLow: minPrice < input.lower,
    leftRangeHigh: maxPrice > input.upper,

    firstPrice,
    lastPrice,
    worstDrawdown: maxDrawdown(series),

    series,
  };
}
