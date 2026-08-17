/**
 * ============================================================================
 * Cost-basis method comparison.
 * ============================================================================
 * Runs the SAME transaction history through the cost-basis engine once per
 * matching method and lays the outcomes side by side, so a US filer can see
 * what FIFO, LIFO and HIFO each do to this year's bill.
 *
 * Two design rules make this honest rather than a "pick HIFO, pay less" toy:
 *
 *  1. It reuses `buildReport` unchanged, via its `methodOverride`. Re-deriving
 *     the gain with fresh arithmetic would re-implement the long-term/short-term
 *     split and the loss netting a second time, and the copy would drift.
 *
 *  2. It surfaces REMAINING COST BASIS, not just the tax saved. Total basis is
 *     fixed: whatever a method does not use this year stays with the lots you
 *     still hold and is taxed when you finally sell them. The method that pays
 *     least now is usually the one that leaves the least basis behind — i.e. it
 *     DEFERS the tax, it does not erase it. Hiding that would be the lie.
 *
 * Choosing a method is only lawful where the tax authority permits specific
 * identification. In this list that is the US alone; every other country
 * mandates one method, so there is nothing to compare and we say so.
 */

import { buildReport } from "@/lib/taxreport/engine";
import type { ReportIssue, TaxReport, Tx } from "@/lib/taxreport/types";
import type { Jurisdiction, MatchingMethod } from "@/lib/taxreport/jurisdictions";

export interface MethodResult {
  method: MatchingMethod;
  /** Short badge, e.g. "FIFO". */
  short: string;
  /** Full label, e.g. "FIFO (first in, first out)". */
  label: string;
  report: TaxReport;
  proceeds: number;
  /** Cost basis consumed by this year's disposals. */
  costUsed: number;
  netGain: number;
  taxableGain: number;
  estimatedTax: number;
  /** Cost basis still attached to the lots you keep — future taxable base. */
  remainingBasis: number;
  /** FIFO tax minus this method's tax. Positive = cheaper than FIFO this year. */
  savedVsFifo: number;
  /** FIFO remaining basis minus this method's. Positive = more tax deferred. */
  basisDeferredVsFifo: number;
  isBest: boolean;
  isFifo: boolean;
}

export interface MethodComparison {
  /** True only where the law lets you choose (specific identification — US). */
  allowsChoice: boolean;
  jurisdiction: Jurisdiction;
  currency: string;
  taxYearLabel: string;
  /** Three results for the US; a single mandated method elsewhere. */
  results: MethodResult[];
  fifo: MethodResult;
  best: MethodResult;
  /** fifo.estimatedTax − best.estimatedTax, never negative. */
  maxSaving: number;
  /** Import + engine issues from the FIFO run (identical set across methods). */
  issues: ReportIssue[];
}

/** The methods a US filer may elect under specific identification. */
const US_METHODS: { method: MatchingMethod; short: string; label: string }[] = [
  { method: "fifo", short: "FIFO", label: "FIFO (first in, first out)" },
  { method: "lifo", short: "LIFO", label: "LIFO (last in, first out)" },
  { method: "hifo", short: "HIFO", label: "HIFO (highest in, first out)" },
];

function shortFor(method: MatchingMethod): string {
  switch (method) {
    case "fifo": return "FIFO";
    case "lifo": return "LIFO";
    case "hifo": return "HIFO";
    case "acb": return "ACB";
    case "pool104": return "Pool";
    case "annual-pool": return "Annual";
  }
}

export interface CompareOptions {
  jurisdiction: Jurisdiction;
  taxYearLabel: string;
  rate: number;
  longTermRate?: number;
}

export function compareMethods(txs: Tx[], importIssues: ReportIssue[], opts: CompareOptions): MethodComparison {
  const j = opts.jurisdiction;
  // Specific identification is a US feature. Everywhere else the method is fixed.
  const allowsChoice = j.id === "us";
  const methods = allowsChoice
    ? US_METHODS
    : [{ method: j.method, short: shortFor(j.method), label: j.methodLabel }];

  const raw = methods.map((m) => {
    const report = buildReport(txs, importIssues, {
      jurisdiction: j,
      taxYearLabel: opts.taxYearLabel,
      rate: opts.rate,
      longTermRate: opts.longTermRate,
      methodOverride: allowsChoice ? m.method : undefined,
      methodLabelOverride: allowsChoice ? m.label : undefined,
    });
    return { m, report, remainingBasis: report.holdings.reduce((s, h) => s + h.cost, 0) };
  });

  const fifoRaw = raw.find((r) => r.m.method === "fifo") ?? raw[0];
  const fifoTax = fifoRaw.report.totals.estimatedTax;
  const fifoBasis = fifoRaw.remainingBasis;

  const results: MethodResult[] = raw.map((r) => {
    const t = r.report.totals;
    return {
      method: r.m.method,
      short: r.m.short,
      label: r.m.label,
      report: r.report,
      proceeds: t.proceeds,
      costUsed: t.cost,
      netGain: t.netGain,
      taxableGain: t.taxableGain,
      estimatedTax: t.estimatedTax,
      remainingBasis: r.remainingBasis,
      savedVsFifo: fifoTax - t.estimatedTax,
      basisDeferredVsFifo: fifoBasis - r.remainingBasis,
      isBest: false,
      isFifo: r.m.method === "fifo",
    };
  });

  // Best = least tax this year. On a tie the earliest (FIFO, listed first) wins,
  // because switching methods for no saving is not worth the paperwork.
  let best = results[0];
  for (const r of results) if (r.estimatedTax < best.estimatedTax - 1e-6) best = r;
  best.isBest = true;

  const fifo = results.find((r) => r.isFifo) ?? results[0];

  return {
    allowsChoice,
    jurisdiction: j,
    currency: j.currencyCode,
    taxYearLabel: fifoRaw.report.taxYearLabel,
    results,
    fifo,
    best,
    maxSaving: Math.max(0, fifo.estimatedTax - best.estimatedTax),
    issues: fifoRaw.report.issues,
  };
}

const DAY_MS = 86_400_000;
const day = (d: Date) => d.toISOString().slice(0, 10);

/**
 * A demonstration history dated relative to today, so the disposals always land
 * in the open tax year rather than drifting into a closed one.
 *
 * It is built to make the whole point visible in one screen: several lots of the
 * same asset bought at very different prices, then a partial sale. Under FIFO the
 * cheap early lot is sold (a big gain); under HIFO the dearest lot goes (almost
 * none); LIFO sells the most recent. The ETH leg deliberately turns into a loss
 * under LIFO/HIFO, to show a method can manufacture a deductible loss this year.
 */
export function buildSample(today: Date): string {
  const back = (days: number) => day(new Date(today.getTime() - days * DAY_MS));
  return [
    "Date,Type,Sent Amount,Sent Currency,Received Amount,Received Currency,Fee Amount,Fee Currency,Net Value",
    `${back(1200)},Buy,20000,USD,1,BTC,25,USD,20000`,
    `${back(800)},Buy,15000,USD,10,ETH,20,USD,15000`,
    `${back(400)},Buy,60000,USD,1,BTC,50,USD,60000`,
    `${back(200)},Buy,35000,USD,10,ETH,30,USD,35000`,
    `${back(30)},Buy,45000,USD,1,BTC,40,USD,45000`,
    `${back(20)},Sell,5,ETH,,,15,USD,15000`,
    `${back(10)},Sell,1,BTC,,,20,USD,65000`,
  ].join("\n");
}
