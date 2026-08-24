import type { Guide } from "../types";

const guide: Guide = {
  slug: "how-to-choose-a-crypto-exchange",
  affiliate: "exchange",
  title: "How to Choose a Crypto Exchange (2026)",
  description:
    "The things that actually matter when picking a crypto exchange — custody, availability, real fees, liquidity and track record — and the ones that don't.",
  readingMinutes: 8,
  updatedAt: "2026-08-24",
  seo: {
    title: "How to Choose a Crypto Exchange (2026)",
    description:
      "A practical checklist for choosing a crypto exchange in 2026: custody and security, your country's availability, the fees you'll actually pay, liquidity, and the red flags to avoid.",
    keywords: [
      "how to choose a crypto exchange",
      "best crypto exchange 2026",
      "choosing a crypto exchange",
      "crypto exchange comparison",
      "safest crypto exchange",
      "crypto exchange fees",
    ],
  },
  relatedTools: ["trading-fee-calculator", "profit-calculator", "position-size-calculator"],
  body: [
    {
      type: "p",
      text: "Every exchange's marketing says the same three things: low fees, high security, thousands of coins. None of that tells you which one to actually use, because the differences that matter are the ones no landing page leads with — whether it will still serve your country next year, whether your funds are yours or the platform's, and what you truly pay once spread and withdrawal costs are counted. Here is the checklist that survives contact with reality, roughly in order of importance.",
    },

    { type: "h2", text: "1. Custody: whose coins are they while they sit there?" },
    {
      type: "p",
      text: "When your crypto is on an exchange, the exchange holds the keys — you hold an IOU. That is fine for trading and a problem for storing. Every major exchange collapse of the last few years (FTX, Celsius, Voyager) ended the same way: users could see a balance they could not withdraw. The rule that would have saved all of them is boring and absolute — keep on the exchange only what you are actively trading, and move long-term holdings to a wallet you control. Judge an exchange on how easy it makes that withdrawal, not on how good its yield product looks.",
    },
    {
      type: "callout",
      text: "\"Not your keys, not your coins\" is not a slogan, it is the entire risk model. An exchange is a place to trade, not a place to keep your net worth.",
    },

    { type: "h2", text: "2. Will it actually serve you?" },
    {
      type: "p",
      text: "Availability changes with regulation, and it changes fast. An exchange that is the obvious choice in one country is blocked in another, or offers a stripped-down entity there with fewer products. Before anything else, confirm the exchange accepts users from your country, that it supports your local currency for deposits and withdrawals, and that the KYC it requires is something you can complete. A great exchange you cannot legally fund is worse than a merely good one you can.",
    },

    { type: "h2", text: "3. The fee you pay is not the fee they advertise" },
    {
      type: "p",
      text: "The headline \"0.1% maker/taker\" is the smallest part of the bill. Your real cost is that fee on both the entry and the exit (so 0.2% round-trip before anything else), plus the spread between the buy and sell price, plus the deposit and withdrawal fees that vary wildly by method and network. A \"zero-fee\" exchange usually makes it back on a wider spread. The only honest way to compare is to price a realistic round trip end to end.",
    },
    { type: "tool", slug: "trading-fee-calculator" },

    { type: "h2", text: "4. Liquidity and product range" },
    {
      type: "ul",
      items: [
        "Liquidity: on a deep order book your order fills near the price you see; on a thin one a modest order moves the market against you. For the coins you actually trade, deeper is cheaper — regardless of the quoted fee.",
        "Spot vs derivatives: if you only buy and hold, a clean spot exchange is all you need. If you use leverage, the quality of the derivatives engine, funding rates and liquidation mechanics matter far more than the spot fee.",
        "Coin range: most people need the top 20 assets, not the 2,000 a new exchange lists to look comprehensive. A long list is not a feature; a delisting that traps you in an illiquid token is a risk.",
      ],
    },

    { type: "h2", text: "5. Track record and transparency" },
    {
      type: "p",
      text: "An exchange is a custodian of your money, so its history is part of the product. Look for how long it has operated, whether it publishes proof-of-reserves, how it handled past incidents (every large exchange has had at least one), and what regulators have said about it. A guilty plea, a hot-wallet theft, a frozen-withdrawals episode — none is automatically disqualifying, but you should know about it before you deposit, not after.",
    },
    {
      type: "cta",
      title: "Compare the major exchanges and wallets",
      text: "Our platforms page lists reputable exchanges, hardware wallets and tax tools with the current signup offers — and every entry carries a plain 'watch out' note, because a comparison where nothing has a downside is an advertisement.",
      href: "/exchanges",
      label: "See the platforms list",
    },
    {
      type: "cta",
      title: "Head-to-head comparisons",
      text: "Weighing two specific platforms? The comparison pages line them up on custody, availability, KYC and product range — the things that hold still for years, not a fee table that changes next quarter.",
      href: "/compare",
      label: "Open the comparisons",
    },

    { type: "h2", text: "Red flags that end the search early" },
    {
      type: "ul",
      items: [
        "Guaranteed returns, \"staking\" APYs far above the market, or anything that pays you to deposit and not to trade — that is a yield product with counterparty risk, not an exchange feature.",
        "No clear company, jurisdiction or team, and support that only exists on Telegram.",
        "Withdrawal friction: minimums, delays, 'verification' loops, or fees that quietly punish leaving. The moment getting money out is harder than putting it in, treat it as a warning.",
        "Pressure and urgency — bonuses that expire in an hour, deposit-to-unlock mechanics. Real exchanges do not need you to hurry.",
      ],
    },

    { type: "h2", text: "The short version" },
    {
      type: "p",
      text: "Pick an exchange that legally serves your country, holds a credible track record, and lets you withdraw to self-custody without friction — then judge fees by pricing a real round trip, not the headline rate. Keep only trading balances on it. For everything you are not actively trading, the right 'exchange feature' is the withdraw button.",
    },
  ],
  faq: [
    {
      q: "What is the safest crypto exchange?",
      a: "There is no single safest one, and any exchange is less safe than self-custody for long-term holdings. The safer choices share traits: a long operating history, published proof-of-reserves, clear regulation in a real jurisdiction, and easy withdrawals. Whatever you pick, move coins you are not actively trading off it.",
    },
    {
      q: "Which crypto exchange has the lowest fees?",
      a: "The one with the lowest total cost for your specific trade — which is rarely the one with the lowest headline maker/taker rate. Add the fee on both sides, the spread, and deposit/withdrawal costs, then compare. A round trip on a 'zero-fee' venue with a wide spread can cost more than one on a 0.1% exchange with a tight book.",
    },
    {
      q: "Should I keep my crypto on the exchange?",
      a: "Only what you are actively trading. An exchange holds the keys, so your balance is a claim on the platform, not coins you control — which is exactly what went wrong for users of every exchange that failed. Move long-term holdings to a wallet whose keys are yours.",
    },
    {
      q: "Do I need more than one exchange?",
      a: "Many people use two: a large, regulated one for fiat on-ramp and long-term buying, and a second for a coin or product the first doesn't offer. It also means one platform freezing withdrawals doesn't strand all your funds. Just don't let 'diversifying exchanges' become an excuse to keep everything on exchanges.",
    },
  ],
};

export default guide;
