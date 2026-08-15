import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-calculate-liquidation-price",
  title: "How to Calculate Liquidation Price in Crypto Futures",
  description:
    "Understand exactly how liquidation price works on leveraged crypto positions, the formula behind it, and how to trade with a safety buffer.",
  readingMinutes: 6,
  updatedAt: "2026-07-16",
  seo: {
    keywords: [
      "how to calculate liquidation price",
      "liquidation price formula",
      "crypto futures liquidation",
      "leverage liquidation explained",
      "what is liquidation price",
    ],
    description:
      "A clear guide to calculating liquidation price on crypto futures — the formula, how leverage and maintenance margin change it, and how to stay safe.",
  },
  relatedTools: ["liquidation-calculator", "leverage-calculator", "position-size-calculator", "risk-reward-calculator"],
  body: [
    { type: "p", text: "When you trade crypto futures with leverage, the exchange lends you buying power against your margin. If the market moves against you far enough, your position no longer has enough equity to cover potential losses, and the exchange force-closes it. The price at which that happens is your liquidation price." },
    { type: "p", text: "Knowing this number before you enter a trade is one of the simplest ways to avoid a wipeout. This guide breaks down how it's calculated and how to give yourself breathing room." },

    { type: "h2", text: "The liquidation price formula" },
    { type: "p", text: "For an isolated-margin position, a good approximation is:" },
    { type: "ul", items: [
      "Long liquidation ≈ Entry × (1 − 1/Leverage + Maintenance margin)",
      "Short liquidation ≈ Entry × (1 + 1/Leverage − Maintenance margin)",
    ] },
    { type: "p", text: "The key driver is 1/Leverage. At 10× leverage, 1/10 = 10%, so a long gets liquidated after roughly a 10% drop. At 20×, it's about 5%. The higher the leverage, the closer liquidation sits to your entry — and the less room the market has to breathe." },

    { type: "h2", text: "What is maintenance margin?" },
    { type: "p", text: "Maintenance margin is the minimum equity the exchange requires to keep a position open, usually a small percentage (0.4%–1%) that grows with position size. It nudges your liquidation price slightly closer to entry. Because exchanges use tiered maintenance margins and add funding fees, your real liquidation price can differ a little from the clean formula." },
    { type: "callout", text: "Rule of thumb: your approximate liquidation distance is 1 ÷ leverage. 5× ≈ 20%, 10× ≈ 10%, 25× ≈ 4%, 50× ≈ 2%." },

    { type: "h2", text: "Isolated vs cross margin" },
    { type: "p", text: "In isolated margin, only the margin assigned to that position is at risk, so the formula above applies directly. In cross margin, your whole account balance backs the position, which pushes liquidation further away — but risks your entire balance if it's hit. Beginners are usually safer with isolated margin and modest leverage." },

    { type: "h2", text: "How to trade with a safety buffer" },
    { type: "ul", items: [
      "Use lower leverage. Dropping from 20× to 5× turns a 5% liquidation buffer into 20%.",
      "Set a stop-loss above your liquidation price so you exit on your terms, not the exchange's.",
      "Size positions by risk, not by how much margin you have — risk a fixed small percentage of your account per trade.",
      "Account for funding fees on positions you hold for a long time; they slowly erode margin.",
    ] },
    { type: "p", text: "Plug your entry, leverage and direction into the calculator below to see your exact liquidation price and the percentage move that would trigger it." },
    { type: "tool", slug: "liquidation-calculator" },
  ],
  faq: [
    { q: "Does higher leverage always mean higher liquidation risk?", a: "Yes. Liquidation distance is roughly 1 ÷ leverage, so higher leverage places liquidation closer to your entry and leaves less room for normal volatility." },
    { q: "Can I avoid liquidation entirely?", a: "Use a stop-loss set above your liquidation price, keep leverage low, and add margin if a position moves against you. A stop-loss lets you exit before the exchange liquidates you." },
    { q: "Why is the exchange's liquidation price different from the formula?", a: "Exchanges use tiered maintenance margins, funding fees and sometimes cross-margin, which all shift the exact number. The formula gives a close isolated-margin estimate." },
  ],
};

export default guide;
