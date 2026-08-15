import type { Coin } from "./types";
import { getCoin, sortedCoins } from "./registry";
import { getTool } from "@/lib/tools/registry";
import type { ToolConfig, ToolFaqItem } from "@/lib/tools/types";

/**
 * ============================================================================
 * Coin × tool pairing specs — the generator behind /coins/<coin>/<tool>.
 * ============================================================================
 * Each spec says: which underlying tool to render, which coins it applies to,
 * how to prefill the form for that coin (including which fields take the live
 * price), and how to write copy that is genuinely specific to the pair.
 *
 * A pair only earns a page if the spec can say something true and useful about
 * THAT coin with THAT tool. Specs that would only swap a ticker into a template
 * do not belong here.
 */

export interface CoinToolSpec {
  /** URL segment: /coins/<coin>/<slug>. */
  slug: string;
  /** The underlying tool config that actually does the maths. */
  toolSlug: string;
  /** Which coins get this page. */
  applies: (coin: Coin) => boolean;
  /** Page H1 / <title> head. */
  title: (coin: Coin) => string;
  /** Meta description. */
  description: (coin: Coin) => string;
  /** Extra keywords beyond the underlying tool's. */
  keywords: (coin: Coin) => string[];
  /** Static field prefills (amounts, rates, periods). */
  overrides: (coin: Coin) => Record<string, number | string>;
  /**
   * Fields that should be filled from the live coin price, mapped to a
   * multiplier — e.g. an entry price at 0.8× the current price so the example
   * shows a position in profit rather than a flat zero.
   */
  priceFields: Record<string, number>;
  /** Two to three paragraphs of pair-specific prose. */
  body: (coin: Coin) => string[];
  /** Pair-specific FAQ appended to the tool's own. */
  faq: (coin: Coin) => ToolFaqItem[];
}

/** "Solana (SOL)", but just "XRP" when the name and ticker are the same. */
function nameAndTicker(coin: Coin): string {
  return coin.name === coin.symbol ? coin.name : `${coin.name} (${coin.symbol})`;
}

/** "8.97 billion" — supply counts are unreadable as raw digits. */
function supplyWords(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toLocaleString("en-US", { maximumFractionDigits: 2 })} trillion`;
  if (n >= 1e9) return `${(n / 1e9).toLocaleString("en-US", { maximumFractionDigits: 2 })} billion`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString("en-US", { maximumFractionDigits: 2 })} million`;
  return n.toLocaleString("en-US");
}

