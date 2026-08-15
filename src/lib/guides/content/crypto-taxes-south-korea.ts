import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-taxes-south-korea",
  title: "Crypto Tax in South Korea: No Gains Tax Yet — 22% Arrives in 2027",
  description:
    "South Korea still does not tax individual crypto gains. A 22% tax on gains above ₩2.5 million is legislated to start in January 2027 after three delays — but its future is still contested.",
  readingMinutes: 7,
  updatedAt: "2026-07-27",
  reviewedAt: "2026-07-27",
  sources: [
    {
      label:
        "거주자의 가상자산소득 과세 개요 (taxation of residents' virtual-asset income)",
      publisher: "National Tax Service",
      url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40370&cntntsId=238935",
    },
  ],
  seo: {
    keywords: [
      "crypto tax south korea",
      "korea crypto tax 2027",
      "south korea 22% crypto tax",
      "korea crypto capital gains delayed",
      "korea crypto tax threshold",
      "korea virtual asset tax",
    ],
    description:
      "South Korea crypto tax guide: why individual crypto gains are currently untaxed, the 22% tax on gains above ₩2.5 million legislated for January 2027, the repeated delays, and existing gift and inheritance tax.",
  },
  relatedTools: ["crypto-tax-calculator", "average-entry-calculator", "profit-calculator"],
  partOf: "crypto-tax-by-country",
  body: [
    { type: "callout", text: "General information, not tax advice. South Korea's crypto gains tax has been delayed repeatedly and remains politically contested; personal circumstances vary. Check nts.go.kr or a Korean tax professional before relying on this." },

    { type: "p", text: "South Korea is unusual: one of the world's largest and most active retail crypto markets still does not tax individual trading gains. A tax has been drafted, legislated and scheduled several times — and delayed every time. As things stand, the charge is set to begin in January 2027, but given the history and the ongoing political fight, even that date is not certain." },

    { type: "h2", text: "The current position: gains are untaxed" },
    { type: "p", text: "For individuals, capital gains on crypto are currently not taxed in South Korea. You can buy, trade and sell crypto without a gains-tax liability on the profit. This is not a permanent exemption by design — it is the result of the planned tax being pushed back repeatedly — but for now it is the practical reality for Korean investors." },
    { type: "tool", slug: "profit-calculator" },

    { type: "h2", text: "What is scheduled for 2027" },
    { type: "p", text: "The legislated tax would apply to income generated from 1 January 2027. Annual crypto gains above a ₩2.5 million tax-free threshold would be taxed at a combined 22% — 20% income tax plus a 2% local income tax. Gains up to ₩2.5 million a year would remain untaxed, targeting the charge at more substantial profits." },
    { type: "ul", items: [
      "Rate: 22% total (20% national + 2% local) on gains above the threshold.",
      "Threshold: a ₩2.5 million annual tax-free allowance on crypto gains.",
      "Effective date: income earned from 1 January 2027, unless the law is changed again first.",
    ] },
    { type: "tool", slug: "crypto-tax-calculator" },

    { type: "h2", text: "A history of delays" },
    { type: "p", text: "The tax was originally slated to begin in 2021, then pushed to 2023, then to 2025, and most recently to 2027 — three postponements driven by concerns about market readiness, exchange reporting systems, and political pressure from a large retail investor base. Even now, some lawmakers have introduced bills to scrap the tax entirely before it takes effect. The 2027 start stands as the current law, but the pattern of delay means investors should watch for further changes." },
    { type: "callout", text: "Do not build a plan around the tax never arriving — or around it arriving exactly on schedule. Treat January 2027 as the current legal position and re-check closer to the date, because this deadline has moved three times already." },
    { type: "tool", slug: "average-entry-calculator" },

    { type: "h2", text: "What is already taxable" },
    { type: "p", text: "The delay applies to the capital gains charge, not to everything. Crypto received by gift or inheritance is already subject to South Korea's gift and inheritance tax, valued at market value. Crypto received as business income or payment can fall within existing income tax rules. And corporations are treated differently from individuals. So 'no crypto tax yet' refers specifically to individual trading gains — not to every way crypto can create a tax liability." },

    { type: "h2", text: "Reporting and what is coming" },
    { type: "ul", items: [
      "While individual gains are untaxed, there is no gains return to file for them — but keep full records now, because the 2027 regime will need historical cost basis to compute gains.",
      "Korean exchanges are subject to strict regulation and reporting, and the National Tax Service is coordinating with major exchanges (Upbit, Bithumb, Coinone, Korbit, Gopax) to build the reporting infrastructure for the 2027 tax.",
      "Global transparency frameworks are also advancing, so cross-border information exchange will expand regardless of the domestic timeline.",
    ] },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "Right now, individual crypto trading gains in South Korea are not taxed. A 22% tax on annual gains above ₩2.5 million is legislated to begin in January 2027, but it has already been delayed three times and faces active efforts to scrap or reshape it. The smart move is to keep meticulous records of your cost basis today — so that whenever the tax does arrive, you can calculate your gains correctly — while watching the legislation for the next twist." },
  ],
  faq: [
    { q: "Does South Korea tax crypto gains?", a: "Not yet, for individuals. Capital gains on crypto are currently untaxed because the planned tax has been repeatedly delayed. A 22% tax is legislated to begin in January 2027." },
    { q: "What will the South Korean crypto tax be?", a: "A combined 22% (20% national income tax plus 2% local) on annual crypto gains above a ₩2.5 million tax-free threshold, applying to income generated from 1 January 2027 — unless the law changes again." },
    { q: "Why has South Korea's crypto tax been delayed so many times?", a: "It was scheduled for 2021, then 2023, then 2025, and now 2027 — postponed over concerns about market readiness, exchange reporting systems and political pressure from retail investors. Some lawmakers are still trying to scrap it." },
    { q: "Is any crypto already taxed in South Korea?", a: "Yes. Crypto received by gift or inheritance is subject to gift and inheritance tax, and crypto received as business income or payment can be taxed under existing rules. Only individual trading gains are currently untaxed." },
    { q: "Should I keep crypto records in South Korea even though gains aren't taxed?", a: "Yes. The 2027 regime will require your historical cost basis to calculate gains, so keeping detailed acquisition records now will make compliance far easier whenever the tax takes effect." },
  ],
};

export default guide;
