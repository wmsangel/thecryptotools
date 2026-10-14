/**
 * ============================================================================
 * Spot trading-fee snapshot — powers the exchange fee-comparison table.
 * ============================================================================
 * The site's long-standing rule (see compare/data.ts) is that a STALE fee is
 * worse than no fee at all. This table honours that three ways:
 *   1. It is a DATED snapshot (`FEES_AS_OF`) of the standard VIP-0 tier, before
 *      any native-token discount — the one tier that is comparable across venues.
 *   2. It states a number ONLY where independent sources strongly agree. Where
 *      they disagree or a venue just rebuilt its tiers (Kraken did, July 2026;
 *      Coinbase/HTX/Crypto.com differ by source), the rate is `null` and the row
 *      links straight to the exchange's own live schedule instead of guessing.
 *   3. Every row links to the live fee page and to our own fee calculator, so
 *      the reader confirms the current number and their real cost themselves.
 *
 * Maintenance: re-check against each `liveUrl` and bump `FEES_AS_OF` roughly
 * quarterly. Never invent a rate — set it `null` if you cannot confirm it.
 */

export const FEES_AS_OF = "October 2026";

export interface ExchangeFee {
  /** platforms.ts slug — the row's "Trade" button routes through /go/<slug>. */
  slug: string;
  name: string;
  /** Spot maker/taker %, standard (VIP-0) tier. null = sources differ → "see schedule". */
  makerPct: number | null;
  takerPct: number | null;
  /** Native-token discount, where well documented. */
  tokenDiscount?: string;
  features: { futures?: boolean; card?: boolean; bots?: boolean };
  /** The exchange's own live fee page. */
  liveUrl: string;
  /** Why the rate is deferred (shown when maker/taker are null). */
  note?: string;
}

export const EXCHANGE_FEES: ExchangeFee[] = [
  { slug: "binance", name: "Binance", makerPct: 0.1, takerPct: 0.1, tokenDiscount: "−25% paying with BNB", features: { futures: true, bots: true }, liveUrl: "https://www.binance.com/en/fee/schedule" },
  { slug: "bybit", name: "Bybit", makerPct: 0.1, takerPct: 0.1, features: { futures: true, card: true, bots: true }, liveUrl: "https://www.bybit.com/en/help-center/article/Trading-Fee-Structure" },
  { slug: "okx", name: "OKX", makerPct: 0.08, takerPct: 0.1, tokenDiscount: "lower with OKB", features: { futures: true, bots: true }, liveUrl: "https://www.okx.com/fees" },
  { slug: "kucoin", name: "KuCoin", makerPct: 0.1, takerPct: 0.1, tokenDiscount: "−20% with KCS", features: { futures: true, bots: true }, liveUrl: "https://www.kucoin.com/vip/level" },
  { slug: "bitget", name: "Bitget", makerPct: 0.1, takerPct: 0.1, tokenDiscount: "−20% with BGB", features: { futures: true, bots: true }, liveUrl: "https://www.bitget.com/fee" },
  { slug: "mexc", name: "MEXC", makerPct: 0, takerPct: 0.05, features: { futures: true }, liveUrl: "https://www.mexc.com/fee" },
  { slug: "gate-io", name: "Gate.io", makerPct: 0.1, takerPct: 0.1, tokenDiscount: "lower with GT", features: { futures: true }, liveUrl: "https://www.gate.com/fee" },
  { slug: "bitfinex", name: "Bitfinex", makerPct: 0.1, takerPct: 0.2, features: { futures: true }, liveUrl: "https://www.bitfinex.com/fees/" },
  { slug: "kraken", name: "Kraken", makerPct: null, takerPct: null, features: { futures: true }, liveUrl: "https://www.kraken.com/features/fee-schedule", note: "Rebuilt its fee tiers in July 2026 — confirm the current rate on the schedule." },
  { slug: "coinbase", name: "Coinbase", makerPct: null, takerPct: null, features: {}, liveUrl: "https://www.coinbase.com/advanced-fees", note: "Advanced Trade tiers vary by volume; the simple buy/sell interface costs far more." },
  { slug: "htx", name: "HTX", makerPct: null, takerPct: null, features: { futures: true }, liveUrl: "https://www.htx.com/en-us/fee/", note: "Published rates differ by source — confirm on the schedule." },
  { slug: "crypto-com", name: "Crypto.com", makerPct: null, takerPct: null, features: { card: true }, liveUrl: "https://crypto.com/exchange/document/fees-limits", note: "The Exchange and the App price differently — check the Exchange schedule." },
];

export type FeeBand = "low" | "mid" | "high" | "unknown";

/** low ≤0.10% taker · mid ≤0.25% · high >0.25% · unknown when deferred. */
export function feeBand(f: ExchangeFee): FeeBand {
  if (f.takerPct == null) return "unknown";
  if (f.takerPct <= 0.1) return "low";
  if (f.takerPct <= 0.25) return "mid";
  return "high";
}
