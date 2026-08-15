import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "liquidation-calculator",
  updatedAt: "2026-08-03",
  title: "Liquidation Price Calculator",
  description:
    "Estimate the liquidation price of a leveraged long or short position from your entry price, leverage and maintenance margin.",
  category: "trading",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "liquidation calculator",
      "liquidation price calculator",
      "crypto liquidation calculator",
      "futures liquidation calculator",
      "leverage liquidation calculator",
    ],
    description:
      "Free liquidation price calculator for crypto futures. Enter entry, leverage and direction to estimate your liquidation price.",
  },
  inputs: [
    { name: "entry", label: "Entry price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    { name: "leverage", label: "Leverage", type: "number", suffix: "x", default: 10, min: 1, step: 1 },
    {
      name: "side",
      label: "Direction",
      type: "select",
      default: "long",
      options: [
        { label: "Long", value: "long" },
        { label: "Short", value: "short" },
      ],
    },
    { name: "mmr", label: "Maintenance margin", type: "number", suffix: "%", default: 0.5, min: 0, step: 0.1, optional: true },
  ],
  resultLabel: "Liquidation price",
  resultUnit: "USD",
  compute: (i) => {
    const entry = Number(i.entry);
    const leverage = Math.max(1, Number(i.leverage));
    const side = String(i.side);
    const mmr = (Number(i.mmr) || 0) / 100;

    // Isolated-margin approximation:
    // long  liq = entry * (1 - 1/lev + mmr)
    // short liq = entry * (1 + 1/lev - mmr)
    const liq =
      side === "short"
        ? entry * (1 + 1 / leverage - mmr)
        : entry * (1 - 1 / leverage + mmr);
    const distancePct = entry > 0 ? (Math.abs(liq - entry) / entry) * 100 : 0;

    return {
      value: fmtUsd(liq),
      note: "Isolated-margin estimate. Funding fees and cross-margin can shift the real liquidation price.",
      breakdown: [
        { label: "Direction", value: side === "short" ? "Short" : "Long" },
        { label: "Move to liquidation", value: `${fmtNumber(distancePct)}%`, emphasis: true },
        { label: "Leverage", value: `${fmtNumber(leverage, 0)}x` },
      ],
    };
  },
  relatedSlugs: ["margin-calculator", "leverage-calculator", "position-size-calculator", "futures-pnl-calculator"],
  faq: [
    { q: "How is liquidation price calculated?", a: "For an isolated long: liq ≈ entry × (1 − 1/leverage + maintenance margin). Higher leverage moves liquidation closer to your entry." },
    { q: "What is maintenance margin?", a: "It's the minimum equity the exchange requires to keep a position open. Falling below it triggers liquidation." },
    { q: "Why is my exchange's number different?", a: "Exchanges add funding fees, use tiered margins and may apply cross-margin — this tool gives a clean isolated-margin estimate." },
  ],
};

export default tool;
