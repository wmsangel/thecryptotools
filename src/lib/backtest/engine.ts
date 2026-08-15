import type {
  BacktestInput,
  BacktestResult,
  Contribution,
  Frequency,
  PriceHistory,
  ValuePoint,
} from "./types";

const DAY = 86_400_000;

/** Parse an ISO date as UTC midnight. `new Date("2020-01-01")` already is, but
 *  `new Date(2020, 0, 1)` is local — mixing the two shifts results by a day in
 *  half the world's timezones, so everything here goes through this. */
export function parseDay(iso: string): number {
  return Date.UTC(
    Number(iso.slice(0, 4)),
    Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10)),
  );
}

export function toIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

const daysBetween = (a: number, b: number) => Math.round((b - a) / DAY);

/** Contribution dates from `from` to `to`, inclusive of the first. */
function schedule(fromMs: number, toMs: number, frequency: Frequency): number[] {
  const dates: number[] = [];
  if (frequency === "monthly") {
    // Calendar months, not 30-day steps: someone paid on the 1st contributes on
    // the 1st. A day-of-month past the end of a short month (the 31st in
    // February) clamps to the last day rather than spilling into March.
    const start = new Date(fromMs);
    const dom = start.getUTCDate();
    let year = start.getUTCFullYear();
    let month = start.getUTCMonth();
    for (;;) {
      const lastOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const ms = Date.UTC(year, month, Math.min(dom, lastOfMonth));
      if (ms > toMs) break;
      if (ms >= fromMs) dates.push(ms);
      month++;
      if (month > 11) { month = 0; year++; }
    }
    return dates;
  }
  const step = (frequency === "weekly" ? 7 : 14) * DAY;
  for (let ms = fromMs; ms <= toMs; ms += step) dates.push(ms);
  return dates;
}

/** Price on a given day, or null when the date is outside the series. */
function priceOn(history: PriceHistory, ms: number): number | null {
  const index = daysBetween(parseDay(history.start), ms);
  if (index < 0 || index >= history.prices.length) return null;
  return history.prices[index];
}

/**
 * Largest peak-to-trough fall in PORTFOLIO VALUE, not in price.
 *
 * These differ under DCA and the difference is the point: buying through a
 * crash adds units, so the portfolio can recover while the price has not. A
 * drawdown quoted from the price chart would overstate what the investor
 * actually lived through.
 */
function maxDrawdown(series: ValuePoint[]): { from: string; to: string; pct: number } {
  let peak = -Infinity;
  let peakDate = series[0]?.date ?? "";
  let worst = { from: peakDate, to: peakDate, pct: 0 };
  for (const point of series) {
    if (point.value > peak) {
      peak = point.value;
      peakDate = point.date;
    }
    if (peak > 0) {
      const fall = ((peak - point.value) / peak) * 100;
      if (fall > worst.pct) worst = { from: peakDate, to: point.date, pct: fall };
    }
  }
  return worst;
}

/**
 * Money-weighted annualised return, found by bisection on the discount rate
 * that makes the contributions' present value equal the final value.
 *
 * Bisection rather than Newton's method on purpose: it cannot diverge, and the
 * inputs here are user-supplied and occasionally degenerate (a coin down 99%,
 * a single contribution yesterday). Being slower and always converging is the
 * right trade for something that runs once per keystroke on a phone.
 */
function annualisedReturn(contributions: Contribution[], finalValue: number, endMs: number): number | null {
  if (contributions.length === 0 || finalValue <= 0) return null;
  const totalIn = contributions.reduce((sum, c) => sum + c.invested, 0);
  if (totalIn <= 0) return null;

  const years = (ms: number) => (endMs - ms) / (365.2425 * DAY);
  const pv = (rate: number) =>
    contributions.reduce((sum, c) => sum + c.invested * Math.pow(1 + rate, years(parseDay(c.date))), 0);

  // −99.99% to +1000% a year covers everything crypto has actually done.
  let low = -0.9999;
  let high = 10;
  if (pv(low) > finalValue || pv(high) < finalValue) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2;
    if (pv(mid) > finalValue) high = mid;
    else low = mid;
  }
  return ((low + high) / 2) * 100;
}

/**
 * Replay a strategy against real daily closes.
 *
 * Never invents a price: if the requested start predates the history, the start
 * is moved to the first day we actually have and `clampedStart` is set so the
 * page can say so, rather than quietly answering a different question.
 */
export function runBacktest(history: PriceHistory, input: BacktestInput): BacktestResult | null {
  if (!history.prices.length || !(input.amount > 0)) return null;

  const historyStart = parseDay(history.start);
  const historyEnd = parseDay(history.end);

  const requestedFrom = parseDay(input.from);
  const fromMs = Math.max(requestedFrom, historyStart);
  const toMs = Math.min(parseDay(input.to), historyEnd);
  if (toMs < fromMs) return null;

  const dates = input.strategy === "lump" ? [fromMs] : schedule(fromMs, toMs, input.frequency);
  if (dates.length === 0) return null;

  const contributions: Contribution[] = [];
  for (const ms of dates) {
    const price = priceOn(history, ms);
    if (price == null || price <= 0) continue;
    contributions.push({
      date: toIso(ms),
      invested: input.amount,
      price,
      units: input.amount / price,
    });
  }
  if (contributions.length === 0) return null;

  // Value the portfolio on every day of the period, accumulating units as each
  // contribution date is passed.
  const series: ValuePoint[] = [];
  let units = 0;
  let invested = 0;
  let next = 0;
  const totalDays = daysBetween(fromMs, toMs);
  for (let d = 0; d <= totalDays; d++) {
    const ms = fromMs + d * DAY;
    while (next < contributions.length && parseDay(contributions[next].date) <= ms) {
      units += contributions[next].units;
      invested += contributions[next].invested;
      next++;
    }
    const price = priceOn(history, ms);
    if (price == null) continue;
    series.push({ day: d, date: toIso(ms), invested, value: units * price });
  }
  if (series.length === 0) return null;

  const totalInvested = contributions.reduce((sum, c) => sum + c.invested, 0);
  const lastPrice = series[series.length - 1].value / units;
  const finalValue = units * lastPrice;
  const profit = finalValue - totalInvested;
  const years = daysBetween(parseDay(contributions[0].date), toMs) / 365.2425;

  const best = series.reduce((a, b) => (b.value > a.value ? b : a), series[0]);

  return {
    input,
    history: { symbol: history.symbol, source: history.source, start: history.start, end: history.end },
    actualFrom: toIso(fromMs),
    actualTo: toIso(toMs),
    clampedStart: requestedFrom < historyStart,

    totalInvested,
    units,
    finalValue,
    profit,
    roi: (profit / totalInvested) * 100,
    // Deliberately null for DCA — see the note on `cagr` in types.ts.
    cagr:
      input.strategy === "lump" && years > 0 && totalInvested > 0 && finalValue > 0
        ? (Math.pow(finalValue / totalInvested, 1 / years) - 1) * 100
        : null,
    annualised: annualisedReturn(contributions, finalValue, toMs),

    firstPrice: contributions[0].price,
    lastPrice,
    averageEntry: totalInvested / units,

    bestDay: { date: best.date, value: best.value },
    worstDrawdown: maxDrawdown(series),

    contributions,
    series,
  };
}
