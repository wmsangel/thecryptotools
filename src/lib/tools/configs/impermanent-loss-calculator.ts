import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "impermanent-loss-calculator",
  updatedAt: "2026-07-30",
  title: "Impermanent Loss Calculator",
  description:
    "Estimate impermanent loss for a 50/50 liquidity pool from the price change of one asset versus the other.",
  category: "defi",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "impermanent loss calculator",
      "il calculator",
      "liquidity pool calculator",
      "defi impermanent loss",
      "amm loss calculator",
    ],
    description:
      "Free impermanent loss calculator for DeFi liquidity providers. See IL % from the relative price change of pooled assets.",
  },
  inputs: [
    { name: "priceRatio", label: "Price change of asset A", type: "number", suffix: "x", default: 2, min: 0, step: 0.01, help: "e.g. 2 = the price doubled vs asset B" },
  ],
  resultLabel: "Impermanent loss",
  compute: (i) => {
    const r = Number(i.priceRatio);
    if (r <= 0) return { value: "—", note: "Price ratio must be greater than 0." };

    // IL = 2*sqrt(r)/(1+r) - 1  (for a constant-product 50/50 pool)
    const il = (2 * Math.sqrt(r)) / (1 + r) - 1;
    const ilPct = il * 100;

    return {
      value: `${fmtNumber(ilPct)}%`,
      note: "Impermanent loss vs simply holding the two assets. It becomes permanent only if you withdraw at this ratio.",
      breakdown: [
        { label: "Price ratio", value: `${fmtNumber(r)}x` },
        { label: "Loss vs holding", value: `${fmtNumber(Math.abs(ilPct))}%`, emphasis: true },
      ],
    };
  },
  faq: [
    { q: "What is impermanent loss?", a: "It's the difference in value between providing liquidity to an AMM pool and simply holding the assets, caused by price divergence." },
    { q: "Is impermanent loss permanent?", a: "Only if you withdraw while prices have diverged. If prices return to the original ratio, the loss disappears." },
    { q: "How is it calculated?", a: "For a 50/50 constant-product pool: IL = 2·√r ÷ (1 + r) − 1, where r is the price ratio change of one asset vs the other." },
  ],
};

export default tool;
