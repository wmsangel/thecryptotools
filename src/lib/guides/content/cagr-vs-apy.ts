import type { Guide } from "../types";

const guide: Guide = {
  slug: "cagr-vs-apy",
  title: "CAGR vs APY vs Total Return: Which Growth Number Is Honest?",
  description:
    "Total return, CAGR and APY describe the same growth in very different-looking numbers. Confusing them makes a mediocre investment look great. Here's how to read each one correctly.",
  readingMinutes: 6,
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "cagr vs apy",
      "cagr vs total return",
      "annualized return explained",
      "what is cagr",
      "apy vs annual return",
      "compound annual growth rate",
    ],
    description:
      "CAGR vs APY vs total return explained: what each measures, how to convert between them, and why annualizing is the only fair way to compare investments over different periods.",
  },
  relatedTools: ["cagr-calculator", "apy-calculator", "compound-interest-calculator"],
  body: [
    { type: "p", text: "Someone tells you their trade 'made 300%.' Impressive — until you learn it took six years. Someone else quotes '25% APY.' Also impressive — until you notice it's a variable rate that already dropped. Growth can be described in several honest-looking numbers that mean very different things, and the gaps between them are where people get misled. Three matter most: total return, CAGR and APY." },

    { type: "h2", text: "Total return: the whole gain, no time context" },
    { type: "p", text: "Total return is the simplest: how much you ended with versus what you started with, expressed as a percentage. Turn $1,000 into $4,000 and your total return is 300%. It's honest but incomplete — it says nothing about how long it took. A 300% return over one year is extraordinary; the same 300% over ten years is fairly ordinary. Total return alone can't tell those apart, which is precisely why it's the number people quote when the time frame is unflattering." },

    { type: "h2", text: "CAGR: total return, spread evenly across time" },
    { type: "p", text: "Compound Annual Growth Rate fixes total return's blind spot. It's the single constant yearly rate that would grow your start value into your end value over the period, compounding each year. That 300% over three years becomes a CAGR of about 59% a year; over ten years it's about 15% a year. CAGR is the standard way to compare investments held for different lengths of time, because it puts them all on a per-year footing." },
    { type: "callout", text: "CAGR smooths away all the drama. A coin that 10×'d then halved can show the same CAGR as one that rose in a straight line. It answers 'what steady rate got me here?' — not 'how wild was the ride?'" },
    { type: "tool", slug: "cagr-calculator" },

    { type: "h2", text: "APY: forward-looking, and it assumes compounding" },
    { type: "p", text: "APY (Annual Percentage Yield) is usually a forward-looking rate quoted by savings, staking and lending products. Crucially, it already bakes in compounding — it's what you'd earn in a year if returns were reinvested at the stated frequency. That's why APY is higher than the simple APR of the same product. APY describes an expected, often variable future rate; CAGR measures a realised, historical one. Don't treat a quoted APY as a guarantee — in crypto, yields move." },
    { type: "tool", slug: "apy-calculator" },

    { type: "h2", text: "Putting them side by side" },
    { type: "ul", items: [
      "Total return — the full gain over the whole period. No time adjustment. Best for a single 'how much did I make' snapshot.",
      "CAGR — total return annualized. Backward-looking. Best for comparing past performance across different holding periods.",
      "APY — an annual rate that includes compounding. Usually forward-looking and variable. Best for comparing yield products.",
      "APR — a yield rate that excludes compounding; APY is APR after compounding is applied.",
    ] },
    { type: "tool", slug: "compound-interest-calculator" },

    { type: "h2", text: "How not to get fooled" },
    { type: "p", text: "When you see a big percentage, always ask two questions: over what period, and does it include compounding? A quoted total return needs a time frame before it means anything — convert it to CAGR to compare fairly. A quoted APY needs a reality check — is that rate fixed or floating, and is it net of fees and token-price risk? The numbers aren't lying; they're just answering different questions. Know which question you're asking, and the honest comparison falls out." },
  ],
  faq: [
    { q: "What's the difference between CAGR and total return?", a: "Total return is the overall percentage gain over the whole period; CAGR spreads that gain evenly across the years as a constant annual rate. A 300% total return over 3 years is roughly a 59% CAGR." },
    { q: "Is APY the same as CAGR?", a: "No. APY is usually a forward-looking annual rate that already includes compounding, common for yield products. CAGR is a backward-looking annualized rate measured from an actual start and end value." },
    { q: "Why is APY higher than APR?", a: "APR is the simple annual rate with no compounding; APY adds the effect of reinvesting your earnings during the year. The more often it compounds, the more APY exceeds APR." },
    { q: "Which number should I use to compare investments?", a: "To compare past performance over different time spans, use CAGR — it annualizes everything onto the same scale. To compare yield products, compare APY, but check whether each rate is fixed or variable." },
  ],
};

export default guide;
