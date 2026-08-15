import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "options-payoff-calculator",
  updatedAt: "2026-07-15",
  title: "Options Profit Calculator",
  description:
    "Calculate the profit or loss of a long call or put at any target price, with the break-even level and return on the premium paid.",
  category: "trading",
  source: "builtin",
  seo: {
    keywords: [
      "options profit calculator",
      "options payoff calculator",
      "call option calculator",
      "put option calculator",
      "crypto options calculator",
    ],
    description:
      "Free options profit calculator for calls and puts. Enter strike, premium and target price to see P/L, break-even and ROI.",
  },
  inputs: [
    {
      name: "type",
      label: "Option type",
      type: "select",
      default: "call",
      options: [
        { label: "Long call", value: "call" },
        { label: "Long put", value: "put" },
      ],
    },
    { name: "strike", label: "Strike price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01 },
    { name: "premium", label: "Premium paid (per unit)", type: "number", suffix: "USD", default: 1200, min: 0, step: 0.01 },
    { name: "target", label: "Target price at expiry", type: "number", suffix: "USD", default: 36000, min: 0, step: 0.01 },
    { name: "size", label: "Contract size / units", type: "number", default: 1, min: 0, step: 0.01, optional: true },
  ],
  resultLabel: "Profit / loss at target",
  resultUnit: "USD",
  compute: (i) => {
    const type = String(i.type);
    const strike = Number(i.strike);
    const premium = Number(i.premium);
    const target = Number(i.target);
    const size = Number(i.size) || 1;

    const intrinsic =
      type === "put" ? Math.max(0, strike - target) : Math.max(0, target - strike);
    const pnlPerUnit = intrinsic - premium;
    const pnl = pnlPerUnit * size;
    const breakeven = type === "put" ? strike - premium : strike + premium;
    const roi = premium > 0 ? (pnlPerUnit / premium) * 100 : 0;

    return {
      value: fmtUsd(pnl),
      note:
        type === "put"
          ? "Long put profits when price falls below the break-even."
          : "Long call profits when price rises above the break-even.",
      breakdown: [
        { label: "Break-even price", value: fmtUsd(breakeven), emphasis: true },
        { label: "Intrinsic value at target", value: fmtUsd(intrinsic * size) },
        { label: "Premium paid", value: `-${fmtUsd(premium * size)}` },
        { label: "Return on premium", value: `${fmtNumber(roi)}%` },
      ],
    };
  },
  faq: [
    { q: "How is option profit calculated?", a: "At expiry a long call is worth max(0, price − strike) and a long put max(0, strike − price). Subtract the premium you paid to get profit or loss." },
    { q: "What is the break-even?", a: "For a call it's strike + premium; for a put it's strike − premium. Beyond that point the option starts making net money." },
    { q: "Does this include time value?", a: "No — this shows the payoff at expiry (intrinsic value only). Before expiry, options also carry time value that this simple model doesn't price." },
  ],
};

export default tool;
