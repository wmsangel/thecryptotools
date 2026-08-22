import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-india",
  affiliate: "tax",
  title: "Crypto Tax in India: The 30% Flat Tax, 1% TDS and No Loss Offset",
  description:
    "India runs one of the world's harshest crypto tax regimes: a flat 30% on every gain, a 1% TDS on each transfer, and no way to offset losses. Here is exactly how Sections 115BBH and 194S work.",
  readingMinutes: 8,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "Section 115BBH — tax on income from virtual digital assets",
      publisher: "Income Tax Department",
      url: "https://www.incometaxindia.gov.in/w/section-115bbh",
    },
  ],
  seo: {
    keywords: [
      "crypto tax india",
      "30% crypto tax india",
      "1% tds crypto",
      "section 115bbh",
      "section 194s tds",
      "vda tax india",
      "schedule vda itr",
    ],
    description:
      "India crypto tax guide: the flat 30% tax on VDA gains under Section 115BBH, the 1% TDS under Section 194S, why losses can't be offset or carried forward, the cess, and Schedule VDA reporting.",
  },
  relatedTools: ["crypto-tax-calculator", "profit-calculator", "average-entry-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Indian VDA tax rules are strict and evolving; personal circumstances vary. Check incometax.gov.in or a chartered accountant before you file." },

    { type: "p", text: "India taxes crypto — officially 'Virtual Digital Assets' (VDAs) — under some of the toughest rules anywhere. There is no distinction between long-term and short-term, no income slab benefit, and almost no relief for losses. If you trade crypto in India, understanding three provisions — the 30% tax, the 1% TDS and the no-loss-offset rule — matters more than any strategy." },

    { type: "h2", text: "The flat 30% tax (Section 115BBH)" },
    { type: "p", text: "Introduced in the 2022 Union Budget, Section 115BBH taxes income from the transfer of VDAs at a flat 30%, regardless of your income slab, how long you held the asset, or whether the gain is capital or business in nature. On top of the 30% sit a 4% health and education cess and any applicable surcharge, pushing the effective rate above 30% for most, and higher still for large incomes." },
    { type: "callout", text: "Only the cost of acquisition is deductible. You cannot deduct trading fees, interest, infrastructure or any other expense against your crypto gains — a rule that makes India's regime far harsher than the headline 30% suggests." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The 1% TDS (Section 194S)" },
    { type: "p", text: "Since 1 July 2022, Section 194S imposes a 1% Tax Deducted at Source on the transfer of VDAs. It is deducted on the transaction value — not the profit — every time you sell or swap, above small annual thresholds. TDS is not an extra tax; it is an advance credit you reconcile against your final liability when you file. But because it is charged on turnover rather than gain, active traders find a meaningful slice of their capital continuously locked up in TDS, which is precisely its intended chilling effect on high-frequency trading." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "No loss offset — the rule that hurts most" },
    { type: "p", text: "This is the provision that surprises people the most. Losses from VDAs cannot be set off against gains from other VDAs, let alone against other income. And they cannot be carried forward to future years. Each gain is taxed at 30% on its own; each loss simply disappears." },
    { type: "ul", items: [
      "A ₹100,000 gain on Bitcoin and a ₹100,000 loss on Ethereum in the same year: you still pay 30% on the ₹100,000 gain, and the loss gives you nothing.",
      "A losing year cannot reduce a future winning year — there is no carry-forward.",
      "This makes gross, per-transaction profitability what matters; netting across your portfolio, which most tax systems allow, does not exist here.",
    ] },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "What counts, and gifts" },
    { type: "p", text: "VDAs cover cryptocurrencies, tokens and NFTs. Taxable transfers include selling crypto for rupees, swapping one crypto for another, and spending it. Crypto received as a gift is generally taxable in the recipient's hands at market value (subject to limited exemptions such as gifts from close relatives). As always, receiving crypto as income — from work, mining or similar — is income at market value when received, separate from the 30% transfer tax on later disposal." },

    { type: "h2", text: "Reporting and deadlines" },
    { type: "ul", items: [
      "The financial year runs 1 April to 31 March. Crypto is reported in 'Schedule VDA' of the income tax return (ITR-2 for capital gains, ITR-3 for business income).",
      "For most individuals (non-audit cases), the return is due by 31 July following the financial year.",
      "Reconcile your TDS: the 1% deducted through the year appears in your Form 26AS / AIS and is credited against your final tax. Keep records of every transfer's value.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "India's message to crypto traders is unambiguous: gains are taxed at a flat 30% with a 4% cess, every transfer bleeds 1% in TDS, and losses give you nothing back. There is no long-term discount and no netting. The practical takeaways are to trade far less (each swap triggers TDS and a standalone 30% on any gain), to keep meticulous records for TDS reconciliation, and to never assume a losing trade will soften a winning one — in India, it won't." },
  ],
  faq: [
    { q: "What is the crypto tax rate in India?", a: "A flat 30% on gains from transferring Virtual Digital Assets under Section 115BBH, plus a 4% health and education cess and any surcharge. It applies regardless of income slab or holding period." },
    { q: "What is the 1% TDS on crypto in India?", a: "Under Section 194S, a 1% Tax Deducted at Source applies to the transaction value of every VDA transfer since 1 July 2022 (above small thresholds). It's an advance credit against your final tax, not an extra tax, but it's charged on turnover, not profit." },
    { q: "Can I offset crypto losses in India?", a: "No. VDA losses cannot be set off against VDA gains, against other income, and cannot be carried forward to future years. Each gain is taxed at 30% on its own and losses provide no relief." },
    { q: "Can I deduct expenses from crypto gains in India?", a: "Only the cost of acquisition is deductible. Trading fees, interest, infrastructure and other costs cannot be deducted, which makes the effective burden heavier than the 30% headline." },
    { q: "How do I report crypto in my Indian tax return?", a: "Through 'Schedule VDA' in the income tax return — ITR-2 for capital gains or ITR-3 for business income. The financial year is 1 April to 31 March, and most individuals file by 31 July." },
  ],
};

export default guide;
