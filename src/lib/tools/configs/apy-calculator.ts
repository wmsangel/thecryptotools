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
  relatedSlugs: ["compound-interest-calculator", "staking-rewards-calculator", "crypto-lending-calculator", "yield-farming-apy-calculator"],
  article: [
    { type: "h2", text: "Why crypto quotes APY — and how the number gets inflated" },
    {
      type: "p",
      text: "APY exists to make one yield comparable to another by folding compounding into a single figure. In crypto it became the headline metric, which is exactly why it is the most gamed. A vault that auto-compounds hourly can quote a large APY off a modest APR; a farm can quote an APY that is mostly its own token emissions, which shrink as more people join. Two protocols both showing “40% APY” may be paying it in completely different things — real trading fees versus freshly minted governance tokens that get sold. This calculator gives you the honest APY for a given APR and compounding frequency; it cannot tell you whether the APR itself is real or sustainable.",
    },
    { type: "h2", text: "Compounding frequency has a ceiling" },
    {
      type: "p",
      text: "Turning APR into APY has sharply diminishing returns. At 12% APR, compounding monthly gives 12.68% APY, daily 12.75%, and continuously 12.75% — the jump from monthly to daily is a rounding error, and from daily to hourly you would never feel it. Anyone advertising an APY far above what the maths allows is compounding a higher APR, not using a cleverer schedule. Set the frequency to how your platform actually pays — many stake daily, some per block, some only when you claim — rather than to the biggest number.",
    },
    { type: "h2", text: "The cost the APY leaves out: gas and claiming" },
    {
      type: "p",
      text: "On-chain compounding is not free. Every time you claim and restake you pay a transaction fee, and on a small position that fee can quietly exceed the reward you are compounding — which is exactly why auto-compounding vaults exist, and why manually compounding a $200 stake every day usually loses to just leaving it alone. Before chasing a higher compounding frequency, weigh what a single claim costs against what a single period actually pays.",
    },
  ],
  faq: [
    { q: "What's the difference between APR and APY?", a: "APR is the simple annual rate. APY includes compounding, so it's higher when rewards are reinvested multiple times per year." },
    { q: "How is APY calculated?", a: "APY = (1 + APR ÷ n)ⁿ − 1, where n is the number of compounding periods per year." },
    { q: "Does more frequent compounding help?", a: "Yes, but with diminishing returns. Daily compounding beats monthly, but the gap narrows as frequency rises." },
  ],
};

export default tool;
