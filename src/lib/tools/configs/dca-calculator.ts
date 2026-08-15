import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "dca-calculator",
  updatedAt: "2026-07-31",
  title: "Crypto DCA Calculator",
  description:
    "Model a dollar-cost averaging strategy: see your average entry price, total coins accumulated and portfolio value across recurring buys.",
  category: "trading",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "dca calculator",
      "free crypto dca calculator",
      "dollar cost averaging calculator",
      "crypto dca calculator",
      "bitcoin dca calculator",
      "average cost calculator",
      "dca bot calculator",
    ],
    description:
      "Free crypto DCA calculator. Enter contribution, number of buys and average price to see accumulated coins, average entry and portfolio value.",
  },
  inputs: [
    { name: "contribution", label: "Amount per buy", type: "number", suffix: "USD", default: 100, min: 0, step: 1 },
    { name: "periods", label: "Number of buys", type: "number", default: 12, min: 1, step: 1 },
    { name: "avgPrice", label: "Average buy price", type: "number", suffix: "USD", default: 25000, min: 0, step: 0.01 },
    { name: "currentPrice", label: "Current price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
  ],
  resultLabel: "Portfolio value",
  resultUnit: "USD",
  compute: (i) => {
    const contribution = Number(i.contribution);
    const periods = Number(i.periods);
    const avgPrice = Number(i.avgPrice);
    const current = Number(i.currentPrice);

    const invested = contribution * periods;
    const coins = avgPrice > 0 ? invested / avgPrice : 0;
    const value = coins * current;
    const profit = value - invested;
    const roi = invested > 0 ? (profit / invested) * 100 : 0;

    return {
      value: fmtUsd(value),
      breakdown: [
        { label: "Total invested", value: fmtUsd(invested) },
        { label: "Coins accumulated", value: fmtNumber(coins, 6) },
        { label: "Average entry", value: fmtUsd(avgPrice) },
        { label: "Profit / loss", value: fmtUsd(profit) },
        { label: "ROI", value: `${fmtNumber(roi)}%`, emphasis: true },
      ],
    };
  },
  relatedSlugs: ["dca-bot-calculator", "dca-vs-lumpsum-calculator", "average-entry-calculator"],
  faq: [
    { q: "What is dollar-cost averaging?", a: "DCA means investing a fixed amount at regular intervals regardless of price, smoothing out volatility over time." },
    { q: "How is the average entry calculated?", a: "Average entry = total invested ÷ total coins accumulated. This calculator uses your provided average buy price." },
    { q: "Is DCA good for crypto?", a: "DCA reduces timing risk and emotional decisions, which is why it's popular for volatile assets like crypto." },
  ],
};

export default tool;
