/**
 * ============================================================================
 * Tax-loss harvesting engine.
 * ============================================================================
 * Answers one question: of the positions you still hold, which ones are worth
 * selling before the tax year closes, and how much tax does each actually save?
 *
 * Three rules this module is built around. Do not "simplify" them away.
 *
 * 1. THE SAVING IS COMPUTED BY THE TAX ENGINE, NOT BY MULTIPLYING BY A RATE.
 *    Every figure comes from running `summarise` — the same function the tax
 *    report uses — twice: once on the disposals that really happened, once
 *    with a synthetic disposal appended. The difference is the saving. That is
 *    the only way Germany's Freigrenze, the UK annual exempt amount,
 *    Australia's loss-ordering, Canada's inclusion rate and India's disallowed
 *    losses stay correct here without being re-implemented a second time.
 *
 * 2. SAVINGS ARE MARGINAL AND RANKED, NEVER STANDALONE. Harvesting stops
 *    paying the moment your realised gains hit zero. A list where every row
 *    shows `loss × rate` promises the same relief over and over; this one
 *    shows what each parcel adds on top of the ones above it, so the rows sum
 *    to the real total.
 *
 * 3. A LOSS OUTSIDE THE CHARGE IS NOT A LOSS. Where a holding-period rule
 *    exempts the gain — Germany past a year, Portugal at 365 days — it kills
 *    the deduction for the loss too. Those parcels are separated out and given
 *    the date their loss expires, because that deadline runs the opposite way
 *    to every other piece of tax advice a holder has ever been given.
 */

import { summarise, type ReportOptions } from "@/lib/taxreport/engine";
import { reliefApplies, taxYearFor, type Jurisdiction } from "@/lib/taxreport/jurisdictions";
import type { Disposal, TaxReport } from "@/lib/taxreport/types";
import { ruleFor } from "./rules";
import type { HarvestCandidate, HarvestPlan, UnpricedHolding } from "./types";

const DAY_MS = 86_400_000;

/** Price per unit in the report currency, keyed by upper-case asset symbol. */
export type PriceMap = Record<string, number>;

export interface HarvestOptions {
  jurisdiction: Jurisdiction;
  report: TaxReport;
  prices: PriceMap;
  /** Where the prices came from, shown verbatim next to the valuations. */
  priceNote: string;
  rate: number;
  longTermRate?: number;
  /** "Today" — passed in so a static page never computes it during render. */
  today: Date;
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / DAY_MS);
}

/**
 * The day a parcel's loss stops being claimable, where a holding-period
 * exemption is coming for it. `inclusive` decides whether the threshold day
 * itself is already exempt: Portugal exempts at 365 days, Germany needs more
 * than 365, so the same holding expires one day apart in the two countries.
 */
function lossExpiryFor(j: Jurisdiction, acquired: Date | null): Date | null {
  if (j.relief.kind !== "exempt" || !acquired) return null;
  const offset = j.relief.inclusive ? j.relief.days : j.relief.days + 1;
  return new Date(acquired.getTime() + offset * DAY_MS);
}

/** Build the disposal a candidate would produce if it were sold today. */
function syntheticDisposal(
  j: Jurisdiction,
  c: HarvestCandidate,
  today: Date,
): Disposal {
  const qualifies = reliefApplies(j.relief, c.holdingDays);
  return {
    line: -1,
    date: today,
    asset: c.asset,
    quantity: c.quantity,
    proceeds: c.value,
    cost: c.cost,
    fee: 0,
    gain: c.unrealised,
    holdingDays: c.holdingDays,
    exempt: j.relief.kind === "exempt" && qualifies,
    longTerm: (j.relief.kind === "rate" || j.relief.kind === "discount") && qualifies,
    basis: j.methodLabel,
  };
}

