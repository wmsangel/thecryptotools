import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "crypto-loan-ltv-calculator",
  updatedAt: "2026-07-30",
  title: "Crypto Loan LTV & Liquidation Calculator",
  description:
    "Calculate the loan-to-value (LTV) of a crypto-backed loan and how far your collateral can fall before it gets liquidated.",
  category: "defi",
  source: "builtin",
  seo: {
    keywords: [
      "ltv calculator",
      "loan to value calculator crypto",
      "crypto loan calculator",
      "crypto collateral liquidation",
      "defi loan calculator",
    ],
    description:
      "Free crypto loan LTV calculator. Enter collateral and loan amount to get your LTV and the price drop that triggers liquidation.",
  },
  inputs: [
    { name: "collateral", label: "Collateral value", type: "number", suffix: "USD", default: 10000, min: 0, step: 1 },
    { name: "loan", label: "Loan amount", type: "number", suffix: "USD", default: 5000, min: 0, step: 1 },
    { name: "liqLtv", label: "Liquidation LTV", type: "number", suffix: "%", default: 85, min: 1, max: 100, step: 1, optional: true },
  ],
  resultLabel: "Loan-to-Value (LTV)",
  compute: (i) => {
    const collateral = Number(i.collateral);
    const loan = Number(i.loan);
    const liqLtv = (Number(i.liqLtv) || 85) / 100;

    const ltv = collateral > 0 ? loan / collateral : 0;
    // Liquidation triggers when collateral value falls to loan / liqLtv.
    const liqCollateralValue = liqLtv > 0 ? loan / liqLtv : 0;
    const dropToLiq =
      collateral > 0 ? Math.max(0, (collateral - liqCollateralValue) / collateral) * 100 : 0;
    const belowThreshold = ltv >= liqLtv;

    return {
      value: `${fmtNumber(ltv * 100)}%`,
      note: belowThreshold
        ? "Your LTV is already at or above the liquidation threshold!"
        : "Keep LTV comfortably below the liquidation level to avoid a forced sale.",
      breakdown: [
        { label: "Liquidation LTV", value: `${fmtNumber(liqLtv * 100, 0)}%` },
        { label: "Collateral price drop to liquidation", value: `-${fmtNumber(dropToLiq)}%`, emphasis: true },
        { label: "Liquidation at collateral value", value: fmtUsd(liqCollateralValue) },
        { label: "Borrowing headroom left", value: fmtUsd(Math.max(0, collateral * liqLtv - loan)) },
      ],
    };
  },
  relatedSlugs: ["crypto-lending-calculator", "crypto-mortgage-calculator"],
  faq: [
    { q: "What is LTV?", a: "Loan-to-value is your loan divided by your collateral value. A $5,000 loan against $10,000 of crypto is 50% LTV. Lower is safer." },
    { q: "When do I get liquidated?", a: "When your collateral falls enough that LTV hits the platform's liquidation threshold (often 80–90%). This tool shows the exact price drop that gets you there." },
    { q: "How do I reduce liquidation risk?", a: "Borrow less relative to collateral, add more collateral, or repay part of the loan. Volatile collateral needs a bigger safety buffer." },
  ],
};

export default tool;
