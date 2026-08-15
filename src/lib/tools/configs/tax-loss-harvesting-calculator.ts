import type { ToolConfig, ToolResultRow } from "../types";
import { fmtNumber, fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "tax-loss-harvesting-calculator",
  title: "Crypto Tax Loss Harvesting Calculator",
  description:
    "See how much tax you save by realising a losing position to offset your crypto gains — the net tax saved, the effective discount on the loss, and how much loss carries forward.",
  category: "portfolio",
  featured: true,
  source: "builtin",
  updatedAt: "2026-08-11",
  seo: {
    keywords: [
      "tax loss harvesting calculator",
      "crypto tax loss harvesting",
      "crypto tax loss calculator",
      "capital loss offset calculator crypto",
      "harvest crypto losses tax",
      "crypto tax savings calculator",
    ],
    description:
      "Free crypto tax loss harvesting calculator. Enter your realised gains, an unrealised loss and your tax rate to see the tax saved, your net position and any loss carried forward.",
  },
  inputs: [
    { name: "gains", label: "Realised gains this year", type: "number", suffix: "USD", default: 12000, min: 0, step: 100, help: "Profit you have already locked in and will be taxed on." },
    { name: "cost", label: "Cost basis of the losing position", type: "number", suffix: "USD", default: 10000, min: 0, step: 100 },
    { name: "value", label: "Current value of that position", type: "number", suffix: "USD", default: 4000, min: 0, step: 100 },
    { name: "rate", label: "Your capital gains tax rate", type: "number", suffix: "%", default: 24, min: 0, max: 60, step: 0.5, help: "e.g. 33% Ireland, 19% Poland, 24% UK higher rate." },
    { name: "carryLimit", label: "Annual loss offset limit", type: "number", suffix: "USD", default: 0, min: 0, step: 100, optional: true, help: "Some regimes cap losses usable per year (US: $3,000 against ordinary income). Leave 0 for no cap." },
  ],
  resultLabel: "Tax saved",
  precision: 2,
  relatedSlugs: ["crypto-tax-calculator", "loss-recovery-calculator", "profit-calculator", "average-entry-calculator"],
  compute: (i) => {
    const gains = Number(i.gains);
    const cost = Number(i.cost);
    const value = Number(i.value);
    const rate = Number(i.rate) / 100;
    const cap = Number(i.carryLimit) || 0;

    if (!(cost > 0)) {
      return { value: "—", note: "Enter the cost basis of the position you are thinking of selling." };
    }

    const loss = cost - value;
    if (loss <= 0) {
      return {
        value: "—",
        note: "That position is in profit, so there is no loss to harvest. Selling it would add to your taxable gains, not reduce them.",
      };
    }

    // Losses offset gains first; anything above the gains (or above an annual
    // cap where one applies) has to wait for a future year.
    const offsetCeiling = cap > 0 ? Math.min(gains + cap, loss) : Math.min(gains, loss);
    const usable = Math.min(loss, offsetCeiling);
    const carried = loss - usable;

    const taxBefore = gains * rate;
    const taxAfter = Math.max(0, gains - usable) * rate;
    const saved = taxBefore - taxAfter;

    // What harvesting actually costs you: you give up `value` of an asset and
    // get `saved` back in cash. The recovery ratio is what makes it worthwhile.
    const effectiveDiscount = loss > 0 ? (saved / loss) * 100 : 0;

    const breakdown: ToolResultRow[] = [
      { label: "Unrealised loss", value: fmtUsd(loss) },
      { label: "Loss used against this year's gains", value: fmtUsd(usable) },
      { label: "Taxable gains before harvesting", value: fmtUsd(gains) },
      { label: "Taxable gains after harvesting", value: fmtUsd(Math.max(0, gains - usable)) },
      { label: "Tax bill before", value: fmtUsd(taxBefore) },
      { label: "Tax bill after", value: fmtUsd(taxAfter) },
      { label: "Tax saved", value: fmtUsd(saved), emphasis: true },
      { label: "Cash recovered per $1 of loss", value: `${fmtNumber(effectiveDiscount)}¢` },
    ];

    if (carried > 0) {
      breakdown.push({ label: "Loss carried forward to future years", value: fmtUsd(carried) });
    }

    let note = `Selling now turns a ${fmtUsd(loss)} paper loss into a ${fmtUsd(saved)} reduction in this year's tax bill.`;
    if (carried > 0) {
      note += ` ${fmtUsd(carried)} of the loss exceeds what you can use this year and carries forward — in most regimes indefinitely, against future gains.`;
    }
    if (usable === 0) {
      note = "You have no gains for this loss to offset this year, so harvesting saves nothing now. The loss would still carry forward against future gains in most regimes.";
    }
    note += " Repurchase rules differ by country: the UK matches a sale against buybacks the same day and for 30 days after, Canada's superficial-loss window runs 30 days either side and counts your spouse, and Spain's runs two months either side — while the US wash-sale rule is written for securities and does not currently reach crypto. Check your own rules before repurchasing.";

    return { value: fmtUsd(saved), note, breakdown };
  },
  faq: [
    {
      q: "What is crypto tax loss harvesting?",
      a: "Selling a position that is underwater to realise the loss, so it offsets gains you have already banked elsewhere and lowers your tax bill. You keep the same market exposure if you rebuy — subject to whatever repurchase rules your country applies.",
    },
    {
      q: "How much tax does harvesting a loss actually save?",
      a: "Roughly the loss multiplied by your capital gains rate, capped by the gains available to offset. A $6,000 loss at a 24% rate saves $1,440 — so you recover about 24 cents of every dollar lost, not the dollar itself. Harvesting never makes a loss profitable.",
    },
    {
      q: "Can I sell and immediately buy back the same coin?",
      a: "It depends where you file, and the answer varies more than the tax rates do. The US wash-sale rule in IRC §1091 covers stock and securities, and the IRS treats crypto as property, so it does not currently reach it. The UK matches a disposal against acquisitions the same day and for the next 30 days. Canada's superficial-loss rule spans 30 days before as well as after, and purchases by an affiliated person such as a spouse count against you. Spain blocks the loss for two months either side. Australia has no fixed window at all and instead cancels wash sales on intent. Assume your country has a rule until you have checked.",
    },
    {
      q: "Does Ireland have a four-week rule for crypto?",
      a: "This is genuinely unsettled, whatever other tax tools tell you. Section 581 TCA 1997 sets aside the normal matching order where shares or securities of the same class are sold and reacquired within four weeks, but it is drafted for shares and securities — and Revenue's own Tax and Duty Manual on crypto-assets, Part 02-01-03, last reviewed in January 2026, neither mentions section 581 nor extends it to crypto-assets. Several commercial packages apply it anyway. Get advice before relying on a quick repurchase in Ireland.",
    },
    {
      q: "What happens to a loss bigger than my gains?",
      a: "In most regimes the excess carries forward, often indefinitely, against future capital gains. Some place an annual cap on how much can offset ordinary income — the US limit is $3,000 a year — which the optional field above models.",
    },
    {
      q: "When is the deadline to harvest losses?",
      a: "The end of your tax year, and it is the disposal date that counts, not the settlement or withdrawal. Most countries use 31 December; the UK uses 5 April, Australia 30 June, South Africa the end of February and New Zealand 31 March.",
    },
    {
      q: "I have more than one losing position — how do I know which to sell?",
      a: "This calculator answers the question for a single holding. For a whole portfolio the ranking matters, because losses only offset the gains you actually have: once those are down to zero the next sale saves nothing this year. The tax loss harvesting tool at /tax-loss-harvesting/ takes the same CSV you export for tax, works out every open parcel's real cost basis, and prices each one at the margin so the savings add up instead of being promised twice.",
    },
    {
      q: "Is harvesting worth doing if I still believe in the coin?",
      a: "Often yes, because the tax saving is real cash now while the position stays a paper loss either way. The trade-offs are transaction fees, spread, the risk of a sharp move while you are out, and a lower cost basis afterwards — which increases the taxable gain if the coin recovers.",
    },
  ],
};

export default tool;
