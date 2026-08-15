import type { RepurchaseRule } from "./rules";

/**
 * One parcel you could sell. Under FIFO this is a single acquisition lot;
 * under a pooling method (Canadian ACB, the UK Section 104 pool) it is the
 * whole position at its pooled average cost, because a pooled holding has no
 * individually identifiable lots to cherry-pick.
 */
export interface HarvestCandidate {
  /** Stable key for rendering — asset plus source row. */
  id: string;
  asset: string;
  quantity: number;
  /** Allowable cost of this parcel, in the report currency. */
  cost: number;
  costPerUnit: number;
  /** Current price per unit used for the valuation. */
  price: number;
  value: number;
  /** value − cost. Negative means underwater. */
  unrealised: number;
  /** Null where the method pools, so there is genuinely no single date. */
  acquired: Date | null;
  holdingDays: number | null;
  /**
   * True where a holding-period exemption puts this parcel outside the charge,
   * so its LOSS cannot be claimed either — Germany past one year, Portugal at
   * 365 days. The asymmetry is the whole point: the gain would be tax-free,
   * and that same rule makes the loss worthless.
   */
  reliefBlocked: boolean;
  /**
   * The day a currently-claimable loss stops being claimable, where a
   * holding-period exemption is coming. Null everywhere else.
   */
  lossExpiresOn: Date | null;
  /**
   * Tax saved by realising THIS parcel on top of everything ranked above it.
   * Marginal, not standalone: once harvested losses have wiped out the year's
   * gains, the next parcel saves nothing, and showing each one its own
   * standalone saving would promise the same money several times over.
   */
  taxSaved: number;
  pooled: boolean;
}

/** A holding we could not put a price on. Listed, never guessed at. */
export interface UnpricedHolding {
  asset: string;
  quantity: number;
  cost: number;
}

export interface HarvestPlan {
  jurisdictionId: string;
  jurisdictionName: string;
  currency: string;
  currencySymbol: string;
  taxYearLabel: string;
  /** Last day of the tax year — the harvesting deadline. */
  yearEnd: Date;
  daysToYearEnd: number;
  methodLabel: string;
  /** True where the method pools, so per-lot selection is not available. */
  pooled: boolean;
  rule: RepurchaseRule;

  /** Underwater parcels, ranked by how much tax each actually saves. */
  candidates: HarvestCandidate[];
  /** Parcels in profit. Shown for context — selling these ADDS tax. */
  winners: HarvestCandidate[];
  unpriced: UnpricedHolding[];

  /** Gains already realised in this tax year, from the transaction history. */
  realisedGain: number;
  /** Estimated tax on the year as it stands. */
  taxBefore: number;
  /** Estimated tax if every worthwhile candidate were harvested. */
  taxAfter: number;
  totalSaved: number;
  /** Paper loss that can actually be claimed. */
  harvestableLoss: number;
  /** Paper loss that exists but is outside the charge and cannot be claimed. */
  blockedLoss: number;
  /**
   * The smallest amount of loss you have to realise to capture the whole
   * saving. Everything past this point is banked for future years.
   */
  lossNeeded: number;
  /**
   * Loss that is claimable but saves nothing THIS year, because the year's
   * gains have already been reduced to zero. It still carries forward in most
   * regimes — which is a decision, not a non-event.
   */
  surplusLoss: number;
  /** Price source per asset, so every valuation on the page is attributable. */
  priceNote: string;
  /** Country-specific things the reader has to know before acting. */
  notes: string[];
}
