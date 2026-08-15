import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

/**
 * The lending side, as distinct from `crypto-loan-ltv-calculator` (borrowing).
 *
 * The arithmetic of "deposit × rate" is trivial and every platform shows it on
 * its own landing page. What none of them show is the number this tool exists
 * for: the annual chance of the platform failing at which the quoted yield
 * stops paying for the risk of lending to it. Celsius, BlockFi, Voyager and
 * Gemini Earn all froze customer withdrawals while advertising a rate, so this
 * is not a hypothetical — it is the single fact that decides whether a lending
 * yield was worth taking.
 */
const tool: ToolConfig = {
  slug: "crypto-lending-calculator",
  updatedAt: "2026-08-10",
  title: "Crypto Lending Calculator",
  description:
    "Work out what lending your crypto actually pays after the platform's cut — and the failure risk that yield is compensating you for.",
  category: "defi",
  source: "builtin",
  seo: {
    title: "Crypto Lending Calculator — Interest, Fees and the Risk Behind the Rate",
    keywords: [
      "crypto lending calculator",
      "crypto interest calculator",
      "lend crypto calculator",
      "crypto lending rates calculator",
      "bitcoin lending calculator",
      "usdc lending calculator",
    ],
    description:
      "Free crypto lending calculator: interest earned after platform fees, effective APY, and the break-even probability of the platform failing.",
  },
  inputs: [
    { name: "amount", label: "Amount you lend", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "apy", label: "Quoted APY", type: "number", suffix: "%", default: 8, min: 0, step: 0.1 },
    { name: "months", label: "How long you lend it", type: "number", suffix: "months", default: 12, min: 1, step: 1 },
    {
      name: "platformCut",
      label: "Platform's cut of the interest",
      type: "number",
      suffix: "%",
      default: 0,
      min: 0,
      max: 100,
      step: 1,
      optional: true,
    },
    {
      // Deliberately not a daily/weekly/monthly picker. A quoted APY already
      // contains its own compounding, so those three options would produce the
      // identical number and imply a choice that does not exist. What actually
      // changes the answer is whether the interest goes back to work.
      name: "reinvest",
      label: "What happens to the interest",
      type: "select",
      default: "compound",
      options: [
        { label: "Left to compound", value: "compound" },
        { label: "Withdrawn as it is paid", value: "payout" },
      ],
      optional: true,
    },
  ],
  resultLabel: "Interest earned",
  compute: (i) => {
    const amount = Number(i.amount) || 0;
    const quoted = (Number(i.apy) || 0) / 100;
    const months = Math.max(1, Number(i.months) || 1);
    const cut = Math.min(100, Math.max(0, Number(i.platformCut) || 0)) / 100;
    const compounding = String(i.reinvest || "compound") === "compound";

    const years = months / 12;

    // The quoted figure is an APY, so it already describes a full year's
    // outcome with its own compounding inside it. Left in place it grows
    // geometrically; withdrawn each time, only the original stake earns.
    const gross = compounding
      ? amount * (Math.pow(1 + quoted, years) - 1)
      : amount * quoted * years;

    const fee = gross * cut;
    const net = gross - fee;
    const finalValue = amount + net;
    const effectiveApy = amount > 0 && years > 0 ? Math.pow(finalValue / amount, 1 / years) - 1 : 0;

    // The whole point of the tool. With no recovery in a failure, a lender
    // breaks even when (1 − p)(1 + r) = 1, so p = r / (1 + r). Anything above
    // that and the yield is not paying for the risk being taken.
    const breakEvenDefault = effectiveApy > 0 ? effectiveApy / (1 + effectiveApy) : 0;

    return {
      value: fmtUsd(net),
      tone: net > 0 ? "positive" : "neutral",
      note:
        breakEvenDefault > 0
          ? `This rate pays for itself only if the platform's chance of failing is under ${fmtNumber(
              breakEvenDefault * 100,
            )}% a year. Above that, you are being underpaid for the risk.`
          : "At a 0% rate there is nothing to compensate you for the risk of the platform holding your coins.",
      breakdown: [
        { label: "Gross interest", value: fmtUsd(gross) },
        ...(cut > 0
          ? [{ label: `Platform keeps ${fmtNumber(cut * 100, 0)}%`, value: `−${fmtUsd(fee)}` }]
          : []),
        {
          label: compounding ? "Balance at the end" : "Stake plus interest taken",
          value: fmtUsd(finalValue),
        },
        { label: "Effective APY after fees", value: `${fmtNumber(effectiveApy * 100)}%`, emphasis: true },
        {
          label: "Break-even chance of platform failure",
          value: `${fmtNumber(breakEvenDefault * 100)}% a year`,
        },
      ],
    };
  },
  relatedSlugs: [
    "crypto-loan-ltv-calculator",
    "apy-calculator",
    "staking-rewards-calculator",
    "compound-interest-calculator",
    "yield-farming-apy-calculator",
  ],
  faq: [
    {
      q: "What is the break-even failure chance?",
      a: "It is the annual probability of the platform going under at which the yield exactly cancels out the expected loss, assuming you get nothing back. At 8% APY it is about 7.4% a year — so lending at 8% is only worth it if you genuinely believe the platform is more than 92.6% likely to still be solvent and paying out in twelve months. It is a blunt measure and it ignores partial recovery, but it turns 'is this rate good?' into a question you can actually answer.",
    },
    {
      q: "Is lending crypto the same as staking it?",
      a: "No, and the difference is who has your coins. Staking locks your coins in a protocol and pays you for securing it; the main risks are the protocol, slashing and the lock-up. Lending hands your coins to a company that lends them on to someone else, and adds that company's solvency to the list. The yields look similar on a marketing page and the risks are not.",
    },
    {
      q: "Why is the yield higher on some platforms?",
      a: "Because someone is paying more to borrow, or because the platform is taking more risk to generate it, or because it is subsidising the rate to attract deposits. A rate well above the market is information about risk, not a bargain — several of the highest-paying lenders of 2021 and 2022 stopped honouring withdrawals entirely.",
    },
    {
      q: "Does the compounding frequency matter much?",
      a: "Far less than people expect. A quoted APY already includes compounding, so choosing daily over monthly changes the outcome only through when interest lands in your account. The platform's cut and whether you get your money back matter orders of magnitude more.",
    },
    {
      q: "Do I owe tax on lending interest?",
      a: "In most countries interest is income at the moment you receive it, valued at that day's price, and then a later sale of those coins is a separate capital gain. That is a different treatment from a simple buy-and-hold, and it means a good year for lending can create a tax bill on coins whose value has since fallen.",
    },
  ],
};

export default tool;
