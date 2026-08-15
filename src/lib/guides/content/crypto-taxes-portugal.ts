import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-portugal",
  title: "Crypto Tax in Portugal: The 365-Day Rule and the 28% Flat Rate",
  description:
    "Portugal is no longer fully tax-free, but it still rewards patience: hold for more than a year and your gain is exempt. Here is how the 28% short-term rate, the 365-day rule and category classification work.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Código do IRS, artigo 10.º — mais-valias",
      publisher: "Autoridade Tributária e Aduaneira",
      url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs10.aspx",
    },
  ],
  seo: {
    keywords: [
      "crypto tax portugal",
      "portugal 365 day rule crypto",
      "portugal crypto capital gains 28%",
      "is crypto tax free in portugal",
      "category g crypto portugal",
      "portugal crypto tax 2026",
    ],
    description:
      "Portugal crypto tax guide: the 28% flat rate on gains held under 365 days, the one-year exemption, tax-free crypto-to-crypto swaps, professional (Category B) traders and staking income.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Portuguese tax rules changed significantly in 2023 and continue to evolve; personal circumstances vary. Check portaldasfinancas.gov.pt or speak to a Portuguese tax adviser before you file." },

    { type: "p", text: "Portugal spent years as the poster child for tax-free crypto, and its reputation still draws holders. That reputation is now out of date: since 1 January 2023 Portugal does tax crypto. But it kept a genuinely attractive feature — a one-year exemption — so the country remains favourable for long-term holders, just not the blanket haven it once was." },

    { type: "h2", text: "The 365-day rule" },
    { type: "p", text: "The centrepiece is holding period. Gains on crypto held for 365 days or more are exempt from capital gains tax. Sell a coin you have held for less than a year and the gain is taxed; cross the one-year line and it is generally tax-free. This is the same philosophy as Germany's one-year rule, and it makes the acquisition date the most important thing you track." },
    { type: "callout", text: "The exemption applies to crypto that counts as a plain cryptoasset. Tokens that qualify as securities can be treated differently, and the exemption's scope has nuances — check your specific assets rather than assuming everything qualifies." },

    { type: "h2", text: "The 28% flat rate on short-term gains" },
    { type: "p", text: "Gains on crypto held for less than 365 days fall under Category G (capital gains) and are taxed at a flat 28%. You can instead elect to include the gains in your general progressive income (englobamento), which only helps lower-income taxpayers; most people take the flat 28%. There is no separate small-gain allowance for crypto, so short-term profits are taxed from the first euro of gain." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Crypto-to-crypto swaps are not taxed" },
    { type: "p", text: "Like France, Portugal does not tax crypto-to-crypto trades. Swapping BTC for ETH is not a disposal, and — importantly — the holding period carries over cumulatively across the swap. Tax is triggered only when you convert to fiat or spend the crypto. This lets you rebalance without resetting your one-year clock, a meaningful advantage for active portfolio management." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Professional traders: Category B" },
    { type: "p", text: "If your activity amounts to a professional or business trading operation rather than personal investing, it is taxed under Category B (self-employment) on the progressive income scale, which runs from 14.5% up to 53% including the top-rate solidarity surcharges. The distinction turns on how habitual, organised and business-like your trading is. Most individuals remain private investors under Category G, but high-frequency operators can be reclassified, with very different consequences." },

    { type: "h2", text: "Staking, mining and rewards" },
    { type: "p", text: "Passive crypto income — staking rewards, lending yield and similar — is generally treated as investment income (Category E) and can be taxed at 28%, while mining and validation activity carried on as a business fall under Category B. As in most countries, rewards are effectively taxed as income when received, and any later change in value on disposal is then assessed under the capital gains rules. The exact category depends on the nature of the activity." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "The tax year is the calendar year. Crypto gains and income are reported in the annual IRPF return (Modelo 3), typically filed between April and June of the following year.",
      "Keep records of acquisition dates and values, disposal dates and proceeds, and the euro value of any rewards when received — the 365-day rule makes precise dates essential.",
      "From 2026 the EU-wide DAC8 framework requires crypto service providers to report user and transaction data to tax authorities automatically.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Portugal is still one of Europe's friendlier crypto jurisdictions, but the 'tax-free' label no longer holds without qualification. The winning play is the long hold: cross 365 days and your gain is exempt, and because swaps do not reset the clock, you can rebalance along the way. Sell early and you owe a flat 28%. Track your dates, and the rest follows." },
  ],
  faq: [
    { q: "Is crypto still tax-free in Portugal?", a: "Only for long-term holders. Since 1 January 2023 Portugal taxes short-term crypto gains at 28%, but gains on crypto held for 365 days or more remain exempt from capital gains tax." },
    { q: "What is the 365-day rule in Portugal?", a: "Crypto held for at least 365 days is exempt from capital gains tax when sold. Held for less than a year, the gain is taxed at a flat 28% under Category G." },
    { q: "Are crypto-to-crypto swaps taxed in Portugal?", a: "No. Swapping one crypto for another is not a taxable event, and the holding period carries over. Tax is only triggered when you convert crypto to fiat or spend it." },
    { q: "What tax rate applies to short-term crypto gains in Portugal?", a: "A flat 28% under Category G. You can elect to include gains in your general progressive income instead, but that generally only benefits lower earners." },
    { q: "How are professional crypto traders taxed in Portugal?", a: "Under Category B (self-employment) on the progressive income scale, from 14.5% up to 53%. The classification depends on how habitual and business-like the trading is." },
    { q: "How are staking rewards taxed in Portugal?", a: "Passive rewards are generally investment income (Category E), taxable at 28%, while business-scale mining or validation falls under Category B. Rewards are taxed as income when received." },
  ],
};

export default guide;
