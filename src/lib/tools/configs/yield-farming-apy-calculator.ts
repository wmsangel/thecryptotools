import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "yield-farming-apy-calculator",
  updatedAt: "2026-07-30",
  title: "APR to APY Calculator (Yield Farming)",
  description:
    "Convert a yield-farming APR into a compounded APY based on how often you reinvest, and see the yearly earnings on your deposit.",
  category: "defi",
  source: "builtin",
  seo: {
    keywords: [
      "apr to apy calculator",
      "yield farming calculator",
      "apy calculator crypto",
      "compounding calculator defi",
      "apr apy converter",
    ],
    description:
      "Free APR to APY calculator for DeFi yield farming. Pick a compounding frequency to turn APR into a real APY and project earnings.",
  },
  inputs: [
    { name: "apr", label: "APR", type: "number", suffix: "%", default: 20, min: 0, step: 0.1 },
    {
      name: "frequency",
      label: "Compounding frequency",
      type: "select",
      default: "365",
      options: [
        { label: "Daily", value: "365" },
        { label: "Weekly", value: "52" },
        { label: "Monthly", value: "12" },
        { label: "Quarterly", value: "4" },
        { label: "Yearly", value: "1" },
      ],
    },
    { name: "principal", label: "Deposit", type: "number", suffix: "USD", default: 1000, min: 0, step: 1, optional: true },
  ],
  resultLabel: "APY",
  compute: (i) => {
    const apr = Number(i.apr) / 100;
    const n = Math.max(1, Number(i.frequency));
    const principal = Number(i.principal) || 0;

    const apy = Math.pow(1 + apr / n, n) - 1;
    const earnings = principal * apy;
    const boost = apr > 0 ? (apy - apr) * 100 : 0;

    return {
      value: `${fmtNumber(apy * 100)}%`,
      breakdown: [
        { label: "APR (no compounding)", value: `${fmtNumber(apr * 100)}%` },
        { label: "APY (compounded)", value: `${fmtNumber(apy * 100)}%`, emphasis: true },
        { label: "Compounding boost", value: `+${fmtNumber(boost)}%` },
        { label: "Yearly earnings on deposit", value: fmtUsd(earnings) },
      ],
    };
  },
  relatedSlugs: ["apy-calculator", "compound-interest-calculator", "crypto-lending-calculator", "staking-rewards-calculator"],
  faq: [
    { q: "What's the difference between APR and APY?", a: "APR is the simple annual rate. APY includes the effect of reinvesting (compounding) your rewards, so it's always higher than APR when you compound more than once a year." },
    { q: "How does compounding frequency change my yield?", a: "The more often you harvest and reinvest, the higher the APY — but each reinvest costs gas, so daily compounding isn't always worth it for small positions." },
    { q: "Is DeFi APY guaranteed?", a: "No. Advertised APYs move with pool size, token prices and emissions, and can drop fast. Treat them as a snapshot, not a promise." },
  ],
};

export default tool;
