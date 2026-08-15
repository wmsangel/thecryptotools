import type { CalendarEvent } from "./types";
import { halvings } from "./halvings";

/**
 * ============================================================================
 * The events themselves.
 * ============================================================================
 * Every tax deadline below is taken from our own country guide for that
 * jurisdiction, which carries the primary source it was verified against — so
 * this file never becomes a second, drifting copy of the tax research. If a
 * deadline here disagrees with the guide, the guide is right.
 *
 * DELIBERATELY ABSENT: ETF decision dates, exchange listings, conference
 * schedules and "expected" network upgrades. Each of those either moves
 * without notice or needs a data source we would have to keep paying attention
 * to — and a calendar that is wrong about a date is worse than one that is
 * quiet about it.
 *
 * Deadlines are for individuals filing their own return. Using an accountant
 * usually extends them, which every entry says rather than implying otherwise.
 */
export const calendarEvents: CalendarEvent[] = [
  /* ---- Tax deadlines ----------------------------------------------------- */
  {
    kind: "annual",
    id: "tax-us",
    month: 4,
    day: 15,
    title: "US individual tax return due",
    detail:
      "Form 1040 for the previous calendar year, including Schedule D and Form 8949 for crypto disposals. Shifts to the next business day when the 15th falls on a weekend or holiday.",
    category: "tax",
    country: { flag: "🇺🇸", name: "United States" },
    href: "/guides/crypto-taxes-usa",
    source: { label: "When to file", publisher: "IRS", url: "https://www.irs.gov/filing/individuals/when-to-file" },
  },
  {
    kind: "annual",
    id: "tax-sg",
    month: 4,
    day: 18,
    title: "Singapore e-filing deadline",
    detail:
      "Individual income tax e-filing. Investors with only capital gains have nothing crypto-specific to file — Singapore does not tax them.",
    category: "tax",
    country: { flag: "🇸🇬", name: "Singapore" },
    href: "/guides/crypto-taxes-singapore",
  },
  {
    kind: "annual",
    id: "tax-jp",
    month: 3,
    day: 15,
    title: "Japan kakutei shinkoku deadline",
    detail:
      "The final income tax return for the previous calendar year, filed from 16 February. Crypto gains are miscellaneous income, taxed at up to roughly 55% rather than at a capital gains rate.",
    category: "tax",
    country: { flag: "🇯🇵", name: "Japan" },
    href: "/guides/crypto-taxes-japan",
  },
  {
    kind: "annual",
    id: "tax-ca",
    month: 4,
    day: 30,
    title: "Canada tax return due",
    detail:
      "Individual return for the previous calendar year. Crypto gains use the adjusted cost base method and a 50% inclusion rate.",
    category: "tax",
    country: { flag: "🇨🇦", name: "Canada" },
    href: "/guides/crypto-taxes-canada",
  },
  {
    kind: "annual",
    id: "tax-pl",
    month: 4,
    day: 30,
    title: "Poland PIT-38 due",
    detail:
      "File and pay for the previous calendar year. Crypto-to-crypto swaps are not taxable in Poland, and costs carry forward indefinitely.",
    category: "tax",
    country: { flag: "🇵🇱", name: "Poland" },
    href: "/guides/crypto-taxes-poland",
  },
  {
    kind: "annual",
    id: "tax-nl",
    month: 5,
    day: 1,
    title: "Netherlands aangifte due",
    detail:
      "Income tax return for the previous calendar year, with extensions available. Crypto sits in Box 3 as wealth, valued on 1 January.",
    category: "tax",
    country: { flag: "🇳🇱", name: "Netherlands" },
    href: "/guides/crypto-taxes-netherlands",
  },
  {
    kind: "annual",
    id: "tax-es",
    month: 6,
    day: 30,
    title: "Spain IRPF return due",
    detail:
      "Modelo 100 for the previous calendar year. Swaps are taxable in Spain, and Modelo 721 separately reports large foreign holdings.",
    category: "tax",
    country: { flag: "🇪🇸", name: "Spain" },
    href: "/guides/crypto-taxes-spain",
  },
  {
    kind: "annual",
    id: "tax-in",
    month: 7,
    day: 31,
    title: "India ITR due (non-audit cases)",
    detail:
      "Report crypto through Schedule VDA. The flat 30% applies with no loss offset and no carry-forward, plus 1% TDS on transfers.",
    category: "tax",
    country: { flag: "🇮🇳", name: "India" },
    href: "/guides/crypto-taxes-india",
  },
  {
    kind: "annual",
    id: "tax-de",
    month: 7,
    day: 31,
    title: "Germany tax return due (self-filed)",
    detail:
      "For the previous year. Later if a Steuerberater files for you. Holdings sold after more than twelve months are tax-free under §23 EStG.",
    category: "tax",
    country: { flag: "🇩🇪", name: "Germany" },
    href: "/guides/crypto-taxes-germany",
  },
  {
    kind: "annual",
    id: "tax-au",
    month: 10,
    day: 31,
    title: "Australia tax return due (self-lodged)",
    detail:
      "For the income year ending 30 June. Using a registered tax agent generally extends this. The 50% CGT discount applies after twelve months.",
    category: "tax",
    country: { flag: "🇦🇺", name: "Australia" },
    href: "/guides/crypto-taxes-australia",
  },
  {
    kind: "annual",
    id: "tax-ie-return",
    month: 10,
    day: 31,
    title: "Ireland CGT return due",
    detail:
      "The return for the previous year — note this comes almost a year after the payment deadline, which catches people out.",
    category: "tax",
    country: { flag: "🇮🇪", name: "Ireland" },
    href: "/guides/crypto-taxes-ireland",
  },
  {
    kind: "annual",
    id: "tax-ie-pay",
    month: 12,
    day: 15,
    title: "Ireland CGT payment due (Jan–Nov disposals)",
    detail:
      "Ireland wants the tax on this year's disposals before this year ends. Disposals made in December are paid by 31 January instead.",
    category: "tax",
    country: { flag: "🇮🇪", name: "Ireland" },
    href: "/guides/crypto-taxes-ireland",
  },
  {
    kind: "annual",
    id: "tax-uk",
    month: 1,
    day: 31,
    title: "UK Self Assessment: file and pay",
    detail:
      "For the tax year ending 5 April. Both the return and the payment are due today. Share pooling decides which coins you sold — it is not FIFO.",
    category: "tax",
    country: { flag: "🇬🇧", name: "United Kingdom" },
    href: "/guides/crypto-taxes-uk",
  },
  {
    kind: "annual",
    id: "tax-ie-pay-dec",
    month: 1,
    day: 31,
    title: "Ireland CGT payment due (December disposals)",
    detail: "The second Irish payment date, covering disposals made in December of the previous year.",
    category: "tax",
    country: { flag: "🇮🇪", name: "Ireland" },
    href: "/guides/crypto-taxes-ireland",
  },
  {
    kind: "annual",
    id: "tax-nl-peildatum",
    month: 1,
    day: 1,
    title: "Netherlands Box 3 valuation date",
    detail:
      "The peildatum: Box 3 is assessed on what you hold at this single moment, and nothing you do for the rest of the year changes that figure. Selling on 2 January does not reduce it.",
    category: "tax",
    country: { flag: "🇳🇱", name: "Netherlands" },
    href: "/guides/crypto-taxes-netherlands",
  },
  {
    kind: "annual",
    id: "tax-nz-yearend",
    month: 3,
    day: 31,
    title: "New Zealand tax year ends",
    detail:
      "The New Zealand income year runs 1 April to 31 March. With no capital gains tax, crypto profit is ordinary income — so which side of today a disposal falls decides which year's rate it meets.",
    category: "tax",
    country: { flag: "🇳🇿", name: "New Zealand" },
    href: "/guides/crypto-taxes-new-zealand",
  },
  {
    kind: "annual",
    id: "tax-za-yearend",
    month: 2,
    day: 28,
    title: "South Africa tax year ends",
    detail:
      "The South African tax year runs 1 March to the end of February. The annual capital gains exclusion resets — it rose to R50,000 for the 2027 tax year.",
    category: "tax",
    country: { flag: "🇿🇦", name: "South Africa" },
    href: "/guides/crypto-taxes-south-africa",
  },
  {
    kind: "annual",
    id: "tax-uk-yearend",
    month: 4,
    day: 5,
    title: "UK tax year ends",
    detail:
      "The last day to use this year's £3,000 capital gains annual exempt amount. It does not carry forward — unused, it is gone.",
    category: "tax",
    country: { flag: "🇬🇧", name: "United Kingdom" },
    href: "/guides/crypto-taxes-uk",
  },
  {
    kind: "annual",
    id: "tax-au-yearend",
    month: 6,
    day: 30,
    title: "Australia income year ends",
    detail:
      "The Australian income year runs 1 July to 30 June. Losses realised before today can offset this year's gains — and losses are applied before the 50% discount.",
    category: "tax",
    country: { flag: "🇦🇺", name: "Australia" },
    href: "/guides/crypto-taxes-australia",
  },
  {
    kind: "annual",
    id: "tax-calendar-yearend",
    month: 12,
    day: 31,
    title: "Calendar tax year ends in most countries",
    detail:
      "The last day to realise a loss that offsets this year's gains in the US, Germany, Canada, Spain, Poland, Italy and most of Europe. Check your own rules first — some jurisdictions restrict loss offsetting entirely.",
    category: "tax",
    href: "/guides/crypto-tax-by-country",
  },

  /* ---- Regulation -------------------------------------------------------- */
  {
    kind: "once",
    id: "carf-hk",
    date: "2027-01-01",
    title: "Hong Kong CARF regime commences",
    detail:
      "Hong Kong's Crypto-Asset Reporting Framework rules take effect, with the first automatic exchange of information expected in 2028.",
    category: "regulation",
    country: { flag: "🇭🇰", name: "Hong Kong" },
    href: "/guides/crypto-taxes-hong-kong",
  },
  {
    kind: "once",
    id: "tax-kr-start",
    date: "2027-01-01",
    title: "South Korea: 22% gains tax legislated to begin",
    detail:
      "Individual crypto gains above ₩2.5 million become taxable — as the law currently stands. This start date has already been postponed three times and is still politically contested, so treat it as the legal position rather than a certainty.",
    category: "regulation",
    country: { flag: "🇰🇷", name: "South Korea" },
    href: "/guides/crypto-taxes-south-korea",
  },
  {
    kind: "once",
    id: "carf-nz-report",
    date: "2027-06-30",
    title: "New Zealand: first CARF report due",
    detail:
      "New Zealand providers began collecting reportable data on 1 April 2026; the first report to Inland Revenue is due today.",
    category: "regulation",
    country: { flag: "🇳🇿", name: "New Zealand" },
    href: "/guides/crypto-taxes-new-zealand",
  },

  /* ---- Network ----------------------------------------------------------- */
  ...halvings,
];
