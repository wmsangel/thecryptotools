/**
 * ============================================================================
 * Jurisdiction rules driving the report.
 * ============================================================================
 * Each entry encodes only mechanics the engine can actually apply: the
 * matching method, the tax-year boundary, whether a swap is a disposal, and
 * how holding periods and allowances work. Rates are DEFAULTS the user edits,
 * because almost every country's real rate depends on their other income.
 *
 * Every figure here traces to the country guide of the same slug, which was
 * verified against the tax authority's own material. If you change a number,
 * change the guide too — and re-verify, don't trust memory.
 */

export type MatchingMethod =
  | "fifo" // oldest lot first
  | "lifo" // newest lot first — US specific-identification only
  | "hifo" // highest-cost lot first — US specific-identification only
  | "acb" // adjusted cost base / moving average (Canada)
  | "pool104" // UK: same-day, then 30-day, then the Section 104 pool
  | "annual-pool"; // Poland: annual revenue less annual costs, no lot matching

/**
 * `inclusive` decides whether the threshold day itself qualifies. Germany and
 * the US require MORE than a year (inclusive: false); Portugal exempts assets
 * held 365 days OR MORE (inclusive: true). One day, two different answers.
 */
export type Relief =
  | { kind: "none" }
  /** Gain is wholly exempt once the holding period is met. */
  | { kind: "exempt"; days: number; inclusive: boolean }
  /** A fraction of the gain is removed once the holding period is met. */
  | { kind: "discount"; days: number; pct: number; inclusive: boolean }
  /** A separate, lower rate applies once the holding period is met. */
  | { kind: "rate"; days: number; inclusive: boolean };

/** Does a holding period of `days` qualify for this relief? */
export function reliefApplies(relief: Relief, holdingDays: number | null): boolean {
  if (relief.kind === "none" || holdingDays === null) return false;
  return relief.inclusive ? holdingDays >= relief.days : holdingDays > relief.days;
}

export interface Jurisdiction {
  id: string;
  name: string;
  flag: string;
  currency: string;
  /** ISO 4217 code used for formatting. */
  currencyCode: string;
  /** Guide slug, so the report can link to the full rules. */
  guideSlug: string;
  method: MatchingMethod;
  methodLabel: string;
  /** Tax year start, 1-based month and day. */
  yearStart: { month: number; day: number };
  /** Is a crypto-to-crypto swap itself a disposal? */
  swapsTaxable: boolean;
  /**
   * When a swap is NOT taxable, does the new asset inherit the original
   * acquisition date? Portugal says yes — swapping does not reset the
   * 365-day clock. Elsewhere the deferral is cost-only.
   */
  swapsPreserveHoldingPeriod: boolean;
  relief: Relief;
  /**
   * "allowance" reduces the gain by up to this amount.
   * "freigrenze" is all-or-nothing: at or below it nothing is taxed, one unit
   * above it and the WHOLE gain is taxable. Germany works this way and it is
   * the single most misunderstood rule in European crypto tax.
   */
  allowance: number;
  allowanceKind: "allowance" | "freigrenze";
  allowanceLabel: string;
  /** Fraction of the net gain that enters taxable income (Canada 50%, SA 40%). */
  inclusionRate: number;
  /** Can capital losses offset gains at all? India says no. */
  lossesDeductible: boolean;
  defaultRate: number;
  /** Rate for the long-term bucket where `relief.kind === "rate"`. */
  defaultLongTermRate?: number;
  rateNote: string;
  /** Rules the engine deliberately does NOT model, shown to the user. */
  caveats: string[];
}

