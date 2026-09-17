import type { ToolConfig } from "../types";
import { fmtUsd } from "@/lib/format";

/**
 * Realistic-looking sample holdings, with a name and an ILLUSTRATIVE sample
 * price each so the generated portfolio can show plausible coin amounts and a
 * simulated 24h move — not a market snapshot.
 *
 * Ticker note: MATIC was replaced by POL in the 2024–25 migration. It sat here
 * as MATIC until 2026-08 and made every generated fixture look two years out of
 * date to anyone who knows the market.
 */
const COINS: { symbol: string; name: string; price: number }[] = [
  { symbol: "BTC", name: "Bitcoin", price: 60000 },
  { symbol: "ETH", name: "Ethereum", price: 3000 },
  { symbol: "SOL", name: "Solana", price: 150 },
  { symbol: "BNB", name: "BNB", price: 600 },
  { symbol: "XRP", name: "XRP", price: 0.6 },
  { symbol: "ADA", name: "Cardano", price: 0.45 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.12 },
  { symbol: "AVAX", name: "Avalanche", price: 30 },
  { symbol: "LINK", name: "Chainlink", price: 15 },
  { symbol: "DOT", name: "Polkadot", price: 6 },
  { symbol: "POL", name: "Polygon", price: 0.5 },
  { symbol: "LTC", name: "Litecoin", price: 80 },
];

/** A block bar, so allocation is legible without a chart library. */
function bar(pct: number): string {
  const filled = Math.max(1, Math.round(pct / 4));
  return "█".repeat(Math.min(filled, 25));
}

function fmtAmount(n: number): string {
  const d = n >= 1000 ? 2 : n >= 1 ? 4 : 6;
  return n.toLocaleString("en-US", { maximumFractionDigits: d });
}

