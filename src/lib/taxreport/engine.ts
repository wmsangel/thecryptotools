/**
 * ============================================================================
 * Cost-basis engine.
 * ============================================================================
 * Walks the whole transaction history to build correct lots, then reports only
 * the disposals falling inside the chosen tax year — basis from earlier years
 * has to be carried in, or every gain is wrong.
 *
 * Design rule throughout: never invent a number. A row we cannot value is
 * marked `unvalued`, kept out of the totals and surfaced as an error. A silent
 * zero in a tax report is the one failure mode that actually costs someone.
 */

import type { Disposal, OpenLot, ReportIssue, TaxReport, ReportTotals, Tx } from "./types";
import { FIAT_CODES } from "./csv";
import { reliefApplies, taxYearFor, type Jurisdiction } from "./jurisdictions";

const DAY_MS = 86_400_000;

interface Lot {
  qty: number;
  costPerUnit: number;
  acquired: Date;
  line: number;
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / DAY_MS);
}

function sameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

const isFiat = (asset?: string) => !!asset && FIAT_CODES.has(asset.toUpperCase());

/** Result of taking `qty` out of an asset's holdings. */
interface Match {
  qty: number;
  cost: number;
  acquired: Date | null;
}

export interface ReportOptions {
  jurisdiction: Jurisdiction;
  /** Tax-year label to report on, e.g. "2025" or "2025–26". */
  taxYearLabel: string;
  rate: number;
  longTermRate?: number;
}

