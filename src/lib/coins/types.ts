/**
 * ============================================================================
 * Coin configuration schema — powers the programmatic `coin + tool` pages.
 * ============================================================================
 * Each coin is ONE object matching `Coin`. Combined with the pairing specs in
 * `./pairs.ts` it generates a hub page (/coins/solana) plus one calculator page
 * per applicable tool (/coins/solana/staking-calculator) — no per-page code.
 *
 * Only durable facts belong here (consensus, launch year, supply schedule).
 * Volatile numbers (price, APR) are either fetched live in the browser or
 * clearly presented as an editable default, never as a stated fact.
 */

export interface CoinFact {
  label: string;
  value: string;
}

export interface CoinStaking {
  /** Editable default reward rate (%) prefilled into the staking calculator. */
  defaultApr: number;
  /** Honest range shown next to the field, e.g. "roughly 6–8%". */
  range: string;
  /** How the coin is staked — one sentence, coin-specific. */
  how: string;
  /** Unbonding / lockup reality. */
  lockup: string;
  /** True when staking is native to the protocol (vs a third-party wrapper). */
  native: boolean;
}

export interface Coin {
  /** URL slug: /coins/<slug>. */
  slug: string;
  name: string;
  symbol: string;
  /** CoinGecko id — used for the live price fetch. */
  coingeckoId: string;
  /**
   * Binance pair used as the fallback when the CoinGecko call fails.
   *
   * Optional, because plenty of perfectly liquid assets are not on Binance —
   * Monero was delisted, Hyperliquid and Kaspa never listed, and CRO and MNT
   * trade mainly on their own exchanges. Those coins simply have no fallback;
   * `fetchCoinSpot` skips the second request rather than asking Binance for a
   * pair that does not exist and getting a 400 back.
   */
  binance?: string;
  /** Official site domain — used to pull the brand favicon. */
  domain: string;
  /** Brand colour for the logo fallback badge. */
  color: string;
  /** One-line positioning used in card grids and meta descriptions. */
  tagline: string;
  /** 2–3 sentences of genuinely coin-specific context. */
  intro: string;
  /** Durable protocol facts rendered as a table on every page for this coin. */
  facts: CoinFact[];
  /** Present only when the coin has a meaningful staking story. */
  staking?: CoinStaking;
  /**
   * Approximate circulating supply, used to prefill the market-cap calculator.
   * This one DOES drift, so it is presented as an editable starting value and
   * always rendered next to `supplyAsOf` — never stated as a current fact.
   * Omit for a coin whose supply we cannot state honestly; that coin simply
   * gets no market-cap page.
   */
  circulatingSupply?: number;
  /** ISO date the supply figure was read, shown wherever the figure appears. */
  supplyAsOf?: string;
  /**
   * Hard cap, or the settled total supply where the protocol has no cap but the
   * figure is stable. Omit for genuinely uncapped, inflationary supplies (ETH,
   * DOT, XTZ) — the market-cap page then simply skips the FDV block rather than
   * inventing a denominator.
   */
  totalSupply?: number;
  /** How transaction costs behave — reused in fee-aware copy. */
  feeNote: string;
  /** How the coin tends to move — reused in risk-aware copy. */
  volatilityNote: string;
  /** A round, realistic position size used to prefill "amount" fields. */
  typicalAmount: number;
  /** Ordering weight (roughly market cap rank). */
  order: number;
}
