import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

/**
 * A crypto-backed mortgage: an amortising property loan secured on coins.
 *
 * Not a duplicate of `crypto-loan-ltv-calculator`. That one prices a standing
 * loan whose balance never moves; this one repays over years, so the LTV falls
 * on the debt side while the collateral swings on the other — and the answer
 * that matters is how far the coin can fall before the lender sells it.
 *
 * The design decision worth keeping: the headline is the LIQUIDATION PRICE, not
 * the monthly payment. Every mortgage calculator on the internet gives the
 * payment. The reason this product is different from a bank mortgage is that a
 * price move can take the house, and burying that under an affordability figure
 * would sell the thing rather than explain it.
 */
const tool: ToolConfig = {
  slug: "crypto-mortgage-calculator",
  updatedAt: "2026-08-10",
  title: "Crypto Mortgage Calculator",
  description:
    "Work out the payments on a crypto-backed property loan and, more importantly, how far your collateral can fall before the lender sells it.",
  category: "defi",
  source: "builtin",
  seo: {
    title: "Crypto Mortgage Calculator — Payments and Collateral Liquidation Price",
    keywords: [
      "crypto mortgage calculator",
      "bitcoin mortgage calculator",
      "crypto backed mortgage",
      "crypto backed loan calculator",
      "buy a house with bitcoin calculator",
      "crypto collateral mortgage",
    ],
    description:
      "Free crypto mortgage calculator. Monthly payment, total interest, LTV, and the collateral price that triggers a margin call on a crypto-backed home loan.",
  },
  inputs: [
    { name: "price", label: "Property price", type: "number", suffix: "USD", default: 400000, min: 0, step: 1000 },
    { name: "loan", label: "Amount borrowed", type: "number", suffix: "USD", default: 320000, min: 0, step: 1000 },
    { name: "rate", label: "Interest rate", type: "number", suffix: "% a year", default: 9, min: 0, step: 0.1 },
    { name: "years", label: "Term", type: "number", suffix: "years", default: 30, min: 1, max: 40, step: 1 },
    {
      name: "collateralUnits",
      label: "Crypto put up as collateral",
      type: "number",
      suffix: "coins",
      default: 10,
      min: 0,
      step: 0.0001,
    },
    {
      name: "coinPrice",
      label: "Price per coin now",
      type: "number",
      suffix: "USD",
      default: 65000,
      min: 0,
      step: 1,
      livePrice: true,
    },
    {
      name: "marginCallLtv",
      label: "Margin-call LTV",
      type: "number",
      suffix: "%",
      default: 75,
      min: 1,
      max: 100,
      step: 1,
      optional: true,
    },
  ],
  resultLabel: "Collateral can fall to",
  compute: (i) => {
    const price = Number(i.price) || 0;
    const loan = Number(i.loan) || 0;
    const annualRate = (Number(i.rate) || 0) / 100;
    const years = Math.max(1, Number(i.years) || 1);
    const units = Number(i.collateralUnits) || 0;
    const coinPrice = Number(i.coinPrice) || 0;
    const callLtv = Math.min(100, Math.max(1, Number(i.marginCallLtv) || 75)) / 100;

    const months = Math.round(years * 12);
    const r = annualRate / 12;

    // Standard amortisation, with the zero-rate case handled separately: the
    // usual formula divides by r and would return NaN at 0%.
    const payment =
      r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -months)) : months > 0 ? loan / months : 0;
    const totalPaid = payment * months;
    const totalInterest = totalPaid - loan;

    const collateralValue = units * coinPrice;
    const ltv = collateralValue > 0 ? loan / collateralValue : 0;
    const deposit = Math.max(0, price - loan);

    // The lender calls when the collateral falls to loan / callLtv. Expressed
    // per coin, that is a price the reader can put next to a chart.
    const callValue = callLtv > 0 ? loan / callLtv : 0;
    const callPrice = units > 0 ? callValue / units : 0;
    const dropToCall =
      collateralValue > 0 ? Math.max(0, (collateralValue - callValue) / collateralValue) * 100 : 0;
    const alreadyCalled = collateralValue > 0 && ltv >= callLtv;

    return {
      value: alreadyCalled ? "Already past the margin call" : fmtUsd(callPrice),
      tone: alreadyCalled ? "negative" : "neutral",
      note: alreadyCalled
        ? `At ${fmtUsd(coinPrice)} a coin this collateral is already at ${fmtNumber(
            ltv * 100,
          )}% LTV, at or past the ${fmtNumber(callLtv * 100, 0)}% margin-call level. The lender can sell now.`
        : `A fall of ${fmtNumber(dropToCall)}% — to ${fmtUsd(
            callPrice,
          )} a coin — triggers the margin call. Crypto has fallen further than that in a single month more than once.`,
      breakdown: [
        { label: "Monthly payment", value: fmtUsd(payment), emphasis: true },
        { label: "Deposit / equity in the property", value: fmtUsd(deposit) },
        { label: "Collateral value now", value: fmtUsd(collateralValue) },
        { label: "Loan-to-value on the collateral", value: `${fmtNumber(ltv * 100)}%` },
        { label: "Margin call at collateral value", value: fmtUsd(callValue) },
        { label: `Total paid over ${fmtNumber(years, 0)} years`, value: fmtUsd(totalPaid) },
        { label: "Of which interest", value: fmtUsd(totalInterest) },
      ],
    };
  },
  relatedSlugs: [
    "crypto-loan-ltv-calculator",
    "liquidation-calculator",
    "crypto-lending-calculator",
    "compound-interest-calculator",
    "crypto-tax-calculator",
  ],
  faq: [
    {
      q: "What is a crypto mortgage?",
      a: "A property loan secured on crypto instead of, or alongside, a cash deposit. You keep the coins rather than selling them, the lender holds them as collateral, and you repay the loan in the normal amortising way. The appeal is not having to sell — and in most countries, not triggering a capital gain by selling.",
    },
    {
      q: "Why is the liquidation price the headline here?",
      a: "Because it is the only number that makes this different from an ordinary mortgage. A bank mortgage does not get harder to keep because an asset fell 40% in a month. This one does: below the margin-call level the lender can sell your collateral, usually at the worst possible moment, and you still owe the loan.",
    },
    {
      q: "What happens if I get margin called?",
      a: "Typically the lender asks for more collateral or a partial repayment within a short window — sometimes hours — and sells if it does not arrive. Selling collateral is usually a disposal for tax, so a forced sale can produce a tax bill in the same year the price collapsed. Check the specific lender's terms; they vary a lot and are not standardised the way bank mortgages are.",
    },
    {
      q: "Are the interest rates worse than a bank?",
      a: "Generally yes, often substantially, and the term is frequently shorter. You are paying for the ability not to sell your coins and for the lender's own risk in holding volatile collateral. Run the total-interest figure above against an ordinary mortgage plus the tax on selling enough crypto for a deposit before deciding which is really cheaper.",
    },
    {
      q: "Does this replace advice?",
      a: "No. This is arithmetic on numbers you supply, not a recommendation, and it deliberately ignores fees, insurance, property taxes and the specific terms of any lender. A loan secured on an asset that can halve is a serious commitment and worth discussing with someone qualified in your jurisdiction.",
    },
  ],
};

export default tool;
