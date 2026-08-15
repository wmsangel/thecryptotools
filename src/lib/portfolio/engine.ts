import { parseDay, toIso } from "@/lib/backtest/engine";
import type {
  Allocation,
  AssetOutcome,
  CorrelationMatrix,
  DiversificationScore,
  PortfolioInput,
  PortfolioPoint,
  PortfolioResult,
  PriceHistory,
  RebalanceComparison,
  RebalanceFrequency,
  RiskMetrics,
} from "./types";

const DAY = 86_400_000;
/** Crypto trades every day, so a year is 365 periods and not 252. */
const YEAR = 365;
const YEAR_MS = 365.2425 * DAY;

const daysBetween = (a: number, b: number) => Math.round((b - a) / DAY);

/** Price on a given day, or null when the date falls outside the series. */
export function priceOn(history: PriceHistory, ms: number): number | null {
  const index = daysBetween(parseDay(history.start), ms);
  if (index < 0 || index >= history.prices.length) return null;
  const price = history.prices[index];
  return price > 0 ? price : null;
}

/**
 * The stretch of time every one of these assets actually existed for.
 *
 * Deliberately the intersection. A union would let a 2024 launch appear in a
 * 2018 backtest by inventing prices for the six years before it traded, which
 * is the single easiest way to make a portfolio tool lie.
 */
export function commonWindow(histories: PriceHistory[]): {
  start: string;
  end: string;
  limitedBy: { slug: string; symbol: string; start: string } | null;
} | null {
  if (histories.length === 0) return null;
  let latest = histories[0];
  let earliestEnd = histories[0].end;
  for (const h of histories) {
    if (h.start > latest.start) latest = h;
    if (h.end < earliestEnd) earliestEnd = h.end;
  }
  if (latest.start >= earliestEnd) return null;
  return {
    start: latest.start,
    end: earliestEnd,
    // Only worth naming when more than one asset is in play — with a single
    // asset "limited by itself" is noise.
    limitedBy:
      histories.length > 1
        ? { slug: latest.slug, symbol: latest.symbol, start: latest.start }
        : null,
  };
}

/** Weights as fractions summing to 1. Zero and negative entries are dropped. */
export function normaliseWeights(allocations: Allocation[]): Map<string, number> {
  const positive = allocations.filter((a) => a.weight > 0);
  const total = positive.reduce((sum, a) => sum + a.weight, 0);
  const out = new Map<string, number>();
  if (total <= 0) return out;
  for (const a of positive) out.set(a.slug, a.weight / total);
  return out;
}

/**
 * Calendar dates every `stepMonths` months after `fromMs`, up to `toMs`.
 *
 * Calendar months rather than 30-day steps, with the day-of-month clamped to
 * the length of the target month — a portfolio rebalanced on the 31st is
 * rebalanced on the 28th of February, not on the 3rd of March.
 */
function monthlySteps(fromMs: number, toMs: number, stepMonths: number): number[] {
  const start = new Date(fromMs);
  const dom = start.getUTCDate();
  const dates: number[] = [];
  for (let n = 1; ; n++) {
    const month = start.getUTCMonth() + n * stepMonths;
    const year = start.getUTCFullYear() + Math.floor(month / 12);
    const m = ((month % 12) + 12) % 12;
    const lastOfMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    const ms = Date.UTC(year, m, Math.min(dom, lastOfMonth));
    if (ms > toMs) break;
    dates.push(ms);
  }
  return dates;
}

const REBALANCE_MONTHS: Record<Exclude<RebalanceFrequency, "none">, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

/** Sample standard deviation. Sample, not population: these are observations. */
function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/** Daily simple returns from a price series. */
function returnsOf(prices: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1];
    if (prev > 0) out.push(prices[i] / prev - 1);
  }
  return out;
}

/**
 * Money-weighted annualised return, by bisection on the discount rate.
 *
 * Same reasoning as the single-asset backtest: bisection cannot diverge, and
 * these inputs are user-supplied and sometimes degenerate.
 */
