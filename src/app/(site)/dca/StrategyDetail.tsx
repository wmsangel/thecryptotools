"use client";

import Link from "next/link";
import type { Variant, HistoryDeal } from "@/lib/dca/types";
import {
  coinOf, strategyTitle, strategySubtitle, variantTag, entryLabel,
  roiPct, stateLabel, pct, usd, hours, round,
} from "@/lib/dca/labels";

function Metric({ label, children, tone }: { label: string; children: React.ReactNode; tone?: number }) {
  const cls = tone == null ? "" : tone > 0 ? "text-emerald-500" : tone < 0 ? "text-red-500" : "";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className={`mt-1 font-extrabold tabular-nums ${cls}`}>{children}</div>
    </div>
  );
}

function num(n: number | null | undefined, kind: "usd" | "pct" = "usd") {
  const cls = n == null ? "text-[var(--muted)]" : n > 0 ? "text-emerald-500" : n < 0 ? "text-red-500" : "";
  return <span className={cls}>{kind === "pct" ? pct(n) : usd(n)}</span>;
}

/** Накопленный PnL по закрытым сделкам — простой встроенный SVG. */
function PnlChart({ deals }: { deals: HistoryDeal[] }) {
  if (deals.length < 2) return null;
  const cum: number[] = [];
  let run = 0;
  for (const d of deals) { run += d.pnl || 0; cum.push(run); }
  const w = 640, h = 120, pad = 6;
  const min = Math.min(0, ...cum), max = Math.max(0, ...cum);
  const span = max - min || 1;
  const x = (i: number) => pad + (i / (cum.length - 1)) * (w - 2 * pad);
  const y = (v: number) => h - pad - ((v - min) / span) * (h - 2 * pad);
  const line = cum.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(cum.length - 1).toFixed(1)},${(h - pad).toFixed(1)} L${x(0).toFixed(1)},${(h - pad).toFixed(1)} Z`;
  const zeroY = y(0);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 120 }}>
      <defs>
        <linearGradient id="pnlg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={pad} y1={zeroY} x2={w - pad} y2={zeroY} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
      <path d={area} fill="url(#pnlg)" />
      <path d={line} fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function StrategyDetail({ v, onBack }: { v: Variant; onBack: () => void }) {
  const coin = coinOf(v.symbol);
  const st = stateLabel(v);
  const slot = (v.slots || []).find((s) => s.state === "in_position");
  const deals = (v.slots || [])
    .flatMap((s) => s.history || [])
    .sort((a, b) => (a.closed_at || "").localeCompare(b.closed_at || ""));
  const exchangeHref = "/go/bybit";

  return (
    <div>
      <button onClick={onBack} className="mb-5 text-sm font-semibold text-brand-ink hover:underline">← All strategies</button>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-7">
        {/* header */}
        <div className="flex flex-wrap items-start gap-3">
          <span className="mt-1 h-4 w-4 shrink-0 rounded-full" style={{ background: coin.color }} aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{strategyTitle(v)}</h1>
              {v.is_new && <span className="rounded-md bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-400">NEW</span>}
              <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${st.kind === "pos" ? "bg-emerald-500/15 text-emerald-500" : st.kind === "wait" ? "bg-amber-500/15 text-amber-500" : "bg-white/5 text-[var(--muted)]"}`}>{st.text}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{strategySubtitle(v)}</p>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)] opacity-70">{variantTag(v)} · {v.symbol}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold">{num(roiPct(v), "pct")}</div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">ROI</div>
          </div>
        </div>

        {/* KPI grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Realized P&L" tone={v.realized_pnl}>{num(v.realized_pnl)}</Metric>
          <Metric label="Unrealized" tone={v.unrealized_pnl}>{num(v.unrealized_pnl)}</Metric>
          <Metric label="Closed deals">{v.deals_done}</Metric>
          <Metric label="Win rate">{v.stats?.winrate_pct != null ? `${round(v.stats.winrate_pct, 0)}%` : "—"}</Metric>
          <Metric label="Avg hold">{hours(v.stats?.avg_hours)}</Metric>
          <Metric label="Best / worst">{v.stats?.best_pnl != null ? `${usd(v.stats.best_pnl)} / ${usd(v.stats.worst_pnl)}` : "—"}</Metric>
          <Metric label="Take-profit">{v.take_profit_pct != null ? `${round(v.take_profit_pct, 2)}%` : "—"}</Metric>
          <Metric label="Drawdown now">{slot?.drawdown_pct != null ? `${round(slot.drawdown_pct, 1)}%` : "—"}</Metric>
        </div>

        {/* chart */}
        {deals.length >= 2 && (
          <div className="mt-6">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Cumulative realized P&L</div>
            <PnlChart deals={deals} />
          </div>
        )}

        {/* description */}
        <div className="mt-6 space-y-3 text-sm text-[var(--muted)]">
          <h2 className="text-base font-bold text-[color:var(--fg,inherit)]">How this strategy works</h2>
          <p>
            {coin.name} <strong>DCA grid</strong>: it opens a base position and places a ladder of{" "}
            {v.safety_orders ?? "several"} safety orders spread across roughly {v.grid_coverage_pct != null ? `${round(v.grid_coverage_pct, 0)}%` : "a range"} below entry.
            As price falls, those orders fill and pull the average entry down; a single take-profit sits{" "}
            {v.take_profit_pct != null ? `${round(v.take_profit_pct, 2)}%` : ""} above the average, closing the cycle in profit.
          </p>
          <p>
            Entry rule: <strong>{entryLabel(v.entry_filter)}</strong>. Every figure on this page is a real outcome of these
            rules running live on {coin.name} market prices, updated continuously.
          </p>
        </div>

        {/* current position + grid */}
        {slot?.grid && slot.grid.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Open position — safety-order grid</div>
            <div className="space-y-1">
              {slot.grid.map((g) => (
                <div key={g.step} className="flex items-center gap-2 text-xs">
                  <span className={`h-2 w-2 rounded-full ${g.status === "filled" ? "bg-emerald-500" : g.status === "pending" ? "bg-amber-500" : "bg-[var(--border)]"}`} />
                  <span className="w-14 text-[var(--muted)]">−{round(g.deviation_pct, 0)}%</span>
                  <span className="flex-1 font-mono">${g.price.toLocaleString("en-US")}</span>
                  <span className="text-[var(--muted)]">${round(g.amount_usdt, 1)}</span>
                  <span className="w-16 text-right text-[var(--muted)]">{pct(g.distance_pct, 1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* trade history */}
        {deals.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Recent closed deals</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[var(--muted)]">
                    <th className="py-1 pr-3 font-semibold">Closed</th>
                    <th className="py-1 pr-3 font-semibold">Held</th>
                    <th className="py-1 pr-3 font-semibold">Safety orders</th>
                    <th className="py-1 pr-3 text-right font-semibold">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {[...deals].reverse().slice(0, 15).map((d, i) => (
                    <tr key={i} className="border-t border-[var(--border)]">
                      <td className="py-1.5 pr-3">{(d.closed_at || "").slice(0, 10)}</td>
                      <td className="py-1.5 pr-3">{hours(d.hours)}</td>
                      <td className="py-1.5 pr-3">{d.safety_orders ?? 0}</td>
                      <td className="py-1.5 pr-3 text-right">{num(d.pnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6 rounded-2xl border border-brand-500/40 hero-glow p-6 sm:p-7">
        <h2 className="text-xl font-extrabold tracking-tight">Want to run a strategy like this?</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          These strategies run on Bybit. Open an account, or let us set one up and run it for you on our own server —
          no setup headaches. Prefer to try first? Test any strategy on a <strong>demo account</strong> before committing real funds.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={exchangeHref} target="_blank" rel="sponsored nofollow noopener noreferrer" className="btn-primary">
            Open a Bybit account →
          </a>
          <Link href="/donate" className="btn-ghost">Get it set up for you →</Link>
          <Link href="/guides/grid-trading-explained" className="btn-ghost">How grid trading works</Link>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Not investment advice. Past results — live or simulated — never guarantee future returns.
        </p>
      </div>
    </div>
  );
}
