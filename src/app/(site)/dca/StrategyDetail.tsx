"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { HistoryDeal } from "@/lib/dca/types";
import type { StrategyGroup } from "@/lib/dca/labels";
import { coinOf, entryLabel, roiPct, stateLabel, pct, usd, hours, round, aggressivenessLabel } from "@/lib/dca/labels";
import { strategyTypeFor } from "@/lib/dca/strategy-types";
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

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      LIVE · updated continuously
    </span>
  );
}

function PnlChart({ deals }: { deals: (HistoryDeal & { symbol?: string })[] }) {
  const [hi, setHi] = useState<number | null>(null);
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
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    setHi(Math.max(0, Math.min(cum.length - 1, Math.round(rx * (cum.length - 1)))));
  };
  const leftPct = hi != null ? (hi / (cum.length - 1)) * 100 : 0;
  return (
    <div className="relative" onMouseMove={onMove} onMouseLeave={() => setHi(null)} onTouchStart={() => setHi(null)}>
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
        {hi != null && <line x1={x(hi)} y1={pad} x2={x(hi)} y2={h - pad} stroke="var(--muted)" strokeWidth="1" />}
        {hi != null && <circle cx={x(hi)} cy={y(cum[hi])} r={3.5} fill="#2dd4bf" stroke="var(--bg-elevated)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
      </svg>
      {hi != null && (
        <div className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 text-xs shadow-lg"
          style={{ left: `${Math.min(90, Math.max(10, leftPct))}%` }}>
          <span className={`font-bold ${cum[hi] > 0 ? "text-emerald-500" : cum[hi] < 0 ? "text-red-500" : ""}`}>{usd(cum[hi])}</span>
          <span className="ml-2 text-[var(--muted)]">{(deals[hi].closed_at || "").slice(0, 10)}</span>
          {deals[hi].symbol && <span className="ml-2 text-[var(--muted)]">{coinOf(deals[hi].symbol!).ticker}</span>}
        </div>
      )}
    </div>
  );
}

type SortKey = "coin" | "roi" | "realized" | "unreal" | "deals" | "win" | "dd";

