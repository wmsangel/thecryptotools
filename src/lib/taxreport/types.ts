/**
 * ============================================================================
 * Crypto tax report — data model.
 * ============================================================================
 * Everything here runs in the visitor's browser. No transaction ever leaves
 * the device: there is no server to send it to, and that is the point — this
 * is the one calculation on the site where people are rightly nervous about
 * uploading their history to a stranger.
 *
 * The model is deliberately "sent / received" rather than "pair / side",
 * because that shape covers buys, sells, swaps, income and spending with one
 * row type, and it is what most exchange exports can be mapped onto.
 */

/** What the row does, once normalised. */
export type TxType =
  | "buy" // fiat → crypto
  | "sell" // crypto → fiat
  | "trade" // crypto → crypto
  | "income" // staking, mining, airdrop, interest — acquired at market value
  | "spend" // crypto → goods/services (a disposal)
  | "transfer" // between your own wallets — not taxable, but fees may be
  | "unknown";

export interface RawRow {
  /** 1-based line number in the uploaded file, for error messages. */
  line: number;
  values: Record<string, string>;
}

/** A normalised transaction, before any tax logic is applied. */
export interface Tx {
  line: number;
  date: Date;
  type: TxType;
  sentAsset?: string;
  sentAmount?: number;
  receivedAsset?: string;
  receivedAmount?: number;
  feeAsset?: string;
  feeAmount?: number;
  /**
   * Value of the transaction in the report currency at the time it happened.
   * Derived from the fiat leg where there is one; otherwise it must come from
   * the file. We never invent it — a row we cannot value is reported as a
   * problem rather than silently priced at zero.
   */
  fiatValue?: number;
  /** Fee expressed in the report currency, where we can work it out. */
  fiatFee?: number;
}

/** A single taxable disposal produced by the engine. */
export interface Disposal {
  line: number;
  date: Date;
  asset: string;
  quantity: number;
  /** Gross proceeds in the report currency. */
  proceeds: number;
  /** Allowable cost of the quantity disposed of, including acquisition fees. */
  cost: number;
  /** Disposal-side fees deducted from the gain. */
  fee: number;
  gain: number;
  /** Days between acquisition and disposal — null where the method pools lots. */
  holdingDays: number | null;
  /** True when a holding-period rule made this gain wholly exempt. */
  exempt: boolean;
  /** Portion of the gain that qualified for a long-term discount or rate. */
  longTerm: boolean;
  /** How the cost was established, shown in the table so the number is auditable. */
  basis: string;
  /**
   * True when the row could not be valued in the report currency. Its lots are
   * still consumed so later basis stays right, but it is excluded from the
   * totals and flagged — a guessed proceeds figure is worse than a gap.
   */
  unvalued?: boolean;
  note?: string;
}

/** Something we could not process — surfaced, never swallowed. */
export interface ReportIssue {
  line: number;
  severity: "error" | "warning";
  message: string;
}

export interface ReportTotals {
  proceeds: number;
  cost: number;
  fees: number;
  /** Gains before any allowance or discount. */
  grossGain: number;
  grossLoss: number;
  netGain: number;
  /** Gain removed by a holding-period exemption (Germany, Portugal). */
  exemptGain: number;
  /**
   * Losses on assets that were themselves exempt, and so cannot be claimed.
   * Tracked separately purely so the summary adds up on screen — without it a
   * reader sees a loss deducted that the engine has in fact disallowed.
   */
  exemptLoss: number;
  /** Gain removed by a long-term discount (Australia). */
  discountedAway: number;
  /** Gain remaining after exemptions and discounts, before the allowance. */
  taxableBeforeAllowance: number;
  allowanceUsed: number;
  taxableGain: number;
  estimatedTax: number;
  /** Income events (staking, mining, airdrops) valued on receipt. */
  incomeTotal: number;
}

/**
 * An un-disposed acquisition still sitting in the lot pool at the end of the
 * walk. The tax report itself only needs the per-asset totals in `holdings`,
 * but tax-loss harvesting is a LOT-level question — a position that is net in
 * profit can still contain an underwater lot worth selling — so the engine
 * hands the individual lots out rather than making a second walker derive them.
 *
 * `acquired` is null for lots the matching method has pooled (the UK Section
 * 104 pool, Canadian ACB), because a pooled holding genuinely has no single
 * acquisition date and any date shown would be an invention.
 */
export interface OpenLot {
  asset: string;
  quantity: number;
  costPerUnit: number;
  /** quantity × costPerUnit, i.e. the allowable cost of what is left. */
  cost: number;
  acquired: Date;
  /** Row in the uploaded file this lot came from. */
  line: number;
}

export interface TaxReport {
  jurisdiction: string;
  currency: string;
  taxYearLabel: string;
  disposals: Disposal[];
  issues: ReportIssue[];
  totals: ReportTotals;
  /** Assets still held at the end of the year, with their remaining cost basis. */
  holdings: { asset: string; quantity: number; cost: number }[];
  /** The same holdings broken out lot by lot — see `OpenLot`. */
  openLots: OpenLot[];
  /** Method actually applied, echoed back so the report is self-describing. */
  methodLabel: string;
}
