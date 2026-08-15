import type { Guide } from "../types";

const guide: Guide = {
  slug: "dollar-cost-averaging-crypto",
  title: "Dollar-Cost Averaging (DCA) in Crypto: A Complete Guide",
  description:
    "What dollar-cost averaging is, why it works in volatile crypto markets, its pros and cons, and how to model your own DCA plan.",
  readingMinutes: 7,
  updatedAt: "2026-07-16",
  seo: {
    keywords: [
      "dollar cost averaging crypto",
      "dca crypto",
      "what is dca",
      "dca vs lump sum",
      "crypto dca strategy",
    ],
    description:
      "A complete guide to dollar-cost averaging (DCA) in crypto — how it works, DCA vs lump sum, pros and cons, and how to plan your buys.",
  },
  relatedTools: ["dca-calculator", "dca-vs-lump-sum-calculator", "average-entry-calculator", "profit-calculator"],
  body: [
    { type: "p", text: "Dollar-cost averaging (DCA) means investing a fixed amount at regular intervals — say $100 every week — regardless of price. Instead of trying to time the market, you spread your buys over time, automatically buying more units when prices are low and fewer when they're high." },
    { type: "p", text: "In crypto, where prices can swing 10% in a day, DCA is popular precisely because it removes the pressure of picking the perfect entry." },

    { type: "h2", text: "How DCA works" },
    { type: "p", text: "Suppose you invest $100 a week into Bitcoin. If BTC is $50,000 one week you buy 0.002 BTC; if it drops to $40,000 the next you buy 0.0025 BTC. Over time your average entry price lands somewhere in the middle of the range you bought across — often below the simple average price, because you accumulate more coins at lower prices." },
    { type: "callout", text: "DCA's superpower is behavioral: it turns investing into a habit and stops you from panic-buying tops or freezing during crashes." },

    { type: "h2", text: "DCA vs lump sum" },
    { type: "p", text: "If you have a lump sum to invest, research on traditional markets shows investing it all at once usually beats DCA on average, because markets trend up over time and DCA leaves cash uninvested. But that's an average — lump sum also has a wider range of outcomes and a worse worst-case." },
    { type: "ul", items: [
      "Choose lump sum if you can stomach volatility and believe in the asset long-term.",
      "Choose DCA if you're nervous about timing, investing from income, or want to reduce regret risk.",
      "Many investors do both: a partial lump sum plus ongoing DCA.",
    ] },
    { type: "tool", slug: "dca-vs-lump-sum-calculator" },

    { type: "h2", text: "Pros and cons of DCA" },
    { type: "ul", items: [
      "Pro: removes emotion and market-timing stress.",
      "Pro: smooths out your entry price across volatility.",
      "Pro: easy to automate on most exchanges.",
      "Con: in a steadily rising market, you'll pay more on average than buying early.",
      "Con: frequent small buys can rack up trading fees — check your exchange's fee schedule.",
    ] },

    { type: "h2", text: "Planning your DCA" },
    { type: "p", text: "Decide three things: how much per buy, how often, and for how long. Then model it. The calculator below lets you project how a recurring buy would have accumulated, and the average-entry tool shows your blended cost as you add to a position." },
    { type: "tool", slug: "dca-calculator" },
  ],
  faq: [
    { q: "Is DCA better than lump-sum investing?", a: "On average, lump sum tends to outperform because markets rise over time, but DCA reduces the risk of buying at a bad moment and is easier psychologically. The best choice depends on your risk tolerance and cash flow." },
    { q: "How often should I DCA?", a: "Weekly or monthly are common. More frequent buys smooth your entry slightly more but can increase fees. Consistency matters more than frequency." },
    { q: "Does DCA guarantee a profit?", a: "No. DCA lowers timing risk but you can still lose money if the asset falls over your entire investment period. It's a risk-management approach, not a profit guarantee." },
  ],
};

export default guide;
