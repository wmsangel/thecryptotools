import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "futures-pnl-calculator",
  updatedAt: "2026-07-15",
  title: "Futures PnL Calculator",
  description:
    "Calculate the profit or loss and ROE% of a leveraged long or short futures position from entry, exit, margin and leverage.",
  category: "trading",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "pnl calculator",
      "futures pnl calculator",
      "crypto pnl calculator",
      "leverage profit calculator",
      "roe calculator crypto",
    ],
    description:
      "Free futures PnL calculator. Enter entry, exit, margin and leverage to see profit/loss and return on equity (ROE).",
  },
  inputs: [
    { name: "margin", label: "Margin", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "leverage", label: "Leverage", type: "number", suffix: "x", default: 10, min: 1, step: 1 },
    { name: "entry", label: "Entry price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    { name: "exit", label: "Exit price", type: "number", suffix: "USD", default: 33000, min: 0, step: 0.01 },
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
  ],
  resultLabel: "Profit / Loss",
  resultUnit: "USD",
  compute: (i) => {
    const margin = Number(i.margin);
    const leverage = Math.max(1, Number(i.leverage));
    const entry = Number(i.entry);
    const exit = Number(i.exit);
    const dir = String(i.side) === "short" ? -1 : 1;

    const positionUsd = margin * leverage;
    const coins = entry > 0 ? positionUsd / entry : 0;
    const pnl = (exit - entry) * coins * dir;
    const roe = margin > 0 ? (pnl / margin) * 100 : 0;
    const priceMovePct = entry > 0 ? ((exit - entry) / entry) * 100 * dir : 0;

    return {
      value: fmtUsd(pnl),
      label: pnl >= 0 ? "Profit" : "Loss",
      breakdown: [
        { label: "ROE (return on margin)", value: `${fmtNumber(roe)}%`, emphasis: true },
        { label: "Price move (in your favor)", value: `${fmtNumber(priceMovePct)}%` },
        { label: "Position size", value: fmtUsd(positionUsd) },
        { label: "Coins", value: fmtNumber(coins, 6) },
      ],
    };
  },
  faq: [
    { q: "What is ROE in futures?", a: "Return on equity is your PnL divided by the margin you posted. With leverage, a small price move can be a large ROE." },
    { q: "How is futures PnL calculated?", a: "PnL = (exit − entry) × position size in coins, flipped for shorts. Position size = margin × leverage ÷ entry price." },
    { q: "Does this include fees or funding?", a: "No — it's the raw price PnL. Subtract trading fees and funding payments for your net result." },
  ],
};

export default tool;
