import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "trading-fee-calculator",
  title: "Crypto Trading Fee Calculator",
  description:
    "Work out what maker/taker fees actually cost per trade and across many trades — plus the price move you need just to cover them. Fees are the silent tax on active trading.",
  category: "trading",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "crypto trading fee calculator",
      "maker taker fee calculator",
      "trading fees calculator",
      "exchange fee calculator",
      "binance fee calculator",
      "break even fee calculator",
    ],
    description:
      "Free crypto trading fee calculator. Enter position size, fee rate and number of trades to see total fees paid and the break-even move needed to cover them.",
  },
  inputs: [
    { name: "size", label: "Position size (per trade)", type: "number", suffix: "USD", default: 5000, min: 0, step: 10 },
    { name: "fee", label: "Fee per side", type: "number", suffix: "%", default: 0.1, min: 0, step: 0.01, help: "Taker ≈ 0.04–0.1%, maker often lower." },
    {
      name: "sides",
      label: "Trade type",
      type: "select",
      default: "round",
      options: [
        { label: "Round trip (entry + exit)", value: "round" },
        { label: "One side only", value: "one" },
      ],
    },
    { name: "trades", label: "Number of round trips", type: "number", suffix: "trades", default: 20, min: 1, step: 1, help: "How many times you repeat this over the period." },
  ],
  resultLabel: "Total fees paid",
  precision: 2,
  relatedSlugs: ["profit-calculator", "break-even-calculator", "crypto-arbitrage-calculator"],
  compute: (i) => {
    const size = Number(i.size);
    const fee = Number(i.fee) / 100;
    const sidesPerTrade = String(i.sides) === "round" ? 2 : 1;
    const trades = Math.max(1, Number(i.trades));

    const feePerTrade = size * fee * sidesPerTrade;
    const totalFees = feePerTrade * trades;
    const breakEvenMove = fee * sidesPerTrade * 100;

    return {
      value: fmtUsd(totalFees),
      note: `You need at least a ${fmtNumber(breakEvenMove)}% favourable move on each ${sidesPerTrade === 2 ? "round trip" : "trade"} just to break even on fees.`,
      breakdown: [
        { label: "Fee per trade", value: fmtUsd(feePerTrade), emphasis: true },
        { label: "Break-even move needed", value: `${fmtNumber(breakEvenMove)}%` },
        { label: "Sides charged per trade", value: sidesPerTrade },
        { label: "Total across all trades", value: fmtUsd(totalFees) },
      ],
    };
  },
  faq: [
    { q: "What's the difference between maker and taker fees?", a: "A maker adds liquidity by posting a limit order that rests on the book; a taker removes liquidity with a market order that fills immediately. Maker fees are usually lower, sometimes zero or rebated." },
    { q: "How much do fees really cost active traders?", a: "At 0.1% per side, a round trip costs 0.2% of position size. Do that 20 times and you've paid 4% of a single position in fees — before any losing trades. It's why overtrading quietly kills returns." },
    { q: "What is the break-even move?", a: "It's the price change needed just to cover fees. For a 0.1% round-trip fee you need +0.2% before you make a cent. Scalping tiny moves rarely clears this bar after fees." },
    { q: "How do I lower my fees?", a: "Use limit (maker) orders, hold the exchange's token for a discount, reach higher VIP volume tiers, and trade less often. Spot fees also differ from futures fees — check both." },
  ],
};

export default tool;
