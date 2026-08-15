import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "token-vesting-dilution-calculator",
  title: "Token Unlock & Vesting Dilution Calculator",
  description:
    "Estimate how much a token unlock dilutes existing holders and how much sell pressure it could add. Big cliff unlocks routinely move prices — size the event before it lands.",
  category: "market",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "token unlock calculator",
      "vesting dilution calculator",
      "token dilution calculator",
      "token unlock sell pressure",
      "crypto vesting schedule calculator",
      "circulating supply dilution",
    ],
    description:
      "Free token unlock & vesting dilution calculator. Enter circulating supply, tokens unlocking and price to estimate dilution, sell pressure and theoretical price impact.",
  },
  inputs: [
    { name: "circulating", label: "Circulating supply", type: "number", suffix: "tokens", default: 100000000, min: 1, step: 1 },
    { name: "unlock", label: "Tokens unlocking", type: "number", suffix: "tokens", default: 10000000, min: 0, step: 1 },
    { name: "price", label: "Token price", type: "number", suffix: "USD", default: 2, min: 0, step: 0.0001 },
    { name: "sellShare", label: "Assumed sold on unlock", type: "number", suffix: "%", default: 30, min: 0, max: 100, step: 1, optional: true, help: "Rough guess of how much of the unlock hits the market." },
  ],
  resultLabel: "Dilution of circulating supply",
  precision: 2,
  relatedSlugs: ["tokenomics-calculator", "market-cap-calculator", "market-cap-price-calculator", "target-price-calculator"],
  compute: (i) => {
    const circulating = Number(i.circulating);
    const unlock = Number(i.unlock);
    const price = Number(i.price);
    const sellShare = (Number(i.sellShare) || 0) / 100;

    if (circulating <= 0) {
      return { value: "—", note: "Circulating supply must be greater than zero." };
    }

    const dilution = (unlock / circulating) * 100;
    const newSupply = circulating + unlock;
    const unlockValue = unlock * price;
    const estSellPressure = unlockValue * sellShare;
    // If market cap is unchanged, price adjusts down as supply grows.
    const theoreticalPrice = price * (circulating / newSupply);
    const priceImpact = (theoreticalPrice / price - 1) * 100;

    return {
      value: `${fmtNumber(dilution)}%`,
      note: "Dilution assumes constant market cap; real price impact depends on how much of the unlock is actually sold and how deep the order book is.",
      breakdown: [
        { label: "Unlock value", value: fmtUsd(unlockValue), emphasis: true },
        { label: "Est. sell pressure", value: fmtUsd(estSellPressure) },
        { label: "New circulating supply", value: fmtNumber(newSupply, 0) },
        { label: "Theoretical price (mcap held)", value: fmtUsd(theoreticalPrice) },
        { label: "Theoretical price impact", value: `${fmtNumber(priceImpact)}%` },
      ],
    };
  },
  faq: [
    { q: "What is a token unlock?", a: "Many projects issue tokens to teams, investors and treasuries on a vesting schedule. When a tranche 'unlocks', those tokens become transferable and can be sold — increasing circulating supply." },
    { q: "How does an unlock dilute holders?", a: "More circulating tokens chasing the same demand means each existing token represents a smaller slice of the network. If market cap stays flat, price falls proportionally to the supply increase." },
    { q: "Does every unlocked token get sold?", a: "No. Insiders may hold, stake or sell gradually. This tool lets you set an assumed sold-share so you can model a light or heavy sell scenario rather than assuming 100% hits the market." },
    { q: "Where do I find unlock schedules?", a: "Token unlock trackers, the project's tokenomics docs and vesting dashboards publish upcoming cliff and linear unlocks. Large cliff unlocks (a big chunk at once) tend to move price more than smooth linear ones." },
  ],
};

export default tool;