function moneyWeightedReturn(
  flows: { ms: number; amount: number }[],
  finalValue: number,
  endMs: number,
): number | null {
  if (flows.length === 0 || finalValue <= 0) return null;
  const pv = (rate: number) =>
    flows.reduce(
      (sum, f) => sum + f.amount * Math.pow(1 + rate, (endMs - f.ms) / YEAR_MS),
      0,
    );
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

/** Largest peak-to-trough fall in a series, as a positive percentage. */
function maxDrawdown(points: { date: string; value: number }[]): {
  from: string;
  to: string;
  pct: number;
} {
  let peak = -Infinity;
  let peakDate = points[0]?.date ?? "";
  const worst = { from: peakDate, to: peakDate, pct: 0 };
  for (const p of points) {
    if (p.value > peak) {
      peak = p.value;
      peakDate = p.date;
    }
    if (peak > 0) {
      const fall = ((peak - p.value) / peak) * 100;
      if (fall > worst.pct) {
        worst.from = peakDate;
        worst.to = p.date;
        worst.pct = fall;
      }
    }
  }
  return worst;
}

/**
 * Replay a multi-asset portfolio against real daily closes.
 *
 * Returns null rather than a partial answer whenever the request cannot be
 * honoured — no assets, no overlap between them, nothing invested.
 */
export function runPortfolio(
  histories: PriceHistory[],
  input: PortfolioInput,
): PortfolioResult | null {
  const weights = normaliseWeights(input.allocations);
  if (weights.size === 0 || !(input.initial > 0)) return null;

  const used = histories.filter((h) => weights.has(h.slug));
  if (used.length !== weights.size) return null;

  const window = commonWindow(used);
  if (!window) return null;

  const requestedFrom = parseDay(input.from);
  const fromMs = Math.max(requestedFrom, parseDay(window.start));
  const toMs = Math.min(parseDay(input.to), parseDay(window.end));
  if (toMs <= fromMs) return null;

  const w = used.map((h) => weights.get(h.slug) as number);
  const contributionDates =
    input.monthlyContribution > 0 ? new Set(monthlySteps(fromMs, toMs, 1)) : new Set<number>();
  const rebalanceDates =
    input.rebalance === "none"
      ? new Set<number>()
      : new Set(monthlySteps(fromMs, toMs, REBALANCE_MONTHS[input.rebalance]));

  const firstPrices = used.map((h) => priceOn(h, fromMs));
  if (firstPrices.some((p) => p == null)) return null;

  const units = used.map((_, i) => (input.initial * w[i]) / (firstPrices[i] as number));
  const gains = used.map(() => 0);

  const series: PortfolioPoint[] = [];
  const flows: { ms: number; amount: number }[] = [{ ms: fromMs, amount: input.initial }];
  let invested = input.initial;
  let index = 100;
  let previousClose = input.initial;
  let previousPrices = firstPrices as number[];

  series.push({ day: 0, date: toIso(fromMs), invested, value: input.initial, index });

  const totalDays = daysBetween(fromMs, toMs);
  for (let d = 1; d <= totalDays; d++) {
    const ms = fromMs + d * DAY;
    const prices = used.map((h) => priceOn(h, ms));
    if (prices.some((p) => p == null)) continue;
    const today = prices as number[];

    // 1. Market move only — this, against yesterday's close, is the day's real
    //    return. Doing it before any cash lands is what keeps a contribution
    //    from being counted as performance.
    let valueBefore = 0;
    for (let i = 0; i < used.length; i++) {
      valueBefore += units[i] * today[i];
      gains[i] += units[i] * (today[i] - previousPrices[i]);
    }
    if (previousClose > 0) index *= valueBefore / previousClose;

    // 2. Cash in, bought at today's prices in the target proportions.
    let cash = 0;
    if (contributionDates.has(ms)) {
      cash = input.monthlyContribution;
      invested += cash;
      flows.push({ ms, amount: cash });
      for (let i = 0; i < used.length; i++) units[i] += (cash * w[i]) / today[i];
    }

    const value = valueBefore + cash;

    // 3. Drag the mix back to target, if today is one of those days.
    if (rebalanceDates.has(ms) && value > 0) {
      for (let i = 0; i < used.length; i++) units[i] = (value * w[i]) / today[i];
    }

    series.push({ day: d, date: toIso(ms), invested, value, index });
    previousClose = value;
    previousPrices = today;
  }

  if (series.length < 2) return null;

  const last = series[series.length - 1];
  const finalValue = last.value;
  const profit = finalValue - invested;
  const spanYears = daysBetween(fromMs, parseDay(last.date)) / 365.2425;

  const assets: AssetOutcome[] = used.map((h, i) => {
    const finalPrice = previousPrices[i];
    const held = units[i] * finalPrice;
    const own = returnsOf(sliceSeries(h, fromMs, toMs));
    return {
      slug: h.slug,
      symbol: h.symbol,
      targetWeight: w[i] * 100,
      finalWeight: finalValue > 0 ? (held / finalValue) * 100 : 0,
      priceReturn: ((finalPrice - (firstPrices[i] as number)) / (firstPrices[i] as number)) * 100,
      volatility: stdev(own) * Math.sqrt(YEAR) * 100,
      finalValue: held,
      profitContribution: gains[i],
    };
  });

  return {
    input,
    actualFrom: toIso(fromMs),
    actualTo: last.date,
    clamped: requestedFrom < parseDay(window.start),
    limitedBy: window.limitedBy,

    totalInvested: invested,
    finalValue,
    profit,
    roi: invested > 0 ? (profit / invested) * 100 : 0,
    moneyWeighted: moneyWeightedReturn(flows, finalValue, parseDay(last.date)),

    risk: riskFrom(series, spanYears, input.riskFreeRate),
    worstDrawdown: maxDrawdown(series),

    assets,
    series,
  };
}

/** The asset's own closes over the portfolio window, for its own volatility. */
function sliceSeries(history: PriceHistory, fromMs: number, toMs: number): number[] {
  const startIndex = daysBetween(parseDay(history.start), fromMs);
  const endIndex = daysBetween(parseDay(history.start), toMs);
  return history.prices.slice(Math.max(0, startIndex), Math.min(history.prices.length, endIndex + 1));
}

/** Risk figures, all taken from the time-weighted index rather than the balance. */
function riskFrom(series: PortfolioPoint[], years: number, riskFreeRate: number): RiskMetrics {
  const daily: number[] = [];
  let best = { date: series[0].date, pct: 0 };
  let worst = { date: series[0].date, pct: 0 };
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1].index;
    if (prev <= 0) continue;
    const r = series[i].index / prev - 1;
    daily.push(r);
    if (r > best.pct) best = { date: series[i].date, pct: r * 100 };
    if (r < worst.pct) worst = { date: series[i].date, pct: r * 100 };
  }

  const volatility = stdev(daily) * Math.sqrt(YEAR) * 100;
  const finalIndex = series[series.length - 1].index;
  const cagr =
    years > 0 && finalIndex > 0 ? (Math.pow(finalIndex / 100, 1 / years) - 1) * 100 : 0;

  // Downside deviation against a 0% daily target: only the days that lost money
  // count, which is the whole point of Sortino over Sharpe for an asset class
  // whose upside outliers are as large as its downside ones.
  const downside = daily.filter((r) => r < 0);
  const downsideDeviation =
    downside.length > 0
      ? Math.sqrt(downside.reduce((s, r) => s + r * r, 0) / daily.length) * Math.sqrt(YEAR) * 100
      : 0;

  return {
    volatility,
    cagr,
    sharpe: volatility > 0 ? (cagr - riskFreeRate) / volatility : null,
    sortino: downsideDeviation > 0 ? (cagr - riskFreeRate) / downsideDeviation : null,
    best,
    worst,
  };
}

