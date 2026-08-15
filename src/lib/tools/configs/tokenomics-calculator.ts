import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

function fmtCap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${fmtNumber(value / 1e12)}T`;
  if (abs >= 1e9) return `$${fmtNumber(value / 1e9)}B`;
  if (abs >= 1e6) return `$${fmtNumber(value / 1e6)}M`;
  return fmtUsd(value);
}

const tool: ToolConfig = {
  slug: "tokenomics-calculator",
  title: "Crypto Tokenomics Calculator",
  description:
    "Size up a token launch before you buy: valuation at listing, what your allocation is worth, how much supply is still locked, and the annual emission rate diluting you.",
  category: "market",
  featured: true,
  source: "builtin",
  updatedAt: "2026-07-31",
  seo: {
    keywords: [
      "crypto tokenomics calculator",
      "tokenomics calculator",
      "token supply calculator",
      "token allocation calculator",
      "token emission calculator",
      "fdv and dilution calculator",
      "token launch valuation calculator",
    ],
    description:
      "Free crypto tokenomics calculator. Enter total supply, circulating supply, price and yearly emissions to see market cap, FDV, locked supply and annual inflation.",
  },
  inputs: [
    { name: "totalSupply", label: "Total supply", type: "number", suffix: "tokens", default: 1000000000, min: 1, step: 1, help: "Every token that will ever exist." },
    { name: "circulating", label: "Circulating at launch", type: "number", suffix: "tokens", default: 150000000, min: 0, step: 1, help: "Unlocked and tradeable on day one." },
    { name: "price", label: "Token price", type: "number", suffix: "USD", default: 0.25, min: 0, step: 0.00000001 },
    { name: "emissions", label: "Tokens unlocking per year", type: "number", suffix: "tokens", default: 200000000, min: 0, step: 1, optional: true, help: "From the vesting schedule — vesting, staking rewards, emissions." },
    { name: "allocationPct", label: "Your allocation", type: "number", suffix: "%", default: 0.5, min: 0, max: 100, step: 0.01, optional: true, help: "Share of total supply you hold or are being offered." },
  ],
  resultLabel: "Fully diluted valuation",
  precision: 2,
  relatedSlugs: ["token-burn-calculator", "market-cap-calculator", "token-vesting-dilution-calculator", "market-cap-price-calculator"],
  compute: (i) => {
    const totalSupply = Number(i.totalSupply);
    const circulating = Math.min(Number(i.circulating), totalSupply);
    const price = Number(i.price);
    const emissions = Number(i.emissions) || 0;
    const allocationPct = Number(i.allocationPct) || 0;

    if (!(totalSupply > 0) || !(price > 0)) {
      return { value: "—", note: "Enter a total supply and a price above zero." };
    }

    const fdv = totalSupply * price;
    const marketCap = circulating * price;
    const floatPct = (circulating / totalSupply) * 100;
    const locked = totalSupply - circulating;
    const lockedValue = locked * price;
    const inflation = circulating > 0 ? (emissions / circulating) * 100 : 0;
    const yearOneCirc = Math.min(circulating + emissions, totalSupply);
    // Price that keeps market cap flat once the new supply lands.
    const dilutedPrice = yearOneCirc > 0 ? marketCap / yearOneCirc : 0;
    const priceDrag = price > 0 ? ((dilutedPrice - price) / price) * 100 : 0;
    const allocation = (allocationPct / 100) * totalSupply;

    const breakdown: ToolResultRow[] = [
      { label: "Fully diluted valuation (FDV)", value: fmtCap(fdv), emphasis: true },
      { label: "Market cap at launch", value: fmtCap(marketCap) },
      { label: "Float (circulating ÷ total)", value: `${fmtNumber(floatPct)}%` },
      { label: "Locked supply", value: `${fmtNumber(locked, 0)} tokens (${fmtCap(lockedValue)})` },
    ];

    if (emissions > 0) {
      breakdown.push(
        { label: "Year-1 supply inflation", value: `${fmtNumber(inflation)}%` },
        { label: "Circulating after 12 months", value: `${fmtNumber(yearOneCirc, 0)} tokens` },
        { label: "Price to hold market cap flat", value: `${fmtUsd(dilutedPrice, dilutedPrice < 1 ? 6 : 2)} (${fmtNumber(priceDrag)}%)` },
      );
    }

    if (allocation > 0) {
      breakdown.push(
        { label: "Your tokens", value: `${fmtNumber(allocation, 0)} tokens` },
        { label: "Your value at this price", value: fmtUsd(allocation * price) },
      );
    }

    let note = `FDV is ${fmtNumber(fdv / (marketCap || 1))}× the launch market cap.`;
    if (floatPct < 20) {
      note += ` A float under 20% means the visible price is set by a small slice of supply — low-float launches often print a high FDV that the market never validates once unlocks begin.`;
    }
    if (inflation > 50) {
      note += ` Year-one emissions add ${fmtNumber(inflation)}% to circulating supply: demand has to grow by roughly the same amount just to keep the price where it is.`;
    }

    return { value: fmtCap(fdv), note, breakdown };
  },
  faq: [
    {
      q: "What is tokenomics?",
      a: "Tokenomics is the supply-side design of a token: how many exist, who holds them, when locked tokens unlock, and how new supply is issued. It sets the arithmetic your investment has to fight against — good tokenomics will not save a bad product, but bad tokenomics can sink a good one.",
    },
    {
      q: "What is FDV and why does it matter more at launch?",
      a: "Fully diluted valuation is price × total supply — what the project would be worth if every token were circulating today. At launch, a project can put a tiny float on the market and print an attractive market cap while the FDV is ten or twenty times larger. The FDV is the number the market eventually has to justify.",
    },
    {
      q: "What is a low float, high FDV launch?",
      a: "A launch where only a small percentage of supply is tradeable on day one. Thin supply makes the price easy to push up, and the headline market cap looks modest — but every unlock afterwards adds sellers into that same book. It has been one of the most reliable ways to lose money on new listings.",
    },
    {
      q: "How much annual inflation is too much?",
      a: "Compare emissions to demand, not to a fixed threshold. If circulating supply grows 60% in a year, buying pressure must grow roughly 60% just to hold the price flat. Chains with 2–5% staking inflation are a different category from projects unlocking half their supply annually.",
    },
    {
      q: "Where do I find a token's real supply figures?",
      a: "The project's own docs or vesting page for the schedule, and a market data site for the current circulating figure — then check that they agree. If the unlock schedule is vague or absent, treat that as the answer. Our token unlock calculator sizes a single unlock event in detail.",
    },
  ],
};

export default tool;
