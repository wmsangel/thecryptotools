import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

// Standard normal CDF via an Abramowitz–Stegun erf approximation.
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
function normCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

const tool: ToolConfig = {
  slug: "black-scholes-calculator",
  updatedAt: "2026-07-15",
  title: "Black-Scholes Option Pricing Calculator",
  description:
    "Price a European call or put with the Black-Scholes model from spot, strike, time, volatility and rate — with delta, intrinsic and time value.",
  category: "trading",
  source: "builtin",
  seo: {
    keywords: [
      "black scholes calculator",
      "option pricing calculator",
      "black scholes option price",
      "option greeks calculator",
      "crypto option pricing",
    ],
    description:
      "Free Black-Scholes calculator. Enter spot, strike, days to expiry, volatility and rate to get the theoretical option price and delta.",
  },
  inputs: [
    {
      name: "type",
      label: "Option type",
      type: "select",
      default: "call",
      options: [
        { label: "Call", value: "call" },
        { label: "Put", value: "put" },
      ],
    },
    { name: "spot", label: "Spot price", type: "number", suffix: "USD", default: 30000, min: 0, step: 0.01, livePrice: true },
    { name: "strike", label: "Strike price", type: "number", suffix: "USD", default: 32000, min: 0, step: 0.01 },
    { name: "days", label: "Days to expiry", type: "number", default: 30, min: 0, step: 1 },
    { name: "vol", label: "Volatility (annual)", type: "number", suffix: "%", default: 70, min: 0, step: 0.1 },
    { name: "rate", label: "Risk-free rate", type: "number", suffix: "%", default: 4, step: 0.1, optional: true },
  ],
  resultLabel: "Option price",
  resultUnit: "USD",
  compute: (i) => {
    const type = String(i.type);
    const S = Number(i.spot);
    const K = Number(i.strike);
    const T = Number(i.days) / 365;
    const sigma = Number(i.vol) / 100;
    const r = (Number(i.rate) || 0) / 100;

    const intrinsic = type === "put" ? Math.max(0, K - S) : Math.max(0, S - K);

    if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) {
      return {
        value: fmtUsd(intrinsic),
        note: "With zero time or volatility, the option equals its intrinsic value.",
        breakdown: [{ label: "Intrinsic value", value: fmtUsd(intrinsic), emphasis: true }],
      };
    }

    const sqrtT = Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * sqrtT);
    const d2 = d1 - sigma * sqrtT;
    const disc = Math.exp(-r * T);

    const price =
      type === "put"
        ? K * disc * normCdf(-d2) - S * normCdf(-d1)
        : S * normCdf(d1) - K * disc * normCdf(d2);
    const delta = type === "put" ? normCdf(d1) - 1 : normCdf(d1);
    const timeValue = Math.max(0, price - intrinsic);

    return {
      value: fmtUsd(price),
      note: "European-style Black-Scholes theoretical price. Real crypto options also carry a volatility skew.",
      breakdown: [
        { label: "Delta", value: fmtNumber(delta, 3), emphasis: true },
        { label: "Intrinsic value", value: fmtUsd(intrinsic) },
        { label: "Time value", value: fmtUsd(timeValue) },
        { label: "d1 / d2", value: `${fmtNumber(d1, 3)} / ${fmtNumber(d2, 3)}` },
      ],
    };
  },
  faq: [
    { q: "What is the Black-Scholes model?", a: "A formula for the fair price of a European option based on spot price, strike, time to expiry, volatility and the risk-free rate. It's the foundation of modern options pricing." },
    { q: "What is delta?", a: "Delta is how much the option price moves per $1 move in the underlying. A call delta of 0.5 means the option gains about $0.50 when spot rises $1." },
    { q: "Why does my exchange price differ?", a: "Real markets add a volatility skew, supply/demand and (for crypto) funding and settlement quirks. Black-Scholes gives a clean theoretical baseline." },
  ],
};

export default tool;