const tool: ToolConfig = {
  slug: "fake-portfolio-generator",
  updatedAt: "2026-09-17",
  title: "Fake Crypto Portfolio Generator & Simulator",
  description:
    "Generate a random but realistic-looking crypto portfolio — allocation, coin amounts, sample values and a simulated 24h move — shown as a dashboard and copyable as JSON for mockups and mock APIs. Simulated data only, not real holdings.",
  category: "dev",
  source: "builtin",
  seo: {
    title: "Fake Crypto Portfolio Generator & Simulator — Realistic Test Data",
    keywords: [
      "fake crypto portfolio generator",
      "fake crypto portfolio simulator",
      "crypto portfolio simulator",
      "fake crypto portfolio",
      "fake bitcoin portfolio",
      "mock crypto portfolio",
      "random crypto portfolio",
      "test portfolio data",
      "sample portfolio json",
    ],
    description:
      "Free fake crypto portfolio simulator. Generate a realistic-looking portfolio — allocation, coin amounts, sample USD values and a simulated 24h change — as a readable dashboard and copyable JSON for mockups, screenshots and QA. Simulated data only.",
  },
  inputs: [
    { name: "assets", label: "Number of assets", type: "number", default: 5, min: 1, max: 12, step: 1 },
    { name: "total", label: "Total value", type: "number", suffix: "USD", default: 10000, min: 0, step: 100 },
  ],
  resultLabel: "Simulated portfolio",
  compute: (i) => {
    const n = Math.min(COINS.length, Math.max(1, Math.floor(Number(i.assets) || 1)));
    const total = Number(i.total) || 0;

    const picks = [...COINS].sort(() => Math.random() - 0.5).slice(0, n);
    const weights = picks.map(() => Math.random() + 0.1);
    const sum = weights.reduce((a, b) => a + b, 0);

    const holdings = picks
      .map((coin, idx) => {
        const valueUsd = Number(((weights[idx] / sum) * total).toFixed(2));
        const change24h = Number((Math.random() * 24 - 12).toFixed(2)); // −12%..+12%
        return {
          symbol: coin.symbol,
          name: coin.name,
          amount: Number((valueUsd / coin.price).toFixed(coin.price >= 1000 ? 6 : coin.price >= 1 ? 4 : 2)),
          priceUsdSample: coin.price,
          valueUsd,
          allocationPct: Number(((weights[idx] / sum) * 100).toFixed(2)),
          change24hPct: change24h,
        };
      })
      .sort((a, b) => b.valueUsd - a.valueUsd);

    // Portfolio-level simulated 24h move = value-weighted average of the parts.
    const portfolioChange =
      total > 0 ? holdings.reduce((acc, h) => acc + h.valueUsd * h.change24hPct, 0) / total : 0;
    const up = portfolioChange >= 0;

    const breakdown = [
      {
        label: "24h change (simulated)",
        value: `${up ? "▲" : "▼"} ${Math.abs(portfolioChange).toFixed(2)}%`,
      },
      ...holdings.map((h) => ({
        label: `${h.symbol}  ${bar(h.allocationPct)}`,
        value: `${fmtUsd(h.valueUsd)}  ·  ${h.allocationPct}%`,
      })),
    ];

    return {
      value: fmtUsd(total),
      label: `${n}-asset simulated portfolio — sample data, not real holdings`,
      breakdown,
      copyText: JSON.stringify(
        {
          totalUsd: total,
          change24hPct: Number(portfolioChange.toFixed(2)),
          assets: n,
          simulated: true,
          holdings: holdings.map((h) => ({
            symbol: h.symbol,
            name: h.name,
            amount: h.amount,
            priceUsdSample: h.priceUsdSample,
            valueUsd: h.valueUsd,
            allocationPct: h.allocationPct,
            change24hPct: h.change24hPct,
          })),
        },
        null,
        2,
      ),
      copyLabel: "Copy portfolio as JSON",
      note:
        "Simulated sample data for testing, mockups and screenshots. The coins, weights, amounts and the 24h move are randomly generated and the prices are illustrative, not market values — this is not a portfolio anyone holds. Presenting it as real holdings to persuade someone to invest is fraud. Change any input to roll a new one.",
    };
  },
  article: [
    { type: "h2", text: "What this portfolio simulator does" },
    {
      type: "p",
      text: "It builds a realistic-looking but entirely fake crypto portfolio: a set of coins with random weights that add up to the total you choose, each with a plausible coin amount, a sample USD value and a simulated 24h move — presented as a readable dashboard and available as JSON. It exists for the moments you need portfolio-shaped data without a real account: a UI mockup, a screenshot, a tutorial, or fixtures for a test database.",
    },
    { type: "h2", text: "Why the data is fake — and must stay that way" },
    {
      type: "p",
      text: "Everything is generated at random in your browser and nothing is saved or sent anywhere. The prices are illustrative constants, not live quotes, and the holdings belong to no one. Passing this off as a real portfolio to persuade somebody to invest, or to fake a track record, is fraud — the tool is deliberately built to read as test data, not as an exchange screen.",
    },
    { type: "h2", text: "Good ways to use it" },
    {
      type: "ul",
      items: [
        "Fill a portfolio dashboard mockup or screenshot with believable data instead of placeholders.",
        "Seed a test database, mock API or Storybook stories — copy the JSON straight in.",
        "QA how your UI handles many assets, tiny allocations, big numbers and negative 24h moves.",
        "Illustrate a tutorial or design comp without exposing a real portfolio.",
      ],
    },
    { type: "h2", text: "What it will never do" },
    {
      type: "ul",
      items: [
        "Never shows real market prices or a real 24h move — the figures are illustrative.",
        "Never represents holdings that anyone actually owns.",
        "Never should be presented as a genuine portfolio or performance record.",
      ],
    },
    {
      type: "p",
      text: "If you want to track a real portfolio or model real returns, use the profit, DCA and market-cap calculators on this site with live prices instead.",
    },
  ],
  faq: [
    {
      q: "What does this generate?",
      a: "A random allocation across popular coins that adds up to the total you choose — with coin amounts, sample USD values and a simulated 24h change — shown as a dashboard and available as JSON. It is seed data for testing portfolio screens.",
    },
    {
      q: "Is the data real?",
      a: "No. The coins, weights, amounts and 24h move are random, and the prices are illustrative constants, not market values. It is sample data, not a portfolio anyone holds and not a market snapshot.",
    },
    {
      q: "Are the prices and 24h change live?",
      a: "No. Prices are fixed illustrative constants so the amounts look plausible, and the 24h change is randomly generated. Nothing here is tied to a live market.",
    },
    {
      q: "Can I use it in my app?",
      a: "Yes. Copy the JSON straight into your mock API, fixtures or Storybook stories. There is no licence and no attribution required.",
    },
    {
      q: "Can I use it to show someone a portfolio I do not have?",
      a: "Please do not. This produces obviously generated sample data for testing software; presenting it as real holdings to persuade somebody to invest is fraud. The tool is deliberately built to look like test data rather than an exchange screen.",
    },
    {
      q: "How do I get a different one?",
      a: "Change any input. Every run picks a fresh set of coins, fresh random weights and a fresh 24h move.",
    },
  ],
};

export default tool;
