import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PriceHistory } from "@/lib/backtest/types";
import type { Coin } from "./types";

/**
 * ============================================================================
 * Per-(coin × tool) unique facts. SERVER ONLY (reads price history from disk).
 * ============================================================================
 * The 343 `/coins/<coin>/<tool>/` pages carried tool prose that was identical
 * across coins bar a swapped ticker, which is why so many sat in "discovered,
 * not indexed". This gives each page something true only of that coin AND
 * framed around that specific tool's question.
 *
 * TWO TRAPS THIS MODULE IS BUILT TO AVOID, both from the earlier sweep:
 *  1. Do NOT repeat `/investment-calculator/<coin>/`. That page owns the
 *     LONG-TERM story (hold multiple, worst drawdown, best/worst YEAR). So here
 *     we only use SHORT-TERM, distributional figures from the last 12 months —
 *     52-week range, the typical DAY, the biggest single day. Different numbers,
 *     different sentence, no duplicate pair.
 *  2. Do NOT repeat the OTHER tools of the same coin. Each tool leads with a
 *     different computed output (profit → daily moves vs fees; dca → coins per
 *     $100 across the range; average → weighted break-even; liquidation → tail
 *     days; staking → compounding; market-cap → price implied by supply).
 *
 * Every figure is bounded by the window we hold and dated — never an all-time
 * claim. Supply and staking figures are registry facts, presented as dated.
 */