export function StrategyDetail({ group }: { group: StrategyGroup }) {
  const rep = group.variants[0];
  const type = strategyTypeFor(group.name);

  const deals: (HistoryDeal & { symbol: string })[] = group.variants
    .flatMap((v) => (v.slots || []).flatMap((s) => (s.history || []).map((h) => ({ ...h, symbol: v.symbol }))))
    .sort((a, b) => (a.closed_at || "").localeCompare(b.closed_at || ""));

  // Rows for the per-coin table (sortable).
  const rows = useMemo(() => group.variants.map((v) => {
    const c = coinOf(v.symbol);
    const st = stateLabel(v);
    const dd = (v.slots || []).find((s) => s.state === "in_position")?.drawdown_pct ?? null;
    return { v, c, st, coin: c.name, roi: roiPct(v), realized: v.realized_pnl, unreal: v.unrealized_pnl, deals: v.deals_done, win: v.stats?.winrate_pct ?? null, dd };
  }), [group]);

  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "roi", dir: -1 });
  const sorted = useMemo(() => {
    const arr = [...rows];
    const { key, dir } = sort;
    arr.sort((a, b) => {
      if (key === "coin") return a.coin.localeCompare(b.coin) * dir;
      const av = a[key] as number | null, bv = b[key] as number | null;
      if (av == null && bv == null) return 0;
      if (av == null) return 1; // nulls last
      if (bv == null) return -1;
      return (av - bv) * dir;
    });
    return arr;
  }, [rows, sort]);

  const best = useMemo(() => rows.filter((r) => r.roi != null).sort((a, b) => (b.roi as number) - (a.roi as number))[0], [rows]);
  // Unique, data-derived facts for this exact configuration (self-updating).
  const worst = useMemo(() => rows.filter((r) => r.roi != null).sort((a, b) => (a.roi as number) - (b.roi as number))[0], [rows]);
  const inPos = rows.filter((r) => r.st.kind === "pos").length;
  const tp = rep.take_profit_pct;
  const cov = rep.grid_coverage_pct;
  // Capital is a budget, not a P&L, so format it unsigned (usd() prefixes a +).
  const capStr = rep.capital != null ? `$${Math.round(rep.capital).toLocaleString("en-US")}` : null;
  const tpWord = tp == null ? null : tp <= 3 ? "quick, frequent take-profits" : tp <= 8 ? "moderate take-profits" : "patient, larger take-profits";
  const covWord = cov == null ? null : cov >= 40 ? "deep coverage — lots of room before the last safety order fills" : cov >= 20 ? "moderate coverage" : "shallow coverage — the grid runs out of safety orders sooner in a big drop";

  function clickSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "coin" ? 1 : -1 }));
  }
  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : "");
  const Th = ({ k, children, right }: { k: SortKey; children: React.ReactNode; right?: boolean }) => (
    <th className={`px-3 py-2 font-semibold ${right ? "text-right" : "text-left"}`}>
      <button type="button" onClick={() => clickSort(k)} className={`inline-flex items-center hover:text-brand-ink ${sort.key === k ? "text-brand-ink" : ""}`}>
        {children}<span className="tabular-nums">{arrow(k)}</span>
      </button>
    </th>
  );

  return (
    <div>
      <Link href="/dca/" className="mb-5 inline-block text-sm font-semibold text-brand-ink hover:underline">← All strategies</Link>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-7">
        {/* header */}
        <LiveBadge />
        <div className="mt-3 flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{group.name}</h1>
              {group.isNew && <span className="rounded-md bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-400">NEW</span>}
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-[var(--muted)]">{group.coins} coins</span>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{group.subtitle}</p>
            {type && <p className="mt-2 max-w-2xl text-sm font-medium text-[var(--text)]/90">{type.tagline}</p>}
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold">{num(group.avgRoi, "pct")}</div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Avg ROI across coins</div>
          </div>
        </div>

        {/* aggregate KPI */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Metric label="Realized P&L" tone={group.totalRealized}>{num(group.totalRealized)}</Metric>
          <Metric label="Unrealized" tone={group.totalUnrealized}>{num(group.totalUnrealized)}</Metric>
          <Metric label="Closed deals">{group.totalDeals}</Metric>
          <Metric label="Win rate">{group.winrate != null ? `${round(group.winrate, 0)}%` : "—"}</Metric>
          <Metric label="Avg hold">{hours(group.avgHours)}</Metric>
          <Metric label="Best coin">{best ? <span>{best.c.ticker} {num(best.roi, "pct")}</span> : "—"}</Metric>
        </div>

        {/* per-coin comparison — the core view, sortable */}
        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">This strategy across coins</div>
            <div className="text-[11px] text-[var(--muted)]">tap a column to sort</div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--muted)]">
                  <Th k="coin">Coin</Th>
                  <th className="px-3 py-2 text-left font-semibold">State</th>
                  <Th k="roi" right>ROI</Th>
                  <Th k="realized" right>Realized</Th>
                  <Th k="unreal" right>Unreal.</Th>
                  <Th k="deals" right>Deals</Th>
                  <Th k="win" right>Win</Th>
                  <Th k="dd" right>Drawdown</Th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.v.symbol} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.c.color }} />
                        <span className="font-semibold">{r.c.name}</span>
                        <span className="text-[var(--muted)]">{r.c.ticker}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs ${r.st.kind === "pos" ? "text-emerald-500" : r.st.kind === "wait" ? "text-amber-500" : "text-[var(--muted)]"}`}>{r.st.text}</span>
                    </td>
                    <td className="px-3 py-2 text-right font-bold">{num(r.roi, "pct")}</td>
                    <td className="px-3 py-2 text-right">{num(r.realized)}</td>
                    <td className="px-3 py-2 text-right">{num(r.unreal)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.deals}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-[var(--muted)]">{r.win != null ? `${round(r.win, 0)}%` : "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-[var(--muted)]">{r.dd != null ? `${round(r.dd, 1)}%` : "—"}</td>
                  </tr>
                ))}
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

        {/* description — enriched from the strategy type */}
        <div className="mt-8 space-y-4 text-sm text-[var(--muted)]">
          <h2 className="text-lg font-bold text-[var(--text)]">How this strategy works</h2>
          {type && <p>{type.description}</p>}
          <p>
            In character it leans <strong>{aggressivenessLabel(rep)}</strong>. In numbers, a <strong>DCA grid</strong> with {rep.safety_orders ?? "several"} safety orders laddered across
            roughly {rep.grid_coverage_pct != null ? `${round(rep.grid_coverage_pct, 0)}%` : "a range"} below the entry
            {/grid/i.test(`${rep.scheme ?? ""} ${rep.name ?? ""}`) ? " (even-step spacing)" : " (scaling spacing — orders grow further down)"}.
            A base order opens the cycle; as price falls the safety orders fill and pull the average entry down, and a single
            take-profit{rep.take_profit_pct != null ? ` ${round(rep.take_profit_pct, 2)}%` : ""} above that average closes the whole
            cycle in profit. The entry rule — <strong>{entryLabel(rep.entry_filter)}</strong> — decides when a new cycle may start.
          </p>
          <p className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 px-4 py-3">
            <strong className="text-[var(--text)]">This configuration right now:</strong> it has booked {num(group.totalRealized)} across{" "}
            {group.totalDeals} closed {group.totalDeals === 1 ? "cycle" : "cycles"} on {group.coins} coins, holding each about {hours(group.avgHours)} on average.{" "}
            {best && worst && best.v.symbol !== worst.v.symbol && (
              <>Results differ by coin — best is <strong>{best.c.ticker}</strong> at {num(best.roi, "pct")}, weakest{" "}
              <strong>{worst.c.ticker}</strong> at {num(worst.roi, "pct")}. </>
            )}
            {inPos > 0 && <>{inPos} of {group.coins} {inPos === 1 ? "is" : "are"} in a position, carrying {num(group.totalUnrealized)} unrealized. </>}
            {tpWord && covWord && tp != null && cov != null && (
              <>Its {round(tp, 2)}% take-profit means {tpWord}, and its {round(cov, 0)}% coverage is {covWord}.</>
            )}
          </p>
          {type && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Best in</div>
                <div className="mt-1 text-[var(--text)]/90">{type.whenGood}</div>
              </div>
              <div className="rounded-xl border border-[var(--border)] px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-500">Trade-off</div>
                <div className="mt-1 text-[var(--text)]/90">{type.tradeoff}</div>
              </div>
            </div>
          )}
          <p>
            The same rules run on <strong>{group.coins} coins in parallel</strong>, and the table above shows how each is doing —
            every figure is a real outcome on live market prices, updated continuously. One strategy can shine on one coin and
            struggle on another; watching that over time is exactly the point.
          </p>

          <h2 className="pt-2 text-lg font-bold text-[var(--text)]">Reading the numbers honestly</h2>
          <p>
            A grid without a stop-loss tends to show a <strong>very high win rate</strong> — it only ever closes a cycle in
            profit. The real risk doesn&apos;t live in the closed-deal record; it lives in the <strong>open drawdown</strong>
            during a deep, sustained fall, while safety orders keep averaging down a position that&apos;s still underwater.
            So read <em>realized</em> and <em>unrealized</em> together, and watch the drawdown column — that&apos;s where the
            danger actually is.
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

        {/* Exactly what this strategy is — the config to replicate + its capital footprint. */}
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">What you&apos;d be setting up</div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Metric label="Take-profit">{tp != null ? `${round(tp, 2)}%` : "—"}</Metric>
            <Metric label="Safety orders">{rep.safety_orders ?? "—"}</Metric>
            <Metric label="Grid coverage">{cov != null ? `${round(cov, 0)}%` : "—"}</Metric>
            <Metric label="Spacing">{/grid/i.test(`${rep.scheme ?? ""} ${rep.name ?? ""}`) ? "Even-step" : "Scaling"}</Metric>
            <Metric label="Entry rule">{entryLabel(rep.entry_filter)}</Metric>
            {capStr && <Metric label="Budget per coin">≈ {capStr}</Metric>}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            These are the exact settings tested above{capStr ? `, run with about ${capStr} of capital per coin` : ""}. Replicate
            them on any bot-capable exchange, or send them to us and we&apos;ll configure it on your account.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXCHANGES.map((p) => (
            <a key={p.slug} href={`/go/${p.slug}`} target="_blank" rel="sponsored nofollow noopener noreferrer" data-affiliate={p.slug} data-affiliate-placement="dca-strategy" className="btn-ghost">
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
