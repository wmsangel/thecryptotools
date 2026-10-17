/**
 * ============================================================================
 * Single-disposal capital-gains estimate, per country.
 * ============================================================================
 * The country landing calculators share this one pure function. It models ONE
 * disposal honestly — gross gain, then the country's holding-period relief,
 * then its allowance (or German-style Freigrenze), then its inclusion rate,
 * then the rate — in that order, because order changes the answer.
 *
 * It deliberately does NOT model multi-lot matching, rate bands straddling a
 * gain, loss carry-forward or wallet-level basis. Those need a full history,
 * which is exactly what the CSV tool at /crypto-tax-report is for — the landing
 * calculator is the quick single-sale check that funnels there.
 *
 * Every rule here is read from the verified `Jurisdiction` record; nothing is
 * hard-coded per country, so the numbers trace back to each country guide.
 */
import { type Jurisdiction, reliefApplies } from "@/lib/taxreport/jurisdictions";

export interface TaxEstimateInput {
  /** What you sold for, in the country's currency. */
  proceeds: number;
  /** What you paid, including buy fees, in the country's currency. */
  costBasis: number;
  /** Days held, or null when the country has no holding-period relief. */
  holdingDays: number | null;
  /** The marginal/applicable rate the user chose, in percent. */
  rate: number;
  /** The preferential long-term rate, in percent, where a `rate` relief applies (US). */
  longTermRate?: number;
}

export interface TaxEstimate {
  grossGain: number;
  isLoss: boolean;
  /** Human text of the relief applied, or null if none applied. */
  reliefNote: string | null;
  /** The whole gain is exempt (held past an `exempt` threshold). */
  fullyExempt: boolean;
  /** Gain after holding-period relief (discount/exempt), before allowance. */
  gainAfterRelief: number;
  /** Amount of allowance / annual exclusion actually used. */
  allowanceApplied: number;
  /** German Freigrenze cleared the whole (small) gain. */
  freigrenzeExempt: boolean;
  /** Gain after relief and allowance. */
  taxableGain: number;
  /** Portion of the taxable gain that enters income (Canada 0.5, SA 0.4). */
  inclusionRate: number;
  taxableIncome: number;
  /** The rate actually applied, in percent. */
  rateUsed: number;
  tax: number;
  /** Gross gain minus tax — what you keep of the gain. */
  gainAfterTax: number;
  /** tax / grossGain, 0..1. */
  effectiveRate: number;
}

/** Round to cents to avoid float noise leaking into the breakdown. */
const r2 = (n: number) => Math.round(n * 100) / 100;

export function estimateTax(j: Jurisdiction, input: TaxEstimateInput): TaxEstimate {
  const grossGain = r2(input.proceeds - input.costBasis);

  if (grossGain <= 0) {
    return {
      grossGain,
      isLoss: true,
      reliefNote: null,
      fullyExempt: false,
      gainAfterRelief: grossGain,
      allowanceApplied: 0,
      freigrenzeExempt: false,
      taxableGain: 0,
      inclusionRate: j.inclusionRate,
      taxableIncome: 0,
      rateUsed: input.rate,
      tax: 0,
      gainAfterTax: grossGain,
      effectiveRate: 0,
    };
  }

  // 1. Holding-period relief.
  let gain = grossGain;
  let reliefNote: string | null = null;
  let fullyExempt = false;
  let rateUsed = input.rate;
  const applies = reliefApplies(j.relief, input.holdingDays);

  if (j.relief.kind === "exempt" && applies) {
    fullyExempt = true;
    gain = 0;
    reliefNote = `Held ${j.relief.inclusive ? "≥" : "more than"} ${j.relief.days} days → the gain is tax-free`;
  } else if (j.relief.kind === "discount" && applies) {
    gain = r2(gain * (1 - j.relief.pct / 100));
    reliefNote = `${j.relief.pct}% long-term discount → only ${100 - j.relief.pct}% of the gain is taxable`;
  } else if (j.relief.kind === "rate" && applies) {
    rateUsed = input.longTermRate ?? j.defaultLongTermRate ?? input.rate;
    reliefNote = `Long-term holding → preferential ${rateUsed}% rate`;
  }

  const gainAfterRelief = gain;

  // 2. Allowance / annual exclusion (Germany's is a Freigrenze: all-or-nothing).
  let allowanceApplied = 0;
  let freigrenzeExempt = false;
  let taxableGain = gainAfterRelief;

  if (!fullyExempt && gainAfterRelief > 0 && j.allowance > 0) {
    if (j.allowanceKind === "freigrenze") {
      if (gainAfterRelief <= j.allowance) {
        taxableGain = 0;
        freigrenzeExempt = true;
        allowanceApplied = gainAfterRelief;
      }
      // One unit over the Freigrenze and the whole gain stays taxable.
    } else {
      allowanceApplied = Math.min(gainAfterRelief, j.allowance);
      taxableGain = r2(gainAfterRelief - allowanceApplied);
    }
  }

  // 3. Inclusion rate, then 4. the rate.
  const taxableIncome = r2(taxableGain * j.inclusionRate);
  const tax = fullyExempt ? 0 : r2(Math.max(0, taxableIncome * (rateUsed / 100)));

  return {
    grossGain,
    isLoss: false,
    reliefNote,
    fullyExempt,
    gainAfterRelief,
    allowanceApplied,
    freigrenzeExempt,
    taxableGain,
    inclusionRate: j.inclusionRate,
    taxableIncome,
    rateUsed,
    tax,
    gainAfterTax: r2(grossGain - tax),
    effectiveRate: grossGain > 0 ? tax / grossGain : 0,
  };
}
