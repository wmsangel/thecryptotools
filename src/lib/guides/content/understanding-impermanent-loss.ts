import type { Guide } from "../types";

const guide: Guide = {
  slug: "understanding-impermanent-loss",
  title: "Impermanent Loss Explained (With Examples)",
  description:
    "What impermanent loss is, why liquidity providers suffer it, how big it gets at different price moves, and when fees make up for it.",
  readingMinutes: 6,
  updatedAt: "2026-07-16",
  seo: {
    keywords: ["impermanent loss explained", "what is impermanent loss", "liquidity provider risk", "impermanent loss calculator", "defi lp risk"],
    description:
      "Impermanent loss explained simply: why providing liquidity can underperform holding, how large the loss gets, and how trading fees offset it.",
  },
  relatedTools: ["impermanent-loss-calculator", "yield-farming-apy-calculator", "crypto-price-converter"],
  body: [
    { type: "p", text: "Impermanent loss is the hidden cost of providing liquidity to an automated market maker (AMM) like Uniswap. It's the difference between simply holding two tokens and depositing them into a liquidity pool when their prices change." },
    { type: "h2", text: "Why it happens" },
    { type: "p", text: "AMM pools keep a balance between two assets. When one token's price rises, arbitrage traders buy it out of the pool until the pool price matches the market. That means the pool automatically sells your winning asset and accumulates the losing one — so you end up with less of the token that went up than if you'd just held." },
    { type: "callout", text: "It's called 'impermanent' because the loss only becomes real when you withdraw. If prices return to where you deposited, it disappears." },
    { type: "h2", text: "How big does it get?" },
    { type: "ul", items: [
      "1.25× price change (one asset up 25%): about 0.6% loss.",
      "2× price change: about 5.7% loss.",
      "4× price change: about 20% loss.",
      "5× price change: about 25% loss.",
    ] },
    { type: "p", text: "The loss grows with the size of the price divergence between the two assets, and is symmetric — it happens whether one asset rises or falls relative to the other." },
    { type: "tool", slug: "impermanent-loss-calculator" },
    { type: "h2", text: "When is it worth it?" },
    { type: "p", text: "Liquidity providers earn trading fees (and sometimes reward tokens). If those fees exceed the impermanent loss over your time in the pool, you come out ahead. Stablecoin pairs and correlated assets have little price divergence, so impermanent loss stays tiny — which is why they're popular for LPing." },
    { type: "tool", slug: "yield-farming-apy-calculator" },
  ],
  faq: [
    { q: "Is impermanent loss a real loss?", a: "It becomes real only when you withdraw at diverged prices. If prices return to your entry ratio, the loss reverses — hence 'impermanent'." },
    { q: "How do I reduce impermanent loss?", a: "Provide liquidity for correlated or stable pairs (like two stablecoins), where price divergence and therefore loss are minimal, and make sure fee income exceeds the expected loss." },
    { q: "Do trading fees cancel it out?", a: "They can. LPs earn a share of every swap's fee. If accumulated fees exceed the impermanent loss over your time in the pool, you're net positive versus just holding." },
  ],
};

export default guide;
