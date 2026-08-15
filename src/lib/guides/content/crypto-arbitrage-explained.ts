import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-arbitrage-explained",
  title: "Crypto Arbitrage Explained: Does the Price Gap Actually Pay?",
  description:
    "Arbitrage sounds like free money — buy low on one exchange, sell high on another. Here is why most spreads evaporate after fees, and how to tell a real edge from a mirage.",
  readingMinutes: 7,
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "crypto arbitrage",
      "crypto arbitrage explained",
      "how does crypto arbitrage work",
      "exchange arbitrage",
      "triangular arbitrage crypto",
      "is crypto arbitrage profitable",
    ],
    description:
      "Crypto arbitrage explained: the types (spatial, triangular, funding), why fees and transfer time kill most spreads, and how to calculate real net profit before you trade.",
  },
  relatedTools: ["crypto-arbitrage-calculator", "funding-rate-calculator", "trading-fee-calculator"],
  body: [
    { type: "p", text: "Arbitrage is the act of buying an asset in one place and selling it in another at the same time for a higher price, capturing the difference. In theory it's risk-free: you're not betting on direction, just on a price gap that already exists. In crypto, where the same coin trades on hundreds of venues, those gaps appear constantly. The hard part isn't finding them — it's keeping any profit after costs." },

    { type: "h2", text: "The three kinds you'll actually meet" },
    { type: "ul", items: [
      "Spatial (cross-exchange) arbitrage — the classic: BTC is $60,000 on one exchange and $60,600 on another. You buy on the cheap one and sell on the dear one.",
      "Triangular arbitrage — one exchange, three pairs. You cycle BTC → ETH → USDT → BTC and end with more BTC than you started, exploiting a mispricing between the three rates.",
      "Funding-rate (cash-and-carry) arbitrage — you hold spot and short the perpetual future, collecting a positive funding rate while the two prices converge. Market-neutral, but capital-heavy.",
    ] },

    { type: "h2", text: "Why the spread is smaller than it looks" },
    { type: "p", text: "A 1% gap on the screen is not a 1% profit. Every step has a cost: a trading fee to buy, a trading fee to sell, and — for cross-exchange arbitrage — a network withdrawal fee plus the time it takes to move the coin. Two 0.1% taker fees and a $15 withdrawal can turn a $600 spread on half a Bitcoin into pennies." },
    { type: "callout", text: "Before you send a single order, price the whole round trip including every fee. The gross spread is marketing; the net number after fees is the only one that pays your rent." },
    { type: "tool", slug: "crypto-arbitrage-calculator" },

    { type: "h2", text: "The risks that aren't on the screen" },
    { type: "p", text: "The reason those gaps persist is that closing them is risky. The biggest hazard is time: to sell on exchange B you often need to move coins from exchange A, and blockchains don't confirm instantly. During those minutes the price can move against you and erase the edge — or you pre-fund both venues and tie up double the capital. Add withdrawal freezes, thin order books that slip when you size up, and the risk that one exchange simply won't let you withdraw when you want to." },
    { type: "ul", items: [
      "Execution risk — the second leg fills at a worse price than quoted (slippage on a thin book).",
      "Transfer risk — the coin is in transit and the spread closes before you can sell.",
      "Counterparty risk — an exchange halts withdrawals or freezes your account with your capital inside.",
      "Capital drag — to trade fast you must keep funds parked on multiple exchanges, which is its own risk.",
    ] },

    { type: "h2", text: "Funding-rate arbitrage: the steadier cousin" },
    { type: "p", text: "When perpetual futures trade above spot, longs pay shorts a periodic funding fee. If you buy the coin on spot and short an equal amount of the perpetual, you're market-neutral — you don't care which way price goes — and you collect that funding. It's lower-variance than chasing cross-exchange gaps, but returns are thin, funding can flip negative, and you're exposed to exchange risk on the short leg." },
    { type: "tool", slug: "funding-rate-calculator" },

    { type: "h2", text: "So is crypto arbitrage worth it?" },
    { type: "p", text: "For most individuals, pure cross-exchange arbitrage is a losing game against bots that hold pre-funded balances on every venue and execute in milliseconds. The realistic edges for a human are slower and more structural: funding-rate carry, arbitraging a coin during a genuine exchange outage, or new-listing dislocations. Whatever the angle, the discipline is identical — calculate the net number after every fee first, and treat the transfer window as the real risk. If the profit only exists before fees, it doesn't exist." },
  ],
  faq: [
    { q: "Is crypto arbitrage really risk-free?", a: "No. It's low directional risk but full of execution, transfer and counterparty risk. The moment your two legs aren't truly simultaneous — for example while coins move between exchanges — you're exposed to price movement." },
    { q: "How much money do I need to arbitrage crypto?", a: "More than you'd think, because you often pre-fund both exchanges to trade instantly, and per-trade profits are tiny percentages. Small spreads only become meaningful money at size." },
    { q: "Do arbitrage bots make it pointless for individuals?", a: "For fast cross-exchange spreads, largely yes — professional bots close them in milliseconds. Humans do better on slower, structural edges like funding-rate carry or unusual one-off dislocations." },
    { q: "How do I know if a spread is actually profitable?", a: "Subtract both trading fees and any withdrawal/network fee from the gross spread. Use the arbitrage calculator to get the net profit and return on capital before committing." },
  ],
};

export default guide;
