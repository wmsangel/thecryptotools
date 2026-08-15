import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "crypto-price-converter",
  updatedAt: "2026-07-15",
  title: "Crypto Price Converter",
  description:
    "Convert any crypto amount to USD and back using a price you set — works for any coin, offline, no live feed needed.",
  category: "converters",
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "crypto price converter",
      "crypto to usd converter",
      "coin to dollar calculator",
      "crypto value calculator",
      "token price converter",
    ],
    description:
      "Free crypto price converter. Turn any coin amount into USD (or USD into coins) with your own price input.",
  },
  inputs: [
    { name: "amount", label: "Amount", type: "number", default: 0.5, min: 0, step: 0.0001 },
    { name: "price", label: "Coin price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    {
      name: "direction",
      label: "Direction",
      type: "select",
      default: "toUsd",
      options: [
        { label: "Coins → USD", value: "toUsd" },
        { label: "USD → Coins", value: "toCoins" },
      ],
    },
  ],
  resultLabel: "Converted value",
  compute: (i) => {
    const amount = Number(i.amount);
    const price = Number(i.price);
    const toUsd = String(i.direction) === "toUsd";

    if (toUsd) {
      return { value: fmtUsd(amount * price), label: "Value in USD" };
    }
    const coins = price > 0 ? amount / price : 0;
    return { value: fmtNumber(coins, 8), unit: "coins", label: "Amount in coins" };
  },
  faq: [
    { q: "How does the converter work?", a: "Coins → USD multiplies your amount by the price you enter; USD → Coins divides your dollar amount by the price." },
    { q: "Why do I enter the price manually?", a: "This tool is 100% offline and works for any coin. Paste the current price from your exchange for an up-to-date result." },
    { q: "Can I use it for any token?", a: "Yes — it's price-agnostic, so it works for BTC, ETH or any altcoin as long as you know the price." },
  ],
};

export default tool;
