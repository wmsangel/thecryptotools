import type { ToolConfig } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "loss-recovery-calculator",
  title: "Loss Recovery Calculator (Break-Even Gain)",
  description:
    "See the exact percentage gain you need to recover a loss. Losses and the gains that undo them are not symmetric — a 50% drop needs a 100% rally just to break even.",
  category: "trading",
  source: "builtin",
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "loss recovery calculator",
      "break even gain calculator",
      "percentage to recover loss",
      "gain needed to recover loss",
      "crypto drawdown recovery",
      "break even percentage calculator",
    ],
    description:
      "Free loss recovery calculator. Enter how much you're down and see the exact percentage gain required to get back to break-even.",
  },
  inputs: [
    { name: "loss", label: "Current loss / drawdown", type: "number", suffix: "%", default: 50, min: 0, max: 99.99, step: 0.1 },
    { name: "balance", label: "Current balance", type: "number", suffix: "USD", default: 5000, min: 0, step: 1, optional: true, help: "Optional — shows the dollar target." },
  ],
  resultLabel: "Gain needed to break even",
  precision: 2,
  relatedSlugs: ["tax-loss-harvesting-calculator", "break-even-calculator", "max-drawdown-calculator", "roi-calculator"],
  compute: (i) => {
    const loss = Number(i.loss);
    const balance = Number(i.balance) || 0;

    if (loss >= 100) {
      return { value: "∞", note: "A 100% loss cannot be recovered — the position is worth zero." };
    }

    const gainNeeded = (loss / (100 - loss)) * 100;
    const breakdown = [
      { label: "You are down", value: `${fmtNumber(loss)}%` },
    ];

    if (balance > 0) {
      const original = balance / (1 - loss / 100);
      breakdown.push({ label: "Break-even target", value: fmtUsd(original) });
      breakdown.push({ label: "Amount to regain", value: fmtUsd(original - balance) });
    }

    return {
      value: `${fmtNumber(gainNeeded)}%`,
      note: "Because gains compound off a smaller base, the recovery percentage is always larger than the loss. Deep drawdowns get brutal fast.",
      breakdown,
    };
  },
  faq: [
    { q: "Why is the recovery gain bigger than the loss?", a: "After a loss you're working from a smaller balance, so a given dollar gain is a larger percentage. Down 20% needs +25%; down 50% needs +100%; down 90% needs +900%." },
    { q: "What's the formula?", a: "Required gain % = loss ÷ (100 − loss) × 100. For a 33% loss: 33 ÷ 67 × 100 ≈ 49.3%." },
    { q: "Why does this matter for risk management?", a: "It's the mathematical case for cutting losses early. Small, controlled losses are easy to recover; letting a position bleed to −70% or −80% requires a near-miracle rally to get back to flat." },
    { q: "Does leverage change this?", a: "Leverage amplifies both the loss and the move needed to recover — and a large enough loss triggers liquidation, after which no recovery is possible at all." },
  ],
};

export default tool;
