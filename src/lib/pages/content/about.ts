import type { StaticPage } from "../types";
import { site } from "@/lib/site";

export const about: StaticPage = {
  slug: "about",
  title: `About ${site.name}`,
  description:
    "Why this site exists, how the calculators are built, and what we will never do.",
  eyebrow: "About",
  updatedAt: "2026-08-17",
  seo: {
    title: `About ${site.name}`,
    description:
      "TheCryptoTools is a free, no-signup suite of crypto calculators and guides that runs entirely in your browser. Here is how and why it is built.",
    keywords: ["about thecryptotools", "free crypto calculators", "crypto tools site"],
  },
  body: [
    {
      type: "p",
      text: "Most crypto calculators are buried three clicks deep inside an exchange, want your email first, or quietly assume a fee structure that is not yours. We wanted the opposite: open a page, type two numbers, get the answer, leave.",
    },

    { type: "h2", text: "Who is behind it" },
    {
      type: "p",
      text: "TheCryptoTools is an independent project. It is not owned by, funded by, or affiliated with any exchange, wallet, token or fund, and it takes no payment to rank a platform or recommend a product. It is built and maintained by a small independent team that has spent years making practical, no-signup web tools — the same people behind a number of other free calculator and reference sites. That independence is the point: the tool has no incentive to make a strategy look better or worse than the maths says.",
    },
    {
      type: "p",
      text: "We are not licensed financial advisers, and nothing here is financial advice. What we can do is arithmetic correctly and explain it honestly — which is exactly what the calculators and guides set out to do, and where a decision needs a professional, we say so.",
    },

    { type: "h2", text: "What you get" },
    {
      type: "ul",
      items: [
        "Dozens of calculators across trading, futures, portfolio, DeFi, mining, converters and developer utilities.",
        "Live prices from public market-data APIs, plus a site-wide ticker and a top-100 market table.",
        "Plain-English guides that explain the maths behind each tool and link straight to it.",
        "A curated list of exchanges and hardware wallets with the current signup offers.",
      ],
    },

    { type: "h2", text: "How it is built" },
    {
      type: "p",
      text: "The whole site is a static export — HTML, CSS and JavaScript on a CDN. There is no backend, no database and no account system. Every calculation runs locally in your browser, which is why nothing you type can leak: technically, there is nowhere for it to go.",
    },
    {
      type: "p",
      text: "Formulas are the standard, publicly documented ones (liquidation price, Kelly fraction, Black–Scholes, Sharpe ratio and so on), implemented in plain code and checked against worked examples. Where a model simplifies reality — ignoring fees, funding or tiered margin — the tool says so.",
    },

    { type: "h2", text: "How we check the numbers" },
    {
      type: "p",
      text: "Every tool is verified against hand-computed examples before it ships, and where a figure comes from the real world it is traced to a primary source rather than repeated from memory. The country tax guides cite the tax authority or the legislation itself, carry the date they were last reviewed, and mark clearly when a rule is unsettled instead of guessing. Price-history figures are computed from daily market data and bounded by the window we actually hold — never dressed up as an all-time claim.",
    },
    {
      type: "p",
      text: "We get things wrong sometimes, and when we do we fix the tool or the guide and update its date rather than quietly editing the past. If you find a formula that looks off, telling us is the fastest way it gets corrected. Our editorial policy page sets out the verification standard in full.",
    },

    { type: "h2", text: "How it stays free" },
    {
      type: "p",
      text: "Advertising and affiliate commissions from exchange and wallet signups. That funding never touches the numbers a calculator produces, and every partner link is disclosed. See the affiliate disclosure for the full picture.",
    },

    { type: "h2", text: "What we will not do" },
    {
      type: "ul",
      items: [
        "No signup walls, no email harvesting, no newsletter popups.",
        "No tracking cookies without your explicit consent.",
        "No price predictions, no signals, no \"guaranteed\" strategies, no token shilling.",
        "No paid rankings on the platforms page.",
      ],
    },

    { type: "h2", text: "Get in touch" },
    {
      type: "p",
      text: `Found a formula that looks wrong, or want a tool that does not exist yet? That feedback is how the list grows — write to ${site.contactEmail}.`,
    },
  ],
};
