import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "crypto-airdrop-calculator",
  updatedAt: "2026-07-15",
  title: "Crypto Airdrop Value Calculator",
  description:
    "Work out what a crypto airdrop is really worth after claim gas fees and taxes, from your token allocation and the token price.",
  category: "market",
  source: "builtin",
  seo: {
    keywords: [
      "airdrop calculator",
      "crypto airdrop calculator",
      "airdrop value calculator",
      "token allocation value",
      "airdrop profit calculator",
    ],
    description:
      "Free crypto airdrop calculator — enter your token amount and price to see the gross value and the net value after gas and tax.",
  },
  inputs: [
    { name: "tokens", label: "Tokens received", type: "number", default: 500, min: 0, step: 1 },
    { name: "price", label: "Token price", type: "number", suffix: "USD", default: 2.5, min: 0, step: 0.0001 },
    { name: "gas", label: "Claim / gas cost", type: "number", suffix: "USD", default: 15, min: 0, step: 0.01, optional: true },
    { name: "tax", label: "Tax rate", type: "number", suffix: "%", default: 0, min: 0, max: 100, step: 1, optional: true },
  ],
  resultLabel: "Net airdrop value",
  resultUnit: "USD",
  compute: (i) => {
    const tokens = Number(i.tokens);
    const price = Number(i.price);
    const gas = Number(i.gas) || 0;
    const tax = (Number(i.tax) || 0) / 100;

    const gross = tokens * price;
    const afterGas = gross - gas;
    const taxDue = Math.max(0, afterGas) * tax;
    const net = afterGas - taxDue;

    return {
      value: fmtUsd(net),
      breakdown: [
        { label: "Gross value", value: fmtUsd(gross) },
        { label: "Claim / gas cost", value: `-${fmtUsd(gas)}` },
        { label: "Estimated tax", value: `-${fmtUsd(taxDue)}` },
        { label: "Price per token", value: fmtUsd(price, price < 1 ? 4 : 2) },
        { label: "Tokens", value: fmtNumber(tokens, 0) },
      ],
    };
  },
  faq: [
    { q: "How do I value an airdrop?", a: "Multiply the number of tokens you received by the current token price, then subtract the gas you paid to claim and any tax you'll owe." },
    { q: "Are airdrops taxable?", a: "In many countries airdrops are taxed as income at the value when received, and again as capital gains when sold. Enter your rate to estimate the hit — but confirm with a local tax pro." },
    { q: "Why subtract gas?", a: "Claiming on-chain can cost meaningful gas, especially on Ethereum. For small airdrops the fee can wipe out most of the value." },
  ],
};

export default tool;
