import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-brazil",
  affiliate: "tax",
  title: "Crypto Tax in Brazil: The Flat 17.5% Rule and the End of the R$35,000 Exemption",
  description:
    "Brazil scrapped its tiered system and monthly exemption. From 2026 a flat 17.5% applies to all crypto gains — including self-custody and offshore wallets. Here is what changed and how it works.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Criptoativos — declarações e demonstrativos",
      publisher: "Receita Federal",
      url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/criptoativos",
    },
  ],
  seo: {
    keywords: [
      "crypto tax brazil",
      "imposto criptomoedas brasil",
      "brazil 17.5% crypto tax",
      "brazil crypto R$35000 exemption",
      "brazil offshore crypto tax",
      "brazil crypto tax 2026",
    ],
    description:
      "Brazil crypto tax guide: the new flat 17.5% on all crypto gains from 2026, the removed R$35,000 monthly exemption, the old tiered 15%–22.5% rates, offshore and self-custody rules, and reporting.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. Brazil's crypto rules changed via Provisional Measure 1,303 (June 2025) and provisional measures can still be amended in Congress; personal circumstances vary. Check gov.br/receitafederal or a Brazilian contador before you file." },

    { type: "p", text: "Brazil has just rewritten its crypto tax rules, and the change is significant for retail investors. The old system rewarded small traders with a generous monthly exemption and taxed larger gains on a rising scale. The new system, taking effect from 2026, sweeps that away in favour of a single flat rate on everything — and explicitly reaches self-custody and offshore wallets that some investors assumed were out of reach." },

    { type: "h2", text: "The old regime (through 2025)" },
    { type: "p", text: "Until the change, individual investors enjoyed a monthly exemption: if your total crypto sales in a calendar month were R$35,000 or less, the gains were tax-free. Above that, gains were taxed on a progressive scale — 15% up to R$5 million, 17.5% from R$5–10 million, 20% from R$10–30 million and 22.5% above R$30 million. Separately, crypto and financial assets held offshore came into a 15% flat charge under the 2023 offshore-assets law." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "The new regime: a flat 17.5% from 2026" },
    { type: "p", text: "Provisional Measure 1,303, published on 11 June 2025, introduces a unified framework for financial investments and crypto assets. From 1 January 2026, crypto gains are taxed at a flat 17.5%, and the R$35,000 monthly exemption is removed. All realised gains become taxable at that single rate, regardless of size." },
    { type: "ul", items: [
      "The R$35,000 monthly exemption for retail investors is gone — small traders now pay from the first real of gain.",
      "The rule explicitly covers gains on crypto held in self-custody wallets and on offshore platforms, not just domestic exchanges.",
      "The R$35,000 figure survives only as a monthly reporting threshold for certain offshore transactions, not as a tax exemption.",
      "Gains are now assessed and reported on a quarterly basis.",
    ] },
    { type: "callout", text: "The headline for retail is bittersweet: 17.5% is lower than the old top tiers (up to 22.5%), but the loss of the R$35,000 monthly exemption means many small investors who previously paid nothing now pay 17.5% on every gain." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Winners and losers" },
    { type: "p", text: "The flat rate reshuffles who pays what. Large investors whose gains once fell into the 20% or 22.5% tiers benefit from the lower 17.5%. Small, active retail traders who stayed under R$35,000 a month — and therefore paid no tax — are the clear losers, now taxed on everything. And anyone who assumed self-custody or an offshore exchange kept them outside the system now finds those explicitly in scope." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "Crypto received as income" },
    { type: "p", text: "The 17.5% rate is for capital gains on disposals. Crypto received as income — mining rewards, staking where it functions as income, or being paid in crypto — is treated as ordinary income and taxed at Brazil's standard progressive income tax rates, separately from the flat capital gains charge. As elsewhere, receiving crypto as income and later selling it are two distinct taxable moments." },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "Crypto holdings are declared in the annual income tax return (DIRPF), typically filed around March–May for the prior year.",
      "Under the new framework, gains are calculated and reported quarterly rather than monthly.",
      "Brazilian exchanges report user transactions to Receita Federal, and offshore holdings must be disclosed — keep detailed records of every disposal in reais.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Brazil has traded a tiered system with a real retail exemption for a simpler, broader flat tax. From 2026, plan on 17.5% of every realised crypto gain — whether the coins sit on a Brazilian exchange, in your own wallet, or on an offshore platform. Because the rules arrived by provisional measure and can still be adjusted in Congress, confirm the final form for the year you are filing before relying on any specific figure." },
  ],
  faq: [
    { q: "What is the crypto tax rate in Brazil in 2026?", a: "A flat 17.5% on all realised crypto gains, introduced by Provisional Measure 1,303 and effective from 1 January 2026. It replaced the old tiered 15%–22.5% scale." },
    { q: "Is the R$35,000 monthly crypto exemption still available in Brazil?", a: "No. The monthly exemption that let investors sell up to R$35,000 tax-free was removed from 2026. The R$35,000 figure now survives only as a monthly reporting threshold for some offshore transactions, not as a tax exemption." },
    { q: "Does Brazil tax crypto held offshore or in self-custody?", a: "Yes. The new flat 17.5% regime explicitly covers gains on crypto in self-custody wallets and on offshore platforms, not just domestic exchanges." },
    { q: "How were crypto gains taxed in Brazil before 2026?", a: "On a progressive scale above a R$35,000 monthly sales exemption: 15% up to R$5M, 17.5% to R$10M, 20% to R$30M and 22.5% above R$30M, with a separate 15% charge on offshore assets." },
    { q: "How is crypto income taxed in Brazil?", a: "Crypto received as income — mining, staking as income, or payment in crypto — is taxed at standard progressive income tax rates, separately from the 17.5% flat capital gains rate on disposals." },
  ],
};

export default guide;
