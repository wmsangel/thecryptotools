"use client";

import { useEffect, useMemo, useState } from "react";
import type { DcaStatus, Variant } from "@/lib/dca/types";
import { SAMPLE_STATUS } from "@/lib/dca/sample";
import { StrategyDetail } from "./StrategyDetail";
import {
  DCA_STATUS_URL, coinOf, strategyTitle, strategySubtitle, variantTag, strategySlug, entryLabel,
  roiPct, stateLabel, pct, usd, hours, daysSince, round,
} from "@/lib/dca/labels";

function Num({ v, kind = "usd", d = 2 }: { v: number | null | undefined; kind?: "usd" | "pct"; d?: number }) {
  const n = v ?? null;
  const cls = n == null ? "text-[var(--muted)]" : n > 0 ? "text-emerald-500" : n < 0 ? "text-red-500" : "text-[var(--muted)]";
  return <span className={cls}>{kind === "pct" ? pct(n, d) : usd(n, d)}</span>;
}

function Card({ v, onOpen }: { v: Variant; onOpen: () => void }) {
  const coin = coinOf(v.symbol);
  const st = stateLabel(v);
  const roi = roiPct(v);
  const slot = (v.slots || []).find((s) => s.state === "in_position");
  const stChip = st.kind === "pos" ? "bg-emerald-500/15 text-emerald-500"
    : st.kind === "wait" ? "bg-amber-500/15 text-amber-500" : "bg-white/5 text-[var(--muted)]";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition hover:border-[color:var(--muted)]">
      <button onClick={onOpen} className="flex w-full items-start gap-3 text-left">
        <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: coin.color }} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{strategyTitle(v)}</span>
            {v.is_new && <span className="rounded-md bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-400">NEW</span>}
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${stChip}`}>{st.text}</span>
          </span>
          <span className="mt-0.5 block text-xs text-[var(--muted)]">{strategySubtitle(v)}</span>
          <span className="mt-0.5 block font-mono text-[10px] text-[var(--muted)] opacity-70">{variantTag(v)}</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-lg font-extrabold"><Num v={roi} kind="pct" /></span>
          <span className="block text-[10px] uppercase tracking-wide text-[var(--muted)]">ROI</span>
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
        <button onClick={onOpen} className="ml-auto font-semibold text-brand-ink hover:underline">Details →</button>
      </div>
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
  const [sort, setSort] = useState<"roi" | "realized" | "deals" | "unreal">("roi");
  const [coin, setCoin] = useState("all");
  const [family, setFamily] = useState<"all" | "new" | "classic">("all");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setSelected(new URLSearchParams(window.location.search).get("s"));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

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

  const all = status?.variants ?? [];

  const coinsList = useMemo(() => {
    const m = new Map<string, string>();
    for (const v of all) m.set(v.symbol, coinOf(v.symbol).name);
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [all]);

  const filtered = useMemo(() => {
    const vs = all.filter(
      (v) =>
        (coin === "all" || v.symbol === coin) &&
        (family === "all" || (family === "new" ? !!v.is_new : !v.is_new)),
    );
    const key = (v: Variant) =>
      sort === "roi" ? (roiPct(v) ?? -1e9)
        : sort === "realized" ? v.realized_pnl
          : sort === "deals" ? v.deals_done
            : v.unrealized_pnl;
    return [...vs].sort((a, b) => key(b) - key(a));
  }, [all, coin, family, sort]);

  const slugMaps = useMemo(() => {
    const bySlug = new Map<string, Variant>();
    const slugOf = new Map<Variant, string>();
    const seen = new Set<string>();
    for (const v of all) {
      let s = strategySlug(v);
      while (seen.has(s)) s += "-x";
      seen.add(s); bySlug.set(s, v); slugOf.set(v, s);
    }
    return { bySlug, slugOf };
  }, [all]);

  if (loading) return <p className="text-[var(--muted)]">Loading live strategies…</p>;
  if (!status) return null;

  const go = (slug: string) => {
    window.history.pushState({}, "", `?s=${encodeURIComponent(slug)}`);
    setSelected(slug);
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    window.history.pushState({}, "", window.location.pathname);
    setSelected(null);
  };
  const current = selected ? slugMaps.bySlug.get(selected) : null;
  if (current) return <StrategyDetail v={current} onBack={back} />;

  const totalRealized = all.reduce((s, v) => s + (v.realized_pnl || 0), 0);
  const totalDeals = all.reduce((s, v) => s + (v.deals_done || 0), 0);
  const earliest = all.flatMap((v) => v.slots || []).map((s) => s.opened_at).filter(Boolean).sort()[0];
  const days = daysSince(status.started_at) ?? daysSince(earliest);
  const shown = showAll ? filtered : filtered.slice(0, 24);
  const selCls = "rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm";

  return (
    <div>
      {isSample && (
        <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Showing <strong>example data</strong> — the live feed connects the moment the bot starts publishing. Layout and numbers are illustrative.
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile k="Strategies" v={String(all.length)} />
        <Tile k="Realized P&L" v={usd(totalRealized)} tone={totalRealized} />
        <Tile k="Closed deals" v={String(totalDeals)} />
        <Tile k="Running" v={days != null ? `${days} days` : "—"} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <select value={coin} onChange={(e) => { setCoin(e.target.value); setShowAll(false); }} className={selCls} aria-label="Filter by coin">
          <option value="all">All coins ({all.length})</option>
          {coinsList.map(([sym, name]) => <option key={sym} value={sym}>{name}</option>)}
        </select>
        <div className="inline-flex overflow-hidden rounded-lg border border-[var(--border)]">
          {(["all", "new", "classic"] as const).map((f) => (
            <button key={f} onClick={() => { setFamily(f); setShowAll(false); }}
              className={`px-3 py-1.5 ${family === f ? "bg-white/10 font-semibold" : "text-[var(--muted)]"}`}>
              {f === "all" ? "All" : f === "new" ? "New" : "Classic"}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={selCls} aria-label="Sort by">
          <option value="roi">Sort: ROI</option>
          <option value="realized">Sort: Realized</option>
          <option value="deals">Sort: Deals</option>
          <option value="unreal">Sort: Unrealized</option>
        </select>
        <span className="ml-auto text-[var(--muted)]">{shown.length} of {filtered.length}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((v) => <Card key={`${v.symbol}-${v.name}`} v={v} onOpen={() => go(slugMaps.slugOf.get(v)!)} />)}
      </div>

      {filtered.length > shown.length && (
        <div className="mt-6 text-center">
          <button onClick={() => setShowAll(true)} className="btn-ghost">Show all {filtered.length} strategies</button>
        </div>
      )}

      <p className="mt-6 text-xs text-[var(--muted)]">
        {isSample ? "Example snapshot" : `Updated ${status.updated_at ?? "—"} UTC`} · live strategy test on real market prices ·
        refresh the page for the latest.
      </p>
    </div>
  );
}

function Tile({ k, v, tone }: { k: string; v: string; tone?: number }) {
  const cls = tone == null ? "" : tone > 0 ? "text-emerald-500" : tone < 0 ? "text-red-500" : "";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{k}</div>
      <div className={`mt-1 text-xl font-extrabold tabular-nums ${cls}`}>{v}</div>
    </div>
  );
}
