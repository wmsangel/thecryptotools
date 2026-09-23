"use client";

import { useEffect, useMemo, useState } from "react";
import type { DcaStatus, Variant } from "@/lib/dca/types";
import { SAMPLE_STATUS } from "@/lib/dca/sample";
import {
  DCA_STATUS_URL, coinOf, strategyTitle, strategySubtitle, entryLabel,
  roiPct, stateLabel, pct, usd, hours, daysSince, round,
} from "@/lib/dca/labels";

function Num({ v, kind = "usd", d = 2 }: { v: number | null | undefined; kind?: "usd" | "pct"; d?: number }) {
  const n = v ?? null;
  const cls = n == null ? "text-[var(--muted)]" : n > 0 ? "text-emerald-500" : n < 0 ? "text-red-500" : "text-[var(--muted)]";
  return <span className={cls}>{kind === "pct" ? pct(n, d) : usd(n, d)}</span>;
}

function Card({ v }: { v: Variant }) {
  const [open, setOpen] = useState(false);
  const coin = coinOf(v.symbol);
  const st = stateLabel(v);
  const roi = roiPct(v);
  const slot = (v.slots || []).find((s) => s.state === "in_position");
  const stChip = st.kind === "pos" ? "bg-emerald-500/15 text-emerald-500"
    : st.kind === "wait" ? "bg-amber-500/15 text-amber-500" : "bg-white/5 text-[var(--muted)]";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card,#141a24)] p-5 transition hover:border-[color:var(--muted)]">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 text-left">
        <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: coin.color }} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{strategyTitle(v)}</span>
            {v.is_new && <span className="rounded-md bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-400">NEW</span>}
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${stChip}`}>{st.text}</span>
          </span>
          <span className="mt-0.5 block text-xs text-[var(--muted)]">{strategySubtitle(v)}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-lg font-extrabold"><Num v={roi} kind="pct" /></span>
          <span className="block text-[10px] uppercase tracking-wide text-[var(--muted)]">ROI (paper)</span>
        </span>
      </button>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <Metric label="Realized"><Num v={v.realized_pnl} /></Metric>
        <Metric label="Unrealized"><Num v={v.unrealized_pnl} /></Metric>
        <Metric label="Deals">{v.deals_done}</Metric>
        <Metric label="Win rate">{v.stats?.winrate_pct != null ? `${round(v.stats.winrate_pct, 0)}%` : "—"}</Metric>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--muted)]">Entry: {entryLabel(v.entry_filter)}</span>
        {slot?.drawdown_pct != null && (
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--muted)]">Drawdown {round(slot.drawdown_pct, 1)}%</span>
        )}
        {v.stats?.avg_hours != null && (
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--muted)]">Avg hold {hours(v.stats.avg_hours)}</span>
        )}
        <button onClick={() => setOpen((o) => !o)} className="ml-auto font-semibold text-brand-ink hover:underline">
          {open ? "Hide details" : "Details"}
        </button>
      </div>

      {open && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          {slot ? (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                <Metric label="Avg price">{slot.avg_price != null ? `$${round(slot.avg_price, slot.avg_price < 10 ? 4 : 2).toLocaleString("en-US")}` : "—"}</Metric>
                <Metric label="To take-profit">{slot.to_take_profit_pct != null ? pct(slot.to_take_profit_pct) : "—"}</Metric>
                <Metric label="Safety orders">{slot.safety_orders_filled ?? 0}/{slot.safety_orders_total ?? v.safety_orders ?? "—"}</Metric>
                <Metric label="In position">{hours(slot.hours_in_position)}</Metric>
              </div>
              {slot.grid && slot.grid.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Safety-order grid</div>
                  <div className="space-y-1">
                    {slot.grid.map((g) => (
                      <div key={g.step} className="flex items-center gap-2 text-xs">
                        <span className={`h-2 w-2 rounded-full ${g.status === "filled" ? "bg-emerald-500" : g.status === "pending" ? "bg-amber-500" : "bg-white/20"}`} />
                        <span className="w-14 text-[var(--muted)]">−{round(g.deviation_pct, 0)}%</span>
                        <span className="flex-1 font-mono">${g.price.toLocaleString("en-US")}</span>
                        <span className="text-[var(--muted)]">${round(g.amount_usdt, 1)}</span>
                        <span className="w-16 text-right text-[var(--muted)]">{pct(g.distance_pct, 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              {v.waiting_for_signal ? "No open position — the entry filter is waiting for its signal." : "No open position right now."}
              {" "}Closed deals: {v.deals_done}, all exits by take-profit.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="font-semibold tabular-nums">{children}</div>
    </div>
  );
}

export function DcaBoard() {
  const [status, setStatus] = useState<DcaStatus | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(DCA_STATUS_URL, { cache: "no-store" });
        const d: DcaStatus = await r.json();
        if (!alive) return;
        if (d && Array.isArray(d.variants) && d.variants.length > 0) {
          setStatus(d); setIsSample(false);
        } else {
          setStatus(SAMPLE_STATUS); setIsSample(true);
        }
      } catch {
        if (!alive) return;
        setStatus(SAMPLE_STATUS); setIsSample(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const variants = useMemo(() => {
    const vs = status?.variants ? [...status.variants] : [];
    vs.sort((a, b) => (roiPct(b) ?? -999) - (roiPct(a) ?? -999));
    return vs;
  }, [status]);

  if (loading) return <p className="text-[var(--muted)]">Loading live strategies…</p>;
  if (!status) return null;

  const totalRealized = variants.reduce((s, v) => s + (v.realized_pnl || 0), 0);
  const totalDeals = variants.reduce((s, v) => s + (v.deals_done || 0), 0);
  const days = daysSince(status.started_at);

  return (
    <div>
      {isSample && (
        <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Showing <strong>example data</strong> — the live feed connects the moment the bot starts publishing. Layout and numbers are illustrative.
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile k="Strategies" v={String(variants.length)} />
        <Tile k="Realized (paper)" v={usd(totalRealized)} tone={totalRealized} />
        <Tile k="Closed deals" v={String(totalDeals)} />
        <Tile k="Running" v={days != null ? `${days} days` : "—"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {variants.map((v) => <Card key={v.name} v={v} />)}
      </div>

      <p className="mt-6 text-xs text-[var(--muted)]">
        {isSample ? "Example snapshot" : `Updated ${status.updated_at ?? "—"} UTC`} · paper trading, no real funds ·
        refresh the page for the latest.
      </p>
    </div>
  );
}

function Tile({ k, v, tone }: { k: string; v: string; tone?: number }) {
  const cls = tone == null ? "" : tone > 0 ? "text-emerald-500" : tone < 0 ? "text-red-500" : "";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card,#141a24)] p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{k}</div>
      <div className={`mt-1 text-xl font-extrabold tabular-nums ${cls}`}>{v}</div>
    </div>
  );
}
