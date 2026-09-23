import { coins } from "@/lib/coins/registry";
import type { Variant } from "./types";

/** Живой фид бумажных стратегий (Cloudflare Worker dca-status). */
export const DCA_STATUS_URL = "https://dca-status.ocrsnip.workers.dev/status";

// symbol (BTCUSDT / BTC) -> {name, color} из реестра монет; иначе — сам тикер.
const bySymbol = new Map<string, { name: string; color: string }>();
for (const c of coins) {
  const rec = { name: c.name, color: c.color };
  bySymbol.set(c.symbol.toUpperCase(), rec);
  if (c.binance) bySymbol.set(c.binance.toUpperCase(), rec);
}

const FALLBACK_COLOR = "#2dd4bf";

export function coinOf(symbol: string): { ticker: string; name: string; color: string } {
  const s = (symbol || "").toUpperCase();
  const ticker = s.replace(/USDT$|USDC$|USD$/i, "") || s;
  const rec = bySymbol.get(s) || bySymbol.get(ticker);
  return { ticker, name: rec?.name || ticker, color: rec?.color || FALLBACK_COLOR };
}

/** Красивый заголовок стратегии: "Bitcoin DCA grid". */
export function strategyTitle(v: Variant): string {
  return `${coinOf(v.symbol).name} DCA grid`;
}

/** Короткий подзаголовок из реальных параметров. */
export function strategySubtitle(v: Variant): string {
  const parts: string[] = [];
  if (v.take_profit_pct != null) parts.push(`${round(v.take_profit_pct, 2)}% take-profit`);
  if (v.safety_orders != null) parts.push(`${v.safety_orders} safety orders`);
  if (v.grid_coverage_pct != null) parts.push(`${round(v.grid_coverage_pct, 0)}% coverage`);
  return parts.join(" · ");
}

/** Фильтр входа человеческим языком (значения бота бывают на русском). */
export function entryLabel(filter?: string | null): string {
  if (!filter) return "No filter — always active";
  const f = filter.toLowerCase();
  const m = f.match(/откат\s*([\d.]+)|dip\s*([\d.]+)/);
  if (m) return `Buys the dip (−${m[1] || m[2]}%)`;
  if (f.includes("отскок") || f.includes("bounce")) return "Waits for a bounce";
  if (f.includes("объ") || f.includes("vol") || f.includes("x2")) return "Volume-spike filter";
  if (f.includes("час") || f.includes("ноч") || f.includes("hour") || f.includes("night")) return "Time-of-day filter";
  if (f.includes("sma") || f.includes("ниже")) return "Below moving average";
  if (f.includes("тих") || f.includes("quiet")) return "Low-volatility filter";
  if (f.includes("баз") || f.includes("base")) return "Base order (no filter)";
  // общий случай: причесать
  return filter.replace(/[·:_-]+/g, " ").replace(/\s+/g, " ").trim();
}

/** ROI % = общий PnL к вложенному капиталу. */
export function roiPct(v: Variant): number | null {
  const cap = v.capital || 0;
  if (!cap) return null;
  const total = v.total_pnl ?? v.realized_pnl + v.unrealized_pnl;
  return (total / cap) * 100;
}

export function stateLabel(v: Variant): { text: string; kind: "pos" | "wait" | "idle" } {
  if (v.waiting_for_signal) return { text: "Waiting for entry signal", kind: "wait" };
  const active = v.slots_active ?? 0;
  if (active > 0) return { text: `In position (${active} slot${active > 1 ? "s" : ""})`, kind: "pos" };
  return { text: "Idle", kind: "idle" };
}

// --- форматтеры ---
export function round(n: number, d = 2): number {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}
export function pct(n: number | null | undefined, d = 2): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n > 0 ? "+" : ""}${round(n, d)}%`;
}
export function usd(n: number | null | undefined, d = 2): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}$${Math.abs(round(n, d)).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
}
export function hours(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n < 48) return `${round(n, 0)}h`;
  return `${round(n / 24, 1)}d`;
}
export function daysSince(iso?: string | null): number | null {
  if (!iso) return null;
  const t = Date.parse(iso.replace(" ", "T") + "Z");
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / 86400000));
}
