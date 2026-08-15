import type { ToolConfig } from "../types";
import { fmtUsd } from "@/lib/format";

/**
 * Realistic-looking sample holdings.
 *
 * Ticker note: MATIC was replaced by POL in the 2024–25 migration. It sat here
 * as MATIC until 2026-08 and made every generated fixture look two years out of
 * date to anyone who knows the market.
 */
const COINS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA",
  "DOGE", "AVAX", "LINK", "DOT", "POL", "LTC",
];

/** A block bar, so allocation is legible without a chart library. */
function bar(pct: number): string {
  const filled = Math.max(1, Math.round(pct / 4));
  return "█".repeat(Math.min(filled, 25));
}

const tool: ToolConfig = {
  slug: "fake-portfolio-generator",
  updatedAt: "2026-08-06",
  title: "Fake Crypto Portfolio Generator",
  description:
    "Generate a random but realistic crypto portfolio — see the allocation as a table, and copy it as JSON for testing dashboards and mock APIs.",
  category: "dev",
  source: "builtin",
  seo: {
    keywords: [
      "fake crypto portfolio",
      "fake bitcoin portfolio",
      "fake portfolio generator",
      "mock crypto portfolio",
      "random crypto portfolio",
      "test portfolio data",
      "sample portfolio json",
    ],
    description:
      "Free fake crypto portfolio generator. Random allocations across popular coins, shown as a readable breakdown and copyable JSON for testing.",
  },
  inputs: [
    { name: "assets", label: "Number of assets", type: "number", default: 5, min: 1, max: 12, step: 1 },
    { name: "total", label: "Total value", type: "number", suffix: "USD", default: 10000, min: 0, step: 100 },
  ],
  resultLabel: "Sample portfolio",
  compute: (i) => {
    const n = Math.min(COINS.length, Math.max(1, Math.floor(Number(i.assets) || 1)));
    const total = Number(i.total) || 0;

    const picks = [...COINS].sort(() => Math.random() - 0.5).slice(0, n);
    const weights = picks.map(() => Math.random() + 0.1);
    const sum = weights.reduce((a, b) => a + b, 0);

    const holdings = picks
      .map((symbol, idx) => ({
        symbol,
        allocationPct: Number(((weights[idx] / sum) * 100).toFixed(2)),
        valueUsd: Number(((weights[idx] / sum) * total).toFixed(2)),
      }))
      .sort((a, b) => b.valueUsd - a.valueUsd);

    return {
      value: fmtUsd(total),
      label: `${n} assets, randomly weighted`,
      // The readable half. Search Console says most people arriving here are
      // not developers, and until now they were shown nothing but JSON.
      breakdown: holdings.map((h) => ({
        label: `${h.symbol}  ${bar(h.allocationPct)}`,
        value: `${fmtUsd(h.valueUsd)}  ·  ${h.allocationPct}%`,
      })),
      copyText: JSON.stringify({ totalUsd: total, holdings }, null, 2),
      copyLabel: "JSON for your mock API",
      note:
        "Randomly generated sample data — these are not real holdings and the coins are not priced at market. Change an input to roll a new one.",
    };
  },
  faq: [
    {
      q: "What does this generate?",
      a: "A random allocation across popular coins that adds up to the total you choose, shown as a readable breakdown and available as JSON. It is seed data for testing portfolio screens.",
    },
    {
      q: "Is the data real?",
      a: "No. The weights are random and the coins are not priced at market — it is sample data, not a portfolio anyone holds and not a market snapshot.",
    },
    {
      q: "Can I use it in my app?",
      a: "Yes. Copy the JSON straight into your mock API, fixtures or Storybook stories. There is no licence and no attribution required.",
    },
    {
      q: "Can I use it to show someone a portfolio I do not have?",
      a: "Please do not. This produces obviously generated sample data for testing software; presenting it as real holdings to persuade somebody to invest is fraud. The tool is deliberately built to look like test data rather than an exchange screen.",
    },
    {
      q: "How do I get a different one?",
      a: "Change any input. Every run picks a fresh set of coins and fresh random weights.",
    },
  ],
};

export default tool;
