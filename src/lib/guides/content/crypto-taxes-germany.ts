import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-germany",
  title: "Crypto Tax in Germany: The One-Year Rule, §23 EStG and the €1,000 Limit",
  description:
    "Germany treats crypto unusually kindly: hold for more than a year and the gain is completely tax-free. Here is how §23 EStG works, the €1,000 exemption limit, staking rules and the new DAC8 reporting.",
  readingMinutes: 9,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Einzelfragen zur ertragsteuerrechtlichen Behandlung bestimmter Kryptowerte (6 March 2025)",
      publisher: "Bundesministerium der Finanzen",
      url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2025-03-06-einzelfragen-kryptowerte.html",
    },
    {
      label:
        "§ 23 EStG — Private Veräußerungsgeschäfte",
      publisher: "Gesetze im Internet",
      url: "https://www.gesetze-im-internet.de/estg/__23.html",
    },
  ],
  seo: {
    keywords: [
      "crypto tax germany",
      "krypto steuer",
      "§23 estg crypto",
      "germany one year holding period crypto",
      "bitcoin steuer deutschland",
      "crypto tax free germany",
    ],
    description:
      "Germany crypto tax guide: the 12-month tax-free holding rule under §23 EStG, the €1,000 private-sale exemption limit, the €256 staking allowance, income tax rates 0–45%, loss rules and DAC8 reporting from 2026.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. German tax law and BMF guidance change, and church tax, solidarity surcharge and individual circumstances vary. Check with a Steuerberater or bundesfinanzministerium.de before you file." },

    { type: "p", text: "Germany has one of the friendliest crypto tax regimes among major economies, and it comes down to a single rule: hold a coin for more than twelve months and any gain is entirely tax-free — no matter how large. That is because Germany does not treat crypto as a capital asset like shares. It treats it as a private asset, and applies the rules for 'private disposal transactions' (private Veräußerungsgeschäfte) under §23 of the Income Tax Act (EStG)." },

    { type: "h2", text: "The one-year rule that changes everything" },
    { type: "p", text: "Under §23 EStG, gains on private assets are only taxable if you dispose of them within one year of acquiring them. Sell after the one-year mark and the gain falls outside the tax net completely. Buy Bitcoin on 1 January 2025 and you can sell it entirely tax-free from 2 January 2026 onward. This is the opposite of most countries, where a long hold merely earns a discount — in Germany it earns a full exemption." },
    { type: "callout", text: "The exemption is per coin, measured from acquisition. If you bought in several tranches, each tranche has its own one-year clock. Germany uses FIFO (first-in, first-out) by default to decide which coins you sold." },

    { type: "h2", text: "What is a taxable disposal within the year" },
    { type: "ul", items: [
      "Selling crypto for euros within 12 months of buying it.",
      "Swapping one token for another within the year — a disposal at market value, even though no euros moved.",
      "Spending crypto on goods or services within the year.",
      "Not taxable: simply holding, and moving coins between your own wallets. Buying is never itself a taxable event.",
    ] },

    { type: "h2", text: "The €1,000 exemption limit — and why it is all-or-nothing" },
    { type: "p", text: "For gains realised within the year, there is a tax-free exemption limit (Freigrenze) of €1,000 per year, raised from €600 starting in 2024. But note the word limit, not allowance. A Freigrenze is all-or-nothing: if your total short-term private-sale gains for the year come to €999, none of it is taxed; if they come to €1,001, the entire €1,001 is taxable, not just the euro over the line. This is the single most misunderstood number in German crypto tax." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Rates on short-term gains" },
    { type: "p", text: "Gains taken within the year (above the €1,000 limit) are added to your other income and taxed at your personal income tax rate, which is progressive from 0% up to 45%. For 2025 the basic tax-free allowance (Grundfreibetrag) is €12,084; the rate then rises through the 14–42% zone, sits at 42% from about €68,430, and reaches the top 45% 'Reichensteuer' rate above €277,825. On top of the income tax, a 5.5% solidarity surcharge can apply to higher earners, and church tax (8–9% of the income tax) applies if you are a registered member of a church." },
    { type: "p", text: "Because it is your marginal rate, the same €5,000 short-term gain costs a low earner far less than a top earner. There is no separate flat crypto rate the way the Abgeltungsteuer works for shares and interest — private crypto sits outside that 25% flat regime." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Staking, lending, mining and airdrops" },
    { type: "p", text: "Rewards are the more complex corner. Income from staking, lending and similar activities is treated as other income and is taxed on the euro value when you receive it — but there is a separate exemption limit of €256 per year for this kind of income (again a Freigrenze, all-or-nothing). Mining and airdrops received in return for a service are likewise taxable as income on receipt." },
    { type: "p", text: "A crucial clarification from the Finance Ministry: staking or lending your coins does not extend the holding period. Earlier fears that lent or staked coins would need a ten-year hold to go tax-free were laid to rest — the one-year rule still applies to the underlying coins. The reward tokens themselves, however, start their own one-year clock from the day you receive them." },

    { type: "h2", text: "Losses" },
    { type: "p", text: "Losses from private disposal transactions can only be offset against gains from other private disposal transactions — you cannot use a crypto loss to reduce your salary or your share gains. Unused losses carry back one year or forward indefinitely against future private-sale gains. And the mirror of the one-year rule bites here too: a loss on a coin you have held for more than a year is generally not deductible, because a gain would not have been taxable either." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Reporting, deadlines and DAC8" },
    { type: "ul", items: [
      "Tax year is the calendar year. Crypto gains go in the Anlage SO (other income) of your income tax return.",
      "The deadline for the 2025 return is 31 July 2026 if you file yourself, and later if a Steuerberater files for you.",
      "Keep records: acquisition and disposal dates, quantities, euro values at each point, wallet addresses and exchange statements. The one-year rule makes the acquisition date the most important field you record.",
    ] },
    { type: "p", text: "From 1 January 2026 the EU-wide DAC8 framework — Europe's implementation of the OECD Crypto-Asset Reporting Framework (CARF) — requires crypto service providers to report customer identities and transaction data to tax authorities automatically and across borders. The era of German crypto gains being invisible to the Finanzamt is ending; the one-year exemption is generous, but it only helps if you report correctly." },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Germany rewards patience like almost nowhere else: the difference between selling at eleven months and thirteen months can be the difference between your full marginal rate and zero. Track your acquisition dates religiously, keep short-term gains under the €1,000 limit where you can, and remember that from 2026 the tax office is receiving the data automatically." },
  ],
  faq: [
    { q: "Is crypto really tax-free in Germany after one year?", a: "Yes. For private investors, gains on crypto held longer than twelve months are fully exempt under §23 EStG, regardless of the amount. The coin must genuinely have been held for more than one year from acquisition." },
    { q: "What is the €1,000 crypto exemption in Germany?", a: "It's a Freigrenze (exemption limit) on short-term private-sale gains within a year, raised from €600 in 2024. It's all-or-nothing: gains up to €1,000 are tax-free, but exceed it and the entire gain becomes taxable, not just the excess." },
    { q: "How are staking rewards taxed in Germany?", a: "As other income at your personal rate on the euro value when received, subject to a separate €256 per year exemption limit. Staking does not extend the one-year holding period of the underlying coins." },
    { q: "Is swapping one crypto for another taxable in Germany?", a: "Yes, if done within the one-year holding period — a crypto-to-crypto swap is a disposal at market value in euros. After more than a year, the swap is tax-free like any other disposal." },
    { q: "What tax rate applies to short-term crypto gains in Germany?", a: "Your personal progressive income tax rate, from 0% up to 45%, plus a possible 5.5% solidarity surcharge and church tax. There is no separate flat crypto rate for private investors." },
    { q: "Does the German tax office know about my crypto?", a: "Increasingly yes. From 1 January 2026 the DAC8 framework requires EU crypto service providers to report user and transaction data to tax authorities automatically, including across borders." },
  ],
};

export default guide;
