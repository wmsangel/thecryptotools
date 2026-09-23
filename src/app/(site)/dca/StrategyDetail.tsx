"use client";

import Link from "next/link";
import type { HistoryDeal } from "@/lib/dca/types";
import type { StrategyGroup } from "@/lib/dca/labels";
import { coinOf, entryLabel, roiPct, stateLabel, pct, usd, hours, round } from "@/lib/dca/labels";
import { platforms, type Platform } from "@/lib/platforms";

const EXCHANGE_SLUGS = ["bybit", "binance", "okx", "kucoin", "bitget", "mexc"];
const EXCHANGES = EXCHANGE_SLUGS
  .map((s) => platforms.find((p) => p.slug === s))
  .filter((p): p is Platform => !!p);

function num(n: number | null | undefined, kind: "usd" | "pct" = "usd") {
  const cls = n == null ? "text-[var(--muted)]" : n > 0 ? "text-emerald-500" : n < 0 ? "text-red-500" : "";
  return <span className={cls}>{kind === "pct" ? pct(n) : usd(n)}</span>;
}

function Metric({ label, children, tone }: { label: string; children: React.ReactNode; tone?: number }) {
  const cls = tone == null ? "" : tone > 0 ? "text-emerald-500" : tone < 0 ? "text-red-500" : "";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className={`mt-1 font-extrabold tabular-nums ${cls}`}>{children}</div>
    </div>
  );
}

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
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 120 }}>
      <defs>
        <linearGradient id="pnlg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={pad} y1={y(0)} x2={w - pad} y2={y(0)} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
      <path d={area} fill="url(#pnlg)" />
      <path d={line} fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function StrategyDetail({ group, onBack }: { group: StrategyGroup; onBack: () => void }) {
  const rep = group.variants[0];
  const deals: (HistoryDeal & { symbol: string })[] = group.variants
    .flatMap((v) => (v.slots || []).flatMap((s) => (s.history || []).map((h) => ({ ...h, symbol: v.symbol }))))
    .sort((a, b) => (a.closed_at || "").localeCompare(b.closed_at || ""));

  return (
    <div>
      <button onClick={onBack} className="mb-5 text-sm font-semibold text-brand-ink hover:underline">← All strategies</button>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-7">
        {/* header */}
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{group.name}</h1>
              {group.isNew && <span className="rounded-md bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-400">NEW</span>}
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-[var(--muted)]">{group.coins} coins</span>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{group.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold">{num(group.avgRoi, "pct")}</div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Avg ROI across coins</div>
          </div>
        </div>

        {/* aggregate KPI */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Realized P&L" tone={group.totalRealized}>{num(group.totalRealized)}</Metric>
          <Metric label="Unrealized" tone={group.totalUnrealized}>{num(group.totalUnrealized)}</Metric>
          <Metric label="Closed deals">{group.totalDeals}</Metric>
          <Metric label="Win rate">{group.winrate != null ? `${round(group.winrate, 0)}%` : "—"}</Metric>
        </div>

        {/* per-coin comparison — the core view */}
        <div className="mt-7">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">This strategy across coins</div>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--muted)]">
                  <th className="px-3 py-2 font-semibold">Coin</th>
                  <th className="px-3 py-2 font-semibold">State</th>
                  <th className="px-3 py-2 text-right font-semibold">ROI</th>
                  <th className="px-3 py-2 text-right font-semibold">Realized</th>
                  <th className="px-3 py-2 text-right font-semibold">Unreal.</th>
                  <th className="px-3 py-2 text-right font-semibold">Deals</th>
                  <th className="px-3 py-2 text-right font-semibold">Win</th>
                  <th className="px-3 py-2 text-right font-semibold">Drawdown</th>
                </tr>
              </thead>
              <tbody>
                {group.variants.map((v) => {
                  const c = coinOf(v.symbol);
                  const st = stateLabel(v);
                  const dd = (v.slots || []).find((s) => s.state === "in_position")?.drawdown_pct;
                  return (
                    <tr key={v.symbol} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                          <span className="font-semibold">{c.name}</span>
                          <span className="text-[var(--muted)]">{c.ticker}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-xs ${st.kind === "pos" ? "text-emerald-500" : st.kind === "wait" ? "text-amber-500" : "text-[var(--muted)]"}`}>{st.text}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-bold">{num(roiPct(v), "pct")}</td>
                      <td className="px-3 py-2 text-right">{num(v.realized_pnl)}</td>
                      <td className="px-3 py-2 text-right">{num(v.unrealized_pnl)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{v.deals_done}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-[var(--muted)]">{v.stats?.winrate_pct != null ? `${round(v.stats.winrate_pct, 0)}%` : "—"}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-[var(--muted)]">{dd != null ? `${round(dd, 1)}%` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* aggregate chart */}
        {deals.length >= 2 && (
          <div className="mt-7">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Cumulative realized P&L (all coins)</div>
            <PnlChart deals={deals} />
          </div>
        )}

        {/* description */}
        <div className="mt-7 space-y-3 text-sm text-[var(--muted)]">
          <h2 className="text-base font-bold">How this strategy works</h2>
          <p>
            <strong>DCA grid</strong>: opens a base position and places a ladder of {rep.safety_orders ?? "several"} safety
            orders across roughly {rep.grid_coverage_pct != null ? `${round(rep.grid_coverage_pct, 0)}%` : "a range"} below entry.
            As price falls, those orders fill and pull the average down; a single take-profit
            {rep.take_profit_pct != null ? ` ${round(rep.take_profit_pct, 2)}%` : ""} above the average closes the cycle in profit.
          </p>
          <p>
            Entry rule: <strong>{entryLabel(rep.entry_filter)}</strong>. The same rules run on {group.coins} coins in parallel —
            the table above shows how each is doing. Every figure is a real outcome on live market prices, updated continuously.
            One strategy can shine on one coin and struggle on another; that&apos;s exactly what this lets you see over time.
          </p>
        </div>

        {/* recent deals */}
        {deals.length > 0 && (
          <div className="mt-7">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Recent closed deals</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[var(--muted)]">
                    <th className="py-1 pr-3 font-semibold">Coin</th>
                    <th className="py-1 pr-3 font-semibold">Closed</th>
                    <th className="py-1 pr-3 font-semibold">Held</th>
                    <th className="py-1 pr-3 font-semibold">Safety orders</th>
                    <th className="py-1 pr-3 text-right font-semibold">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {[...deals].reverse().slice(0, 18).map((d, i) => (
                    <tr key={i} className="border-t border-[var(--border)]">
                      <td className="py-1.5 pr-3">{coinOf(d.symbol).ticker}</td>
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
          Pick an exchange and run it yourself, or have us set it up and get it running for you — no setup headaches.
          Prefer to try first? Test any strategy on a <strong>demo account</strong> before committing real funds.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {EXCHANGES.map((p) => (
            <a key={p.slug} href={`/go/${p.slug}`} target="_blank" rel="sponsored nofollow noopener noreferrer" className="btn-ghost">
              {p.name} →
            </a>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="https://t.me/izagorodnyi" target="_blank" rel="noopener noreferrer" className="btn-primary">Set it up for me — Telegram →</a>
          <a href="mailto:info@thecryptotools.com?subject=DCA%20strategy%20setup" className="btn-ghost">Email us →</a>
          <Link href="/guides/grid-trading-explained" className="btn-ghost">How grid trading works</Link>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Not investment advice. Past results — live or simulated — never guarantee future returns.
        </p>
      </div>

      {/* How the setup service works */}
      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-7">
        <h2 className="text-lg font-bold">How the setup service works</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            { n: 1, t: "Tell us what you want", d: "Message us on Telegram or email — your exchange, budget and how much risk you're comfortable with." },
            { n: 2, t: "We configure it on your account", d: "We set the strategy up on your own exchange account. Your API keys and funds stay with you — we never take custody." },
            { n: 3, t: "It runs — you stay in control", d: "The strategy runs live on your account. You keep full control and can pause or stop it any time." },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-500/50 text-sm font-extrabold text-brand-ink">{s.n}</span>
              <span>
                <span className="block font-semibold">{s.t}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-[var(--muted)]">
          Your API keys and funds stay in your own exchange account — we never take custody or trade on your behalf beyond the
          setup you approve. This is a setup and configuration service, not managed money or investment advice. We recommend
          testing on a demo account first.
        </p>
      </div>
    </div>
  );
}