export const jurisdictions: Jurisdiction[] = [
  {
    id: "us", name: "United States", flag: "🇺🇸", currency: "$", currencyCode: "USD",
    guideSlug: "crypto-taxes-usa",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 1, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "rate", days: 365, inclusive: false },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No annual allowance",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 24, defaultLongTermRate: 15,
    rateNote: "Short-term gains are taxed at your income rate (10–37%). Long-term gains — held more than a year — are taxed at 0%, 15% or 20%.",
    caveats: [
      "The IRS allows specific identification if you documented it at the time; this report assumes FIFO.",
      "Per-wallet cost basis tracking has applied since 2025 — this report pools each asset across all wallets.",
      "Capital losses offset gains in full, and up to $3,000 of the excess can offset ordinary income each year. That $3,000 rule is not applied here.",
    ],
  },
  {
    id: "uk", name: "United Kingdom", flag: "🇬🇧", currency: "£", currencyCode: "GBP",
    guideSlug: "crypto-taxes-uk",
    method: "pool104", methodLabel: "Same-day, 30-day, then Section 104 pool",
    yearStart: { month: 4, day: 6 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 3000, allowanceKind: "allowance", allowanceLabel: "£3,000 annual exempt amount",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 24,
    rateNote: "18% for gains within your basic rate band, 24% above it. A single gain can straddle both.",
    caveats: ["HMRC's share-pooling rules are applied, but a gain straddling the basic and higher rate bands is taxed here at the single rate you choose."],
  },
  {
    id: "de", name: "Germany", flag: "🇩🇪", currency: "€", currencyCode: "EUR",
    guideSlug: "crypto-taxes-germany",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 1, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "exempt", days: 365, inclusive: false },
    allowance: 1000, allowanceKind: "freigrenze", allowanceLabel: "€1,000 Freigrenze (all-or-nothing)",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 42,
    rateNote: "Gains taken within a year are added to your income and taxed at your personal rate, up to 45% plus solidarity surcharge. Held longer than a year, they are tax-free.",
    caveats: ["The €1,000 limit is a Freigrenze, not an allowance: one euro over and the entire gain becomes taxable. The report applies it correctly — check the summary line."],
  },
  {
    id: "au", name: "Australia", flag: "🇦🇺", currency: "$", currencyCode: "AUD",
    guideSlug: "crypto-taxes-australia",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 7, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "discount", days: 365, pct: 50, inclusive: false },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No separate CGT allowance",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 32.5,
    rateNote: "Gains are added to your income and taxed at your marginal rate. Assets held more than 12 months get a 50% CGT discount.",
    caveats: ["The personal-use asset exemption is not modelled — it is narrow and rarely applies to investment crypto."],
  },
  {
    id: "ca", name: "Canada", flag: "🇨🇦", currency: "$", currencyCode: "CAD",
    guideSlug: "crypto-taxes-canada",
    method: "acb", methodLabel: "Adjusted cost base (moving average)",
    yearStart: { month: 1, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No annual allowance",
    inclusionRate: 0.5, lossesDeductible: true,
    defaultRate: 30,
    rateNote: "Half of each capital gain is taxable, at your marginal rate. The proposed rise to 66.67% was cancelled.",
    caveats: ["The superficial loss rule — which denies a loss if you rebuy within 30 days — is not applied."],
  },
  {
    id: "ie", name: "Ireland", flag: "🇮🇪", currency: "€", currencyCode: "EUR",
    guideSlug: "crypto-taxes-ireland",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 1, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 1270, allowanceKind: "allowance", allowanceLabel: "€1,270 annual personal exemption",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 33,
    rateNote: "A flat 33% on chargeable gains, with no distinction between short and long holding.",
    caveats: ["Ireland's four-week rule, which restricts loss relief when you rebuy quickly, is not applied."],
  },
  {
    id: "za", name: "South Africa", flag: "🇿🇦", currency: "R", currencyCode: "ZAR",
    guideSlug: "crypto-taxes-south-africa",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 3, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 50000, allowanceKind: "allowance", allowanceLabel: "R50,000 annual exclusion",
    inclusionRate: 0.4, lossesDeductible: true,
    defaultRate: 45,
    rateNote: "40% of the net gain enters taxable income at your marginal rate — a maximum effective 18%. This assumes capital, not revenue, treatment.",
    caveats: ["SARS may treat active trading as revenue rather than capital, taxing the full profit at up to 45%. This report assumes capital treatment."],
  },
  {
    id: "pt", name: "Portugal", flag: "🇵🇹", currency: "€", currencyCode: "EUR",
    guideSlug: "crypto-taxes-portugal",
    method: "fifo", methodLabel: "FIFO, with swaps deferred",
    yearStart: { month: 1, day: 1 },
    swapsTaxable: false, swapsPreserveHoldingPeriod: true,
    relief: { kind: "exempt", days: 365, inclusive: true },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No annual allowance",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 28,
    rateNote: "28% on gains from crypto held 365 days or less. Held longer, the gain is exempt.",
    caveats: ["Swaps are not taxed and do not reset the 365-day clock — the report carries the original acquisition date through a swap."],
  },
  {
    id: "pl", name: "Poland", flag: "🇵🇱", currency: "zł", currencyCode: "PLN",
    guideSlug: "crypto-taxes-poland",
    method: "annual-pool", methodLabel: "Annual pool — revenue less costs, no lot matching",
    yearStart: { month: 1, day: 1 },
    swapsTaxable: false, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No allowance; unused costs carry forward",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 19,
    rateNote: "A flat 19% on revenue from disposing of virtual currency, less documented acquisition costs.",
    caveats: [
      "Poland works on annual totals, not lot matching: all acquisition costs incurred in the year are set against all fiat-exit revenue in the year.",
      "Crypto-to-crypto swaps are outside the system entirely — neither taxable nor deductible.",
      "Costs above revenue are not a loss; they carry forward indefinitely as costs. File even in years you only bought.",
    ],
  },
  {
    id: "nz", name: "New Zealand", flag: "🇳🇿", currency: "$", currencyCode: "NZD",
    guideSlug: "crypto-taxes-new-zealand",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 4, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No allowance and no holding-period relief",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 33,
    rateNote: "There is no capital gains tax — profit is ordinary income at 10.5% to 39%, so use your marginal rate.",
    caveats: ["Because this is income rather than capital gains, a genuine loss is generally deductible against your other income."],
  },
  {
    id: "es", name: "Spain", flag: "🇪🇸", currency: "€", currencyCode: "EUR",
    guideSlug: "crypto-taxes-spain",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 1, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No annual allowance",
    inclusionRate: 1, lossesDeductible: true,
    defaultRate: 21,
    rateNote: "Savings-income scale: 19% to €6,000, 21% to €50,000, 23% to €200,000, 27% to €300,000 and 28% above. Pick the band your gain lands in.",
    caveats: ["The progressive savings scale is not applied automatically — the report uses the single rate you choose."],
  },
  {
    id: "in", name: "India", flag: "🇮🇳", currency: "₹", currencyCode: "INR",
    guideSlug: "crypto-taxes-india",
    method: "fifo", methodLabel: "FIFO (first in, first out)",
    yearStart: { month: 4, day: 1 },
    swapsTaxable: true, swapsPreserveHoldingPeriod: false,
    relief: { kind: "none" },
    allowance: 0, allowanceKind: "allowance", allowanceLabel: "No allowance",
    inclusionRate: 1, lossesDeductible: false,
    defaultRate: 30,
    rateNote: "A flat 30% under Section 115BBH, plus cess and any surcharge, regardless of holding period or income slab.",
    caveats: [
      "Losses cannot offset gains, other income, or be carried forward. The report therefore taxes each gain on its own and ignores every loss — that is the law, not a bug.",
      "The 1% TDS under Section 194S is withheld per transfer and is not modelled here.",
    ],
  },
];