export function buildHarvestPlan(opts: HarvestOptions): HarvestPlan {
  const { jurisdiction: j, report, prices, today } = opts;
  const rule = ruleFor(j.id);
  const pooled = j.method === "acb" || j.method === "pool104";
  const year = taxYearFor(j, today);

  // Harvesting only means anything in the year that is still open: you cannot
  // go back and sell something last December. The caller must therefore build
  // the report for the CURRENT tax year, and if it did not, every deadline on
  // the page would be measured against the wrong year end.
  if (report.taxYearLabel !== year.label) {
    throw new Error(
      `Harvest plan needs the open tax year. The report covers "${report.taxYearLabel}" but today falls in "${year.label}".`,
    );
  }

  const reportOpts: ReportOptions = {
    jurisdiction: j,
    taxYearLabel: report.taxYearLabel,
    rate: opts.rate,
    longTermRate: opts.longTermRate,
  };

  // Poland pools costs annually and recognises them when incurred, so the set
  // of disposals in the year does not drive the bill the way it does
  // elsewhere. Re-running `summarise` with a synthetic sale would produce a
  // number, and that number would be meaningless — so we do not produce one.
  const poland = j.method === "annual-pool";

  const realDisposals = report.disposals;
  const priceOf = (asset: string) => prices[asset.toUpperCase()];

  // --- Value every open parcel ---------------------------------------------
  const unpriced: UnpricedHolding[] = [];
  const parcels: HarvestCandidate[] = [];

  const source = pooled
    ? // A pooled holding has one average cost. Collapse the lots so the page
      // cannot imply you may pick an underwater lot out of a pool — under ACB
      // and the S104 pool you simply cannot.
      report.holdings.map((h) => ({
        asset: h.asset,
        quantity: h.quantity,
        cost: h.cost,
        costPerUnit: h.quantity > 0 ? h.cost / h.quantity : 0,
        acquired: null as Date | null,
        line: 0,
      }))
    : report.openLots.map((l) => ({
        asset: l.asset,
        quantity: l.quantity,
        cost: l.cost,
        costPerUnit: l.costPerUnit,
        acquired: l.acquired as Date | null,
        line: l.line,
      }));

  for (const [i, p] of source.entries()) {
    const price = priceOf(p.asset);
    if (typeof price !== "number" || !isFinite(price)) {
      const existing = unpriced.find((u) => u.asset === p.asset);
      if (existing) {
        existing.quantity += p.quantity;
        existing.cost += p.cost;
      } else {
        unpriced.push({ asset: p.asset, quantity: p.quantity, cost: p.cost });
      }
      continue;
    }
    const value = p.quantity * price;
    const holdingDays = p.acquired ? daysBetween(p.acquired, today) : null;
    const reliefBlocked =
      j.relief.kind === "exempt" && reliefApplies(j.relief, holdingDays);

    parcels.push({
      id: `${p.asset}-${p.line}-${i}`,
      asset: p.asset,
      quantity: p.quantity,
      cost: p.cost,
      costPerUnit: p.costPerUnit,
      price,
      value,
      unrealised: value - p.cost,
      acquired: p.acquired,
      holdingDays,
      reliefBlocked,
      lossExpiresOn: value < p.cost ? lossExpiryFor(j, p.acquired) : null,
      taxSaved: 0,
      pooled,
    });
  }

  const winners = parcels
    .filter((p) => p.unrealised >= 0)
    .sort((a, b) => b.unrealised - a.unrealised);

  // --- Rank the losers and price each one at the margin ---------------------
  // Ranked by raw loss so the biggest deduction is taken first; parcels whose
  // loss the law will not allow are ranked last, since they can never add
  // anything. Blocked parcels are still surfaced — a reader needs to see that
  // a 40% paper loss is worth nothing to them, and why.
  const losers = parcels
    .filter((p) => p.unrealised < 0)
    .sort((a, b) => {
      if (a.reliefBlocked !== b.reliefBlocked) return a.reliefBlocked ? 1 : -1;
      return a.unrealised - b.unrealised;
    });

  const taxBefore = poland
    ? report.totals.estimatedTax
    : summarise(realDisposals, j, reportOpts, report.totals.incomeTotal, {
        revenue: 0, costs: 0, carryIn: 0,
      }).estimatedTax;

  let running = taxBefore;
  const accumulated: Disposal[] = [];

  for (const c of losers) {
    if (poland) {
      c.taxSaved = 0;
      continue;
    }
    accumulated.push(syntheticDisposal(j, c, today));
    const after = summarise(
      [...realDisposals, ...accumulated],
      j,
      reportOpts,
      report.totals.incomeTotal,
      { revenue: 0, costs: 0, carryIn: 0 },
    ).estimatedTax;
    // Clamp at zero: a rounding wobble must never render as "this sale
    // increases your tax", which is not what a loss does.
    c.taxSaved = Math.max(0, running - after);
    running = after;
  }

  const taxAfter = running;
  const totalSaved = Math.max(0, taxBefore - taxAfter);

  const blockedLoss = losers
    .filter((c) => c.reliefBlocked)
    .reduce((s, c) => s + -c.unrealised, 0);
  const harvestableLoss = losers
    .filter((c) => !c.reliefBlocked)
    .reduce((s, c) => s + -c.unrealised, 0);

  /**
   * How much loss you actually have to realise to capture the whole saving.
   *
   * Counting whole parcels is not good enough: a single big parcel can sail
   * past the point where the year's gains run out, so its own saving is
   * non-zero while most of it still does nothing. Bisecting on a synthetic
   * loss finds the real figure — and "you only need to sell X of the Y you are
   * down" is more useful than either number alone.
   */
  const lossNeeded = poland || totalSaved <= 0
    ? 0
    : (() => {
        const taxWith = (loss: number) =>
          summarise(
            [
              ...realDisposals,
              {
                line: -2, date: today, asset: "—", quantity: 0,
                proceeds: 0, cost: loss, fee: 0, gain: -loss,
                holdingDays: null, exempt: false, longTerm: false, basis: j.methodLabel,
              },
            ],
            j, reportOpts, report.totals.incomeTotal, { revenue: 0, costs: 0, carryIn: 0 },
          ).estimatedTax;

        let lo = 0;
        let hi = harvestableLoss;
        // 40 halvings takes any realistic portfolio well below a cent.
        for (let i = 0; i < 40; i++) {
          const mid = (lo + hi) / 2;
          if (taxBefore - taxWith(mid) >= totalSaved - 1e-6) hi = mid;
          else lo = mid;
        }
        return hi;
      })();

  const surplusLoss = Math.max(0, harvestableLoss - lossNeeded);

  // --- Country notes --------------------------------------------------------
  const notes: string[] = [];

  if (poland) {
    notes.push(
      "Poland recognises acquisition costs in the year you incur them, whether or not you sold anything, and unused costs carry forward indefinitely. Selling a losing position before 31 December does not change your PIT-38 figures, so no saving is shown below.",
    );
  }
  if (!j.lossesDeductible) {
    notes.push(
      "Losses on virtual digital assets cannot be set off against anything here — not against other crypto gains, and not carried forward. Every saving below is therefore zero, and that is the correct answer rather than a fault in the calculation.",
    );
  }
  if (j.relief.kind === "exempt") {
    const word = j.relief.inclusive ? `${j.relief.days} days or more` : `more than ${j.relief.days} days`;
    notes.push(
      `Gains on positions held ${word} are exempt here — and a position outside the charge cannot produce a deductible loss either. Any parcel already past that mark is listed below as blocked, with its loss shown but its saving zero.`,
    );
  }
  if (j.allowanceKind === "freigrenze") {
    notes.push(
      `The ${j.allowanceLabel} is all-or-nothing, not an allowance. If your gains for the year already fall at or below it you owe nothing anyway, so harvesting saves nothing — and if they are just above it, a small harvest that drops you under the line can be worth more than a large one.`,
    );
  } else if (j.allowance > 0) {
    notes.push(
      `Your ${j.allowanceLabel} is used before any tax is due, so harvesting only starts paying once gains exceed it. Losses spent bringing gains down into the allowance are wasted — they would have been covered for free.`,
    );
  }
  if (surplusLoss > 0 && j.lossesDeductible && !poland && totalSaved > 0) {
    notes.push(
      "You do not need to sell everything that is down. Realising the amount shown above captures the entire saving; anything beyond it saves nothing this year, because there are no more gains left to offset. Selling it anyway still banks the loss to carry forward against future gains in most regimes — a real decision, but not this year's money.",
    );
  }
  if (unpriced.length > 0) {
    notes.push(
      `${unpriced.length} holding${unpriced.length === 1 ? "" : "s"} could not be priced automatically and ${unpriced.length === 1 ? "is" : "are"} excluded from every total on this page. They are listed separately — a guessed price would quietly change the answer.`,
    );
  }

  return {
    jurisdictionId: j.id,
    jurisdictionName: j.name,
    currency: j.currencyCode,
    currencySymbol: j.currency,
    taxYearLabel: report.taxYearLabel,
    yearEnd: year.end,
    daysToYearEnd: daysBetween(today, year.end),
    methodLabel: j.methodLabel,
    pooled,
    rule,
    candidates: losers,
    winners,
    unpriced,
    realisedGain: report.totals.netGain,
    taxBefore,
    taxAfter,
    totalSaved,
    harvestableLoss,
    blockedLoss,
    lossNeeded,
    surplusLoss,
    priceNote: opts.priceNote,
    notes,
  };
}
