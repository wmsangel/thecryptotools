import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "gas-fee-calculator",
  updatedAt: "2026-07-13",
  title: "Ethereum Gas Fee Calculator",
  description:
    "Estimate the cost of an Ethereum transaction from the gas limit and gas price (Gwei) — in ETH and USD.",
  category: "converters",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "gas fee calculator",
      "ethereum gas calculator",
      "gwei to usd",
      "eth transaction fee calculator",
      "gas price calculator",
    ],
    description:
      "Free Ethereum gas fee calculator. Enter gas limit and Gwei to see the transaction cost in ETH and USD.",
  },
  inputs: [
    { name: "gasLimit", label: "Gas limit", type: "number", default: 21000, min: 0, step: 1, help: "21000 for a simple ETH transfer" },
    { name: "gasPrice", label: "Gas price", type: "number", suffix: "Gwei", default: 30, min: 0, step: 0.1 },
    { name: "ethPrice", label: "ETH price", type: "number", suffix: "USD", default: 2000, min: 0, step: 1, optional: true },
  ],
  resultLabel: "Transaction fee",
  resultUnit: "USD",
  compute: (i) => {
    const gasLimit = Number(i.gasLimit);
    const gwei = Number(i.gasPrice);
    const ethPrice = Number(i.ethPrice) || 0;

    const feeEth = (gasLimit * gwei) / 1e9; // gwei = 1e-9 ETH
    const feeUsd = feeEth * ethPrice;

    return {
      value: ethPrice > 0 ? fmtUsd(feeUsd) : `${fmtNumber(feeEth, 8)} ETH`,
      label: ethPrice > 0 ? "Fee in USD" : "Fee in ETH",
      breakdown: [
        { label: "Fee in ETH", value: `${fmtNumber(feeEth, 8)} ETH`, emphasis: true },
        { label: "Total Gwei", value: fmtNumber(gasLimit * gwei, 0) },
        ...(ethPrice > 0 ? [{ label: "Fee in USD", value: fmtUsd(feeUsd) }] : []),
      ],
    };
  },
  faq: [
    { q: "How is an Ethereum gas fee calculated?", a: "Fee = gas limit × gas price (in Gwei), converted to ETH. Multiply by the ETH/USD price for the dollar cost." },
    { q: "What gas limit should I use?", a: "A simple ETH transfer uses 21,000 gas. Token transfers and contract calls use more — check the dApp or your wallet estimate." },
    { q: "What is Gwei?", a: "Gwei is a denomination of ETH (1 ETH = 1,000,000,000 Gwei) used to price gas." },
  ],
};

export default tool;
