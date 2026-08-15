import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

/** Compact supply/cap notation shared with the market-cap tools. */
function fmtCap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${fmtNumber(value / 1e12)}T`;
  if (abs >= 1e9) return `$${fmtNumber(value / 1e9)}B`;
  if (abs >= 1e6) return `$${fmtNumber(value / 1e6)}M`;
  return fmtUsd(value);
}

const tool: ToolConfig = {
  slug: "token-burn-calculator",
  title: "Token Burn Calculator",
  description:
    "See what a token burn actually does: the supply removed, the price it implies if market cap holds, how long a recurring burn takes to reach a target supply, and whether emissions cancel it out.",
  category: "market",
  source: "builtin",
  updatedAt: "2026-08-03",
  seo: {
    keywords: [
      "token burn calculator",
      "crypto burn calculator",
      "token burn price impact",
      "deflationary token calculator",
      "coin burn calculator",
      "burn rate crypto calculator",
    ],
    description:
      "Free token burn calculator. Enter supply, price and burn amount to see the new supply, the implied price if market cap holds, and whether emissions cancel the burn out.",
  },
  inputs: [
    { name: "supply", label: "Circulating supply", type: "number", suffix: "tokens", default: 1000000000, min: 0, step: 1 },
    { name: "price", label: "Current price", type: "number", suffix: "USD", default: 0.02, min: 0, step: 0.00000001, livePrice: true },
    { name: "burn", label: "Tokens burned per period", type: "number", suffix: "tokens", default: 5000000, min: 0, step: 1 },
    { name: "periods", label: "Number of periods", type: "number", suffix: "×", default: 12, min: 1, max: 1000, step: 1, help: "e.g. 12 monthly burns over a year." },
    { name: "emission", label: "New tokens issued per period", type: "number", suffix: "tokens", default: 0, min: 0, step: 1, optional: true, help: "Staking rewards or unlocks working against the burn." },
  ],
  resultLabel: "Supply after burns",
  precision: 2,
  relatedSlugs: ["tokenomics-calculator", "market-cap-calculator", "token-vesting-dilution-calculator", "target-price-calculator"],
  compute: (i) => {
    const supply = Number(i.supply);
    const price = Number(i.price);
    const burn = Number(i.burn);
    const periods = Math.max(1, Math.floor(Number(i.periods) || 1));
    const emission = Number(i.emission) || 0;

    if (!(supply > 0) || !(price > 0)) {
      return { value: "—", note: "Enter a circulating supply and a price above zero." };
    }
    if (!(burn > 0)) {
      return { value: "—", note: "Enter the number of tokens burned per period." };
    }

    const marketCap = supply * price;
    const net = burn - emission;
    const totalBurned = burn * periods;
    const totalIssued = emission * periods;
    const finalSupply = Math.max(0, supply - net * periods);

    // The core question a burn poses: if the market keeps valuing the network at
    // the same total, a smaller supply must carry a higher price per token.
    const impliedPrice = finalSupply > 0 ? marketCap / finalSupply : 0;
    const priceChange = ((impliedPrice - price) / price) * 100;
    const supplyChange = ((finalSupply - supply) / supply) * 100;
    const burnValue = totalBurned * price;

    const perPeriodPct = (net / supply) * 100;
    const annualisedNote = periods >= 12 ? ` That is roughly ${fmtNumber((net / supply) * 100 * 12)}% of supply a year at a monthly cadence.` : "";

    const breakdown: ToolResultRow[] = [
      { label: "Supply now", value: `${fmtNumber(supply, 0)} tokens` },
      { label: "Total burned over the period", value: `${fmtNumber(totalBurned, 0)} tokens (${fmtCap(burnValue)} at today's price)` },
    ];

    if (emission > 0) {
      breakdown.push(
        { label: "Total newly issued", value: `${fmtNumber(totalIssued, 0)} tokens` },
        { label: "Net change in supply", value: `${net >= 0 ? "−" : "+"}${fmtNumber(Math.abs(net * periods), 0)} tokens` },
      );
    }

    breakdown.push(
      { label: "Supply after all periods", value: `${fmtNumber(finalSupply, 0)} tokens`, emphasis: true },
      { label: "Supply change", value: `${supplyChange >= 0 ? "+" : ""}${fmtNumber(supplyChange)}%` },
      { label: "Net burn per period", value: `${fmtNumber(perPeriodPct)}% of current supply` },
      { label: "Market cap today", value: fmtCap(marketCap) },
      { label: "Implied price if market cap is unchanged", value: fmtUsd(impliedPrice, impliedPrice < 1 ? 8 : 2) },
      { label: "Implied price change", value: `${priceChange >= 0 ? "+" : ""}${fmtNumber(priceChange)}%` },
    );

    let note: string;
    if (net > 0) {
      note = `Burning ${fmtNumber(burn, 0)} tokens ${periods} times removes ${fmtNumber(Math.abs(supplyChange))}% of supply. If the market keeps valuing the network at ${fmtCap(marketCap)}, that arithmetic implies ${fmtUsd(impliedPrice, impliedPrice < 1 ? 8 : 2)} per token.${annualisedNote}`;
    } else if (net === 0) {
      note = `Emissions exactly match the burn, so supply is flat. The burn is real but purely cosmetic in supply terms — it is offsetting issuance, not reducing the float.`;
    } else {
      note = `Emissions of ${fmtNumber(emission, 0)} per period outrun the ${fmtNumber(burn, 0)} burned, so supply still grows by ${fmtNumber(Math.abs(supplyChange))}% overall. The token is inflationary despite the burn — a common gap between burn marketing and net tokenomics.`;
    }
    note += " Treat the implied price as arithmetic, not a forecast: market cap is set by what buyers will pay, and a burn does not create demand. Burns funded from a treasury the project already controls also remove tokens that were never in the float to begin with.";

    return { value: `${fmtNumber(finalSupply, 0)} tokens`, note, breakdown };
  },
  faq: [
    {
      q: "What is a token burn?",
      a: "Permanently removing tokens from circulation, usually by sending them to an address nobody holds the keys to or by calling a burn function that destroys them. The supply figure falls and cannot be reversed.",
    },
    {
      q: "Does burning tokens make the price go up?",
      a: "Not mechanically. A burn reduces supply, so if total market value stayed the same the price per token would rise — that is the calculation above. But market cap is not fixed; it is whatever buyers are willing to pay. A burn with no demand behind it simply leaves fewer tokens at a similar price.",
    },
    {
      q: "What is the difference between a burn and a buyback-and-burn?",
      a: "A plain burn destroys tokens the project already holds, which changes the supply number but puts no money into the market. A buyback-and-burn spends revenue to purchase tokens on the open market first, so it creates real buy pressure as well as reducing supply. The second is far more meaningful.",
    },
    {
      q: "Why do some tokens burn and still inflate?",
      a: "Because issuance runs alongside it. Staking rewards, block rewards and vesting unlocks all add tokens. If they add more than the burn removes, net supply grows regardless of how large the burn number sounds — which is what the emissions field above exposes.",
    },
    {
      q: "How do I judge whether a burn is significant?",
      a: "As a percentage of circulating supply per year, not as a token count. Burning a billion tokens sounds enormous and means nothing if supply is a hundred trillion. Anything under about 1% of supply a year is noise next to normal price volatility.",
    },
    {
      q: "Are burned tokens really gone?",
      a: "If sent to a verifiable burn address or destroyed by contract, yes — nobody can recover them. But check what was burned: tokens from a treasury or an unsold allocation were never circulating, so removing them changes the total supply figure without affecting the float that actually trades.",
    },
  ],
};

export default tool;
