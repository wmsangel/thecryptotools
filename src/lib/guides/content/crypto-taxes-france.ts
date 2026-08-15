import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-france",
  title: "Crypto Tax in France: The 30% Flat Tax, the €305 Rule and Tax-Free Swaps",
  description:
    "France taxes crypto only when you cash out to euros — crypto-to-crypto swaps are tax-free. Here is how the 30% flat tax (PFU) works, the €305 exemption, the portfolio gain formula and the account-declaration trap.",
  readingMinutes: 9,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Comment déclarer les plus ou moins-values sur cessions d'actifs numériques",
      publisher: "impots.gouv.fr",
      url: "https://www.impots.gouv.fr/particulier/questions/comment-declarer-les-plus-ou-moins-values-sur-cessions-dactifs-numeriques",
    },
    {
      label:
        "BOI-RPPM-PVBMC-30-30 — cession d'actifs numériques à titre occasionnel",
      publisher: "BOFiP",
      url: "https://bofip.impots.gouv.fr/bofip/11969-PGP.html/identifiant=BOI-RPPM-PVBMC-30-30-20240423",
    },
  ],
  seo: {
    keywords: [
      "crypto tax france",
      "impot crypto",
      "flat tax crypto france",
      "pfu crypto",
      "france crypto to crypto tax free",
      "formulaire 3916-bis crypto",
    ],
    description:
      "France crypto tax guide: the 30% flat tax (PFU) on cash-outs, why crypto-to-crypto swaps are not taxed, the €305 annual exemption, the portfolio-wide gain formula, professional traders and the 3916-bis foreign account declaration.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. French tax rules and rates change and personal circumstances vary. Check impots.gouv.fr or speak to an expert-comptable before you file." },

    { type: "p", text: "France has a distinctive and, for active traders, surprisingly convenient approach: it only taxes crypto when you convert it back to fiat or spend it. As long as your gains stay inside the crypto world — swapping one token for another — nothing is taxed. That single rule makes France's system feel very different from the UK, Germany, Australia or Canada, where every crypto-to-crypto trade is a taxable event." },

    { type: "h2", text: "Only cash-outs are taxed" },
    { type: "p", text: "For a private investor, a taxable disposal happens only when you convert digital assets into euros (or any fiat) or use them to pay for goods or services. Trading BTC for ETH, or moving through stablecoins, defers the tax entirely — you are simply rearranging assets, and the gain is only measured when you finally step back into fiat. This is why French traders can rebalance freely without triggering a tax bill on every move." },
    { type: "ul", items: [
      "Taxable: selling crypto for euros, or spending crypto on goods or services.",
      "Not taxable: crypto-to-crypto swaps, including through stablecoins.",
      "Not taxable: buying and holding, or moving crypto between your own wallets.",
    ] },

    { type: "h2", text: "The 30% flat tax (PFU)" },
    { type: "p", text: "Gains realised on cash-out are taxed under the prélèvement forfaitaire unique (PFU), the flat tax: 30% in total, made up of 12.8% income tax and 17.2% social contributions. It is a single rate regardless of how large the gain is, which makes it simple and, for higher earners, often favourable. (Note: reports indicate the flat tax may rise to around 31.4% for 2026 disposals as social contributions increase — confirm the exact figure on impots.gouv.fr for the year you are filing.)" },
    { type: "p", text: "You can instead elect the progressive income tax scale (barème progressif) on your return, waiving the 12.8% flat income portion in favour of your marginal rate. The 17.2% social contributions still apply either way. Electing the scale only helps lower-income taxpayers, and the choice applies to all your investment income for the year, so weigh it carefully." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The €305 exemption" },
    { type: "p", text: "If your total crypto disposal proceeds for the year stay under €305, your gains are exempt from tax. It is a small threshold aimed at trivial activity, and it is measured on total annual sale proceeds, not on the gain — cash out more than €305 across the year and the exemption is gone, with the whole gain assessed under the flat tax." },

    { type: "h2", text: "The portfolio-wide gain formula" },
    { type: "p", text: "France does not calculate the gain on a single coin in isolation. It uses a proportional, whole-portfolio method. When you cash out, the taxable gain is the sale price minus a slice of your total acquisition cost, weighted by how much of your portfolio you sold:" },
    { type: "callout", text: "Taxable gain = Sale price − (Total acquisition cost of the whole portfolio × Sale price ÷ Total value of the whole portfolio at the moment of sale). You need the euro value of your entire crypto holding at each cash-out — the single most laborious part of filing in France." },
    { type: "p", text: "Because the formula depends on your total portfolio value at each disposal, keeping a running record of every acquisition cost and the market value of everything you hold is essential. Portfolio-tracking software is close to mandatory for anyone with more than a handful of transactions." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Professional and habitual traders" },
    { type: "p", text: "The flat tax is for occasional (private) investors, which is how most people are classified — the French tax authority looks at the amounts, tools, frequency and organisation of your activity. If your trading is deemed habitual or professional, the rules changed from 1 January 2023: such activity is taxed as non-commercial profits (bénéfices non commerciaux, BNC) on the progressive income scale up to 45%, rather than under the flat tax. Mining income is also taxed as BNC. The line is judged case by case, so get advice if you trade at scale." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "The declaration trap: form 3916-bis" },
    { type: "p", text: "This catches more French crypto holders than the tax itself. If you hold accounts on foreign exchanges — Binance, Coinbase, Kraken and virtually every major platform count as foreign — you must declare each one annually on form 3916-bis, even if you made no gains and owe nothing. The penalty for not declaring is €750 per undeclared account, rising to €1,500 per account where the account value exceeds €50,000." },
    { type: "ul", items: [
      "Form 2042 — your main income tax return.",
      "Form 2086 — the detail of each taxable disposal and the gain calculation.",
      "Form 3916-bis — a declaration of every foreign crypto account you held during the year.",
    ] },

    { type: "h2", text: "Reporting, deadlines and DAC8" },
    { type: "p", text: "The tax year is the calendar year, and the income tax return is filed online in the spring following the year (typically May–June, with dates varying by department). From 1 January 2026 the EU-wide DAC8 framework — Europe's version of the OECD Crypto-Asset Reporting Framework — requires crypto service providers to report user and transaction data to tax authorities automatically. Combined with the 3916-bis obligation, the message is clear: the French administration is building a complete picture of who holds what." },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "France rewards traders who stay in crypto and only taxes the exit — a genuinely favourable quirk if you rebalance often. The catch is the paperwork: the portfolio-wide formula demands complete records, and the 3916-bis account declaration is a separate, easily-missed obligation with real penalties. Track everything, declare your foreign accounts, and the flat 30% on cash-out is straightforward." },
  ],
  faq: [
    { q: "Is crypto-to-crypto trading taxed in France?", a: "No. France only taxes gains when you convert crypto to fiat (euros) or spend it on goods or services. Swapping one crypto for another, including via stablecoins, is not a taxable event — the gain is deferred until you cash out." },
    { q: "What is the crypto tax rate in France?", a: "For occasional investors, a 30% flat tax (PFU): 12.8% income tax plus 17.2% social contributions, regardless of the gain size. You can instead elect the progressive income scale, which only benefits lower earners. Reports suggest a rise toward 31.4% for 2026 — confirm the current figure before filing." },
    { q: "What is the €305 crypto exemption in France?", a: "If your total crypto disposal proceeds for the year are under €305, the gains are exempt. It's measured on total annual sale proceeds, not on the gain, and exceeding it makes the whole gain taxable." },
    { q: "Do I have to declare my crypto exchange accounts in France?", a: "Yes. Accounts on foreign exchanges must be declared each year on form 3916-bis, even with no gains. The penalty is €750 per undeclared account, or €1,500 where the account value exceeds €50,000." },
    { q: "How is the crypto capital gain calculated in France?", a: "With a portfolio-wide formula: the gain is the sale price minus your total acquisition cost weighted by the share of your portfolio sold (total cost × sale price ÷ total portfolio value at the time of sale). You need your whole portfolio's value at each cash-out." },
    { q: "Are professional crypto traders taxed differently in France?", a: "Yes. Habitual or professional activity is taxed on the progressive income scale as non-commercial profits (BNC) up to 45%, following rules that changed from 1 January 2023, rather than under the 30% flat tax. Mining income is also BNC." },
  ],
};

export default guide;
