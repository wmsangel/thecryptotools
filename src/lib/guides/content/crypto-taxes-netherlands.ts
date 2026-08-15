import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-netherlands",
  title: "Crypto Tax in the Netherlands: Box 3 Wealth Tax, Not Capital Gains",
  description:
    "The Netherlands does not tax your crypto profits — it taxes a deemed return on what you hold on 1 January. Here is how Box 3 works, the 2026 tax-free allowance, actual-return claims and the big change coming in 2028.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Cryptobezittingen (zoals bitcoins)",
      publisher: "Belastingdienst",
      url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/werk-en-inkomen/content/cryptovaluta",
    },
    {
      label:
        "Moet ik aangifte doen en belasting betalen over mijn crypto's?",
      publisher: "Belastingdienst",
      url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/werk-en-inkomen/content/aangifte-doen-en-belasting-betalen-met-cryptos",
    },
  ],
  seo: {
    keywords: [
      "crypto tax netherlands",
      "box 3 crypto",
      "netherlands wealth tax crypto",
      "belasting crypto",
      "heffingsvrij vermogen crypto",
      "box 3 deemed return 2026",
    ],
    description:
      "Netherlands crypto tax guide: how Box 3 taxes a deemed return on assets rather than real gains, the 36% rate, the 2026 €59,357 tax-free allowance, the 1 January valuation date, actual-return claims and the 2028 reform.",
  },
  relatedTools: ["crypto-tax-calculator", "profit-calculator", "average-entry-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. Dutch Box 3 rules are in flux following court rulings and reform, and personal circumstances vary. Check belastingdienst.nl or speak to a Dutch tax adviser before you file." },

    { type: "p", text: "The Netherlands taxes crypto in a way that surprises almost everyone coming from a capital-gains country: it does not tax your actual profit at all. For private individuals, crypto is wealth, and it sits in Box 3 — the box for savings and investments. What matters is not what you gained or lost, but how much your assets were worth on one single day of the year." },

    { type: "h2", text: "Box 3: a tax on a deemed return, not real gains" },
    { type: "p", text: "Box 3 does not look at what you actually earned. Instead the tax office assumes a fixed percentage return on your assets — a deemed (fictitious) return — and taxes that. For 2025, investments including crypto carry a deemed return of 5.88%, and the Box 3 tax rate is 36%. Multiply those together and the effective annual tax works out to roughly 2.1% of the value of your crypto — whether it doubled, crashed or sat still." },
    { type: "callout", text: "This cuts both ways. In a bull year, paying tax on a deemed 5.88% while your crypto rose 200% is a bargain. In a bad year, being taxed on a deemed gain when you actually lost money feels punitive — which is exactly why the system is being reformed." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The 1 January valuation date" },
    { type: "p", text: "Box 3 is assessed on the value of your assets on 1 January of the tax year (the peildatum). You take the euro value of all your crypto at that single moment, add it to your other Box 3 assets — savings, shares, second properties — and that total drives the tax. What you do during the rest of the year does not change the Box 3 figure, though buying and selling obviously changes what you will hold next 1 January." },

    { type: "h2", text: "The tax-free allowance" },
    { type: "p", text: "Everyone gets a tax-free amount of Box 3 wealth (the heffingsvrij vermogen). For 2026 it is €59,357 per person, or €118,714 for fiscal partners who combine their allowances. Only assets above that threshold are drawn into the deemed-return calculation, so smaller holders may owe nothing at all. Note this is an allowance on total Box 3 wealth, not a crypto-specific exemption — your savings and investments share it." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Claiming your actual return when it is lower" },
    { type: "p", text: "The deemed-return system was challenged in court, and after a 2024 Supreme Court ruling the Netherlands now lets you file an actual-return declaration (Opgaaf Werkelijk Rendement) if your real return was lower than the deemed one — or negative. Under the transitional rules for 2025 to 2027, if your actual return is a loss, your Box 3 income for that year is set to €0. For crypto holders who had a bad year, this is the mechanism that stops you paying tax on a gain you never made — but you have to claim it, with evidence." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "When crypto lands in Box 1 instead" },
    { type: "p", text: "Box 3 is for ordinary investing. If your activity goes beyond normal asset management, it can fall into Box 1 as income, taxed at progressive rates far higher than the Box 3 effective rate. This can happen with professional or day-trading activity, mining or staking carried out as a business, or being paid in crypto for work. The threshold is 'more than normal asset management', which is fact-specific — most passive holders stay firmly in Box 3, but active operations should take advice." },

    { type: "h2", text: "The 2028 reform: from deemed to actual returns" },
    { type: "p", text: "The deemed-return model is on its way out. A new Box 3 system based on actual returns — taxing real capital growth and gains — is planned to start on 1 January 2028 (pushed back from an earlier 2027 target). Until then, the deemed-return method with the option to claim a lower actual return remains in force. Because the rules are genuinely mid-transition, the exact figures and mechanics for a given year should always be checked against the Belastingdienst for that year." },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "The tax year is the calendar year; the income tax return (aangifte) is generally due by 1 May of the following year, with extensions available.",
      "Report the 1 January euro value of all crypto in Box 3, alongside your other savings and investments.",
      "Keep records of that year-start valuation and, if you plan to claim a lower actual return, evidence of your real gains and losses across the year.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "For a long-term holder in a rising market, the Dutch system is quietly generous — you pay a small deemed-return tax rather than a big capital-gains bill. The keys are the 1 January snapshot (which you can plan around), the shared Box 3 allowance, and the right to declare your actual return when the deemed one overstates reality. And keep an eye on 2028, when the whole approach shifts to taxing real returns." },
  ],
  faq: [
    { q: "Does the Netherlands tax crypto capital gains?", a: "Not directly. For private individuals, crypto sits in Box 3 and is taxed on a deemed (assumed) return on its value, not on your actual profit or loss. There is no separate capital gains tax on crypto." },
    { q: "How much is Box 3 crypto tax in 2025?", a: "The deemed return for investments including crypto is 5.88% for 2025, taxed at 36% — an effective rate of roughly 2.1% of the asset value per year, applied to Box 3 wealth above the tax-free allowance." },
    { q: "What is the tax-free allowance for crypto in the Netherlands?", a: "The heffingsvrij vermogen is €59,357 per person for 2026 (€118,714 for fiscal partners). It's an allowance on total Box 3 wealth — savings and investments together — not a crypto-specific exemption." },
    { q: "Which day is my crypto valued for Box 3?", a: "1 January of the tax year (the peildatum). You use the euro value of your crypto on that single date; activity later in the year doesn't change the Box 3 figure for that year." },
    { q: "What if my crypto lost money — do I still pay Box 3 tax?", a: "You can file an actual-return declaration (Opgaaf Werkelijk Rendement). Under the transitional rules for 2025–2027, if your actual return is a loss, your Box 3 income for that year is set to €0 — but you must claim it with evidence." },
    { q: "Is the Dutch crypto tax system changing?", a: "Yes. A new Box 3 system based on actual returns — taxing real capital gains and growth — is planned for 1 January 2028, replacing the deemed-return method. Until then the current system with the actual-return option applies." },
  ],
};

export default guide;
