import type { Guide } from "../types";

const guide: Guide = {
  slug: "value-at-risk-explained",
  title: "Value at Risk (VaR) Explained for Crypto Traders",
  description:
    "VaR compresses 'how much could I lose?' into one number. Here's how to read it, how to calculate it, and — crucially — why crypto's fat tails make it dangerous to trust alone.",
  readingMinutes: 6,
  updatedAt: "2026-07-25",
  seo: {
    keywords: [
      "value at risk",
      "value at risk explained",
      "var crypto",
      "how to calculate value at risk",
      "parametric var",
      "portfolio risk management crypto",
    ],
    description:
      "Value at Risk (VaR) explained for crypto: what the number means, the parametric method, how confidence and time horizon change it, and why fat tails limit it.",
  },
  relatedTools: ["value-at-risk-calculator", "max-drawdown-calculator", "portfolio-volatility-calculator"],
  body: [
    { type: "p", text: "Value at Risk answers one question in a single number: over a set period, at a chosen confidence level, what's the most I should expect to lose? A '1-day 95% VaR of $500' means that on 95 days out of 100, your loss should stay under $500. It became the standard risk metric on trading desks because it turns a messy return distribution into something a risk manager can put in a sentence." },

    { type: "h2", text: "The three inputs that define any VaR" },
    { type: "ul", items: [
      "Time horizon — one day, one week, ten days. Longer horizons mean larger potential losses.",
      "Confidence level — usually 95% or 99%. A 99% VaR is bigger than a 95% VaR because you're asking about a rarer, worse day.",
      "Volatility — how much the asset typically moves. This is the engine of the whole calculation.",
    ] },

    { type: "h2", text: "The parametric method, in plain terms" },
    { type: "p", text: "The most common quick method assumes returns are roughly bell-shaped. You take the asset's volatility (daily standard deviation), multiply by a z-score for your confidence level (1.65 for 95%, 2.33 for 99%), and scale by the square root of the number of days in your horizon. Multiply that percentage by your position size and you have your VaR in dollars." },
    { type: "callout", text: "Time scaling uses the square root of time, not time itself. A 10-day VaR is about √10 ≈ 3.16× the 1-day VaR — not 10×. This is why short-horizon risk understates longer holds by less than you'd guess." },
    { type: "tool", slug: "value-at-risk-calculator" },

    { type: "h2", text: "Why VaR is dangerous in crypto" },
    { type: "p", text: "VaR has two blind spots, and crypto walks straight into both. First, it tells you nothing about the losing tail: a 95% VaR says nothing about how bad the worst 5% of days get — and in crypto those days include 30% flash crashes, depegs and cascading liquidations. Second, the parametric method assumes a normal distribution, but crypto returns have fat tails — extreme moves happen far more often than a bell curve predicts. The result is that plain VaR routinely understates real crypto risk." },
    { type: "p", text: "This is exactly the flaw that blew up firms in 2008 and again in crypto's 2022 blowups: they managed to a VaR number and were destroyed by the losses that lived beyond it. A related measure, Conditional VaR (or 'expected shortfall'), tries to patch this by averaging the losses in that worst tail." },

    { type: "h2", text: "How to use VaR without getting hurt" },
    { type: "ul", items: [
      "Treat VaR as a floor on bad days, never a ceiling on how bad it can get.",
      "Pair it with maximum drawdown, which measures an actual peak-to-trough loss rather than a statistical estimate.",
      "Stress-test separately: ask 'what if BTC drops 40% overnight?' regardless of what VaR says is likely.",
      "Recompute volatility often — crypto vol changes fast, and a VaR built on last month's calm is useless in this month's storm.",
    ] },
    { type: "tool", slug: "max-drawdown-calculator" },

    { type: "h2", text: "The bottom line" },
    { type: "p", text: "VaR is a useful way to size positions and compare risk across holdings, as long as you remember what it is: an estimate of a routine bad day under a distribution that crypto doesn't actually follow. Use it to keep normal risk in bounds, and use drawdown analysis and stress tests to prepare for the days VaR was never designed to see." },
  ],
  faq: [
    { q: "What does a 95% VaR of $500 mean?", a: "Over the chosen horizon, you'd expect a loss greater than $500 on only about 5% of periods. It does not mean $500 is your maximum possible loss — the other 5% can be far worse." },
    { q: "Is 95% or 99% VaR better?", a: "Neither is 'better' — they answer different questions. 99% VaR captures rarer, larger losses and is more conservative; 95% is a more everyday measure. Risk teams often watch both." },
    { q: "Why does VaR fail in crypto?", a: "The common parametric method assumes normally distributed returns, but crypto has fat tails — big crashes happen more often than the model expects — so VaR tends to understate true downside." },
    { q: "What's the difference between VaR and drawdown?", a: "VaR is a forward-looking statistical estimate of a possible loss; maximum drawdown is a backward-looking measurement of an actual worst peak-to-trough decline. Use them together." },
  ],
};

export default guide;