export function getJurisdiction(id: string): Jurisdiction | undefined {
  return jurisdictions.find((j) => j.id === id);
}

/** Tax-year window containing `date`, honouring non-January year starts. */
export function taxYearFor(j: Jurisdiction, date: Date): { start: Date; end: Date; label: string } {
  const y = date.getUTCFullYear();
  const startThisYear = Date.UTC(y, j.yearStart.month - 1, j.yearStart.day);
  const startYear = date.getTime() >= startThisYear ? y : y - 1;
  const start = new Date(Date.UTC(startYear, j.yearStart.month - 1, j.yearStart.day));
  const end = new Date(Date.UTC(startYear + 1, j.yearStart.month - 1, j.yearStart.day) - 1);
  const label =
    j.yearStart.month === 1 && j.yearStart.day === 1
      ? `${startYear}`
      : `${startYear}–${String(startYear + 1).slice(2)}`;
  return { start, end, label };
}

/** Every tax year that appears in a set of dates, newest first. */
export function taxYearsIn(j: Jurisdiction, dates: Date[]): { start: Date; end: Date; label: string }[] {
  const seen = new Map<string, { start: Date; end: Date; label: string }>();
  for (const d of dates) {
    const y = taxYearFor(j, d);
    if (!seen.has(y.label)) seen.set(y.label, y);
  }
  return [...seen.values()].sort((a, b) => b.start.getTime() - a.start.getTime());
}
