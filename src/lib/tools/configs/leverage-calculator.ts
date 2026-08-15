import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "leverage-calculator",
  updatedAt: "2026-07-15",
  title: "Crypto Leverage Calculator",
  description:
    "Work out your position size and exposure from margin and leverage — see exactly how much buying power your collateral gives.",
  category: "trading",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "leverage calculator",
      "crypto leverage calculator",
      "margin calculator crypto",
      "futures leverage calculator",
      "position size leverage",
    ],
    description:
      "Free crypto leverage calculator. Enter margin and leverage to see position size, coin quantity and total exposure.",
  },
  inputs: [
    { name: "margin", label: "Margin (collateral)", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "leverage", label: "Leverage", type: "number", suffix: "x", default: 10, min: 1, step: 1 },
    { name: "entry", label: "Entry price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
  ],
  resultLabel: "Position size",
  resultUnit: "USD",
  compute: (i) => {
    const margin = Number(i.margin);
    const leverage = Math.max(1, Number(i.leverage));
    const entry = Number(i.entry);

    const positionUsd = margin * leverage;
    const coins = entry > 0 ? positionUsd / entry : 0;
    const liqMovePct = 100 / leverage;

    return {
      value: fmtUsd(positionUsd),
      breakdown: [
        { label: "Coins controlled", value: fmtNumber(coins, 6), emphasis: true },
        { label: "Margin used", value: fmtUsd(margin) },
        { label: "Total exposure", value: fmtUsd(positionUsd) },
        { label: "≈ Move to liquidation", value: `${fmtNumber(liqMovePct)}%` },
      ],
    };
  },
  faq: [
    { q: "How does leverage work?", a: "Leverage multiplies your margin into a larger position. 10x on $1,000 margin controls a $10,000 position." },
    { q: "How much can I lose?", a: "A price move of roughly 100% ÷ leverage against you wipes your margin (liquidation). At 10x, that's about a 10% move." },
    { q: "Is higher leverage better?", a: "Higher leverage magnifies both gains and losses and moves liquidation closer to your entry — it's riskier, not better." },
  ],
};

export default tool;
