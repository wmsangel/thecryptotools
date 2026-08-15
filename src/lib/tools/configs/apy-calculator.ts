import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "apy-calculator",
  updatedAt: "2026-07-13",
  title: "Crypto APY Calculator",
  description:
    "Convert an APR into compounded APY and project your staking or yield-farming returns over any period.",
  category: "mining",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "apy calculator",
      "crypto apy calculator",
      "staking calculator",
      "apr to apy calculator",
      "compound interest crypto",
    ],
    description:
      "Free APY calculator. Turn APR into compounded APY and estimate staking rewards over your chosen time frame.",
  },
  inputs: [
    { name: "principal", label: "Principal", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "apr", label: "APR", type: "number", suffix: "%", default: 12, min: 0, step: 0.01 },
    { name: "compounds", label: "Compounds / year", type: "number", default: 365, min: 1, step: 1 },
    { name: "years", label: "Years", type: "number", default: 1, min: 0, step: 0.25 },
  ],
  resultLabel: "Final balance",
  resultUnit: "USD",
  compute: (i) => {
    const principal = Number(i.principal);
    const apr = Number(i.apr) / 100;
    const n = Math.max(1, Number(i.compounds));
    const years = Number(i.years);

    const apy = Math.pow(1 + apr / n, n) - 1;
    const finalBalance = principal * Math.pow(1 + apr / n, n * years);
    const earned = finalBalance - principal;

    return {
      value: fmtUsd(finalBalance),
      breakdown: [
        { label: "Effective APY", value: `${fmtNumber(apy * 100)}%`, emphasis: true },
        { label: "Total earned", value: fmtUsd(earned) },
        { label: "Principal", value: fmtUsd(principal) },
      ],
    };
  },
  relatedSlugs: ["crypto-lending-calculator"],
  faq: [
    { q: "What's the difference between APR and APY?", a: "APR is the simple annual rate. APY includes compounding, so it's higher when rewards are reinvested multiple times per year." },
    { q: "How is APY calculated?", a: "APY = (1 + APR ÷ n)ⁿ − 1, where n is the number of compounding periods per year." },
    { q: "Does more frequent compounding help?", a: "Yes, but with diminishing returns. Daily compounding beats monthly, but the gap narrows as frequency rises." },
  ],
};

export default tool;
