import type { Guide } from "../types";

const guide: Guide = {
  slug: "risk-reward-and-stop-loss",
  title: "Risk/Reward Ratio & Stop-Loss Placement",
  description:
    "How the risk/reward ratio works, why it decides your break-even win rate, and how to place stop-losses that respect it.",
  readingMinutes: 6,
  updatedAt: "2026-07-16",
  seo: {
    keywords: ["risk reward ratio", "stop loss placement", "risk reward trading", "break even win rate", "how to set a stop loss"],
    description:
      "Learn the risk/reward ratio and how to place stop-losses: the break-even win rate for each R:R, and how to combine it with position sizing.",
  },
  relatedTools: ["risk-reward-calculator", "stop-loss-take-profit-calculator", "position-size-calculator", "break-even-calculator"],
  body: [
    { type: "p", text: "The risk/reward ratio compares how much you stand to lose on a trade with how much you stand to gain. A 1:3 ratio means you risk $1 to make $3. It's one of the most important numbers in trading because it sets the win rate you need to be profitable." },
    { type: "h2", text: "Risk/reward and break-even win rate" },
    { type: "p", text: "The higher your reward relative to risk, the fewer trades you need to win to come out ahead. The break-even win rate is 1 / (1 + R), where R is your reward:risk ratio." },
    { type: "ul", items: [
      "1:1 → you need to win 50% of trades just to break even.",
      "1:2 → break-even at ~33%.",
      "1:3 → break-even at 25%.",
      "1:5 → break-even at ~17%.",
    ] },
    { type: "callout", text: "A trader who wins only 40% of the time can still be very profitable at 1:3 risk/reward. Being right less often is fine if winners are bigger than losers." },
    { type: "tool", slug: "risk-reward-calculator" },
    { type: "h2", text: "Placing your stop-loss" },
    { type: "p", text: "Your stop-loss defines the 'risk' side of the ratio, so place it where your trade idea is proven wrong — beyond a support level, a swing low, or a volatility-based distance — not at an arbitrary round number. Then set your take-profit to give you the reward multiple you're targeting." },
    { type: "tool", slug: "stop-loss-take-profit-calculator" },
    { type: "h2", text: "Tie it together with position sizing" },
    { type: "p", text: "Once your stop distance is set, position sizing decides how many units to buy so that hitting the stop only costs a fixed small percentage of your account. Risk/reward, stop placement and position size work as a system — get all three right and no single trade can hurt you badly." },
    { type: "tool", slug: "position-size-calculator" },
  ],
  faq: [
    { q: "What is a good risk/reward ratio?", a: "Many traders aim for at least 1:2 or 1:3, meaning potential reward is two to three times the risk. Higher ratios lower the win rate you need to be profitable." },
    { q: "Where should I place my stop-loss?", a: "At the price that proves your trade idea wrong — beyond a support/resistance level, swing point, or a volatility-based distance — rather than an arbitrary amount. That makes the risk side of your ratio meaningful." },
    { q: "Can a low win rate still be profitable?", a: "Yes. With a 1:3 risk/reward, you only need to win about 25% of trades to break even, so a strategy that wins 40% can be very profitable if it sticks to that ratio." },
  ],
};

export default guide;