/**
 * The same portfolio under every rebalancing policy.
 *
 * Presented as a table because the honest answer is "it depends on the mix and
 * the period", and the only way to say that without hand-waving is to show all
 * four outcomes side by side for the portfolio actually in front of the reader.
 */
export function compareRebalancing(
  histories: PriceHistory[],
  input: PortfolioInput,
): RebalanceComparison[] {
  const options: RebalanceFrequency[] = ["none", "yearly", "quarterly", "monthly"];
  const rows: RebalanceComparison[] = [];
  for (const frequency of options) {
    const result = runPortfolio(histories, { ...input, rebalance: frequency });
    if (!result) continue;
    rows.push({
      frequency,
      finalValue: result.finalValue,
      cagr: result.risk.cagr,
      volatility: result.risk.volatility,
      maxDrawdown: result.worstDrawdown.pct,
      sharpe: result.risk.sharpe,
      events:
        frequency === "none"
          ? 0
          : monthlySteps(
              parseDay(result.actualFrom),
              parseDay(result.actualTo),
              REBALANCE_MONTHS[frequency],
            ).length,
    });
  }
  return rows;
}

/**
 * Daily returns for several assets over a shared window, index-aligned.
 *
 * Every slice starts on the same calendar day, so trimming them all to the
 * shortest keeps day n of one series lined up with day n of the others.
 */
function alignedReturns(
  histories: PriceHistory[],
  from?: string,
  to?: string,
): { returns: number[][]; fromMs: number; toMs: number; length: number } | null {
  if (histories.length === 0) return null;
  const window = commonWindow(histories);
  if (!window) return null;

  const fromMs = Math.max(parseDay(from ?? window.start), parseDay(window.start));
  const toMs = Math.min(parseDay(to ?? window.end), parseDay(window.end));
  if (toMs <= fromMs) return null;

  const series = histories.map((h) => returnsOf(sliceSeries(h, fromMs, toMs)));
  const length = Math.min(...series.map((s) => s.length));
  if (length < 2) return null;
  return { returns: series.map((s) => s.slice(0, length)), fromMs, toMs, length };
}

