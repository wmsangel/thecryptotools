import type { ToolConfig } from "../types";

function randHex(len: number): string {
  let out = "";
  const chars = "0123456789abcdef";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * 16)];
  return out;
}

const tool: ToolConfig = {
  slug: "fake-wallet-generator",
  updatedAt: "2026-07-13",
  title: "Fake Crypto Wallet Generator",
  description:
    "Generate realistic-looking but fake wallet addresses for testing UIs and demos. For development only — never holds real funds.",
  category: "dev",
  source: "builtin",
  seo: {
    keywords: [
      "fake wallet generator",
      "test crypto address generator",
      "fake ethereum address",
      "dummy wallet address",
      "mock crypto wallet",
    ],
    description:
      "Free fake crypto wallet address generator for testing and mockups. Generate ETH/BTC-style addresses instantly.",
  },
  inputs: [
    {
      name: "chain",
      label: "Chain format",
      type: "select",
      default: "eth",
      options: [
        { label: "Ethereum (0x…)", value: "eth" },
        { label: "Bitcoin (bc1…)", value: "btc" },
        { label: "Solana", value: "sol" },
      ],
    },
    { name: "count", label: "How many", type: "number", default: 3, min: 1, max: 50, step: 1 },
  ],
  resultLabel: "Fake addresses",
  compute: (i) => {
    const chain = String(i.chain);
    const count = Math.min(50, Math.max(1, Math.floor(Number(i.count) || 1)));
    const b58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const rand58 = (n: number) =>
      Array.from({ length: n }, () => b58[Math.floor(Math.random() * b58.length)]).join("");

    const lines: string[] = [];
    for (let n = 0; n < count; n++) {
      if (chain === "btc") lines.push("bc1q" + randHex(38));
      else if (chain === "sol") lines.push(rand58(44));
      else lines.push("0x" + randHex(40));
    }
    return lines.join("\n");
  },
  faq: [
    { q: "Are these real wallet addresses?", a: "No. They only mimic the format of real addresses. They have no private keys and cannot receive or hold funds." },
    { q: "What are they for?", a: "Populating test databases, UI mockups, screenshots and QA — anywhere you need address-shaped placeholder data." },
    { q: "Is it safe to send crypto to them?", a: "Never send real crypto to a generated address — funds would be permanently lost." },
  ],
};

export default tool;
