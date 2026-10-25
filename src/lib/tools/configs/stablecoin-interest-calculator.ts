import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "stablecoin-interest-calculator",
  updatedAt: "2026-10-23",
  title: "Stablecoin Interest Calculator",
  description:
    "Project interest on USDC/USDT-style deposits, see approximate monthly passive income, and compare the outcome to a simple bank savings rate.",
  category: "defi",
  featured: false,
  popular: false,
  source: "builtin",
  seo: {
    keywords: [
      "stablecoin interest calculator",
      "usdc interest calculator",
      "stablecoin yield calculator",
      "how much interest on stablecoins",
      "usdt interest calculator",
    ],
    description:
      "Free stablecoin interest calculator for USDC/USDT-style yields. See interest earned, monthly passive income and how it compares to bank savings.",
  },
  inputs: [
    { name: "principal", label: "Stablecoins deposited", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    {
      name: "apy",
      label: "APY",
      type: "number",
      suffix: "%",
      default: 8,
      min: 0,
      step: 0.1,
      help: "Enter the APY your platform quotes today — yields change and are not guaranteed.",
    },
    { name: "years", label: "Years", type: "number", default: 1, min: 0, step: 0.25 },
    {
      name: "frequency",
      label: "Compounding",
      type: "select",
      default: "monthly",
      options: [
        { label: "Daily", value: "daily" },
        { label: "Monthly", value: "monthly" },
        { label: "Yearly", value: "yearly" },
      ],
    },
    {
      name: "bankRate",
      label: "Compare to bank savings",
      type: "number",
      suffix: "%",
      default: 0.5,
      min: 0,
      step: 0.1,
      optional: true,
      help: "Simple annual bank savings rate for the vs-bank line.",
    },
  ],
  resultLabel: "Interest earned",
  resultUnit: "USD",
  compute: (i) => {
    const principal = Number(i.principal) || 0;
    const apy = Number(i.apy) || 0;
    const years = Number(i.years) || 0;
    const frequency = String(i.frequency || "monthly");
    const bankRate = Number(i.bankRate) || 0;

    const n = frequency === "daily" ? 365 : frequency === "yearly" ? 1 : 12;
    const final = principal * Math.pow(1 + apy / 100 / n, n * years);
    const interest = final - principal;
    const monthlyIncome = (principal * (apy / 100)) / 12;
    const bankFinal = principal * Math.pow(1 + bankRate / 100, years);
    const vsBank = final - bankFinal;

    return {
      value: fmtUsd(interest),
      note: "Stablecoin yields are variable and carry smart-contract and de-peg risk — not financial advice.",
      breakdown: [
        { label: "Final balance", value: fmtUsd(final), emphasis: true },
        { label: "Monthly passive income ≈", value: fmtUsd(monthlyIncome) },
        { label: `Extra vs a bank at ${fmtNumber(bankRate)}%`, value: fmtUsd(vsBank) },
      ],
    };
  },
  relatedSlugs: [
    "compound-interest-calculator",
    "yield-farming-apy-calculator",
    "crypto-savings-goal-calculator",
  ],
  article: [
    {
      type: "p",
      text: "This is for stablecoin passive income — USDC, USDT and similar dollar-pegged deposits on lending desks or DeFi protocols — not a generic compound-interest toy. The headline is interest earned; the breakdown adds an approximate monthly income figure and a side-by-side vs bank savings so you can see what the crypto yield is buying relative to a plain deposit account.",
    },
    {
      type: "p",
      text: "Monthly passive income here is a simple APY÷12 sketch on the starting principal (useful for “how much might this throw off each month?”). The final balance compounds at the frequency you pick. Bank comparison uses annual compounding at the rate you enter.",
    },
    {
      type: "p",
      text: "Stablecoin yields move, and the peg and the platform can both fail. Enter the APY you see today; do not treat the default as a live rate or a promise. Use it to size risk against a boring bank alternative, not to chase the highest number on a landing page.",
    },
  ],
  faq: [
    {
      q: "How is this different from a compound interest calculator?",
      a: "Framing and outputs. It assumes a stablecoin deposit, surfaces monthly passive income, and compares the compounded result to a bank savings rate — so the question is “is this yield worth the crypto risk?” not just “what does compounding do?”",
    },
    {
      q: "What APY should I enter?",
      a: "The rate your lending platform or protocol currently quotes for that stablecoin. Rates change; the field is an input, not a live feed.",
    },
    {
      q: "What risks does stablecoin yield carry?",
      a: "Smart-contract bugs, platform insolvency, and de-peg of the stablecoin itself. Higher advertised APYs usually mean more of that risk — the vs-bank line exists to keep that trade-off visible.",
    },
  ],
};

export default tool;
