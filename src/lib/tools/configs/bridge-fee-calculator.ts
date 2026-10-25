import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "bridge-fee-calculator",
  updatedAt: "2026-10-23",
  title: "Crypto Bridge Fee Calculator",
  description:
    "Estimate the total cost of bridging crypto across chains from the bridge fee percent and network/gas fee — and how much arrives on the other side.",
  category: "defi",
  featured: false,
  popular: false,
  source: "builtin",
  seo: {
    keywords: [
      "crypto bridge fee calculator",
      "bridge cost calculator",
      "cross chain bridge fees",
      "how much does bridging cost",
    ],
    description:
      "Free crypto bridge fee calculator. Enter amount, bridge fee % and network fee to see total bridging cost and amount received.",
  },
  inputs: [
    { name: "amount", label: "Amount to bridge", type: "number", suffix: "USD", default: 1000, min: 0, step: 1 },
    {
      name: "bridgeFeePct",
      label: "Bridge fee",
      type: "number",
      suffix: "%",
      default: 0.1,
      min: 0,
      step: 0.01,
      help: "Enter the fee % from your bridge quote — rates differ by route and provider.",
    },
    {
      name: "networkFee",
      label: "Network/gas fee",
      type: "number",
      suffix: "USD",
      default: 5,
      min: 0,
      step: 0.01,
      optional: true,
      help: "Source-chain gas (and destination fee if charged). Set the quote your wallet shows.",
    },
  ],
  resultLabel: "Total bridging cost",
  resultUnit: "USD",
  compute: (i) => {
    const amount = Number(i.amount) || 0;
    const bridgeFeePct = Number(i.bridgeFeePct) || 0;
    const networkFee = Number(i.networkFee) || 0;

    const fee = amount * (bridgeFeePct / 100) + networkFee;
    const received = amount - fee;
    const effectivePct = amount > 0 ? (fee / amount) * 100 : 0;

    return {
      value: fmtUsd(fee),
      note: "Fees differ per bridge — enter the quote your bridge shows. Not financial advice.",
      breakdown: [
        { label: "Amount received", value: fmtUsd(received), emphasis: true },
        { label: "Effective fee", value: `${fmtNumber(effectivePct)}%` },
        { label: "Network fee", value: fmtUsd(networkFee) },
      ],
    };
  },
  relatedSlugs: [
    "trading-fee-calculator",
    "crypto-withdrawal-calculator",
    "gas-fee-calculator",
    "impermanent-loss-calculator",
  ],
  article: [
    {
      type: "p",
      text: "Bridging moves value from one chain to another. The headline bridge fee is only part of the bill — you also pay source-chain gas, and sometimes a destination or relayer fee. This calculator adds those pieces so you can see the all-in cost before you confirm.",
    },
    {
      type: "p",
      text: "Quotes change with congestion and the route you pick. Paste the fee percent and gas estimate from the bridge UI rather than guessing. A 0.1% bridge fee on $1,000 looks small until gas on a busy L1 adds several dollars more.",
    },
    {
      type: "p",
      text: "Use the effective fee percent to compare bridges on the same amount. The tool only multiplies your inputs — it does not fetch live rates or recommend a provider.",
    },
  ],
  faq: [
    {
      q: "What counts as a bridge fee?",
      a: "Usually a percentage of the amount taken by the bridge protocol or liquidity providers. Network/gas fees on the source (and sometimes destination) chain are separate and often larger on busy days.",
    },
    {
      q: "Why does the amount received differ from what I send?",
      a: "Bridge fee plus any network fees are deducted from the amount. Enter both so the received figure matches the quote you expect on the other chain.",
    },
    {
      q: "Are these live bridge rates?",
      a: "No. Defaults are editable placeholders. Set the fee % and gas from the bridge you are using — rates vary by route, asset and congestion.",
    },
  ],
};

export default tool;
