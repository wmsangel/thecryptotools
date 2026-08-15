import type { StaticPage } from "../types";
import { site } from "@/lib/site";

export const privacy: StaticPage = {
  slug: "privacy",
  title: "Privacy Policy",
  description:
    "What data TheCryptoTools does and does not collect, who processes it, and how you can control it.",
  eyebrow: "Legal",
  updatedAt: "2026-07-19",
  seo: {
    title: "Privacy Policy",
    description:
      "Privacy policy for TheCryptoTools — a static website with no accounts and no server-side storage of your calculations.",
    keywords: ["privacy policy", "thecryptotools privacy", "crypto calculator privacy"],
  },
  body: [
    {
      type: "callout",
      text: "Short version: we have no accounts, no database and no server that receives your calculations. Everything you type into a tool is processed in your browser and never leaves your device.",
    },
    { type: "h2", text: "Who we are" },
    {
      type: "p",
      text: `${site.name} (${site.url}) is a free collection of crypto calculators, guides and market data. The site is delivered as static files — there is no application backend, no user accounts and no login.`,
    },
    {
      type: "p",
      text: `If you have any question about this policy you can reach us at ${site.contactEmail}.`,
    },

    { type: "h2", text: "Data you enter into the tools" },
    {
      type: "p",
      text: "Position sizes, entry prices, portfolio values, wallet addresses you paste into a converter — all of it is handled entirely by JavaScript running in your browser. It is never transmitted to us, never logged and never stored on any server we control.",
    },
    {
      type: "p",
      text: "One exception you control yourself: the \"Share\" button on a tool copies your inputs into the page URL so you can send the link to someone. That link contains whatever you typed, so only share it deliberately.",
    },

    { type: "h2", text: "Data stored on your device" },
    {
      type: "ul",
      items: [
        "Theme preference (light / dark / system) — stored in localStorage so the site does not flash the wrong theme on load.",
        "Cookie consent choice — stored in localStorage so we do not ask you again on every visit.",
        "Nothing else. We do not use tracking cookies of our own, and we do not fingerprint your device.",
      ],
    },
    { type: "cookieSettings" },

    { type: "h2", text: "Third parties that may receive data" },
    {
      type: "p",
      text: "Because the site loads live market data and is monetised through advertising and affiliate links, a few third parties can see your IP address and standard request data when their content loads:",
    },
    {
      type: "ul",
      items: [
        "CoinGecko and Binance — public market-data APIs called from your browser to show live prices and the ticker. They receive your IP address as part of that request. No personal data is sent.",
        "Google AdSense — if and when advertising is enabled, Google may set cookies to serve and measure ads. Ad personalisation is only enabled if you consent (see the cookie policy).",
        "Google Analytics — measures aggregate site usage. Google receives your IP address and standard request data, and stores an analytics cookie only after you accept analytics (see the cookie policy).",
        "Cloudflare — our DNS and CDN provider, which terminates TLS and may process request metadata for security and performance.",
        "Exchange and hardware-wallet partners — only when you deliberately click an affiliate link on our platforms page, which passes a referral identifier to that partner.",
      ],
    },
    {
      type: "p",
      text: "We do not sell or share personal information, because we do not collect any to begin with.",
    },

    { type: "h2", text: "Analytics" },
    {
      type: "p",
      text: "We use Google Analytics 4 to understand which pages and tools are used, in aggregate. It loads under Google Consent Mode v2: before you answer the banner it runs cookieless — no identifier is stored on your device — and it only sets analytics cookies once you accept. We never send it anything you type into a calculator; those values stay in your browser. Google's own handling of this data is covered by their privacy policy at policies.google.com/privacy, and you can opt out browser-wide with their add-on at tools.google.com/dlpage/gaoptout.",
    },

    { type: "h2", text: "Your rights" },
    {
      type: "p",
      text: "Under the GDPR, UK GDPR and similar laws you have the right to access, correct, delete and port your personal data, and to object to processing. Since we hold no personal data about you, the practical way to exercise these rights here is to clear your browser storage for this site and withdraw consent using the cookie settings above. For anything else, contact us and we will respond within 30 days.",
    },
    {
      type: "p",
      text: "California residents (CCPA/CPRA): we do not sell or share personal information as those terms are defined, and we do not knowingly process data from children under 16.",
    },

    { type: "h2", text: "Children" },
    {
      type: "p",
      text: "This site is not directed at children under 13 and we do not knowingly collect data from them.",
    },

    { type: "h2", text: "Changes to this policy" },
    {
      type: "p",
      text: "We will update this page whenever our data practices change and revise the \"last updated\" date at the top. Material changes will also reset the cookie banner so you can review your choice.",
    },
  ],
};
