/** Presentation helpers shared by tool formulas and the result UI. */

/**
 * Decimal places needed to keep ~4 significant digits on a small number, so a
 * SHIB price renders as $0.00000417 instead of collapsing to $0. Values at or
 * above the requested precision are left alone.
 */
function digitsFor(abs: number, precision: number): number {
  if (abs === 0 || abs >= 1) return precision;
  const needed = 3 - Math.floor(Math.log10(abs));
  return Math.min(20, Math.max(precision, needed));
}

export function fmtNumber(value: number, precision = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digitsFor(Math.abs(value), precision),
  });
}

export function fmtUsd(value: number, precision = 2): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  // Auto-expand precision for sub-cent crypto prices.
  const digits = digitsFor(abs, precision);
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function fmtPct(value: number, precision = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${value >= 0 ? "" : ""}${fmtNumber(value, precision)}%`;
}
