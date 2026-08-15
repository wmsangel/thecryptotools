import type { StaticPage } from "../types";
import { site } from "@/lib/site";

export const cookies: StaticPage = {
  slug: "cookies",
  title: "Cookie Policy",
  description:
    "Which cookies and browser storage TheCryptoTools uses, why, and how to change your choice at any time.",
  eyebrow: "Legal",
  updatedAt: "2026-07-19",
  seo: {
    title: "Cookie Policy",
    description:
      "Cookie policy for TheCryptoTools: strictly necessary storage only by default, with optional analytics and advertising cookies that require your consent.",
    keywords: ["cookie policy", "cookies", "gdpr cookies", "thecryptotools cookies"],
  },
  body: [
    {
      type: "callout",
      text: "By default this site sets no tracking cookies at all. Analytics and advertising cookies only load if you opt in, and you can change your mind at any moment.",
    },
    { type: "h2", text: "What cookies are" },
    {
      type: "p",
      text: "A cookie is a small file a website stores in your browser so it can remember something between page loads. Browsers also offer localStorage, which works the same way from a privacy standpoint — this policy covers both.",
    },

    { type: "h2", text: "Strictly necessary (always on)" },
    {
      type: "p",
      text: "These are required for the site to work and cannot be switched off. They are stored in localStorage on your device and are never sent to us.",
    },
    {
      type: "ul",
      items: [
        "theme — remembers whether you chose light, dark or system appearance. Persists until you clear it.",
        "tct-consent — remembers your cookie choice so the banner does not reappear on every page. Expires after 12 months.",
      ],
    },

    { type: "h2", text: "Analytics (optional)" },
    {
      type: "p",
      text: "We use Google Analytics 4 to count page views and see which tools people actually use, so we know what to build next. Until you accept analytics in the banner it runs in Google's cookieless mode: no analytics cookie is written and no identifier is stored on your device. Accepting lets it set the cookies below so repeat visits can be recognised.",
    },
    {
      type: "ul",
      items: [
        "_ga — distinguishes one browser from another for visit counting. Set by Google Analytics only after you accept analytics. Expires after 2 years.",
        "_ga_E26K7W8NDZ — keeps session state for this site's analytics property. Same condition, expires after 2 years.",
      ],
    },
    {
      type: "p",
      text: "We look only at aggregate reports — pages, referrers, countries, devices. Google Signals is switched off on our analytics property, so your visits here are not tied to your Google account or joined up across your devices. You can also opt out of Google Analytics in any browser with Google's own add-on at tools.google.com/dlpage/gaoptout.",
    },

    { type: "h2", text: "Advertising (optional)" },
    {
      type: "p",
      text: "The site is partly funded by advertising. If you accept advertising cookies, Google AdSense and its partners may set cookies to select ads, cap how often you see the same one, and measure whether ads work. If you decline, ads — where shown — are limited to non-personalised ones, which still need basic cookies for frequency capping and fraud prevention but do not build a profile of you.",
    },
    {
      type: "p",
      text: "Google's use of advertising cookies is described in Google's own Advertising & Privacy notice at policies.google.com/technologies/ads. EU, UK and Swiss visitors are handled through Google Consent Mode, which receives your choice from the banner before any ad request is made.",
    },

    { type: "h2", text: "Affiliate links" },
    {
      type: "p",
      text: "Our platforms page contains referral links. Clicking one may cause that exchange or wallet vendor to set its own cookie so it can credit us for the signup. That cookie is set by them, on their domain, only after you click — never before. See the affiliate disclosure for details.",
    },

    { type: "h2", text: "Changing your choice" },
    {
      type: "p",
      text: "Use the button below to reopen the cookie settings, or clear this site's data in your browser to reset everything.",
    },
    { type: "cookieSettings" },
    {
      type: "p",
      text: `Questions about this policy? Write to ${site.contactEmail}.`,
    },
  ],
};
