import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const MAX_MONTHS = 1200; // 100 years — past this we call it "indefinitely".

const tool: ToolConfig = {
  slug: "crypto-withdrawal-calculator",
  title: "Crypto Withdrawal Calculator — How Long Will My Crypto Last?",
  description:
    "Work out how long a crypto portfolio lasts if you withdraw a fixed amount each month, allowing for growth, staking yield and inflation — and the safe withdrawal rate that never runs it down.",
  category: "portfolio",
  featured: true,
  source: "builtin",
  updatedAt: "2026-08-03",
  seo: {
    keywords: [
      "crypto withdrawal calculator",
      "how long will my crypto last",
      "crypto retirement calculator",
      "crypto drawdown income calculator",
      "safe withdrawal rate crypto",
      "living off crypto calculator",
    ],
    description:
      "Free crypto withdrawal calculator. Enter your portfolio, monthly withdrawal, return and inflation to see how many years it lasts and what rate is sustainable.",
  },
  inputs: [
    { name: "balance", label: "Portfolio value", type: "number", suffix: "USD", default: 250000, min: 0, step: 1000 },
    { name: "withdrawal", label: "Monthly withdrawal", type: "number", suffix: "USD", default: 2000, min: 0, step: 50 },
    { name: "growth", label: "Expected annual return", type: "number", suffix: "%", default: 8, min: -50, max: 100, step: 0.5, help: "Total expected return including any staking yield. Be conservative — crypto returns are not a straight line." },
    { name: "inflation", label: "Annual inflation", type: "number", suffix: "%", default: 3, min: 0, max: 30, step: 0.1, optional: true, help: "Withdrawals grow by this each year to keep the same buying power." },
  ],
  resultLabel: "Portfolio lasts",
  precision: 2,
  relatedSlugs: ["compound-interest-calculator", "crypto-savings-goal-calculator", "staking-rewards-calculator", "cagr-calculator"],
  compute: (i) => {
    const balance = Number(i.balance);
    const withdrawalStart = Number(i.withdrawal);
    const annualGrowth = Number(i.growth) / 100;
    const annualInflation = Number(i.inflation) / 100 || 0;

    if (!(balance > 0)) {
      return { value: "—", note: "Enter a portfolio value above zero." };
    }
    if (!(withdrawalStart > 0)) {
      return { value: "—", note: "Enter a monthly withdrawal above zero." };
    }

    const monthlyGrowth = Math.pow(1 + annualGrowth, 1 / 12) - 1;
    const monthlyInflation = Math.pow(1 + annualInflation, 1 / 12) - 1;

    // The withdrawal rate the portfolio can sustain forever in real terms is the
    // return net of inflation — anything above it erodes the principal.
    const realReturn = (1 + annualGrowth) / (1 + annualInflation) - 1;
    const sustainableMonthly = realReturn > 0 ? (balance * realReturn) / 12 : 0;

    let value = balance;
    let withdrawal = withdrawalStart;
    let months = 0;
    let totalWithdrawn = 0;
    let peak = balance;

    while (months < MAX_MONTHS) {
      value = value * (1 + monthlyGrowth) - withdrawal;
      if (value <= 0) {
        // Partial final month: count what could actually be paid out.
        totalWithdrawn += Math.max(0, withdrawal + value);
        months += 1;
        break;
      }
      totalWithdrawn += withdrawal;
      peak = Math.max(peak, value);
      withdrawal *= 1 + monthlyInflation;
      months += 1;
    }

    const survived = months >= MAX_MONTHS && value > 0;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const duration = survived
      ? "Indefinitely"
      : `${years} year${years === 1 ? "" : "s"}${remMonths ? ` ${remMonths} month${remMonths === 1 ? "" : "s"}` : ""}`;

    const annualWithdrawal = withdrawalStart * 12;
    const withdrawalRate = (annualWithdrawal / balance) * 100;

    const breakdown: ToolResultRow[] = [
      { label: "Portfolio lasts", value: duration, emphasis: true },
      { label: "Starting withdrawal rate", value: `${fmtNumber(withdrawalRate)}% per year (${fmtUsd(annualWithdrawal)})` },
      { label: "Total withdrawn over that time", value: fmtUsd(totalWithdrawn) },
      { label: "Real return after inflation", value: `${fmtNumber(realReturn * 100)}% per year` },
    ];

    if (survived) {
      breakdown.push(
        { label: "Balance after 100 years", value: fmtUsd(value) },
        { label: "Peak balance reached", value: fmtUsd(peak) },
      );
    } else {
      breakdown.push({ label: "Final monthly withdrawal (inflation-adjusted)", value: fmtUsd(withdrawal) });
    }

    if (sustainableMonthly > 0) {
      breakdown.push({
        label: "Withdrawal that would last forever",
        value: `${fmtUsd(sustainableMonthly)} per month (${fmtNumber(realReturn * 100)}% a year)`,
      });
    }

    let note: string;
    if (survived) {
      note = `At ${fmtUsd(withdrawalStart)} a month the portfolio grows faster than you draw it down, so it never runs out on these assumptions.`;
    } else {
      note = `Drawing ${fmtUsd(withdrawalStart)} a month empties the portfolio in ${duration}, having paid out ${fmtUsd(totalWithdrawn)} in total.`;
      if (sustainableMonthly > 0) {
        note += ` To make it last indefinitely you would need to draw about ${fmtUsd(sustainableMonthly)} a month instead.`;
      } else {
        note += " With a real return of zero or less, any withdrawal at all runs the portfolio down — there is no sustainable rate here.";
      }
    }
    note += " This model applies a smooth average return. Real crypto returns arrive in violent bursts, and a deep drawdown early in retirement does far more damage than the same drawdown later — sequence-of-returns risk that a straight-line model cannot show.";

    return { value: duration, note, breakdown };
  },
  faq: [
    {
      q: "How long will my crypto last if I live off it?",
      a: "It depends on the gap between your withdrawal rate and your return after inflation. Withdraw less than the real return and the portfolio lasts indefinitely; withdraw more and it depletes at a rate that accelerates as the balance shrinks.",
    },
    {
      q: "What is a safe withdrawal rate for a crypto portfolio?",
      a: "Traditional portfolios use around 4% a year, based on decades of stock and bond data. Crypto has no comparable history and far larger drawdowns, so most people applying the idea use a lower rate, hold several years of spending in stablecoins or cash, and accept variable withdrawals in bad years.",
    },
    {
      q: "Why does inflation matter so much here?",
      a: "Because your spending rises even when your portfolio does not. At 3% inflation, $2,000 a month becomes about $3,600 a month after 20 years for the same standard of living. The calculator grows the withdrawal each month so the figure stays comparable in real terms.",
    },
    {
      q: "What is sequence-of-returns risk?",
      a: "The risk that bad years arrive early. Two portfolios with identical average returns can end in very different places depending on the order those returns come in, because withdrawals during a crash sell more coins to raise the same cash. It is the single largest danger in a crypto drawdown plan and is not visible in an average-return model.",
    },
    {
      q: "Should I include staking yield in the expected return?",
      a: "Yes, but as part of a single total return figure rather than on top of it — a staking reward paid in the same token is not extra purchasing power if the token falls. Also remember rewards are usually taxed as income when received in most countries.",
    },
    {
      q: "Does the calculator account for tax?",
      a: "No. Selling crypto to fund withdrawals is usually a taxable disposal, so the amount you must sell is larger than the amount you spend. As a rough adjustment, raise your monthly withdrawal by your effective capital gains rate on the gain portion of each sale.",
    },
  ],
};

export default tool;