/**
 * Pearson correlation of daily returns, pairwise.
 *
 * Returns rather than prices: two assets in a shared uptrend have correlated
 * price levels almost by definition, which is why a correlation quoted off a
 * price chart is close to meaningless. What a holder wants to know is whether
 * the two fall on the same days.
 */
export function correlationMatrix(
  histories: PriceHistory[],
  from?: string,
  to?: string,
): CorrelationMatrix | null {
  if (histories.length < 2) return null;
  const aligned = alignedReturns(histories, from, to);
  if (!aligned) return null;
  const { returns, fromMs, toMs, length } = aligned;

  const n = histories.length;
  const values: number[][] = [];
  let sum = 0;
  let pairs = 0;
  let lowest: CorrelationMatrix["lowest"] = null;
  let highest: CorrelationMatrix["highest"] = null;

  for (let i = 0; i < n; i++) {
    values.push([]);
    for (let j = 0; j < n; j++) {
      const value = i === j ? 1 : pearson(returns[i], returns[j]);
      values[i].push(value);
      if (j > i) {
        sum += value;
        pairs++;
        const pair = { a: histories[i].symbol, b: histories[j].symbol, value };
        if (!lowest || value < lowest.value) lowest = pair;
        if (!highest || value > highest.value) highest = pair;
      }
    }
  }

  return {
    symbols: histories.map((h) => h.symbol),
    slugs: histories.map((h) => h.slug),
    values,
    from: toIso(fromMs),
    to: toIso(toMs),
    days: length,
    average: pairs > 0 ? sum / pairs : 1,
    lowest,
    highest,
  };
}

function pearson(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  let meanA = 0;
  let meanB = 0;
  for (let i = 0; i < n; i++) {
    meanA += a[i];
    meanB += b[i];
  }
  meanA /= n;
  meanB /= n;
  let cov = 0;
  let varA = 0;
  let varB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    cov += da * db;
    varA += da * da;
    varB += db * db;
  }
  if (varA <= 0 || varB <= 0) return 0;
  return cov / Math.sqrt(varA * varB);
}

/**
 * What the mix bought, measured against holding the same assets in lockstep.
 *
 * Both volatilities are computed at the TARGET weights — σ_p = √(wᵀΣw) against
 * Σwᵢσᵢ — rather than from whatever the portfolio drifted into. That matters:
 * a buy-and-hold portfolio whose best asset ran from 15% to 44% is no longer
 * the mix the reader chose, and grading the mix on it would credit or blame
 * diversification for something that is really just concentration. Held at
 * target, the gap between the two figures is exactly what the assets failing to
 * move together is worth, and nothing else.
 */
export function diversification(
  histories: PriceHistory[],
  allocations: Allocation[],
  from?: string,
  to?: string,
): DiversificationScore | null {
  const weights = normaliseWeights(allocations);
  if (weights.size === 0) return null;
  const used = histories.filter((h) => weights.has(h.slug));
  if (used.length !== weights.size) return null;

  const aligned = alignedReturns(used, from, to);
  if (!aligned) return null;
  const { returns } = aligned;
  const w = used.map((h) => weights.get(h.slug) as number);

  const annualise = Math.sqrt(YEAR) * 100;
  const vols = returns.map((r) => stdev(r) * annualise);
  const weightedAverage = w.reduce((sum, weight, i) => sum + weight * vols[i], 0);

  // wᵀΣw, built from the correlations so the covariance and the individual
  // volatilities can never disagree with each other.
  let variance = 0;
  for (let i = 0; i < used.length; i++) {
    for (let j = 0; j < used.length; j++) {
      const rho = i === j ? 1 : pearson(returns[i], returns[j]);
      variance += w[i] * w[j] * vols[i] * vols[j] * rho;
    }
  }
  const portfolioVolatility = Math.sqrt(Math.max(0, variance));

  const matrix = used.length > 1 ? correlationMatrix(used, from, to) : null;

  return {
    portfolioVolatility,
    weightedAverageVolatility: weightedAverage,
    benefit:
      weightedAverage > 0
        ? ((weightedAverage - portfolioVolatility) / weightedAverage) * 100
        : 0,
    averageCorrelation: matrix?.average ?? 1,
  };
}