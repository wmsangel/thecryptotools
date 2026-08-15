import type { Guide } from "../types";

/**
 * The relocation guide, deliberately distinct from `crypto-taxes-uae`.
 *
 * That guide answers "what does the UAE charge?". This one answers the question
 * Search Console actually shows — "move to dubai crypto taxes", "crypto trading
 * dubai tax free" — which is a different question with a much less comfortable
 * answer: what the UAE charges is rarely the part that decides the bill. The
 * country being left does, and most of the content on this topic never mentions
 * it because it is written to sell company formation.
 *
 * Every figure here is checked against the primary instrument, not a summary:
 * Cabinet Decision 49/2023 for the corporate-tax carve-out (the "Personal
 * Investment" definition is quoted almost verbatim because the whole question
 * of whether a trader is caught turns on its exact wording), and the FTA's own
 * service page for the residency-certificate tests.
 */
const guide: Guide = {
  slug: "moving-to-dubai-for-crypto",
  title: "Moving to Dubai for Crypto: What Is Actually Tax-Free",
  description:
    "The UAE charges no personal income tax on crypto — but that is rarely the number that decides your bill. What the rules really say, and what the country you leave does about it.",
  readingMinutes: 11,
  updatedAt: "2026-08-10",
  reviewedAt: "2026-08-10",
  partOf: "crypto-tax-by-country",
  seo: {
    title: "Moving to Dubai for Crypto — Is It Really Tax-Free? (2026)",
    keywords: [
      "move to dubai crypto taxes",
      "crypto trading dubai tax free",
      "no crypto tax dubai",
      "dubai crypto tax",
      "uae crypto tax residency",
      "relocate to dubai cryptocurrency",
    ],
    description:
      "Is crypto really tax-free in Dubai? The UAE rules on personal investment income and corporate tax, the residency tests, and the exit rules in the country you are leaving.",
  },
  relatedTools: [
    "crypto-tax-calculator",
    "tax-loss-harvesting-calculator",
    "profit-calculator",
    "crypto-lending-calculator",
  ],
  body: [
    {
      type: "p",
      text: "The short version is true: the UAE levies no personal income tax and no capital gains tax on individuals, so an ordinary person holding and selling crypto for their own account pays nothing to the UAE on the gain. That is not a loophole or a temporary arrangement — there simply is no personal income tax to owe.",
    },
    {
      type: "p",
      text: "The part almost nobody writing about this mentions is that the UAE's rate is usually the least important number in the decision. Whether the move saves you anything is decided by three other things: whether your trading counts as a business rather than personal investment, whether you actually become UAE tax resident, and what the country you are leaving does on the way out. Get any of those wrong and you can end up paying full tax at home while living in Dubai.",
    },

    { type: "h2", text: "What the UAE actually charges" },
    {
      type: "p",
      text: "There are two separate regimes and it matters which one you land in. Individuals pay no income tax. Businesses pay corporate tax at 9% on taxable income above AED 375,000, introduced by Federal Decree-Law No. 47 of 2022 for financial years starting on or after 1 June 2023.",
    },
    {
      type: "p",
      text: "A natural person is only dragged into the corporate-tax regime under specific conditions, set out in Cabinet Decision No. 49 of 2023. Article 2 says a resident or non-resident natural person is subject to corporate tax only where turnover from businesses or business activities exceeds AED 1,000,000 in a Gregorian calendar year. Note that this is turnover, not profit.",
    },
    {
      type: "callout",
      text: "The carve-out that matters: the same Article excludes wage, personal investment income and real estate investment income from corporate tax entirely — “regardless of the amount of turnover derived from such activities”. There is no AED 1m ceiling on the exclusion. A natural person not conducting a business under this Article is not even required to register for corporate tax.",
    },
    {
      type: "p",
      text: "So the whole question becomes: is your crypto activity personal investment? Cabinet Decision 49 defines it as investment activity a natural person conducts for their own account that is neither conducted through a licence, nor requires a licence from a licensing authority in the UAE, nor is considered a commercial business under Federal Decree-Law No. 50 of 2022, the Commercial Transactions Law.",
    },
    {
      type: "ul",
      items: [
        "Buying, holding and selling crypto on your own account, unlicensed, is personal investment income — outside corporate tax however large the numbers get.",
        "Trading through a licensed entity, or running an activity that requires a licence, is a business. Above AED 1m of turnover, corporate tax applies at 9% on taxable income above AED 375,000.",
        "Market making, running a fund, managing other people's money, operating an exchange or a broker: licensed activity, plainly a business.",
        "Mining and validating are closer to the line than most people assume, because they look more like an operation than like holding an asset. Take advice on the specific setup rather than assuming.",
      ],
    },
    {
      type: "p",
      text: "The line between an unusually active personal investor and a commercial business is exactly the line the Commercial Transactions Law draws, and it is not a volume test with a number on it. If your activity has the character of a trade — systematic, organised, conducted with the apparatus of a business — expect it to be treated as one. If it matters to your decision, this is the point to get a written opinion from a UAE adviser rather than a forum answer.",
    },

    { type: "h2", text: "Becoming resident is not the same as being tax resident" },
    {
      type: "p",
      text: "A residence visa gets you the right to live in the UAE. It does not, on its own, make you UAE tax resident, and it certainly does not make you non-resident anywhere else. Those are three different statuses and people routinely collapse them into one.",
    },
    {
      type: "p",
      text: "The Federal Tax Authority issues tax residency certificates for natural persons under three domestic routes: 183 days or more of physical presence in the UAE in the relevant 12 months; 90 to 182 days plus proof of UAE employment, business or permanent residence; or a primary residence and centre of financial and personal interests in the UAE. Days are counted as any day or part of a day physically present.",
    },
    {
      type: "callout",
      text: "The trap in the 90-day route: it is enough for domestic UAE residency, but the FTA applies the 183-day test for a treaty-purpose certificate. If your plan depends on invoking a double-tax treaty against your old country, 90 days will not get you the document you need to do it.",
    },

    { type: "h2", text: "The country you leave decides most of this" },
    {
      type: "p",
      text: "This is the part the relocation industry does not sell. Landing in Dubai does not end your tax obligations at home; ceasing to be tax resident where you were does, and every country has its own rules for that. They fall into a few recognisable shapes.",
    },
    {
      type: "ul",
      items: [
        "Day counts and ties. Leaving is rarely just a matter of days out. Many countries also look at where your home, family, work and economic interests are — you can be under the day threshold and still resident because everything else about your life stayed put.",
        "Exit taxes. Several countries deem you to have sold your assets on the day you cease residence and tax the gain then, at home rates. In those cases moving does not avoid the tax on gains you have already made; it crystallises them.",
        "Temporary non-residence rules. Some regimes claw the tax back if you return within a set number of years, so a short stay abroad to realise a gain is specifically anticipated and specifically taxed.",
        "Split years and part-year returns. The year you move is usually not clean. Expect a final return, often with the year divided into resident and non-resident parts.",
      ],
    },
    {
      type: "p",
      text: "Which of these applies to you is the single most consequential fact in the whole plan, and it is entirely a question about your current country, not about the UAE. Our country guides set out the rules where the figures are checked against the tax authority itself.",
    },
    {
      type: "cta",
      title: "Crypto taxes by country",
      text: "What each jurisdiction actually charges on crypto, checked against the tax authority in each case — start with the country you are leaving, not the one you are going to.",
      href: "/guides/crypto-tax-by-country",
      label: "Open the country guides",
    },

    { type: "h2", text: "Moving does not backdate anything" },
    {
      type: "p",
      text: "Gains you realised while resident somewhere else are taxable there, and they stay taxable there. Relocating in November does not make a March disposal tax-free. If you are sitting on a large unrealised gain and considering a move partly to avoid tax on it, the order of events — cease residence first, then dispose — is the whole plan, and getting it wrong by one tax year is expensive.",
    },
    {
      type: "p",
      text: "Work out what the gain would actually cost you at home before assuming the move pays for itself. In plenty of cases, especially where an exit tax applies or the holding already qualifies for a long-term rate, the saving is far smaller than the cost and disruption of moving.",
    },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "The UAE is not a place where nobody can see you" },
    {
      type: "p",
      text: "The UAE participates in the Common Reporting Standard, so financial account information is exchanged with other participating jurisdictions. The OECD's Crypto-Asset Reporting Framework extends the same idea specifically to crypto, with the first jurisdictions collecting data from 2026. Exchanges are increasingly required to report account holders' details to the tax authority where they are resident.",
    },
    {
      type: "p",
      text: "Practically, that means the plan has to be that you genuinely are non-resident where you used to be, not that the information will not arrive. It usually does arrive, often a year or two later, and an inconsistency between where you said you lived and where an exchange said you lived is precisely the kind of mismatch these systems exist to surface.",
    },

    { type: "h2", text: "What it costs to live there" },
    {
      type: "p",
      text: "A tax rate of zero is not the same as a low cost of living. Dubai housing is expensive and typically demands rent well in advance; schooling is private and priced accordingly; healthcare runs on insurance; and a residence visa has to be maintained, which usually means employment, a company, or a property investment above a threshold. Company formation and the licence that goes with it carry annual costs, and — as above — a licence is one of the things that can move you out of the personal-investment exclusion and into corporate tax.",
    },
    {
      type: "p",
      text: "None of that is a reason not to move. It is a reason to compare the actual saving against the actual cost, rather than comparing a tax rate against zero.",
    },

    { type: "h2", text: "A workable order of operations" },
    {
      type: "ul",
      items: [
        "Work out what you would owe at home if you did nothing, including any exit tax on unrealised gains. That is the number the move has to beat.",
        "Read your own country's rules on ceasing residence — day counts, ties, temporary non-residence clawbacks — before booking anything.",
        "Decide whether your activity is personal investment or a business under Cabinet Decision 49, because that determines whether the UAE side is 0% or 9% and whether you need a licence at all.",
        "Establish real residence: somewhere to live, days on the ground, your centre of interests genuinely relocated. Documented, because you may have to prove it to two authorities.",
        "Only then realise gains, and keep the records that show which side of the line each disposal fell on.",
        "File the final return at home properly. A silent disappearance is not a cessation of residence.",
      ],
    },
    {
      type: "p",
      text: "This guide is research, not tax advice, and nobody here holds a tax qualification — see our editorial policy for what that means. A relocation of this kind touches two tax systems at once and is worth paid advice in both.",
    },
  ],
  faq: [
    {
      q: "Is crypto really tax-free in Dubai?",
      a: "For an individual holding and selling on their own account, yes as far as the UAE is concerned: there is no personal income tax and no capital gains tax, and Cabinet Decision 49 of 2023 puts personal investment income outside corporate tax regardless of size. What is not true is that moving makes your crypto tax-free in general — that depends on whether you have properly ceased to be tax resident where you were, and on whether that country charges an exit tax on the way out.",
    },
    {
      q: "How many days do I need to spend in the UAE?",
      a: "183 days or more of physical presence in a 12-month period qualifies on its own. Between 90 and 182 days qualifies if you also have UAE employment, a business, or a permanent place of residence. There is a third route based on having your primary residence and centre of financial and personal interests in the UAE. Note that the 90-day route is not accepted for a treaty-purpose residency certificate — that needs 183 days.",
    },
    {
      q: "Will I pay the 9% corporate tax on my trading?",
      a: "Only if your activity is a business rather than personal investment. Cabinet Decision 49 defines personal investment as activity for your own account that is not conducted through a licence, does not require one, and is not a commercial business under the Commercial Transactions Law — and excludes it from corporate tax regardless of turnover. Trading through a licensed entity is a business, and above AED 1,000,000 of turnover corporate tax applies at 9% on taxable income above AED 375,000.",
    },
    {
      q: "Do I need to set up a company?",
      a: "Not for the tax treatment — a company is more likely to move you into the corporate-tax regime than out of it. The usual reason to form one is to obtain a residence visa. Weigh the annual licence and formation costs, and be clear about whether the licence changes how your trading is characterised.",
    },
    {
      q: "What if I keep property or family back home?",
      a: "Then you may well still be tax resident there. Most residence tests look beyond day counts to where your home, family and economic interests are, and keeping a house available to you is one of the strongest ties there is. This is the most common way a move fails to achieve anything: the person is physically in Dubai and legally still resident somewhere else.",
    },
    {
      q: "Can I move, sell, and move back?",
      a: "Several countries anticipate exactly that with temporary non-residence rules that tax the gain anyway if you return within a set period. Check whether yours has one before treating a short relocation as a way to realise a large gain.",
    },
  ],
  sources: [
    {
      label: "Cabinet Decision No. 49 of 2023 on Businesses or Business Activities Conducted by a Natural Person",
      publisher: "UAE Ministry of Finance",
      url: "https://mof.gov.ae/wp-content/uploads/2023/05/Cabinet-Decision-No.-49-of-2023.pdf",
    },
    {
      label: "Issuance of Tax Certificates (Tax Residency) — requirements for natural persons",
      publisher: "UAE Federal Tax Authority",
      url: "https://tax.gov.ae/en/services/issuance.of.tax.certificates.aspx",
    },
    {
      label: "Cabinet Decision No. 85 of 2022 on Determination of Tax Residency",
      publisher: "UAE Ministry of Finance",
      url: "https://mof.gov.ae/en/news/following-cabinet-decision-85-of-2022/",
    },
    {
      label: "Crypto-Asset Reporting Framework (CARF)",
      publisher: "OECD",
      url: "https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework-and-amendments-to-the-common-reporting-standard.htm",
    },
  ],
};

export default guide;
