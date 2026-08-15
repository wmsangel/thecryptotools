import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "staking-rewards-calculator",
  updatedAt: "2026-07-30",
  title: "Crypto Staking Rewards Calculator",
  description:
    "Estimate staking rewards on your coins over any period from the annual reward rate — in both coins and USD.",
  category: "mining",
  featured: true,
  popular: true,
  source: "builtin",
  seo: {
    keywords: [
      "staking calculator",
      "crypto staking rewards calculator",
      "staking rewards calculator",
      "eth staking calculator",
      "staking income calculator",
    ],
    description:
      "Free crypto staking rewards calculator. Enter your amount, reward rate and period to estimate rewards in coins and USD.",
  },
  inputs: [
    { name: "amount", label: "Amount staked", type: "number", suffix: "coins", default: 100, min: 0, step: 0.0001 },
    { name: "price", label: "Coin price", type: "number", suffix: "USD", default: 10, min: 0, step: 0.01, livePrice: true },
    { name: "apr", label: "Reward rate (APR)", type: "number", suffix: "%", default: 8, min: 0, step: 0.01 },
    { name: "days", label: "Period", type: "number", suffix: "days", default: 365, min: 1, step: 1 },
  ],
  resultLabel: "Rewards earned",
  compute: (i) => {
    const amount = Number(i.amount);
    const price = Number(i.price);
    const apr = Number(i.apr) / 100;
    const days = Number(i.days);

    const rewardCoins = amount * apr * (days / 365);
    const rewardUsd = rewardCoins * price;
    const dailyCoins = amount * apr / 365;

    return {
      value: `${fmtNumber(rewardCoins, 6)} coins`,
      breakdown: [
        { label: "Rewards in USD", value: fmtUsd(rewardUsd), emphasis: true },
        { label: "Daily reward", value: `${fmtNumber(dailyCoins, 6)} coins` },
        { label: "Monthly reward", value: `${fmtNumber(dailyCoins * 30, 6)} coins` },
      ],
    };
  },
  relatedSlugs: ["crypto-lending-calculator"],
  faq: [
    { q: "How are staking rewards calculated?", a: "Rewards ≈ amount staked × annual reward rate × (days ÷ 365). This is a simple (non-compounded) estimate." },
    { q: "APR vs APY for staking?", a: "APR is the flat annual rate. If you restake (compound) rewards, your effective APY is higher — see the APY calculator." },
    { q: "Are staking rewards guaranteed?", a: "No — rates vary with network conditions, and some assets have lock-ups or slashing risk. Treat this as an estimate." },
  ],
};

export default tool;