export function buildReport(txs: Tx[], importIssues: ReportIssue[], opts: ReportOptions): TaxReport {
  const j = opts.jurisdiction;
  const issues: ReportIssue[] = [...importIssues];
  const disposals: Disposal[] = [];

  // Lots per asset. ACB and the Section 104 pool are expressed as lots too and
  // consumed proportionally, which is arithmetically the same as an average.
  const lots = new Map<string, Lot[]>();
  const getLots = (asset: string) => {
    let l = lots.get(asset);
    if (!l) lots.set(asset, (l = []));
    return l;
  };

  const acquire = (asset: string, qty: number, cost: number, acquired: Date, line: number) => {
    if (qty <= 0) return;
    getLots(asset).push({ qty, costPerUnit: cost / qty, acquired, line });
  };

  /** Take `qty` from an asset using the jurisdiction's matching method. */
  function take(asset: string, qty: number, when: Date, line: number): Match[] {
    const pool = getLots(asset);
    const available = pool.reduce((s, l) => s + l.qty, 0);

    if (available + 1e-12 < qty) {
      issues.push({
        line,
        severity: "warning",
        message: `Disposed ${qty} ${asset} but only ${available.toFixed(8)} was acquired earlier in this file. The missing ${(qty - available).toFixed(8)} is treated as having zero cost, which overstates the gain — add the missing purchases or opening balance.`,
      });
    }

    const out: Match[] = [];
    let remaining = qty;

    const consume = (lot: Lot, amount: number) => {
      const cost = amount * lot.costPerUnit;
      lot.qty -= amount;
      remaining -= amount;
      out.push({ qty: amount, cost, acquired: lot.acquired });
    };

    if (j.method === "pool104") {
      // HMRC order: same day, then acquisitions in the next 30 days, then pool.
      for (const lot of pool) {
        if (remaining <= 1e-12) break;
        if (lot.qty > 1e-12 && sameUtcDay(lot.acquired, when)) consume(lot, Math.min(lot.qty, remaining));
      }
      for (const lot of pool) {
        if (remaining <= 1e-12) break;
        const gap = daysBetween(when, lot.acquired);
        if (lot.qty > 1e-12 && gap > 0 && gap <= 30) consume(lot, Math.min(lot.qty, remaining));
      }
      // Section 104 pool: everything acquired on or before the disposal date,
      // consumed proportionally so the cost is the pool average.
      const poolLots = pool.filter((l) => l.qty > 1e-12 && l.acquired.getTime() <= when.getTime());
      const poolQty = poolLots.reduce((s, l) => s + l.qty, 0);
      if (remaining > 1e-12 && poolQty > 1e-12) {
        const share = Math.min(1, remaining / poolQty);
        let taken = 0;
        let cost = 0;
        for (const lot of poolLots) {
          const amount = lot.qty * share;
          cost += amount * lot.costPerUnit;
          lot.qty -= amount;
          taken += amount;
        }
        remaining -= taken;
        // The pool has no single acquisition date — holding relief cannot apply.
        out.push({ qty: taken, cost, acquired: null });
      }
    } else if (j.method === "acb") {
      const live = pool.filter((l) => l.qty > 1e-12);
      const totalQty = live.reduce((s, l) => s + l.qty, 0);
      const totalCost = live.reduce((s, l) => s + l.qty * l.costPerUnit, 0);
      if (totalQty > 1e-12) {
        const amount = Math.min(qty, totalQty);
        const cost = totalCost * (amount / totalQty);
        const share = amount / totalQty;
        for (const lot of live) lot.qty -= lot.qty * share;
        remaining -= amount;
        out.push({ qty: amount, cost, acquired: null });
      }
    } else {
      // FIFO — oldest first.
      for (const lot of pool) {
        if (remaining <= 1e-12) break;
        if (lot.qty > 1e-12) consume(lot, Math.min(lot.qty, remaining));
      }
    }

    if (remaining > 1e-12) out.push({ qty: remaining, cost: 0, acquired: null });
    // Drop spent lots so the array does not grow without bound.
    lots.set(asset, pool.filter((l) => l.qty > 1e-12));
    return out;
  }

  /**
   * HMRC's bed-and-breakfast rule matches a disposal against acquisitions made
   * in the NEXT 30 days, so those lots must already exist when the disposal is
   * processed. Pre-load every acquisition for the pooling method only — FIFO
   * and ACB must never see a lot that had not been bought yet.
   */
  const preloadAcquisitions = j.method === "pool104";
  if (preloadAcquisitions) {
    for (const t of txs) {
      if (!t.receivedAsset || !t.receivedAmount) continue;
      if (t.type === "buy") {
        if (t.fiatValue !== undefined) acquire(t.receivedAsset, t.receivedAmount, t.fiatValue + (t.fiatFee ?? 0), t.date, t.line);
      } else if (t.type === "trade" || t.type === "income") {
        acquire(t.receivedAsset, t.receivedAmount, t.fiatValue ?? 0, t.date, t.line);
      }
    }
  }

  const year = (() => {
    const found = txs.map((t) => taxYearFor(j, t.date)).find((y) => y.label === opts.taxYearLabel);
    return found ?? taxYearFor(j, txs[0]?.date ?? new Date());
  })();
  const inYear = (d: Date) => d >= year.start && d <= year.end;

  let incomeTotal = 0;
  // Poland: annual totals rather than lot matching.
  let polandRevenue = 0;
  let polandCosts = 0;
  let polandCarryIn = 0;

  const record = (
    tx: Tx,
    asset: string,
    matches: Match[],
    proceeds: number | undefined,
    fee: number,
    basisLabel: string,
  ) => {
    const totalQty = matches.reduce((s, m) => s + m.qty, 0) || 1;
    for (const m of matches) {
      const share = m.qty / totalQty;
      const holdingDays = m.acquired ? daysBetween(m.acquired, tx.date) : null;
      if (proceeds === undefined) {
        disposals.push({
          line: tx.line, date: tx.date, asset, quantity: m.qty,
          proceeds: 0, cost: m.cost, fee: 0, gain: 0,
          holdingDays, exempt: false, longTerm: false, basis: basisLabel, unvalued: true,
          note: "No value in the report currency — excluded from totals.",
        });
        continue;
      }
      const p = proceeds * share;
      const f = fee * share;
      const gain = p - m.cost - f;
      const qualifies = reliefApplies(j.relief, holdingDays);
      disposals.push({
        line: tx.line, date: tx.date, asset, quantity: m.qty,
        proceeds: p, cost: m.cost, fee: f, gain,
        holdingDays,
        // Marked on the holding period alone, not the sign: a LOSS on an
        // exempt asset is equally outside the charge and cannot be claimed.
        exempt: j.relief.kind === "exempt" && qualifies,
        longTerm: (j.relief.kind === "rate" || j.relief.kind === "discount") && qualifies,
        basis: basisLabel,
      });
    }
  };

  for (const tx of txs) {
    const acqFee = tx.fiatFee ?? 0;

    switch (tx.type) {
      case "buy": {
        if (!tx.receivedAsset || !tx.receivedAmount) break;
        if (tx.fiatValue === undefined) {
          issues.push({ line: tx.line, severity: "error", message: `Purchase of ${tx.receivedAsset} has no value in ${j.currencyCode}. Its cost basis is unknown, so later disposals of this asset will be wrong.` });
          break;
        }
        if (!preloadAcquisitions) acquire(tx.receivedAsset, tx.receivedAmount, tx.fiatValue + acqFee, tx.date, tx.line);
        if (j.method === "annual-pool" && inYear(tx.date)) polandCosts += tx.fiatValue + acqFee;
        else if (j.method === "annual-pool" && tx.date < year.start) polandCarryIn += tx.fiatValue + acqFee;
        break;
      }

      case "sell":
      case "spend": {
        if (!tx.sentAsset || !tx.sentAmount) break;
        const matches = take(tx.sentAsset, tx.sentAmount, tx.date, tx.line);
        if (tx.fiatValue === undefined) {
          issues.push({ line: tx.line, severity: "error", message: `Disposal of ${tx.sentAsset} has no value in ${j.currencyCode}. Add a value column or a fiat leg — this row is excluded from the totals.` });
        }
        if (j.method === "annual-pool") {
          if (tx.fiatValue !== undefined && inYear(tx.date)) polandRevenue += tx.fiatValue - (tx.fiatFee ?? 0);
          if (inYear(tx.date)) {
            disposals.push({
              line: tx.line, date: tx.date, asset: tx.sentAsset, quantity: tx.sentAmount,
              proceeds: tx.fiatValue ?? 0, cost: 0, fee: tx.fiatFee ?? 0,
              gain: 0, holdingDays: null, exempt: false, longTerm: false,
              basis: "Annual pool", unvalued: tx.fiatValue === undefined,
              note: "Poland pools costs annually — see the summary, not this row.",
            });
          }
          break;
        }
        if (inYear(tx.date)) {
          record(tx, tx.sentAsset, matches, tx.fiatValue, tx.fiatFee ?? 0, j.methodLabel);
        }
        break;
      }

      case "trade": {
        if (!tx.sentAsset || !tx.sentAmount || !tx.receivedAsset || !tx.receivedAmount) break;

        if (!j.swapsTaxable) {
          // Deferred: the new asset inherits the old cost, and in Portugal the
          // old acquisition date too — a swap must not reset the 365-day clock.
          const matches = take(tx.sentAsset, tx.sentAmount, tx.date, tx.line);
          const carriedCost = matches.reduce((s, m) => s + m.cost, 0);
          const oldest = matches.map((m) => m.acquired).filter(Boolean).sort((a, b) => a!.getTime() - b!.getTime())[0];
          const acquiredAt = j.swapsPreserveHoldingPeriod && oldest ? oldest : tx.date;
          if (!preloadAcquisitions) acquire(tx.receivedAsset, tx.receivedAmount, carriedCost, acquiredAt, tx.line);
          break;
        }

        const matches = take(tx.sentAsset, tx.sentAmount, tx.date, tx.line);
        if (tx.fiatValue === undefined) {
          issues.push({ line: tx.line, severity: "error", message: `Swap of ${tx.sentAsset} for ${tx.receivedAsset} has no value in ${j.currencyCode}. A crypto-to-crypto swap is a taxable disposal here and cannot be valued from the row alone — add a value column.` });
        }
        if (inYear(tx.date)) record(tx, tx.sentAsset, matches, tx.fiatValue, tx.fiatFee ?? 0, j.methodLabel);
        // The received asset's basis is what it was worth at the swap. Without
        // a value we fall back to the disposed cost, which at least conserves
        // the total basis rather than fabricating one.
        const newCost = tx.fiatValue ?? matches.reduce((s, m) => s + m.cost, 0);
        if (!preloadAcquisitions) acquire(tx.receivedAsset, tx.receivedAmount, newCost, tx.date, tx.line);
        break;
      }

      case "income": {
        if (!tx.receivedAsset || !tx.receivedAmount) break;
        if (tx.fiatValue === undefined) {
          issues.push({ line: tx.line, severity: "warning", message: `Income of ${tx.receivedAmount} ${tx.receivedAsset} has no value in ${j.currencyCode}. It is counted at zero cost, so selling it later will show the whole proceeds as gain.` });
        }
        if (!preloadAcquisitions) acquire(tx.receivedAsset, tx.receivedAmount, tx.fiatValue ?? 0, tx.date, tx.line);
        if (inYear(tx.date)) incomeTotal += tx.fiatValue ?? 0;
        break;
      }

      case "transfer":
        break;

      default:
        issues.push({ line: tx.line, severity: "warning", message: "Could not tell what this row does — skipped. Set its Type column to buy, sell, trade, income or transfer." });
    }
  }

  const totals = summarise(disposals, j, opts, incomeTotal, {
    revenue: polandRevenue,
    costs: polandCosts,
    carryIn: polandCarryIn,
  });

  const holdings = [...lots.entries()]
    .map(([asset, l]) => ({
      asset,
      quantity: l.reduce((s, x) => s + x.qty, 0),
      cost: l.reduce((s, x) => s + x.qty * x.costPerUnit, 0),
    }))
    .filter((h) => h.quantity > 1e-10 && !isFiat(h.asset))
    .sort((a, b) => b.cost - a.cost);

  const openLots: OpenLot[] = [...lots.entries()]
    .filter(([asset]) => !isFiat(asset))
    .flatMap(([asset, l]) =>
      l
        .filter((x) => x.qty > 1e-10)
        .map((x) => ({
          asset,
          quantity: x.qty,
          costPerUnit: x.costPerUnit,
          cost: x.qty * x.costPerUnit,
          acquired: x.acquired,
          line: x.line,
        })),
    )
    .sort((a, b) => a.acquired.getTime() - b.acquired.getTime());

  return {
    jurisdiction: j.name,
    currency: j.currencyCode,
    taxYearLabel: year.label,
    disposals: disposals.sort((a, b) => a.date.getTime() - b.date.getTime()),
    issues,
    totals,
    holdings,
    openLots,
    methodLabel: j.methodLabel,
  };
}

