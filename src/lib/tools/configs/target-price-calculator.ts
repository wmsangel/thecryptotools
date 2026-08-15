import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "target-price-calculator",
  updatedAt: "2026-07-15",
  title: "Price Target Calculator (Reach Your Goal)",
  description:
    "Find the price your coin must hit for your holdings to reach a target value — and how big a move that is from today.",
  category: "portfolio",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "price target calculator",
      "crypto price target calculator",
      "how much to reach calculator",
      "crypto millionaire calculator",
      "target portfolio value calculator",
    ],
    description:
      "Free crypto price target calculator. See what price your coins must hit to reach a goal, and the % gain needed.",
  },
  inputs: [
    { name: "holdings", label: "Coins held", type: "number", default: 1000, min: 0, step: 0.0001 },
    { name: "currentPrice", label: "Current price", type: "number", suffix: "USD", default: 0.5, min: 0, step: 0.00001, livePrice: true },
    { name: "targetValue", label: "Target portfolio value", type: "number", suffix: "USD", default: 1000000, min: 0, step: 1 },
  ],
  resultLabel: "Required price",
  resultUnit: "USD",
  compute: (i) => {
    const holdings = Number(i.holdings);
    const current = Number(i.currentPrice);
    const target = Number(i.targetValue);

    const requiredPrice = holdings > 0 ? target / holdings : 0;
    const currentValue = holdings * current;
    const multiple = current > 0 ? requiredPrice / current : 0;
    const gainPct = current > 0 ? (multiple - 1) * 100 : 0;

    return {
      value: fmtUsd(requiredPrice),
      breakdown: [
        { label: "Current portfolio value", value: fmtUsd(currentValue) },
        { label: "Move needed", value: `${fmtNumber(multiple)}x`, emphasis: true },
        { label: "Gain needed", value: `${fmtNumber(gainPct)}%` },
      ],
    };
  },
  faq: [
    { q: "How do I find the price needed to hit my goal?", a: "Required price = target value ÷ coins held. This tool also shows the multiple and % gain from the current price." },
    { q: "How many coins to become a millionaire?", a: "Set your target to $1,000,000 and your holdings — the tool shows the exact price that gets you there." },
    { q: "Is reaching that price realistic?", a: "Compare the required price to the coin's history and market cap. A huge required multiple usually means it's a long shot." },
  ],
};

export default tool;