/** "31 July 2026" from an ISO date, for the supply as-of disclosure. */
function asOfWords(iso?: string): string {
  if (!iso) return "recently";
  const [y, m, d] = iso.split("-");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

const specs: CoinToolSpec[] = [
  {
    slug: "profit-calculator",
    toolSlug: "profit-calculator",
    applies: () => true,
    title: (c) => `${c.name} Profit Calculator`,
    description: (c) =>
      `Free ${nameAndTicker(c)} profit calculator. Enter your buy and sell price to see ${c.symbol} profit, loss, ROI and fees — prefilled with the live ${c.symbol} price.`,
    keywords: (c) => [
      `${c.name.toLowerCase()} profit calculator`,
      `${c.symbol.toLowerCase()} profit calculator`,
      `${c.symbol.toLowerCase()} roi calculator`,
      `${c.name.toLowerCase()} gain calculator`,
      `how much profit ${c.name.toLowerCase()}`,
    ],
    overrides: (c) => ({ amount: c.typicalAmount, feePct: 0.1 }),
    priceFields: { buyPrice: 0.8, sellPrice: 1 },
    body: (c) => [
      `This calculator works out what a ${c.symbol} trade actually made after fees. Enter the price you bought ${c.symbol} at, the price you sold (or would sell) at, and how many coins you hold — the profit, ROI percentage and total fee cost update as you type. The price fields load the live ${c.symbol} market price when the page opens, so you can start from a realistic number instead of a placeholder.`,
      `Fees matter more than most people expect on ${c.symbol}. ${c.feeNote} The fee field applies your percentage to both the entry and the exit, which is how exchanges actually charge you — a 0.1% maker fee each way is 0.2% of the round trip, and that is before spread.`,
      `${c.volatilityNote} That is worth keeping in mind when reading the ROI figure: an unrealised gain on ${c.symbol} is only a gain once you have exited, and the exit price you can actually get depends on order-book depth at the moment you sell.`,
    ],
    faq: (c) => [
      {
        q: `How do I calculate ${c.name} profit?`,
        a: `Profit equals (sell price − buy price) × the number of ${c.symbol} you hold, minus trading fees on both sides. ROI is that profit divided by what you originally spent. This calculator does both, and applies your fee percentage to the entry and the exit separately.`,
      },
      {
        q: `Does this ${c.symbol} calculator use the live price?`,
        a: `Yes. When the page loads it fetches the current ${c.symbol} market price and prefills the price fields, and the "↧ Live price" button refreshes them on demand. Everything is calculated in your browser — nothing you type is sent anywhere.`,
      },
      {
        q: `Should I include ${c.symbol} withdrawal fees?`,
        a: `If you moved coins on-chain, yes — add them to your fee percentage or subtract them from the result. ${c.feeNote}`,
      },
    ],
  },
  {
    slug: "dca-calculator",
    toolSlug: "dca-calculator",
    applies: () => true,
    title: (c) => `${c.name} DCA Calculator`,
    description: (c) =>
      `Free ${nameAndTicker(c)} dollar-cost-averaging calculator. Model recurring ${c.symbol} buys to see coins accumulated, average entry and portfolio value at today's live price.`,
    keywords: (c) => [
      `${c.name.toLowerCase()} dca calculator`,
      `${c.symbol.toLowerCase()} dca calculator`,
      `dollar cost averaging ${c.name.toLowerCase()}`,
      `${c.name.toLowerCase()} average buy calculator`,
      `${c.symbol.toLowerCase()} recurring buy calculator`,
    ],
    overrides: () => ({ contribution: 100, periods: 12 }),
    priceFields: { avgPrice: 0.85, currentPrice: 1 },
    body: (c) => [
      `Dollar-cost averaging means buying a fixed dollar amount of ${c.symbol} on a schedule instead of trying to time one entry. This calculator models that: set how much you put in per buy, how many buys you have made, the average price you paid across them and the current ${c.symbol} price, and it returns total invested, coins accumulated and what the stack is worth now.`,
      `DCA suits ${c.symbol} for a specific reason. ${c.volatilityNote} A fixed dollar contribution automatically buys more ${c.symbol} when the price is down and less when it is up, which pulls your average entry below the simple average of the prices you bought at.`,
      `One thing the model does not capture: transaction costs on small, frequent buys. ${c.feeNote} If you are contributing a small amount weekly, check what percentage the fee represents — a flat fee on a tiny buy can quietly cost more than the whole strategy earns.`,
    ],
    faq: (c) => [
      {
        q: `Is DCA a good strategy for ${c.name}?`,
        a: `DCA removes timing risk, which is its whole point. It does not remove market risk — if ${c.symbol} trends down for the entire period you keep buying, you will still be underwater, just with a lower average entry than a single lump-sum entry at the top would have given you. Compare both with our DCA vs lump sum calculator.`,
      },
      {
        q: `How many ${c.symbol} will I accumulate?`,
        a: `Total invested divided by your average buy price. The calculator shows this directly, along with what those coins are worth at the live ${c.symbol} price.`,
      },
      {
        q: `What average price should I enter?`,
        a: `If you know your exact fills, use your real weighted average — the average entry calculator on this site works it out from individual buys. If you are planning ahead rather than reviewing, an estimate of where ${c.symbol} will trade over the period is fine; the result is a projection either way.`,
      },
    ],
  },
  {
    slug: "average-price-calculator",
    toolSlug: "average-entry-calculator",
    applies: () => true,
    title: (c) => `${c.name} Average Buy Price Calculator`,
    description: (c) =>
      `Work out your weighted average ${nameAndTicker(c)} entry price across multiple buys — and see exactly where your break-even sits.`,
    keywords: (c) => [
      `${c.name.toLowerCase()} average price calculator`,
      `${c.symbol.toLowerCase()} average buy price`,
      `${c.symbol.toLowerCase()} cost basis calculator`,
      `average down ${c.name.toLowerCase()}`,
      `${c.name.toLowerCase()} break even price`,
    ],
    overrides: (c) => ({ amount1: c.typicalAmount / 2, amount2: c.typicalAmount / 2 }),
    priceFields: { price1: 1.15, price2: 0.85 },
    body: (c) => [
      `If you bought ${c.symbol} more than once, your break-even is not the midpoint of the two prices — it is the weighted average, where the larger buy pulls the average toward its own price. This calculator does that weighting for you across two entries, which is the case that trips people up most often when they average down.`,
      `The weighted average is also your cost basis for tax in most jurisdictions, though the accepted method differs by country — some require FIFO, others mandate an average-cost approach. Our region-by-region crypto tax guides cover which method applies where before you rely on this figure for a return.`,
      `${c.volatilityNote} That is the practical argument for knowing your true average: it tells you the exact ${c.symbol} price at which the position stops being a loss, which is a much more useful anchor during a drawdown than the price of your first buy.`,
    ],
    faq: (c) => [
      {
        q: `How do I calculate my average ${c.symbol} price?`,
        a: `Add up what you spent across all buys, then divide by the total number of ${c.symbol} you received. Weighting by size is essential — buying 1 ${c.symbol} high and 9 ${c.symbol} low gives an average far closer to the low price.`,
      },
      {
        q: `Does averaging down lower my break-even?`,
        a: `Yes, arithmetically — buying more ${c.symbol} below your entry pulls the weighted average down. It also increases your position size, so the same percentage move against you now costs more in dollars. Check the new position against your risk limit before adding.`,
      },
      {
        q: `Do exchange fees change my cost basis?`,
        a: `In most tax systems acquisition fees are added to cost basis, which raises your true break-even slightly above the raw weighted average. ${c.feeNote}`,
      },
    ],
  },
  {
    slug: "staking-calculator",
    toolSlug: "staking-rewards-calculator",
    applies: (c) => Boolean(c.staking),
    title: (c) => `${c.name} Staking Calculator`,
    description: (c) =>
      `Estimate ${nameAndTicker(c)} staking rewards over any period. Prefilled with a typical ${c.symbol} reward rate and the live ${c.symbol} price — edit both to match your validator.`,
    keywords: (c) => [
      `${c.name.toLowerCase()} staking calculator`,
      `${c.symbol.toLowerCase()} staking rewards calculator`,
      `${c.symbol.toLowerCase()} staking apr`,
      `how much can i earn staking ${c.name.toLowerCase()}`,
      `${c.name.toLowerCase()} staking rewards`,
    ],
    overrides: (c) => ({
      amount: c.typicalAmount,
      apr: c.staking?.defaultApr ?? 5,
      days: 365,
    }),
    priceFields: { price: 1 },
    body: (c) => [
      `This calculator estimates what staking ${c.symbol} pays over a period you choose, in both coins and dollars. The reward rate is prefilled at ${c.staking?.defaultApr}% — ${c.staking?.range} — but treat that as a starting point, not a quote: staking rates move with participation and with validator commission, so put in the rate your own validator advertises.`,
      `How you stake ${c.symbol}: ${c.staking?.how} Liquidity matters as much as the rate. ${c.staking?.lockup} A high advertised rate on a coin you cannot exit quickly is a different product from the same rate on a liquid position, and that difference shows up exactly when you need it — during a sharp drawdown.`,
      `Two things the dollar figure cannot tell you. First, rewards are usually taxable as income when you receive them in most jurisdictions, at the value on the day — see the tax guide for your country. Second, ${c.volatilityNote} A ${c.staking?.defaultApr}% yield does not protect you from a price move several times that size, so judge staking on total return, not on the APR alone.`,
    ],
    faq: (c) => [
      {
        q: `How much can I earn staking ${c.name}?`,
        a: `At roughly ${c.staking?.defaultApr}% a year, staking ${c.typicalAmount.toLocaleString("en-US")} ${c.symbol} earns about ${((c.typicalAmount * (c.staking?.defaultApr ?? 0)) / 100).toLocaleString("en-US", { maximumFractionDigits: 4 })} ${c.symbol} over twelve months before commission. Enter your own amount and rate above for the exact figure, in coins and at the live ${c.symbol} price.`,
      },
      {
        q: `Is my ${c.symbol} locked while staking?`,
        a: c.staking?.lockup ?? "",
      },
      {
        q: `Are ${c.symbol} staking rewards taxed?`,
        a: `In most countries staking rewards are income at the moment you can access them, valued in your local currency on that date, and then a second capital-gains event when you later sell. A few treat them differently — Germany, for instance, has its own allowance for staking income. Check our tax guide for your jurisdiction.`,
      },
    ],
  },
  {
    slug: "liquidation-calculator",
    toolSlug: "liquidation-calculator",
    applies: () => true,
    title: (c) => `${c.name} Liquidation Price Calculator`,
    description: (c) =>
      `Find the exact ${nameAndTicker(c)} price that liquidates your leveraged position. Prefilled with the live ${c.symbol} price — set your leverage and direction.`,
    keywords: (c) => [
      `${c.name.toLowerCase()} liquidation calculator`,
      `${c.symbol.toLowerCase()} liquidation price`,
      `${c.symbol.toLowerCase()} leverage calculator`,
      `${c.name.toLowerCase()} futures calculator`,
      `${c.symbol.toLowerCase()} margin calculator`,
    ],
    overrides: () => ({ leverage: 10, side: "long", mmr: 0.5 }),
    priceFields: { entry: 1 },
    body: (c) => [
      `Leverage on ${c.symbol} perpetuals turns a modest move into a total loss of margin. This calculator shows the ${c.symbol} price at which your position gets force-closed, given your entry, your leverage and which side you are on. The entry field starts at the live ${c.symbol} price so the distance to liquidation is a real number, not a hypothetical.`,
      `The rule of thumb: at N× leverage, roughly a 100/N percent move against you wipes the margin. At 10× that is about 10%; at 25× it is about 4%. ${c.volatilityNote} Compare that number honestly against the distance the calculator gives you before you place the order.`,
      `Two adjustments the raw formula does not make. Maintenance margin means liquidation triggers slightly before the theoretical zero — the field above lets you enter your exchange's rate. And on perpetuals you also pay funding, which slowly erodes margin on the crowded side of the trade and can pull the liquidation point closer over a long hold.`,
    ],
    faq: (c) => [
      {
        q: `At what price does my ${c.symbol} long get liquidated?`,
        a: `Approximately your entry price × (1 − 1/leverage), adjusted for maintenance margin. A 10× ${c.symbol} long is liquidated by roughly a 10% drop; a 20× long by roughly 5%. Enter your numbers above for the exact level.`,
      },
      {
        q: `Does adding margin move the ${c.symbol} liquidation price?`,
        a: `Yes — adding margin to an isolated position lowers effective leverage and pushes the liquidation price further away. In cross margin your whole balance backs the position, which moves the level further out but puts the rest of your account at risk.`,
      },
      {
        q: `Why did I get liquidated before the price I calculated?`,
        a: `Three usual reasons: maintenance margin bites before the theoretical level, accumulated funding payments have eaten into your margin, and exchanges liquidate against the mark price (an index) rather than the last trade on that one venue — a wick on a single exchange can differ.`,
      },
    ],
  },
  {
    slug: "market-cap-calculator",
    toolSlug: "market-cap-calculator",
    // Only coins whose supply we can state honestly get this page.
    applies: (c) => Boolean(c.circulatingSupply),
    title: (c) => `${c.name} Market Cap Calculator`,
    description: (c) =>
      `Calculate ${nameAndTicker(c)} market cap from the live ${c.symbol} price and circulating supply — plus FDV, and the price ${c.symbol} would need to reach any target valuation.`,
    keywords: (c) => [
      `${c.name.toLowerCase()} market cap calculator`,
      `${c.symbol.toLowerCase()} market cap calculator`,
      `${c.name.toLowerCase()} market cap`,
      `${c.symbol.toLowerCase()} fdv calculator`,
      `${c.name.toLowerCase()} price at market cap`,
    ],
    overrides: (c) => ({
      circulating: c.circulatingSupply ?? 0,
      total: c.totalSupply ?? "",
      compareCap: 100_000_000_000,
    }),
    priceFields: { price: 1 },
    body: (c) => [
      `Market cap is simply the live ${c.symbol} price multiplied by the number of coins in circulation, and this page does that with the current price loaded for you. The supply field starts at roughly ${supplyWords(c.circulatingSupply ?? 0)} ${c.symbol}, which is where it stood on ${asOfWords(c.supplyAsOf)} — supply moves, so check it against a market data source if you need an exact figure, and edit the field.`,
      c.totalSupply
        ? `${c.name}'s supply is bounded at ${supplyWords(c.totalSupply)} ${c.symbol}, so the fully diluted valuation is a real ceiling rather than an open-ended one. The MC/FDV row shows how much of that supply is already trading: the closer it is to 100%, the less future dilution is waiting for you, and for ${c.symbol} that gap is currently ${Math.round(((c.circulatingSupply ?? 0) / c.totalSupply) * 100)}%.`
        : `${c.name} has no hard supply cap, so there is no honest fully diluted valuation to quote — the FDV rows stay empty unless you enter a total supply yourself. That is a genuine difference from capped assets: with ${c.symbol} the question is not how much locked supply is waiting, but how fast new supply is issued relative to demand.`,
      `The comparison field answers the question people actually come here for: what would ${c.symbol} be worth at some other valuation? Enter a target market cap and the calculator returns the implied ${c.symbol} price and the multiple from here. It is arithmetic, not a forecast — reaching a larger cap means absorbing every holder willing to sell on the way, and ${c.volatilityNote.charAt(0).toLowerCase()}${c.volatilityNote.slice(1)}`,
    ],
    faq: (c) => [
      {
        q: `What is ${c.name}'s market cap?`,
        a: `Multiply the live ${c.symbol} price by the circulating supply — around ${supplyWords(c.circulatingSupply ?? 0)} ${c.symbol} as of ${asOfWords(c.supplyAsOf)}. The calculator above loads the current price and does this for you; the result updates the moment you change either field.`,
      },
      {
        q: `How do I calculate the ${c.symbol} price at a given market cap?`,
        a: `Divide the target market cap by the circulating supply. The comparison field above does it directly and also shows the multiple against today's ${c.symbol} price, which is usually the more sobering number.`,
      },
      c.totalSupply
        ? {
            q: `What is ${c.name}'s fully diluted valuation?`,
            a: `FDV prices all ${supplyWords(c.totalSupply)} ${c.symbol} at the current price, including coins not yet circulating. The difference between FDV and market cap is the supply still to enter the market — worth knowing before you treat market cap as the whole picture.`,
          }
        : {
            q: `Does ${c.name} have a fully diluted valuation?`,
            a: `Not a meaningful one. ${c.symbol} has no fixed maximum supply, so there is no final coin count to price. Judge it on current market cap and the annual issuance rate instead of on FDV.`,
          },
    ],
  },
];

export interface CoinToolPage {
  coin: Coin;
  spec: CoinToolSpec;
  tool: ToolConfig;
}

/** Every (coin, tool) combination that earns a page. */
export function allCoinToolPages(): CoinToolPage[] {
  const pages: CoinToolPage[] = [];
  for (const coin of sortedCoins()) {
    for (const spec of specs) {
      if (!spec.applies(coin)) continue;
      const tool = getTool(spec.toolSlug);
      if (!tool) continue; // spec points at a tool that no longer exists
      pages.push({ coin, spec, tool });
    }
  }
  return pages;
}

/** The calculators available for one coin — used by the coin hub page. */
export function pagesForCoin(coin: Coin): CoinToolPage[] {
  return specs
    .filter((spec) => spec.applies(coin))
    .flatMap((spec) => {
      const tool = getTool(spec.toolSlug);
      return tool ? [{ coin, spec, tool }] : [];
    });
}

/** The coins that have a page for one tool — used to cross-link from /tools. */
export function coinsForTool(toolSlug: string): { coin: Coin; spec: CoinToolSpec }[] {
  const spec = specs.find((s) => s.toolSlug === toolSlug);
  if (!spec) return [];
  return sortedCoins()
    .filter((c) => spec.applies(c))
    .map((coin) => ({ coin, spec }));
}

export function getCoinToolPage(coinSlug: string, specSlug: string): CoinToolPage | undefined {
  const coin = getCoin(coinSlug);
  if (!coin) return undefined;
  const spec = specs.find((s) => s.slug === specSlug);
  if (!spec || !spec.applies(coin)) return undefined;
  const tool = getTool(spec.toolSlug);
  if (!tool) return undefined;
  return { coin, spec, tool };
}

export const coinToolSpecs = specs;
