import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "market-cap-price-calculator",
  updatedAt: "2026-07-31",
  title: "Market Cap Price Calculator",
  description:
    "See what a coin's price would be at a target market cap — the classic \"what if this coin had Bitcoin's market cap?\" tool.",
  category: "market",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "market cap price calculator",
      "coin price at market cap calculator",
      "what if market cap calculator",
      "coin price at market cap",
      "market cap to price",
    ],
    description:
      "Free market cap price calculator. Enter circulating supply and a target market cap to see the implied coin price and upside.",
  },
  inputs: [
    { name: "supply", label: "Circulating supply", type: "number", default: 1000000000, min: 0, step: 1 },
    { name: "targetCap", label: "Target market cap", type: "number", suffix: "USD", default: 100000000000, min: 0, step: 1 },
    { name: "currentPrice", label: "Current price", type: "number", suffix: "USD", default: 0.5, min: 0, step: 0.00001, optional: true },
  ],
  resultLabel: "Implied price",
  resultUnit: "USD",
  compute: (i) => {
    const supply = Number(i.supply);
    const targetCap = Number(i.targetCap);
    const current = Number(i.currentPrice) || 0;

    const impliedPrice = supply > 0 ? targetCap / supply : 0;
    const multiple = current > 0 ? impliedPrice / current : 0;

    return {
      value: fmtUsd(impliedPrice),
      breakdown: [
        { label: "Target market cap", value: fmtUsd(targetCap) },
        ...(current > 0
          ? [
              { label: "Upside from current", value: `${fmtNumber(multiple)}x`, emphasis: true },
              { label: "Gain needed", value: `${fmtNumber((multiple - 1) * 100)}%` },
            ]
          : []),
      ],
    };
  },
  relatedSlugs: ["market-cap-calculator", "tokenomics-calculator", "target-price-calculator"],
  faq: [
    { q: "How is price from market cap calculated?", a: "Price = market cap ÷ circulating supply. So a target market cap divided by supply gives the implied coin price." },
    { q: "Why compare to another coin's market cap?", a: "It's a quick reality check on upside — e.g. 'what would this token cost if it reached a top-10 coin's market cap?'." },
    { q: "Should I use circulating or total supply?", a: "Market cap usually uses circulating supply. Use fully-diluted (max) supply for an FDV-based estimate." },
  ],
};

export default tool;
