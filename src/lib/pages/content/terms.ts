import type { StaticPage } from "../types";
import { site } from "@/lib/site";

export const terms: StaticPage = {
  slug: "terms",
  title: "Terms of Service",
  description:
    "The rules for using TheCryptoTools — what you may do with the calculators, and the limits of our responsibility.",
  eyebrow: "Legal",
  updatedAt: "2026-07-19",
  seo: {
    title: "Terms of Service",
    description:
      "Terms of service for TheCryptoTools: free educational crypto calculators provided as-is, with no warranty and no financial advice.",
    keywords: ["terms of service", "terms and conditions", "thecryptotools terms"],
  },
  body: [
    {
      type: "p",
      text: `By using ${site.url} you agree to these terms. If you do not agree, please do not use the site.`,
    },

    { type: "h2", text: "What the service is" },
    {
      type: "p",
      text: `${site.name} provides free calculators, converters, market data and educational articles about cryptocurrency. There is no account, no subscription and no payment. We may add, change or remove any tool at any time without notice.`,
    },

    { type: "h2", text: "Not financial advice" },
    {
      type: "p",
      text: "Everything on this site is for information and education only. Nothing here is financial, investment, tax or legal advice, an offer to buy or sell any asset, or a recommendation of any strategy, exchange or product. Crypto assets are volatile and you can lose all of your money. Decide for yourself, and consult a licensed professional where appropriate.",
    },

    { type: "h2", text: "Accuracy and availability" },
    {
      type: "p",
      text: "The calculators are provided as-is. Formulas are simplified models; they ignore fees, slippage, funding, taxes and exchange-specific rules unless a tool explicitly says otherwise. Live prices come from third-party APIs and may be delayed, wrong or unavailable. Always verify a number against your exchange before acting on it.",
    },
    {
      type: "p",
      text: "We do not guarantee that the site will be available, uninterrupted or error-free, and we may take it offline at any time.",
    },

    { type: "h2", text: "Acceptable use" },
    {
      type: "ul",
      items: [
        "Use the tools freely for personal or commercial purposes — no attribution required for results you compute.",
        "Do not scrape the site at a rate that degrades it for others, or resell it as your own service.",
        "Do not attempt to breach, overload or interfere with the site or the third-party APIs it relies on.",
        "Do not use the site where doing so would break the law in your jurisdiction.",
      ],
    },

    { type: "h2", text: "Intellectual property" },
    {
      type: "p",
      text: `The site's design, text, guides and code are owned by ${site.name}. Third-party names and logos on the platforms page belong to their respective owners and are used for identification only — their appearance does not imply any endorsement of us by them.`,
    },

    { type: "h2", text: "Third-party links" },
    {
      type: "p",
      text: "We link to exchanges, wallets and other services, some through affiliate programs. We do not control them and are not responsible for their content, security, fees or how they treat your data. Review their terms before signing up.",
    },

    { type: "h2", text: "Limitation of liability" },
    {
      type: "p",
      text: "To the fullest extent permitted by law, we are not liable for any trading loss, lost profit, data loss or any indirect or consequential damages arising from your use of, or inability to use, this site — including any decision made on the basis of a calculation shown here.",
    },

    { type: "h2", text: "Changes" },
    {
      type: "p",
      text: `We may update these terms; the date at the top reflects the current version. Continued use after a change means you accept it. Questions: ${site.contactEmail}.`,
    },
  ],
};
