import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-south-africa",
  title: "Crypto Tax in South Africa: 18% Effective CGT or 45% Income — SARS Decides Which",
  description:
    "SARS taxes crypto either as capital gains (40% inclusion, 18% maximum effective rate) or as ordinary income at up to 45%. Which one applies is a question of intention — and the annual exclusion just rose to R50,000.",
  readingMinutes: 8,
  updatedAt: "2026-08-02",
  reviewedAt: "2026-08-02",
  sources: [
    {
      label:
        "Crypto assets and tax",
      publisher: "SARS",
      url: "https://www.sars.gov.za/individuals/crypto-assets-and-tax/",
    },
    {
      label:
        "Capital Gains Tax",
      publisher: "SARS",
      url: "https://www.sars.gov.za/types-of-tax/capital-gains-tax/",
    },
  ],
  seo: {
    keywords: [
      "crypto tax south africa",
      "sars crypto tax",
      "capital gains tax crypto south africa",
      "bitcoin tax south africa",
      "crypto asset tax sars",
      "south africa crypto tax rate",
    ],
    description:
      "South Africa crypto tax guide: SARS's capital-versus-revenue test, the 40% inclusion rate and 18% maximum effective CGT, the new R50,000 annual exclusion, income tax to 45%, and SARS's third-party data.",
  },
  relatedTools: ["crypto-tax-calculator", "tax-loss-harvesting-calculator", "profit-calculator", "average-entry-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "cta", title: "Do this with your own numbers", text: "Drop an exchange CSV into the free tax report generator and it applies this country's cost-basis method, holding-period rules and allowance automatically. It runs in your browser — nothing is uploaded.", href: "/crypto-tax-report", label: "Open the tax report generator" },
    { type: "callout", text: "General information, not tax advice. Reflects SARS guidance and rates for the 2027 tax year (1 March 2026 – 28 February 2027). Check sars.gov.za or a South African tax practitioner before you file." },

    { type: "p", text: "South Africa's crypto tax question is not 'what is the rate' — it is 'which regime am I in.' SARS can treat the same disposal as a capital gain with a maximum effective rate of 18%, or as ordinary revenue taxed at up to 45%. That is a difference of 27 percentage points on identical economics, decided by facts about your intention rather than by a formula. Everything else follows from that fork." },

    { type: "h2", text: "SARS's starting position" },
    { type: "p", text: "SARS does not treat crypto as currency. A crypto asset is defined as 'a digital representation of value that is not issued by a central bank' but is instead 'traded, transferred and stored electronically' — an intangible asset for tax purposes. The terminology deliberately moved from 'cryptocurrency' to 'crypto asset' to line up with South Africa's wider regulatory framework." },
    { type: "p", text: "SARS groups the ways you can come by crypto into three scenarios, each with its own consequences: mining, exchanging fiat for crypto (or the reverse) on an exchange or privately, and receiving crypto as payment for goods or services. The third is unambiguous — SARS says it 'falls squarely within the realm of income tax.' The other two depend on the capital-versus-revenue test." },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "Capital or revenue: the fork that decides your rate" },
    { type: "p", text: "SARS's guidance is that gains 'may be regarded as capital in nature, as spelt out in the Eighth Schedule' to the Income Tax Act, or taxed as revenue within gross income, depending on the circumstances and existing case law. There is no bright line and no holding period that settles it — South African courts look at intention at acquisition and at what actually happened since." },
    { type: "p", text: "Factors that push towards revenue (and the higher rate): frequent trading, short holding periods, using leverage or borrowed funds, a systematic or business-like operation, and any stated intention to profit from resale. Factors that push towards capital: long holding, few transactions, funding from your own savings, and a genuine investment rationale." },
    { type: "callout", text: "The onus sits with you. SARS states plainly that 'the onus is on taxpayers to declare all crypto assets-related taxable income in the tax year in which it is received or accrued' — and failure to declare attracts interest and penalties." },

    { type: "h2", text: "If it is capital: 40% inclusion, 18% maximum effective" },
    { type: "p", text: "South Africa does not tax capital gains at a separate rate. Instead a portion of the net gain is included in your taxable income and taxed at your marginal rate. For individuals the mechanics are:" },
    { type: "ul", items: [
      "Work out the net capital gain for the year (gains less capital losses).",
      "Subtract the annual exclusion — R50,000 for the 2027 tax year, raised in Budget 2026 from the R40,000 that had stood since 2017.",
      "Include 40% of what remains in your taxable income.",
      "That amount is taxed at your marginal rate, up to the top individual rate of 45%.",
    ] },
    { type: "p", text: "40% × 45% gives the headline maximum effective CGT rate of 18%. Someone in a lower bracket pays proportionally less — a taxpayer in the 26% band faces an effective 10.4%. Capital losses offset capital gains, and unused losses carry forward." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "If it is revenue: up to 45% at the individual brackets" },
    { type: "p", text: "Where the activity is revenue in nature, the full profit enters taxable income with no inclusion rate and no annual exclusion. The 2027 individual brackets run:" },
    { type: "ul", items: [
      "R1 – R245,100: 18%",
      "R245,101 – R383,100: 26%",
      "R383,101 – R530,200: 31%",
      "R530,201 – R695,800: 36%",
      "R695,801 – R887,000: 39%",
      "R887,001 – R1,878,600: 41%",
      "Above R1,878,600: 45%",
    ] },
    { type: "p", text: "The primary rebate for 2027 is R17,820, giving a tax threshold of R99,000 for taxpayers under 65 (R153,250 at 65 and over, R171,300 at 75 and over). Revenue treatment is not purely bad news: trading losses are fully deductible against other income rather than ring-fenced to capital gains — which is why active traders sometimes prefer the classification." },

    { type: "h2", text: "Mining, staking and crypto as payment" },
    { type: "p", text: "Mining rewards are generally revenue: SARS describes mined crypto as held as trading stock, brought to account at the point it is acquired, with the eventual disposal producing a further revenue amount. Staking and lending yields are treated as income at their rand value on receipt." },
    { type: "p", text: "Being paid in crypto for goods, services or employment is income at the rand market value when received — and where it is remuneration, PAYE obligations apply to the employer in the normal way. Crypto-to-crypto swaps are disposals: SARS values each leg in rand at the date of the transaction, so a swap can trigger tax even with no rand ever hitting your bank account." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "SARS is receiving the data" },
    { type: "p", text: "SARS notes it holds 'a wide range of collection powers,' including the ability to require 'third-party service providers to submit financial data.' In practice South African crypto asset service providers now feed trade data to SARS, and the OECD's Crypto-Asset Reporting Framework extends that to cross-border exchange with other tax authorities." },
    { type: "p", text: "SARS has run a voluntary disclosure programme alongside this, and has issued letters to taxpayers whose exchange activity does not match their returns. Correcting a past omission voluntarily is materially cheaper than being found." },

    { type: "h2", text: "Filing and records" },
    { type: "ul", items: [
      "The tax year for individuals runs 1 March to the end of February. Crypto is declared in the annual ITR12 return.",
      "Capital and revenue amounts go in different parts of the return — misclassifying is itself a compliance risk.",
      "Convert every transaction to rand at the date it occurred; SARS expects rand values, not USD.",
      "Keep exchange statements, wallet records, dates, and your reasoning for treating a disposal as capital. If SARS challenges the classification, that reasoning is your evidence.",
      "Foreign exchange holdings may also engage exchange control and foreign asset disclosure rules.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "South Africa gives crypto no special regime and no free pass. A long-term investor who sells occasionally can reasonably claim capital treatment, use the R50,000 annual exclusion and face at most an 18% effective rate. An active trader will more likely be assessed on revenue account at up to 45% — with the consolation that losses become fully deductible. The classification is fact-driven and yours to justify, so the record you keep at the time of each disposal is doing more work than any calculation." },
  ],
  faq: [
    { q: "What is the crypto tax rate in South Africa?", a: "It depends on classification. On capital account, 40% of the net gain above the annual exclusion is included in taxable income, giving a maximum effective rate of 18%. On revenue account, the full profit is taxed at the individual brackets, up to 45%." },
    { q: "What is the annual capital gains exclusion in South Africa?", a: "R50,000 for the 2027 tax year (1 March 2026 – 28 February 2027). Budget 2026 raised it from R40,000, the first increase since 2017. It applies to net capital gains across all assets, not crypto alone." },
    { q: "How does SARS decide if my crypto is capital or revenue?", a: "By intention and conduct, guided by case law — how often you trade, how long you hold, whether you use borrowed funds, and whether the activity looks business-like. There is no fixed holding period, and the onus is on you to justify the treatment." },
    { q: "Are crypto-to-crypto trades taxable in South Africa?", a: "Yes. Each swap is a disposal, valued in rand at the date of the transaction. Tax can arise even though no rand ever passes through your bank account." },
    { q: "How is crypto mining taxed in South Africa?", a: "Generally on revenue account. Mined crypto is treated as trading stock brought to account when acquired, and its later disposal produces a further revenue amount taxed at your marginal rate." },
    { q: "Does SARS know about my crypto?", a: "Increasingly yes. SARS can compel third-party service providers to submit financial data, South African exchanges report trade data, and the OECD's Crypto-Asset Reporting Framework adds cross-border exchange with other tax authorities." },
  ],
};

export default guide;
