import type { StaticPage } from "../types";
import { site } from "@/lib/site";

export const about: StaticPage = {
  slug: "about",
  title: `About ${site.name}`,
  description:
    "Why this site exists, how the calculators are built, and what we will never do.",
  eyebrow: "About",
  updatedAt: "2026-07-19",
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
