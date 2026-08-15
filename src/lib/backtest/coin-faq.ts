import type { CoinInsights } from "./insights";

/**
 * ============================================================================
 * Per-coin questions, answered from that coin's own price history.
 * ============================================================================
 * These 63 pages had no FAQ at all — the only page family on the site without
 * one, alongside compare (fixed separately). This adds both the section and the
 * FAQPage schema.
 *
 * The reason a generated FAQ is defensible here and would NOT have been on the
 * compare pages: there, the underlying facts were the same for every pair, so
 * generating text would have produced 30 near-identical answers and the only
 * honest option was to write them. Here every answer is carrying that coin's
 * own multiple, own drawdown dates, own recovery time — figures that genuinely
 * differ. The question set is shared; the substance is not.
 *
 * Answers still branch on shape rather than only swapping numbers: a coin that
 * never recovered gets a different answer from one that did, and a coin with
 * ten months of data gets told that ten months cannot answer the question.
 */

const pct = (n: number, d = 1) => `${n.toLocaleString("en-US", { maximumFractionDigits: d })}%`;

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

function span(days: number): string {
  if (days < 60) return `${days} days`;
  const months = Math.round(days / 30.44);
  if (months < 24) return `${months} months`;
  let years = Math.floor(days / 365.25);
  let rem = Math.round((days - years * 365.25) / 30.44);
  if (rem >= 12) {
    years += 1;
    rem = 0;
  }
  return rem === 0 ? `${years} years` : `${years} years and ${rem} month${rem === 1 ? "" : "s"}`;
}

export function coinFaq(i: CoinInsights, name: string, symbol: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const startYear = i.start.slice(0, 4);
  const recovered = i.worst.daysToRecover !== null;

  out.push({
    q: `Would buying ${symbol} on the first day of this data and holding have made money?`,
    a:
      i.holdMultiple >= 1
        ? `Yes — ${i.holdMultiple >= 100 ? `${Math.round(i.holdMultiple).toLocaleString("en-US")}×` : `${i.holdMultiple.toLocaleString("en-US", { maximumFractionDigits: 2 })}×`} from ${longDate(i.start)} to ${longDate(i.end)}. The figure is real but it is also the single luckiest entry available in this window, and it required holding through a fall of ${pct(i.worst.depthPct)} on the way. Set the calculator to a date you might plausibly have chosen instead and the answer usually changes a great deal.`
        : `No. Held across the whole window the position ended at ${i.holdMultiple.toLocaleString("en-US", { maximumFractionDigits: 3 })}× — a loss of ${pct((1 - i.holdMultiple) * 100)}. That is worth stating plainly because "hold long enough and it recovers" is the usual advice, and over the ${span(i.days)} we hold for ${symbol} it did not happen.`,
  });

  out.push({
    q: `What is the worst ${symbol} has fallen?`,
    a:
      `${pct(i.worst.depthPct)} in this data, from ${longDate(i.worst.peakDate)} down to ${longDate(i.worst.troughDate)} — ${span(i.worst.daysToTrough)} of falling. ` +
      (recovered
        ? `It took a further ${span(i.worst.daysToRecover!)} to get back to that peak, on ${longDate(i.worst.recoveredOn!)}, so the full round trip was ${span(i.worst.daysToTrough + i.worst.daysToRecover!)}.`
        : `It has not returned to that peak since, so anyone who bought at the top is still waiting.`) +
      ` Bear in mind our ${symbol} series starts in ${startYear}; a deeper fall before that date would not appear here.`,
  });

  if (i.crashCount >= 2) {
    out.push({
      // NOT "how often does it halve" — on the Bitcoin page that reads as a
      // question about the block-subsidy halving, which is a different thing entirely.
      q: `How often does ${symbol} lose half its value?`,
      a: `${i.crashCount} separate falls of 50% or more appear in this data, and the position spent ${pct(i.underwaterPct)} of all days more than 20% below a previous peak. A drop of that size is not an exceptional event for this asset — it is a recurring feature of the record, which is the thing to size a position around.`,
    });
  } else {
    out.push({
      q: `How much time does ${symbol} spend below its previous high?`,
      a: `${pct(i.underwaterPct)} of all days in this window sat more than 20% below a previous peak. Put another way, for most of the time you would have owned it, the screen showed a number lower than one you had already seen — which is the part of a backtest's headline return that the headline never conveys.`,
    });
  }

  if (i.best && i.worstYear && i.best.year !== i.worstYear.year) {
    out.push({
      q: `What were ${symbol}'s best and worst years?`,
      a: `${i.best.year} was the best at ${i.best.pct > 0 ? "+" : ""}${pct(i.best.pct)}${i.best.partial ? " (a partial year in our data)" : ""}, and ${i.worstYear.year} the worst at ${pct(i.worstYear.pct)}${i.worstYear.partial ? " (also partial)" : ""}. The gap between those two is the reason a single average annual return is a poor description of this asset: almost nobody experiences the average, they experience one of the two extremes depending on when they bought.`,
    });
  }

  out.push({
    q: `Is ${span(i.days)} of data enough to trust this backtest?`,
    a:
      i.years < 2
        ? `No, and that is the honest answer for ${symbol} specifically. ${span(i.days)} does not cover a full market cycle, so any result here describes one short stretch rather than a pattern. Treat it as a record of what happened, not as evidence about what tends to happen.`
        : i.years < 5
          ? `Partly. ${span(i.days)} covers real bull and bear conditions for ${symbol} but not a full cycle end to end, so the extremes above are better guides than the average. Coins on this site with longer records give more meaningful answers.`
          : i.years < 8
            ? `Reasonably. ${span(i.days)} spans roughly one full cycle for ${symbol} — enough for the drawdown figure to mean something, not enough to call it a pattern. The assets here with a decade or more behind them support firmer conclusions.`
            : `It is among the longer records available here — ${span(i.days)} covering several complete cycles, which is enough for the drawdown and recovery figures to carry real weight. It is still one path that already happened, and the next sequence of prices has no obligation to resemble it.`,
  });

  return out;
}
