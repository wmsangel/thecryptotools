import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-italy",
  title: "Crypto Tax in Italy: The 26% Rate Rising to 33%, Plus the 0.2% Wealth Tax",
  description:
    "Italy taxes crypto gains at a flat 26% for 2025, rising to 33% from 2026 as the €2,000 exemption disappears — and levies a separate 0.2% wealth tax on holdings. Here is how it all fits together.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Circolare n. 30/E del 27 ottobre 2023 — trattamento fiscale delle cripto-attività",
      publisher: "Agenzia delle Entrate",
      url: "https://www.agenziaentrate.gov.it/portale/documents/20143/5589638/Circolare+criptoattivita+del+27+ottobre+2023.pdf",
    },
  ],
  seo: {
    keywords: [
      "crypto tax italy",
      "tasse criptovalute italia",
      "italy crypto capital gains 33%",
      "imposta sostitutiva crypto",
      "italy crypto wealth tax 0.2%",
      "crypto tax italy 2026",
    ],
    description:
      "Italy crypto tax guide: the 26% substitute tax on gains rising to 33% from 2026, the removed €2,000 exemption, the optional 18% step-up, the 0.2% wealth tax on holdings and RW reporting.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. Italian rules changed with the 2023 and 2025 Budget Laws and continue to evolve; personal circumstances vary. Check agenziaentrate.gov.it or a commercialista before you file." },

    { type: "p", text: "Italy built a dedicated crypto tax regime in the 2023 Budget Law and then sharpened it in the 2025 Budget Law. Two charges matter for a holder: a substitute tax on your gains, and a small annual wealth tax on what you hold. The rates are moving, and the taxpayer-friendly €2,000 buffer is on its way out — so knowing which year you are filing for matters more than usual." },

    { type: "h2", text: "The substitute tax: 26% now, 33% from 2026" },
    { type: "p", text: "Crypto capital gains are taxed as 'other income' (redditi diversi) through a flat substitute tax (imposta sostitutiva). For gains realised in 2025 the rate is 26%. From 1 January 2026 it rises to 33%. One carve-out: euro-denominated e-money tokens (MiCAR-compliant stablecoins) stay at 26% even after 2026." },
    { type: "callout", text: "The €2,000 annual exemption that applied for 2023–2025 is abolished from 2026. That means from 2026 even a €1 gain is taxable — the small-holder buffer is gone at the same moment the rate jumps to 33%." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The optional 18% step-up" },
    { type: "p", text: "Italy offered a way to soften the transition: an optional 18% substitute tax to step up (rivalutare) the tax basis of your holdings to their value on 1 January 2025. Paying the 18% on the stepped-up value resets your cost basis higher, reducing the taxable gain on future disposals. Whether it pays off depends on your unrealised gains and when you plan to sell — it is a planning tool, not an automatic win, and it has its own election deadline." },

    { type: "h2", text: "Which disposals are taxable" },
    { type: "p", text: "The taxable event is converting crypto into fiat, spending it, or exchanging it for an asset with different characteristics. Crucially, a swap between two cryptoassets with the same characteristics and functions is not, by itself, a taxable event — a nuance similar in spirit to Portugal and France, though Italy frames it around the assets' nature rather than a blanket crypto-to-crypto rule. Converting crypto to a stablecoin or to fiat is a disposal." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "The 0.2% wealth tax on holdings" },
    { type: "p", text: "Separate from the tax on gains, Italy levies an annual wealth tax of 0.2% on the value of your crypto, based on the year-end (31 December) fair-market value in euros. For crypto held directly or through foreign intermediaries this is the imposta sul valore delle cripto-attività (an IVAFE-style charge); crypto held with an Italian intermediary faces an equivalent 0.2% stamp duty. It applies whether or not you sold anything — a resident holding €100,000 of crypto at year-end owes €200, regardless of activity." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Staking, mining and rewards" },
    { type: "p", text: "Rewards such as staking and mining are generally taxed as income at their euro value when received, separate from the substitute tax on capital gains. The later disposal of those reward tokens is then a capital gains event under the substitute-tax rules. As always, receiving is one taxable moment and selling is another." },

    { type: "h2", text: "Reporting, RW and deadlines" },
    { type: "ul", items: [
      "The tax year is the calendar year. Gains are reported in the Modello Redditi (quadro RT), and holdings for the wealth tax and monitoring are declared in quadro RW.",
      "Quadro RW is the foreign-asset monitoring section — crypto held outside the Italian banking system is declared here, and it drives the 0.2% wealth tax.",
      "Keep records of acquisition and disposal values in euros, plus the 31 December valuation for the wealth tax. From 2026 the EU-wide DAC8 framework adds automatic provider reporting.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Italy's crypto tax is getting heavier: 26% on 2025 gains becomes 33% in 2026, and the €2,000 exemption vanishes at the same time. Layered on top is the 0.2% annual wealth tax you owe just for holding. The step-up option and the same-characteristics swap rule offer some planning room, but the direction of travel is clear — track your euro values, note your year-end balance for the wealth tax, and factor the higher 2026 rate into any sale you are timing." },
  ],
  faq: [
    { q: "What is the crypto tax rate in Italy?", a: "A flat substitute tax of 26% on gains realised in 2025, rising to 33% from 1 January 2026. Euro-denominated MiCAR-compliant stablecoins stay at 26% even after 2026." },
    { q: "Is there still a €2,000 exemption on crypto gains in Italy?", a: "Only through 2025. The €2,000 annual exemption is abolished from 2026, so from then even a €1 gain is taxable — at the higher 33% rate." },
    { q: "Does Italy have a crypto wealth tax?", a: "Yes. A 0.2% annual tax applies to the year-end (31 December) value of your crypto — the imposta sul valore delle cripto-attività for foreign-held or directly-held crypto, or an equivalent 0.2% stamp duty via Italian intermediaries. It's owed whether or not you sold." },
    { q: "Are crypto-to-crypto swaps taxable in Italy?", a: "A swap between two cryptoassets with the same characteristics and functions is not itself a taxable event. Converting crypto to fiat, to a stablecoin, or to an asset of different nature is a taxable disposal." },
    { q: "What is the 18% step-up option in Italy?", a: "An optional 18% substitute tax that lets you reset (step up) the cost basis of your holdings to their 1 January 2025 value, lowering future taxable gains. It's a planning election with its own deadline, worthwhile only in some situations." },
  ],
};

export default guide;
