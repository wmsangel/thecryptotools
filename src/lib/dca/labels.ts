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

// Русские токены пресетов бота → английские (чтобы не светить кириллицу на сайте).
const RU_EN: Record<string, string> = {
  "тейк-от-базы": "take-from-base", "от-базы": "from-base", "тейк": "take",
  "половина": "half", "трейл": "trail", "откат": "dip", "отскок": "bounce",
  "тихо": "quiet", "объём": "volume", "объем": "volume",
  "часы-ночь": "night-hours", "часы": "hours", "ночь": "night",
  "ниже": "below", "база": "base", "частые": "frequent", "дн": "day", "сма": "sma",
};

function humanizeVariant(s: string): string {
  let t = s.toLowerCase().replace(/нов(\d+)/g, "v$1").replace(/(^|[^a-z0-9])нов($|[^a-z0-9])/g, "$1v1$2");
  for (const [ru, en] of Object.entries(RU_EN)) t = t.split(ru).join(en);
  t = t.replace(/[а-яё]+/g, "").replace(/[:·_]+/g, " ").replace(/\s+/g, " ").replace(/^[ -]+|[ -]+$/g, "");
  return t || "variant";
}

/** Различитель варианта в человекочитаемом виде (без сырой кириллицы). */
export function variantTag(v: Variant): string {
  const raw = v.scheme
    ? String(v.scheme)
    : (v.name.includes("·") ? v.name.split("·").slice(1).join(" · ") : v.name);
  return humanizeVariant(raw);
}

/** Ключ стратегии, общий для всех монет: имя без символа монеты. */
export function strategyKey(v: Variant): string {
  return v.name.includes("·") ? v.name.split("·").slice(1).join("·") : v.name;
}

/** Человеческое имя стратегии по правилу входа (без сырой кириллицы/схем). */
export function strategyName(v: Variant): string {
  const f = (v.entry_filter || "").toLowerCase() + " " + (v.name || "").toLowerCase();
  let lead = "Classic";
  if (/откат|dip/.test(f)) { const m = f.match(/откат\s*(\d+)|dip\s*(\d+)/); const n = m?.[1] || m?.[2]; lead = n ? `Dip-buy (−${n}%)` : "Dip-buy"; }
  else if (/отскок|bounce/.test(f)) lead = "Bounce";
  else if (/трейл|trail/.test(f)) lead = "Trailing";
  else if (/объ|volume|x2/.test(f)) lead = "Volume-spike";
  else if (/час|ноч|hour|night/.test(f)) lead = "Time-filter";
  else if (/sma|ниже|below/.test(f)) lead = "Trend-filter";
  else if (/тих|quiet/.test(f)) lead = "Low-volatility";
  return `${lead} DCA grid`;
}

/** Стабильный url-safe slug стратегии (по конфигу, не по монете). */
export function strategySlug(v: Variant): string {
  const style = /grid/i.test(`${v.scheme ?? ""} ${v.name ?? ""}`) ? "even" : "scaling";
  const base = `${strategyName(v)}-tp${v.take_profit_pct ?? ""}-so${v.safety_orders ?? ""}-c${v.grid_coverage_pct != null ? Math.round(v.grid_coverage_pct) : ""}-${style}`;
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "strategy";
}

export interface StrategyGroup {
  key: string;
  slug: string;
  name: string;
  subtitle: string;
  variants: Variant[]; // по монетам, отсортированы по ROI
  coins: number;
  isNew: boolean;
  avgRoi: number | null;
  totalRealized: number;
  totalUnrealized: number;
  totalDeals: number;
  winrate: number | null;
  avgHours: number | null;
}

/** Сгруппировать варианты в стратегии (одна стратегия = много монет). */
export function buildGroups(all: Variant[]): StrategyGroup[] {
  const m = new Map<string, Variant[]>();
  for (const v of all) {
    const k = strategyKey(v);
    const arr = m.get(k);
    if (arr) arr.push(v); else m.set(k, [v]);
  }
  const seen = new Set<string>();
  return [...m.values()].map((variants) => {
    const rep = variants[0];
    let slug = strategySlug(rep);
    while (seen.has(slug)) slug += "-x";
    seen.add(slug);
    const rois = variants.map(roiPct).filter((x): x is number => x != null);
    const winDeals = variants.reduce((s, v) => s + (v.stats?.deals || 0), 0);
    const wins = variants.reduce((s, v) => s + (v.stats?.winrate_pct != null ? (v.stats.winrate_pct / 100) * (v.stats.deals || 0) : 0), 0);
    const hs = variants.map((v) => v.stats?.avg_hours).filter((x): x is number => x != null);
    return {
      key: strategyKey(rep),
      slug,
      name: strategyName(rep),
      subtitle: strategySubtitle(rep),
      variants: [...variants].sort((a, b) => (roiPct(b) ?? -1e9) - (roiPct(a) ?? -1e9)),
      coins: variants.length,
      isNew: !!rep.is_new,
      avgRoi: rois.length ? rois.reduce((a, b) => a + b, 0) / rois.length : null,
      totalRealized: variants.reduce((s, v) => s + (v.realized_pnl || 0), 0),
      totalUnrealized: variants.reduce((s, v) => s + (v.unrealized_pnl || 0), 0),
      totalDeals: variants.reduce((s, v) => s + (v.deals_done || 0), 0),
      winrate: winDeals ? (wins / winDeals) * 100 : null,
      avgHours: hs.length ? hs.reduce((a, b) => a + b, 0) / hs.length : null,
    };
  });
}

/** Короткий подзаголовок из реальных параметров. */
export function strategySubtitle(v: Variant): string {
  const parts: string[] = [];
  if (v.take_profit_pct != null) parts.push(`${round(v.take_profit_pct, 2)}% take-profit`);
  if (v.safety_orders != null) parts.push(`${v.safety_orders} safety orders`);
  if (v.grid_coverage_pct != null) parts.push(`${round(v.grid_coverage_pct, 0)}% coverage`);
  parts.push(/grid/i.test(`${v.scheme ?? ""} ${v.name ?? ""}`) ? "even-step grid" : "scaling grid");
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
