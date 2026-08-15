import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

/** Compact market-cap notation — $1.29T reads better than $1,289,347,992,598. */
function fmtCap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${fmtNumber(value / 1e12)}T`;
  if (abs >= 1e9) return `$${fmtNumber(value / 1e9)}B`;
  if (abs >= 1e6) return `$${fmtNumber(value / 1e6)}M`;
  return fmtUsd(value);
}

const tool: ToolConfig = {
  slug: "market-cap-calculator",
  title: "Crypto Market Cap Calculator",
  description:
    "Work out a coin's market cap from price and circulating supply, plus its fully diluted valuation and the MC/FDV ratio that tells you how much supply is still to come.",
  category: "market",
  featured: true,
  popular: true,
  source: "builtin",
  updatedAt: "2026-07-31",
  seo: {
    keywords: [
      "crypto market cap calculator",
      "market cap calculator",
      "marketcap calculator",
      "coin market cap calculator",
      "market cap calculator crypto",
      "bitcoin market cap calculator",
      "fully diluted valuation calculator",
      "fdv calculator crypto",
    ],
    description:
      "Free crypto market cap calculator. Enter coin price, circulating supply and total supply to get market cap, fully diluted valuation (FDV) and the MC/FDV ratio.",
  },
  inputs: [
    { name: "price", label: "Coin price", type: "number", suffix: "USD", default: 0.5, min: 0, step: 0.00000001, livePrice: true },
    { name: "circulating", label: "Circulating supply", type: "number", suffix: "coins", default: 1000000000, min: 0, step: 1, help: "Coins actually in public hands right now." },
    { name: "total", label: "Total / max supply", type: "number", suffix: "coins", default: 2000000000, min: 0, step: 1, optional: true, help: "Leave blank if there is no cap — used for FDV." },
    { name: "compareCap", label: "Compare to a market cap", type: "number", suffix: "USD", default: 1000000000000, min: 0, step: 1, optional: true, help: "e.g. Bitcoin's cap — see the price this coin would need to match it." },
  ],
  resultLabel: "Market cap",
  precision: 2,
  relatedSlugs: ["market-cap-price-calculator", "tokenomics-calculator", "token-vesting-dilution-calculator", "target-price-calculator"],
  compute: (i) => {
    const price = Number(i.price);
    const circulating = Number(i.circulating);
    const total = Number(i.total) || 0;
    const compareCap = Number(i.compareCap) || 0;

    if (!(price > 0) || !(circulating > 0)) {
      return { value: "—", note: "Enter a price and a circulating supply above zero." };
    }

    const marketCap = price * circulating;
    const fdv = total > 0 ? price * total : 0;
    const ratio = fdv > 0 ? (marketCap / fdv) * 100 : 0;
    const locked = total > circulating ? total - circulating : 0;
    const lockedValue = locked * price;

    const breakdown: ToolResultRow[] = [
      { label: "Market cap", value: fmtCap(marketCap), emphasis: true },
    ];

    if (fdv > 0) {
      breakdown.push(
        { label: "Fully diluted valuation (FDV)", value: fmtCap(fdv) },
        { label: "MC / FDV", value: `${fmtNumber(ratio)}%` },
        { label: "Supply not yet circulating", value: `${fmtNumber(locked, 0)} coins (${fmtCap(lockedValue)} at today's price)` },
      );
    }

    if (compareCap > 0) {
      const impliedPrice = compareCap / circulating;
      const multiple = impliedPrice / price;
      breakdown.push(
        { label: "Price at the comparison cap", value: fmtUsd(impliedPrice, impliedPrice < 1 ? 6 : 2) },
        { label: "That would be", value: `${fmtNumber(multiple)}× today's price` },
      );
    }

    let note = `Exact market cap: ${fmtUsd(marketCap, 0)}.`;
    if (fdv > 0 && ratio < 50) {
      note += ` Less than half the supply is circulating — the ${fmtNumber(100 - ratio)}% still locked is future sell pressure, so judge this coin on FDV rather than market cap.`;
    } else if (fdv > 0 && ratio >= 95) {
      note += " Almost all supply is already circulating, so market cap and FDV say the same thing — there is little unlock overhang here.";
    }

    return { value: fmtCap(marketCap), note, breakdown };
  },
  faq: [
    {
      q: "How do you calculate crypto market cap?",
      a: "Market cap = current price × circulating supply. A coin at $2 with 500 million coins in circulation has a $1 billion market cap. Note that it is circulating supply, not total supply — tokens still locked in vesting contracts or a treasury are excluded.",
    },
    {
      q: "What is the difference between market cap and FDV?",
      a: "Market cap uses only the coins in circulation today. Fully diluted valuation (FDV) prices every coin that will ever exist, including locked and unminted supply. A project with a $200M market cap but a $2B FDV has 90% of its supply still to hit the market.",
    },
    {
      q: "What is a good MC/FDV ratio?",
      a: "There is no universal threshold, but the ratio tells you how much dilution is ahead. Above ~90% the supply story is largely settled. Below ~50% you are buying a small slice of a much larger future supply, and scheduled unlocks will keep adding sellers regardless of demand.",
    },
    {
      q: "Why can't a small coin just reach Bitcoin's market cap?",
      a: "It can be calculated, and the comparison field above does exactly that — but market cap is not money that flowed in. Reaching a large cap requires sustained buying against every holder willing to sell on the way up, and coins with huge supplies need implausible amounts of it. Treat the figure as a ceiling check, not a target.",
    },
    {
      q: "Does market cap tell me how much money is in a coin?",
      a: "No. It is a price multiplied by a supply count, so a thin order book can move the whole figure by billions on modest volume. Always read market cap alongside real trading volume and liquidity depth.",
    },
  ],
};

export default tool;