/**
 * Turns a set of disposals into the country's actual tax outcome.
 *
 * Exported because the tax-loss harvesting page answers "what would selling
 * this cost me?" by running the SAME function twice — once on the real
 * disposals, once with a synthetic disposal appended — and taking the
 * difference. Re-deriving the saving with its own arithmetic would mean
 * re-implementing Germany's Freigrenze, the UK allowance, Australia's
 * loss-ordering, Canada's inclusion rate and India's disallowed losses a
 * second time, and the second copy would drift.
 */
export function summarise(
  disposals: Disposal[],
  j: Jurisdiction,
  opts: ReportOptions,
  incomeTotal: number,
  poland: { revenue: number; costs: number; carryIn: number },
): ReportTotals {
  const rate = opts.rate / 100;
  const ltRate = (opts.longTermRate ?? opts.rate) / 100;
  const counted = disposals.filter((d) => !d.unvalued);

  const base: ReportTotals = {
    proceeds: 0, cost: 0, fees: 0,
    grossGain: 0, grossLoss: 0, netGain: 0,
    exemptGain: 0, exemptLoss: 0, discountedAway: 0,
    taxableBeforeAllowance: 0, allowanceUsed: 0, taxableGain: 0,
    estimatedTax: 0, incomeTotal,
  };

  if (j.method === "annual-pool") {
    const deductible = poland.costs + poland.carryIn;
    const gain = poland.revenue - deductible;
    base.proceeds = poland.revenue;
    base.cost = deductible;
    base.netGain = gain;
    base.taxableBeforeAllowance = Math.max(0, gain);
    base.taxableGain = Math.max(0, gain);
    base.estimatedTax = base.taxableGain * rate;
    return base;
  }

  for (const d of counted) {
    base.proceeds += d.proceeds;
    base.cost += d.cost;
    base.fees += d.fee;
    if (d.gain >= 0) base.grossGain += d.gain;
    else base.grossLoss += -d.gain;
  }

  // Exempt gains (Germany, Portugal) leave the computation entirely, along
  // with losses on the same exempt footing — you cannot claim a loss on an
  // asset whose gain would not have been taxed.
  const exemptRows = counted.filter((d) => d.exempt);
  base.exemptGain = exemptRows.reduce((s, d) => s + Math.max(0, d.gain), 0);
  base.exemptLoss = exemptRows.reduce((s, d) => s + Math.max(0, -d.gain), 0);
  const live = j.relief.kind === "exempt"
    ? counted.filter((d) => !reliefApplies(j.relief, d.holdingDays))
    : counted;

  let gains = live.filter((d) => d.gain > 0);
  const losses = live.filter((d) => d.gain < 0).reduce((s, d) => s + -d.gain, 0);

  if (j.relief.kind === "discount") {
    // ATO ordering: losses come off NON-discounted gains first, because a
    // dollar of loss is worth twice as much there. Then halve what is left.
    const shortGain = gains.filter((d) => !d.longTerm).reduce((s, d) => s + d.gain, 0);
    const longGain = gains.filter((d) => d.longTerm).reduce((s, d) => s + d.gain, 0);
    const usable = j.lossesDeductible ? losses : 0;
    const offsetShort = Math.min(shortGain, usable);
    const offsetLong = Math.min(longGain, usable - offsetShort);
    const remainingLong = longGain - offsetLong;
    const discount = remainingLong * (j.relief.pct / 100);
    base.discountedAway = discount;
    base.netGain = shortGain + longGain - offsetShort - offsetLong;
    base.taxableBeforeAllowance = Math.max(0, base.netGain - discount);
  } else if (!j.lossesDeductible) {
    // India: every gain is taxed on its own and losses are simply ignored.
    base.netGain = gains.reduce((s, d) => s + d.gain, 0);
    base.taxableBeforeAllowance = base.netGain;
  } else {
    base.netGain = gains.reduce((s, d) => s + d.gain, 0) - losses;
    base.taxableBeforeAllowance = Math.max(0, base.netGain);
  }

  // Allowance, then the inclusion rate — SARS and HMRC both work this way
  // round, and doing it the other way understates the relief.
  let afterAllowance: number;
  if (j.allowanceKind === "freigrenze") {
    afterAllowance = base.taxableBeforeAllowance > j.allowance ? base.taxableBeforeAllowance : 0;
    base.allowanceUsed = afterAllowance === 0 ? base.taxableBeforeAllowance : 0;
  } else {
    base.allowanceUsed = Math.min(j.allowance, base.taxableBeforeAllowance);
    afterAllowance = base.taxableBeforeAllowance - base.allowanceUsed;
  }

  base.taxableGain = afterAllowance * j.inclusionRate;

  if (j.relief.kind === "rate") {
    // Split the taxable amount between the short and long buckets in the same
    // proportion they contributed, then apply each rate.
    const shortGain = gains.filter((d) => !d.longTerm).reduce((s, d) => s + d.gain, 0);
    const longGain = gains.filter((d) => d.longTerm).reduce((s, d) => s + d.gain, 0);
    const total = shortGain + longGain;
    if (total > 0) {
      const shortShare = (shortGain / total) * base.taxableGain;
      const longShare = (longGain / total) * base.taxableGain;
      base.estimatedTax = shortShare * rate + longShare * ltRate;
    } else {
      base.estimatedTax = 0;
    }
  } else {
    base.estimatedTax = base.taxableGain * rate;
  }

  return base;
}
