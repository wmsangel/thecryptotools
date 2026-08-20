import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "compound-interest-calculator",
  updatedAt: "2026-08-03",
  title: "Crypto Compound Interest Calculator",
  description:
    "Project the growth of your crypto with compound interest and optional recurring contributions over any number of years.",
  category: "mining",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "crypto compound interest calculator",
      "crypto compounding calculator",
      "compound interest calculator",
      "compound growth calculator",
      "crypto savings calculator",
      "reinvestment calculator",
    ],
    description:
      "Free compound interest calculator for crypto. Add a starting amount, monthly contributions and rate to project growth.",
  },
  inputs: [
    { name: "principal", label: "Starting amount", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    { name: "monthly", label: "Monthly contribution", type: "number", suffix: "USD", default: 100, min: 0, step: 1, optional: true },
    { name: "rate", label: "Annual rate", type: "number", suffix: "%", default: 10, min: 0, step: 0.01 },
    { name: "years", label: "Years", type: "number", default: 5, min: 0, step: 0.5 },
  ],
  resultLabel: "Final balance",
  resultUnit: "USD",
  compute: (i) => {
    const principal = Number(i.principal);
    const monthly = Number(i.monthly) || 0;
    const rate = Number(i.rate) / 100;
    const years = Number(i.years);

    const r = rate / 12;
    const n = years * 12;
    const growth = Math.pow(1 + r, n);
    const fvPrincipal = principal * growth;
    const fvContrib = r > 0 ? monthly * ((growth - 1) / r) : monthly * n;
    const finalBalance = fvPrincipal + fvContrib;
    const contributed = principal + monthly * n;
    const interest = finalBalance - contributed;

    return {
      value: fmtUsd(finalBalance),
      breakdown: [
        { label: "Total contributed", value: fmtUsd(contributed) },
        { label: "Interest earned", value: fmtUsd(interest), emphasis: true },
        { label: "Growth multiple", value: `${fmtNumber(contributed > 0 ? finalBalance / contributed : 0)}x` },
      ],
    };
  },
  relatedSlugs: ["apy-calculator", "staking-rewards-calculator", "crypto-lending-calculator", "yield-farming-apy-calculator"],
  article: [
    { type: "h2", text: "Compounding in crypto is not compounding in a savings account" },
    {
      type: "p",
      text: "In a bank the rate is fixed and the currency is stable, so a projection like the one above is the whole story. In crypto the “interest” comes from staking, lending or providing liquidity at rates that float from week to week, and it is paid in the same token you already hold. So this projection assumes a steady rate and quietly ignores the variable that usually decides the outcome: the token’s own price. An 8% yield compounded for five years is erased by a single 40% drawdown in the asset, and no compounding frequency changes that.",
    },
    { type: "h2", text: "APR vs APY — the number crypto platforms blur" },
    {
      type: "p",
      text: "Most crypto yields are advertised as APY, which already contains the effect of compounding. Enter an APY here and then let it compound monthly and you double-count. If your platform quotes APR — the flat rate before compounding — then monthly compounding is right and APY is what you actually end up with. The gap grows with the rate: 12% APR compounded daily is about 12.7% APY; 100% APR is about 171%. Enter APR and let the tool compound it, or enter the APY directly and treat the rate as the final number.",
    },
    { type: "h2", text: "Realistic crypto yield ranges — a starting point, not a promise" },
    {
      type: "ul",
      items: [
        "Proof-of-stake staking: roughly 2–8% a year, depending on the chain and how much of the supply is staked network-wide.",
        "Stablecoin lending on major platforms: roughly 4–12% — but that rate is the platform’s promise, not the protocol’s, and platforms have failed.",
        "Liquidity provision and yield farming: often quoted at 20%+, but the headline ignores impermanent loss and decaying token emissions — read it as gross, not net.",
        "“Too good” tiers of 50%+: almost always subsidised by token emissions that fall over time, or a risk you are being paid to take. Model them if you like, but do not plan around them.",
      ],
    },
    {
      type: "p",
      text: "The honest way to use this: run a conservative rate you would actually accept, then run an optimistic one, and treat the two results as a range rather than a target. And judge any crypto yield on total return in dollars — where, more often than not, the token price matters more than the rate you compounded.",
    },
  ],
  faq: [
    { q: "How does compound interest work?", a: "Each period's earnings are added to the balance, so future earnings are calculated on a larger amount — growth accelerates over time." },
    { q: "Does it include my monthly deposits?", a: "Yes — each monthly contribution compounds from the month it's added, using monthly compounding." },
    { q: "What rate should I use?", a: "Use a realistic expected annual return. Crypto yields vary widely, so try conservative and optimistic scenarios." },
  ],
};

export default tool;
