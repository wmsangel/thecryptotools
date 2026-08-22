import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-spain",
  affiliate: "tax",
  title: "Crypto Tax in Spain: Savings-Income Rates, Swaps and Modelo 721",
  description:
    "Spain taxes crypto gains as savings income on a 19%–28% sliding scale, treats every swap as a disposal, and makes you declare foreign holdings on Modelo 721. Here is how the whole system fits together.",
  readingMinutes: 9,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Modelo 721 — declaración de monedas virtuales en el extranjero",
      publisher: "Agencia Tributaria",
      url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/GI44.shtml",
    },
  ],
  seo: {
    keywords: [
      "crypto tax spain",
      "impuesto criptomonedas",
      "spain crypto savings income tax",
      "modelo 721 crypto",
      "spain crypto capital gains rates",
      "hacienda crypto",
    ],
    description:
      "Spain crypto tax guide: the 19%–28% savings-income rates on gains, why crypto-to-crypto swaps are taxable, staking income, the Modelo 721 foreign-holdings declaration and IRPF filing.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Spanish (AEAT) rules and regional variations apply, and personal circumstances differ. Check agenciatributaria.es or speak to a Spanish asesor fiscal before you file." },

    { type: "p", text: "Spain treats crypto as a taxable asset and has, over the last few years, built one of Europe's more thorough reporting regimes around it. For an investor, two things define the experience: gains are taxed as savings income on a progressive scale, and Spain expects to know what you hold — including on foreign platforms. Get both the tax and the disclosure right and it is manageable; miss the disclosure and the penalties bite." },

    { type: "h2", text: "Gains are savings income (19%–28%)" },
    { type: "p", text: "Capital gains on crypto go into the savings tax base (base del ahorro) and are taxed on a sliding scale, not at your general income rate. For 2025 (filed in 2026) the bands are:" },
    { type: "ul", items: [
      "19% on the first €6,000 of savings income.",
      "21% on €6,000 to €50,000.",
      "23% on €50,000 to €200,000.",
      "27% on €200,000 to €300,000.",
      "28% on anything above €300,000.",
    ] },
    { type: "p", text: "The gain is calculated per disposal as proceeds minus acquisition cost, and Spain applies FIFO (first-in, first-out) to decide which coins you sold when you hold several bought at different prices. Crypto gains are pooled with your other savings income (interest, dividends, other capital gains) to find which band applies." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Every swap is a disposal" },
    { type: "p", text: "Unlike Portugal or France, Spain treats a crypto-to-crypto exchange as a taxable disposal (a permuta). Trading BTC for ETH crystallises a gain or loss on the BTC at its euro market value at the moment of the swap, even though no euros changed hands. This means active traders generate a taxable event on every trade, and need the euro value of both sides at each swap — a significant record-keeping burden." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Staking, airdrops and mining" },
    { type: "p", text: "Rewards are generally taxed as income at their euro value when received, rather than as savings-base capital gains. Staking and lending yield are typically treated as investment income; mining carried on as an economic activity is taxed as business income and can bring obligations like registering and, potentially, VAT considerations. As elsewhere, receiving a reward is taxed as income, and the later disposal of those tokens is a separate capital gains event." },

    { type: "h2", text: "Losses" },
    { type: "p", text: "Capital losses on crypto offset capital gains in the savings base, and a limited portion can offset other savings income (such as interest and dividends) within annual limits, with unused losses carried forward for four years. This is far more generous than India's no-offset regime, and makes reporting a loss year worthwhile to bank the relief for future gains." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "The Modelo 721 disclosure" },
    { type: "p", text: "Spain requires a separate informational declaration of crypto held on non-Spanish platforms. If the aggregate value of your crypto on foreign exchanges or wallets exceeds €50,000, you must file Modelo 721, generally between 1 January and 31 March for the previous year's year-end holdings. It is a disclosure, not a tax — but failing to file it carries penalties. Note that the older Modelo 720 (for foreign financial assets) does not apply to crypto; Modelo 721 is the crypto-specific form, introduced for holdings from 2023 onward." },
    { type: "callout", text: "Modelo 721 is about where your crypto sits, not whether you sold. You can owe no tax for the year and still be obliged to file it if your foreign-held crypto tops €50,000. Spanish exchanges also report your holdings to the AEAT directly, so the tax office increasingly has both sides." },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "Gains and income go in the annual IRPF return (Modelo 100), filed roughly April to 30 June for the previous calendar year — so 2025 activity is filed by 30 June 2026.",
      "Modelo 721 (foreign holdings over €50,000) is filed separately, generally by 31 March.",
      "Wealth tax (Impuesto sobre el Patrimonio) can also apply to large holdings depending on your autonomous community — a separate charge from income tax.",
      "From 2026 the EU-wide DAC8 framework adds automatic reporting by crypto service providers on top of Spain's existing disclosures.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Spain's tax rates on crypto gains are moderate — 19% to 28% — and losses get reasonable relief. The real work is the record-keeping: every swap is a taxable disposal under FIFO, so active trading generates a long list of events, and if your foreign-held crypto exceeds €50,000 you have a Modelo 721 disclosure to file whether or not you owe tax. Track euro values at every transaction, watch the €50,000 threshold, and the filing is routine." },
  ],
  faq: [
    { q: "What is the crypto tax rate in Spain?", a: "Crypto gains are savings income taxed on a sliding scale for 2025: 19% up to €6,000, 21% to €50,000, 23% to €200,000, 27% to €300,000 and 28% above €300,000." },
    { q: "Are crypto-to-crypto swaps taxable in Spain?", a: "Yes. Spain treats a crypto-to-crypto exchange as a disposal (permuta), so you realise a gain or loss on the coin you traded away at its euro value at the time — even though no euros were involved." },
    { q: "What is Modelo 721?", a: "A separate informational declaration of crypto held on non-Spanish platforms. If your foreign-held crypto exceeds €50,000 in aggregate, you must file it (generally by 31 March), even if you owe no tax. Modelo 720 does not apply to crypto." },
    { q: "Can I offset crypto losses in Spain?", a: "Yes. Capital losses offset capital gains in the savings base, a limited share can offset other savings income within annual limits, and unused losses carry forward for four years." },
    { q: "How are staking rewards taxed in Spain?", a: "Generally as income at their euro value when received. Staking and lending yield are usually investment income; business-scale mining is taxed as an economic activity. The later disposal of the reward tokens is a separate capital gains event." },
    { q: "When do I file crypto taxes in Spain?", a: "Gains go in the annual IRPF return (Modelo 100), filed by 30 June for the prior calendar year. Modelo 721 for large foreign holdings is filed separately, generally by 31 March." },
  ],
};

export default guide;
