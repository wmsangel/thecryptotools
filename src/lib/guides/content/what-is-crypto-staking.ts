import type { Guide } from "../types";

const guide: Guide = {
  slug: "what-is-crypto-staking",
  title: "What Is Crypto Staking and How Are Rewards Calculated?",
  description:
    "Staking pays you for helping secure a proof-of-stake network. Here is where the yield actually comes from, what it costs you, and how to work out what you would earn.",
  readingMinutes: 6,
  updatedAt: "2026-07-19",
  seo: {
    keywords: [
      "what is staking",
      "crypto staking explained",
      "staking rewards calculator",
      "proof of stake",
      "liquid staking",
      "staking apy",
    ],
    description:
      "Crypto staking explained: how proof-of-stake rewards are generated, the difference between solo, pooled, exchange and liquid staking, and how to calculate your returns.",
  },
  relatedTools: ["staking-rewards-calculator", "apy-calculator", "compound-interest-calculator"],
  body: [
    { type: "p", text: "Staking is what replaced mining on most modern blockchains. Instead of burning electricity to win the right to add a block, validators lock up coins as collateral. Behave honestly and the network pays you; try to cheat and part of your stake is destroyed. Your staking yield is the fee for that service." },

    { type: "h2", text: "Where the yield actually comes from" },
    { type: "p", text: "This matters because it tells you whether a yield is sustainable. Proof-of-stake rewards come from two sources: newly issued coins (inflation) and transaction fees paid by users. A 5% staking yield funded mostly by issuance is not free money — every holder who does not stake is diluted by that same issuance. Yield funded by real transaction fees is genuinely earned." },
    { type: "callout", text: "If an advertised yield is far above the network's own issuance and fee rate, the extra is coming from somewhere else — a token subsidy, a lending desk, or a promise someone may not be able to keep. Find out which." },

    { type: "h2", text: "The four ways to stake" },
    { type: "ul", items: [
      "Solo staking — you run the validator. Highest reward, full control of your keys, but it needs a big minimum (32 ETH on Ethereum), reliable uptime, and you carry slashing risk yourself.",
      "Pooled / delegated staking — you delegate to someone else's validator and share the reward minus a commission (typically 5–15%). No minimum, no hardware.",
      "Exchange staking — the simplest option: click a button on Binance, Kraken or Coinbase. You pay a larger cut and, more importantly, the exchange holds your coins.",
      "Liquid staking — you deposit and receive a tradeable receipt token (stETH, rETH, jitoSOL). You keep earning while using that token elsewhere in DeFi, at the cost of smart-contract risk and a possible price gap between the receipt and the underlying coin.",
    ] },

    { type: "h2", text: "Calculating what you earn" },
    { type: "p", text: "The headline number is usually an APR. What you actually receive depends on whether rewards compound, how often you can claim them, and what the validator takes. Net yield ≈ (gross APR × (1 − commission)), then compounded at your claim frequency." },
    { type: "p", text: "Work an example: 10,000 tokens at 8% gross APR with a 10% validator commission gives 7.2% net. Compounded monthly that is roughly 7.44% effective — about 744 tokens a year rather than 800. Small percentages, but they diverge over multiple years." },
    { type: "tool", slug: "staking-rewards-calculator" },

    { type: "h2", text: "The costs nobody advertises" },
    { type: "ul", items: [
      "Lock-up and unbonding: many chains make you wait days or weeks to withdraw (Cosmos ~21 days, Polkadot ~28). If the price crashes during that window, you watch it happen.",
      "Slashing: validator downtime or double-signing can burn a slice of the delegated stake. Rare, but real — spread across validators rather than betting on one.",
      "Denomination trap: 12% APY paid in a token that falls 40% is a losing trade. Staking yield is denominated in the coin, not in dollars.",
      "Tax: in most jurisdictions staking rewards are income at the moment you receive them, at that day's value — even if you never sold.",
    ] },
    { type: "tool", slug: "compound-interest-calculator" },

    { type: "h2", text: "Is staking worth it?" },
    { type: "p", text: "If you were going to hold the coin for years anyway, staking it with a reputable validator is close to free yield — you are being paid for something you were already doing. If you are actively trading, the lock-up will cost you far more in missed exits than the yield pays. And if you are staking a coin only because the yield is high, you have bought a token you do not want in exchange for a number that can be changed by governance vote." },
  ],
  faq: [
    { q: "Can I lose my coins by staking?", a: "Through slashing you can lose a small percentage if your validator misbehaves, and through custodial or smart-contract failure you can lose everything. The network itself does not take your principal for simply participating." },
    { q: "How much do I need to start staking?", a: "Solo staking has hard minimums (32 ETH on Ethereum). Delegated, exchange and liquid staking generally have none — you can stake any amount, though small positions can be eaten by claim transaction fees." },
    { q: "Is staking yield the same as APY?", a: "Usually platforms quote APR. APY assumes you reinvest rewards. If rewards do not auto-compound, treat the APR as your realistic figure — see our APR vs APY guide." },
    { q: "Do I still own my coins while staking?", a: "With solo, delegated and liquid staking, yes — delegation never transfers ownership. With exchange staking the exchange holds the keys, so you own a claim on them, not the coins." },
  ],
};

export default guide;
