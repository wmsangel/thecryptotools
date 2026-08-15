import type { StaticPage } from "../types";

export const disclaimer: StaticPage = {
  slug: "disclaimer",
  title: "Risk Disclaimer",
  description:
    "Crypto trading carries substantial risk. Read this before acting on anything you calculate here.",
  eyebrow: "Legal",
  updatedAt: "2026-07-19",
  seo: {
    title: "Risk Disclaimer",
    description:
      "Risk disclaimer for TheCryptoTools: educational calculators only, not financial advice. Crypto trading can result in the total loss of your capital.",
    keywords: ["risk disclaimer", "crypto risk", "not financial advice"],
  },
  body: [
    {
      type: "callout",
      text: "Trading crypto — especially with leverage — can and does wipe out entire accounts. Never risk money you cannot afford to lose completely.",
    },

    { type: "h2", text: "Educational purpose only" },
    {
      type: "p",
      text: "Every calculator, guide and chart on this site exists to help you understand a concept. None of it is a recommendation to enter, exit or size any position. We do not know your finances, your tax situation or your risk tolerance, and we are not licensed to advise you on them.",
    },

    { type: "h2", text: "The numbers are models, not predictions" },
    {
      type: "ul",
      items: [
        "Liquidation, margin and PnL results are simplified. Your exchange's actual maintenance-margin tiers, funding payments, fees and mark-price mechanics will move the real number.",
        "APY, staking and yield figures assume rates stay constant. They do not.",
        "Monte Carlo, Kelly, Sharpe and volatility tools are statistical estimates from assumptions you supply. Garbage in, garbage out.",
        "Live prices are third-party data and can lag or fail. Confirm on your exchange before acting.",
      ],
    },

    { type: "h2", text: "Past performance means nothing" },
    {
      type: "p",
      text: "Backward-looking returns, historical volatility and any projection built on them do not predict future results. Crypto markets can gap, halt, delist or go to zero.",
    },

    { type: "h2", text: "Third-party platforms" },
    {
      type: "p",
      text: "Exchanges, wallets and lending platforms we link to carry their own risks: hacks, insolvency, withdrawal freezes, regulatory action and custody loss. Listing a platform is not a safety guarantee. Do your own due diligence.",
    },

    { type: "h2", text: "Your responsibility" },
    {
      type: "p",
      text: "You alone are responsible for your trading decisions and for complying with the tax and financial regulations of your country. If in doubt, speak to a licensed financial adviser or accountant.",
    },
  ],
};
