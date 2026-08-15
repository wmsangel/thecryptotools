import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-ireland",
  title: "Crypto Tax in Ireland: 33% CGT, the €1,270 Exemption and the 15 December Trap",
  description:
    "Ireland charges 33% Capital Gains Tax on crypto disposals after a €1,270 annual exemption — but the payment deadline comes almost a year before the return is due. Here is how the Irish system actually works.",
  readingMinutes: 8,
  updatedAt: "2026-08-02",
  reviewedAt: "2026-08-02",
  sources: [
    {
      label:
        "Crypto-assets",
      publisher: "Revenue",
      url: "https://www.revenue.ie/en/companies-and-charities/financial-services/crypto-assets/index.aspx",
    },
  ],
  seo: {
    keywords: [
      "crypto tax ireland",
      "ireland cryptocurrency tax",
      "cgt on crypto ireland",
      "ireland crypto capital gains tax",
      "revenue crypto tax ireland",
      "bitcoin tax ireland",
    ],
    description:
      "Ireland crypto tax guide: 33% CGT, the €1,270 annual personal exemption, the 15 December payment deadline versus the 31 October return, when crypto is trading income instead, and the non-dom remittance trap.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "profit-calculator", "average-entry-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Figures reflect Revenue guidance and rates current for 2026. Your circumstances matter — check revenue.ie or a Chartered Tax Adviser before you file." },

    { type: "p", text: "Ireland has no bespoke crypto tax law, and Revenue says so explicitly: the existing rules simply apply. Its Tax and Duty Manual on crypto-assets states that 'the tax treatment of transactions involving crypto-assets depends on the nature of the transaction and the circumstances of the person carrying it out.' In practice that means most Irish holders land in Capital Gains Tax at a flat 33% — a comparatively high headline rate, softened only by a small annual exemption. The part that catches people out is not the rate. It is the calendar." },

    { type: "h2", text: "The default: 33% Capital Gains Tax" },
    { type: "p", text: "For an ordinary investor, buying crypto and later disposing of it produces a chargeable gain taxed at 33%. Ireland does not distinguish between short-term and long-term holding — a coin held three weeks and a coin held nine years face the same rate. The gain is sales proceeds minus the cost of acquisition, calculated separately on each asset, disposal by disposal." },
    { type: "p", text: "A disposal is broader than a cash-out. Revenue's own worked example covers a taxpayer who 'used crypto-assets to purchase goods in a local café' and notes this 'is a disposal for CGT purposes upon which Dave must calculate the gain arising, declare the gain to Revenue by filing a tax return and pay any CGT arising.' Swapping one crypto for another is likewise a disposal — you do not need to touch euro for the tax to bite." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The €1,270 annual personal exemption — and its use-it-or-lose-it catch" },
    { type: "p", text: "Every individual gets an annual personal exemption: the first €1,270 of total chargeable gains in a year, after deducting losses, is exempt from CGT. It covers all assets combined, not crypto alone, and it is per person — a married couple has two." },
    { type: "p", text: "Revenue is blunt about the limitation: the exemption 'can only be used to reduce a chargeable gain.' If your gains for the year are €960, your exemption is capped at €960 and 'the remaining €310 cannot be used.' It does not create a loss, it does not roll into next year, and unused portions simply vanish on 31 December. For anyone sitting on unrealised gains, that is a small, quiet argument for realising about €1,270 of gain each year rather than letting it accumulate." },

    { type: "h2", text: "Losses: offset first, carry forward indefinitely" },
    { type: "p", text: "A loss on disposal can generally be deducted from chargeable gains in the same period. If losses exceed gains, the remainder carries forward to future periods for use against future chargeable gains. Note the ordering that Revenue's own example uses: losses come off first, and the €1,270 exemption is applied to what is left — which is why a big loss carry-forward can waste the exemption entirely in a given year." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "The deadline trap: pay in December, file the following October" },
    { type: "p", text: "This is the single most common Irish crypto mistake. Ireland splits the year into two CGT periods, and the tax is due long before the return is." },
    { type: "ul", items: [
      "Initial period — disposals from 1 January to 30 November: tax due on or before 15 December of the same year.",
      "Later period — disposals from 1 to 31 December: tax due on or before 31 January of the following year.",
      "The return declaring the gain is due on or before 31 October of the following year (with an extension where filed through ROS).",
    ] },
    { type: "callout", text: "Revenue's example: a gain arising on 1 May 2024 must be paid by 15 December 2024, but the return covering it is not due until 31 October 2025. Sell in spring, and you owe the money that same December — roughly ten months before you file anything." },
    { type: "p", text: "Which form you use depends on your situation: Form CG1 if you do not normally file annual returns (paper only), Form 12 for PAYE taxpayers, Form 11 if you are self-assessed. PAYE-only employees are not exempt from this: Revenue states that where such an individual has a gain on a crypto disposal subject to CGT, 'that individual will have to file a return.'" },

    { type: "h2", text: "When crypto is income instead of a capital gain" },
    { type: "p", text: "Not everyone lands in CGT. Whether you are carrying on a trade of dealing in crypto-assets is, in Revenue's words, 'a question of fact' — and it warns that describing your activity as a 'trade' in the everyday sense does not make it one in the tax sense. Where it genuinely is a trade, profits are income, taxed at 20% or 40% depending on your rate band (€44,000 standard rate band for a single person in 2026), plus USC and PRSI — a combined marginal rate above 50% for higher earners." },
    { type: "p", text: "Mining and staking rewards, and crypto received as pay, are income rather than capital. Where salary is paid in crypto, Revenue says the value 'is generally the Euro amount attaching to the crypto-asset at the time the payment is made' and 'returns to Revenue must be shown in Euro amounts.' Crypto given to an employee free or at a discount falls under normal benefit-in-kind rules." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "Valuation, records and the six-year rule" },
    { type: "p", text: "Revenue acknowledges the practical problem: crypto values 'may vary between exchanges' and 'there is not always a single exchange rate for crypto-assets,' so 'a reasonable effort should be made to use an appropriate valuation for the transaction in question.' Everything must be reported in euro." },
    { type: "p", text: "Records must be retained for six years — and this applies to PAYE-only taxpayers too. Revenue explicitly extends the rule to self-custody: where records 'are stored in a wallet or vault on a device such as a personal computer, mobile phone or similar device, these records, when requested, must be made available to Revenue.'" },

    { type: "h2", text: "Non-domiciled residents: the 'cloud' problem" },
    { type: "p", text: "Ireland's remittance basis is a genuine draw for non-domiciled residents — foreign gains are taxed only when brought into Ireland. But crypto sits awkwardly inside it, and Revenue has closed the gap deliberately." },
    { type: "p", text: "The statutory test asks whether assets are 'situated outside the State' — not merely whether they are absent from Ireland. Revenue's guidance draws the distinction sharply: 'where a crypto-asset exists on the cloud, it will not actually be situated anywhere and therefore, cannot be viewed as situated outside the State.' Where the situs is disputed, 'the onus is on the taxpayer to prove where the gain accrued,' and if it cannot be confirmed, the gain is taxable in Ireland on residency rules. Non-doms should not assume crypto gains fall outside the charge." },

    { type: "h2", text: "VAT and gifts" },
    { type: "ul", items: [
      "Exchanging crypto for traditional currency is VAT-exempt, following the CJEU's Hedqvist ruling that Bitcoin is a currency for VAT purposes.",
      "Selling goods or services for crypto still attracts VAT in the normal way, on the euro value at the time of supply.",
      "Mining income is generally outside the scope of VAT, as it is not an economic activity for VAT purposes.",
      "Crypto received as a gift or inheritance may create a Capital Acquisitions Tax liability, valued at the euro market value on the valuation date.",
    ] },

    { type: "h2", text: "CARF: Revenue is about to see the data" },
    { type: "p", text: "The OECD's Crypto-Asset Reporting Framework came into force across the EU from 1 January 2026, obliging crypto service providers to report user transaction data to tax authorities, with automatic cross-border exchange to follow. Undeclared Irish gains from 2026 onwards should be assumed visible to Revenue." },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Ireland is straightforward on rate and unforgiving on timing: 33% flat, a €1,270 exemption that expires each year if unused, and CGT payable on 15 December for anything sold between January and November — nearly a year before the return. Crypto-to-crypto swaps and spending crypto both count as disposals, records must survive six years including what sits in your own wallet, and non-doms should not count on the remittance basis for assets that live on the cloud." },
  ],
  faq: [
    { q: "What is the crypto tax rate in Ireland?", a: "Disposals are normally subject to Capital Gains Tax at a flat 33%, with no distinction between short-term and long-term holdings. If your activity amounts to a trade, profits are income instead — taxed at 20% or 40% plus USC and PRSI." },
    { q: "How much crypto profit is tax-free in Ireland?", a: "The first €1,270 of total chargeable gains each year, after losses, is exempt. It covers all assets combined, applies per person, and cannot be carried forward — if your gains are smaller than €1,270, the unused part is simply lost." },
    { q: "When do I pay CGT on crypto in Ireland?", a: "For disposals between 1 January and 30 November, tax is due by 15 December of the same year. For disposals in December, it is due by 31 January following. The return itself is only due by 31 October of the following year — so payment comes first." },
    { q: "Is swapping one crypto for another taxable in Ireland?", a: "Yes. A crypto-to-crypto swap is a disposal for CGT purposes, as is spending crypto on goods or services. Revenue's own guidance uses the example of paying for goods in a café, which triggers a chargeable gain calculation." },
    { q: "Do PAYE workers have to file for crypto gains in Ireland?", a: "Yes. Revenue states that a PAYE-only employee with a crypto gain subject to CGT will have to file a return, typically Form 12 through MyAccount, or Form CG1 if they do not otherwise file." },
    { q: "Can non-domiciled residents use the remittance basis for crypto in Ireland?", a: "Often not. The test is whether the asset is situated outside the State, and Revenue's position is that a crypto-asset existing on the cloud is not situated anywhere — so it cannot be treated as situated outside Ireland. The taxpayer bears the onus of proving where the gain accrued." },
  ],
};

export default guide;