const HISTORY_DIR = join(process.cwd(), "public", "data", "history");
const DAY_MS = 86_400_000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isoDate(start: string, i: number): string {
  return new Date(Date.parse(`${start}T00:00:00Z`) + i * DAY_MS).toISOString().slice(0, 10);
}
function prettyDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
function money(n: number): string {
  if (!isFinite(n) || n <= 0) return "—";
  const d = n >= 1000 ? 0 : n >= 1 ? 2 : n >= 0.01 ? 4 : 8;
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: d });
}
function coins(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 0 : n >= 1 ? 2 : 4 });
}
function big(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e12) return (n / 1e12).toFixed(a >= 1e13 ? 0 : 2) + "T";
  if (a >= 1e9) return (n / 1e9).toFixed(a >= 1e10 ? 1 : 2) + "B";
  if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 0 : 1) + "M";
  if (a >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
const pct = (n: number, d = 1) => n.toLocaleString("en-US", { maximumFractionDigits: d });

export interface DailyStats {
  symbol: string;
  windowStart: string;
  windowEnd: string;
  /** Trading days in the window we actually used (≤ 366). */
  sampleDays: number;
  lastPrice: number;
  low: number;
  lowDate: string;
  high: number;
  highDate: string;
  /** high / low. */
  spreadRatio: number;
  /** Where `lastPrice` sits in the low→high range, 0–100. */
  posInRange: number;
  /** Median absolute daily move, %. */
  medMovePct: number;
  bigUpPct: number;
  bigUpDate: string;
  bigDownPct: number;
  bigDownDate: string;
  /** Days that moved ≥10% in either direction. */
  daysOver10: number;
}

const statsCache = new Map<string, DailyStats | null>();

/** Short-term daily stats from the coin's last ~12 months of closes. */
export function coinDailyStats(slug: string): DailyStats | null {
  const cached = statsCache.get(slug);
  if (cached !== undefined) return cached;

  let out: DailyStats | null = null;
  try {
    const h = JSON.parse(readFileSync(join(HISTORY_DIR, `${slug}.json`), "utf8")) as PriceHistory;
    const all = (h.prices ?? []).filter((p) => typeof p === "number" && isFinite(p) && p > 0);
    // Need a meaningful window; below this the "last year" framing is a lie.
    if (all.length >= 60) {
      const n = Math.min(366, all.length);
      const base = all.length - n; // full-series index of the window's first day
      const win = all.slice(base);

      let low = win[0], high = win[0], loIdx = 0, hiIdx = 0;
      for (let i = 1; i < win.length; i++) {
        if (win[i] < low) { low = win[i]; loIdx = i; }
        if (win[i] > high) { high = win[i]; hiIdx = i; }
      }
      const last = win[win.length - 1];

      const absRets: number[] = [];
      let bigUp = 0, bigUpIdx = 1, bigDown = 0, bigDownIdx = 1, over10 = 0;
      for (let i = 1; i < win.length; i++) {
        const r = win[i] / win[i - 1] - 1;
        absRets.push(Math.abs(r));
        if (r > bigUp) { bigUp = r; bigUpIdx = i; }
        if (r < bigDown) { bigDown = r; bigDownIdx = i; }
        if (Math.abs(r) >= 0.1) over10++;
      }
      absRets.sort((a, b) => a - b);
      const med = absRets.length ? absRets[Math.floor(absRets.length / 2)] * 100 : 0;

      out = {
        symbol: h.symbol,
        windowStart: isoDate(h.start, base),
        windowEnd: h.end,
        sampleDays: win.length,
        lastPrice: last,
        low, lowDate: isoDate(h.start, base + loIdx),
        high, highDate: isoDate(h.start, base + hiIdx),
        spreadRatio: low > 0 ? high / low : 0,
        posInRange: high > low ? ((last - low) / (high - low)) * 100 : 50,
        medMovePct: med,
        bigUpPct: bigUp * 100, bigUpDate: isoDate(h.start, base + bigUpIdx),
        bigDownPct: bigDown * 100, bigDownDate: isoDate(h.start, base + bigDownIdx),
        daysOver10: over10,
      };
    }
  } catch {
    out = null;
  }
  statsCache.set(slug, out);
  return out;
}

export interface ToolInsight {
  heading: string;
  paragraphs: string[];
  stats: { label: string; value: string }[];
}

/**
 * Build the unique insight block for one coin on one tool, or null when we lack
 * the data (a coin with no price history simply keeps its templated body).
 */
export function toolInsight(coin: Coin, toolSlug: string): ToolInsight | null {
  const sym = coin.symbol;
  const name = coin.name;

  switch (toolSlug) {
    case "profit-calculator": {
      const s = coinDailyStats(coin.slug);
      if (!s) return null;
      const feeVerdict =
        s.medMovePct >= 0.4
          ? `comfortably more than the 0.2% a maker round trip costs, so an average day leaves room for profit`
          : s.medMovePct >= 0.2
            ? `barely above the 0.2% a maker round trip costs — a same-day flip has to catch an above-average move to beat fees`
            : `less than the 0.2% a maker round trip costs, so quick in-and-out trades usually hand the profit to the exchange`;
      return {
        heading: `What ${sym}'s recent moves mean for your P/L`,
        paragraphs: [
          `Over the last ${s.sampleDays} days, ${sym} moved a median of ±${pct(s.medMovePct)}% per day. That is ${feeVerdict}. The fee field applies to both your entry and exit, which is why the round trip, not the one-way fee, is the number that decides a short trade.`,
          `The window's extremes set the range this calculator has to work with: ${sym}'s best day added +${pct(s.bigUpPct)}% (${prettyDate(s.bigUpDate)}) and its worst dropped ${pct(s.bigDownPct)}% (${prettyDate(s.bigDownDate)}). An ROI figure only becomes real at the moment you exit — on a coin that can move like that, the fill you actually get depends on order-book depth, not the mid price you type in.`,
        ],
        stats: [
          { label: "Typical day", value: `±${pct(s.medMovePct)}%` },
          { label: "Best day (12mo)", value: `+${pct(s.bigUpPct)}%` },
          { label: "Worst day (12mo)", value: `${pct(s.bigDownPct)}%` },
          { label: "52-week range", value: `${money(s.low)} – ${money(s.high)}` },
        ],
      };
    }

    case "dca-calculator": {
      const s = coinDailyStats(coin.slug);
      if (!s) return null;
      const spreadVerdict =
        s.spreadRatio >= 3
          ? `one of the wider ranges among the majors — exactly the terrain dollar-cost averaging is built for`
          : s.spreadRatio >= 1.6
            ? `wide enough that the price you happened to buy at mattered a great deal`
            : `a relatively tight year, so a schedule would have changed your entry less than usual`;
      const atLow = 100 / s.low;
      const atHigh = 100 / s.high;
      return {
        heading: `Why averaging suited ${sym} this year`,
        paragraphs: [
          `Over the last 12 months ${sym} traded between ${money(s.low)} (${prettyDate(s.lowDate)}) and ${money(s.high)} (${prettyDate(s.highDate)}) — a ${pct(s.spreadRatio, 1)}× spread. That is ${spreadVerdict}.`,
          `A fixed $100 buy picked up ${coins(atLow)} ${sym} at that low and only ${coins(atHigh)} ${sym} at that high — ${pct(s.spreadRatio, 1)}× more coins for the same money at the bottom. A schedule that kept buying through both automatically weighted your stack toward the cheaper end, which is the entire mechanism the numbers above model.`,
        ],
        stats: [
          { label: "52-week low", value: money(s.low) },
          { label: "52-week high", value: money(s.high) },
          { label: "High / low spread", value: `${pct(s.spreadRatio, 1)}×` },
          { label: "$100 buys", value: `${coins(atLow)} vs ${coins(atHigh)} ${sym}` },
        ],
      };
    }

    case "average-price-calculator": {
      const s = coinDailyStats(coin.slug);
      if (!s) return null;
      const where =
        s.posInRange >= 66
          ? `near the top of that range — averaging up here raises your break-even, so size the add carefully`
          : s.posInRange <= 33
            ? `near the bottom of that range — averaging down here pulls your break-even toward the current price fastest`
            : `mid-range — an add here moves your break-even modestly in either direction`;
      const wavg = s.low > 0 && s.high > 0 ? 2 / (1 / s.low + 1 / s.high) : 0; // equal $ → harmonic mean
      const mid = (s.low + s.high) / 2;
      return {
        heading: `Where a ${sym} break-even actually lands`,
        paragraphs: [
          `At ${money(s.lastPrice)}, ${sym} sits about ${pct(s.posInRange, 0)}% of the way up its 12-month range. That puts you ${where}.`,
          `Split $1,000 evenly between a buy at this year's low and one at its high and your weighted average is ${money(wavg)} — below the ${money(mid)} midpoint, because the cheaper buy bought more coins. That weighted number, not the midpoint of the two prices, is your true break-even and, in most countries, your cost basis for tax.`,
        ],
        stats: [
          { label: "Last price", value: money(s.lastPrice) },
          { label: "52-week range", value: `${money(s.low)} – ${money(s.high)}` },
          { label: "Position in range", value: `${pct(s.posInRange, 0)}%` },
          { label: "Equal-$ break-even", value: money(wavg) },
        ],
      };
    }

    case "liquidation-calculator": {
      const s = coinDailyStats(coin.slug);
      if (!s) return null;
      const tail =
        s.daysOver10 > 0
          ? `${sym} has moved more than 10% in a single day ${s.daysOver10} time${s.daysOver10 === 1 ? "" : "s"} in the last year`
          : `${sym} did not post a single 10%+ day this year, but a quieter stretch is not a guarantee`;
      return {
        heading: `How close is liquidation on ${sym}, really`,
        paragraphs: [
          `At 10× leverage a move of roughly 9% against you wipes the margin, and ${tail}. Its worst single day in the window took ${pct(s.bigDownPct)}% (${prettyDate(s.bigDownDate)}) — more than enough to close a 10× position on its own.`,
          `The trap is that ${sym}'s median day is only ±${pct(s.medMovePct)}%: leverage feels safe priced off the calm days and is settled on the violent ones. Set your size against the ${pct(s.bigDownPct)}% day it actually had, not the typical one, then check the distance this calculator gives you against it.`,
        ],
        stats: [
          { label: "Typical day", value: `±${pct(s.medMovePct)}%` },
          { label: "Worst day (12mo)", value: `${pct(s.bigDownPct)}%` },
          { label: "Days over ±10%", value: `${s.daysOver10} in 12mo` },
          { label: "10× liquidation ≈", value: `~9% move` },
        ],
      };
    }

    case "staking-calculator": {
      const st = coin.staking;
      if (!st) return null;
      const amt = coin.typicalAmount;
      const apr = st.defaultApr;
      const simple1y = (amt * apr) / 100;
      const monthly1y = amt * ((1 + apr / 1200) ** 12 - 1);
      const comp5y = amt * ((1 + apr / 1200) ** 60 - 1);
      const custody = st.native
        ? `Staking is native to ${name}, so you are securing the protocol directly rather than trusting a wrapper`
        : `${name} is staked through a validator or liquid-staking wrapper, which adds a counterparty on top of the protocol`;
      return {
        heading: `What ${apr}% actually compounds to on ${sym}`,
        paragraphs: [
          `At ${apr}% (${st.range}), staking ${coins(amt)} ${sym} pays about ${coins(simple1y)} ${sym} in the first year simple. Compounded monthly that becomes ${coins(monthly1y)} ${sym}, and left to compound for five years, ${coins(comp5y)} ${sym} — the gap widens the longer your ${sym} stays put, which is where the lockup matters: ${st.lockup}`,
          `${custody}. Rewards arrive in ${sym}, so their dollar value rides the price — a ${apr}% yield is no defence against a price move several times that size, so judge the position on total return rather than the headline rate.`,
        ],
        stats: [
          { label: "Reward rate", value: `${apr}% (${st.range})` },
          { label: `First year on ${coins(amt)} ${sym}`, value: `${coins(simple1y)} ${sym}` },
          { label: "Monthly-compounded 1y", value: `${coins(monthly1y)} ${sym}` },
          { label: "Compounded 5y", value: `${coins(comp5y)} ${sym}` },
        ],
      };
    }

    case "market-cap-calculator": {
      const supply = coin.circulatingSupply;
      if (!supply || supply <= 0) return null;
      const total = coin.totalSupply;
      const p = (cap: number) => money(cap / supply);
      const issued = total && total > 0 ? (supply / total) * 100 : null;
      return {
        heading: `The ${sym} price behind each market cap`,
        paragraphs: [
          `${sym}'s circulating supply is about ${big(supply)}${coin.supplyAsOf ? ` (as of ${prettyDate(coin.supplyAsOf)})` : ""}${
            issued !== null ? `, ${pct(issued, 0)}% of a ${big(total!)} total` : ""
          }. Market cap is only price × supply, so a target valuation pins one exact price — no guesswork.`,
          `A $1 billion cap would put ${sym} at ${p(1e9)}, a $10 billion cap at ${p(1e10)}, and a $100 billion cap at ${p(1e11)}. ${
            total && total > supply
              ? `On the fully diluted ${big(total)} supply those prices are lower, because ${big(total - supply)} ${sym} is still to be issued — the FDV block above works that denominator in.`
              : `${sym} has no fixed cap here, so there is no fully-diluted denominator to add — the market-cap figure is the honest one.`
          }`,
        ],
        stats: [
          { label: "Circulating supply", value: `${big(supply)} ${sym}` },
          ...(issued !== null ? [{ label: "Share issued", value: `${pct(issued, 0)}%` }] : []),
          { label: "$10B cap →", value: p(1e10) },
          { label: "$100B cap →", value: p(1e11) },
        ],
      };
    }

    default:
      return null;
  }
}
