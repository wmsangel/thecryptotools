import type { ToolConfig } from "../types";
import { fmtNumber } from "@/lib/format";

const TO_WEI: Record<string, number> = {
  wei: 1,
  gwei: 1e9,
  ether: 1e18,
};

const tool: ToolConfig = {
  slug: "eth-unit-converter",
  updatedAt: "2026-07-13",
  title: "Ethereum Unit Converter (Wei · Gwei · Ether)",
  description:
    "Convert between Wei, Gwei and Ether instantly. 1 ETH = 1,000,000,000 Gwei = 10¹⁸ Wei.",
  category: "converters",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "wei to eth",
      "gwei to eth",
      "ethereum unit converter",
      "wei to gwei",
      "eth to wei converter",
    ],
    description:
      "Free Ethereum unit converter. Convert Wei, Gwei and Ether in one click for gas, transactions and smart contracts.",
  },
  inputs: [
    { name: "amount", label: "Amount", type: "number", default: 1, min: 0 },
    {
      name: "from",
      label: "From",
      type: "select",
      default: "ether",
      options: [
        { label: "Ether", value: "ether" },
        { label: "Gwei", value: "gwei" },
        { label: "Wei", value: "wei" },
      ],
    },
    {
      name: "to",
      label: "To",
      type: "select",
      default: "wei",
      options: [
        { label: "Wei", value: "wei" },
        { label: "Gwei", value: "gwei" },
        { label: "Ether", value: "ether" },
      ],
    },
  ],
  resultLabel: "Converted amount",
  compute: (i) => {
    const amount = Number(i.amount);
    const from = String(i.from);
    const to = String(i.to);
    const inWei = amount * TO_WEI[from];
    const out = inWei / TO_WEI[to];

    return {
      value: fmtNumber(out, 9),
      unit: to,
      note: "Very large/small values are shown at limited precision — for exact on-chain math use a BigInt library.",
      breakdown: [
        { label: "In Ether", value: fmtNumber(inWei / TO_WEI.ether, 9) },
        { label: "In Gwei", value: fmtNumber(inWei / TO_WEI.gwei, 4) },
        { label: "In Wei", value: fmtNumber(inWei, 0) },
      ],
    };
  },
  faq: [
    { q: "How many Wei are in 1 ETH?", a: "1 Ether = 10¹⁸ (a quintillion) Wei. Wei is the smallest unit of Ether." },
    { q: "What is Gwei used for?", a: "Gwei (1 ETH = 1,000,000,000 Gwei) is the standard unit for expressing Ethereum gas prices." },
    { q: "Wei vs Gwei vs Ether?", a: "Ether is the main unit, Gwei = 10⁹ Wei is used for gas, and Wei is the base atomic unit for contracts." },
  ],
};

export default tool;
