import type { ToolConfig } from "../types";

/**
 * NOTE: This tool intentionally uses the `expression` path (a serializable
 * formula string evaluated by our safe parser) instead of a `compute` function.
 * It proves the same path AI-generated / DB-stored tools take at runtime.
 */
const tool: ToolConfig = {
  slug: "satoshi-converter",
  updatedAt: "2026-07-13",
  title: "Bitcoin to Satoshi Converter",
  description:
    "Convert between Bitcoin and satoshis instantly. 1 BTC = 100,000,000 satoshis.",
  category: "converters",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "satoshi converter",
      "btc to satoshi",
      "bitcoin to satoshi converter",
      "satoshi calculator",
      "sats converter",
    ],
    description:
      "Free Bitcoin to satoshi converter. Enter an amount in BTC to see the exact number of satoshis.",
  },
  inputs: [
    { name: "btc", label: "Bitcoin (BTC)", type: "number", default: 0.05, min: 0, step: 0.00000001 },
  ],
  expression: "btc * 100000000",
  resultLabel: "Satoshis",
  resultUnit: "sats",
  precision: 0,
  faq: [
    { q: "How many satoshis are in a Bitcoin?", a: "One Bitcoin equals 100,000,000 satoshis. A satoshi is the smallest unit of BTC." },
    { q: "What is a satoshi?", a: "It's the smallest divisible unit of Bitcoin, named after its pseudonymous creator Satoshi Nakamoto." },
    { q: "Why convert to satoshis?", a: "Small transactions, Lightning Network payments and fee calculations are often expressed in sats for precision." },
  ],
};

export default tool;
