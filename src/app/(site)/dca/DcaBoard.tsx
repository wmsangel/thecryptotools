"use client";

import { useEffect, useMemo, useState } from "react";
import type { DcaStatus } from "@/lib/dca/types";
import { SAMPLE_STATUS } from "@/lib/dca/sample";
import { StrategyDetail } from "./StrategyDetail";
import type { StrategyGroup } from "@/lib/dca/labels";
import { DCA_STATUS_URL, buildGroups, coinOf, pct, usd, round, daysSince } from "@/lib/dca/labels";

function Num({ v, kind = "usd", d = 2 }: { v: number | null | undefined; kind?: "usd" | "pct"; d?: number }) {
  const n = v ?? null;
  const cls = n == null ? "text-[var(--muted)]" : n > 0 ? "text-emerald-500" : n < 0 ? "text-red-500" : "text-[var(--muted)]";
  return <span className={cls}>{kind === "pct" ? pct(n, d) : usd(n, d)}</span>;
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="font-semibold tabular-nums">{children}</div>
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

function GroupCard({ g, onOpen }: { g: StrategyGroup; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="block w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 text-left transition hover:border-[color:var(--muted)]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{g.name}</span>
            {g.isNew && <span className="rounded-md bg-fuchsia-500/15 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-400">NEW</span>}
            <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-[var(--muted)]">{g.coins} coins</span>
          </div>
          <div className="mt-0.5 text-xs text-[var(--muted)]">{g.subtitle}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-extrabold"><Num v={g.avgRoi} kind="pct" /></div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Avg ROI</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <Metric label="Realized"><Num v={g.totalRealized} /></Metric>
        <Metric label="Unrealized"><Num v={g.totalUnrealized} /></Metric>
        <Metric label="Deals">{g.totalDeals}</Metric>
        <Metric label="Win rate">{g.winrate != null ? `${round(g.winrate, 0)}%` : "—"}</Metric>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {g.variants.slice(0, 8).map((v) => (
          <span key={v.symbol} className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: coinOf(v.symbol).color }} />
            {coinOf(v.symbol).ticker}
          </span>
        ))}
        {g.coins > 8 && <span className="text-[10px] text-[var(--muted)]">+{g.coins - 8}</span>}
        <span className="ml-auto text-xs font-semibold text-brand-ink">See per-coin results →</span>
      </div>
    </button>
  );
}

export function DcaBoard() {
  const [status, setStatus] = useState<DcaStatus | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"roi" | "realized" | "deals" | "coins">("roi");
  const [family, setFamily] = useState<"all" | "new" | "classic">("all");
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
        if (d && Array.isArray(d.variants) && d.variants.length > 0) { setStatus(d); setIsSample(false); }
        else { setStatus(SAMPLE_STATUS); setIsSample(true); }
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
  const groups = useMemo(() => buildGroups(all), [all]);

  const filtered = useMemo(() => {
    const gs = groups.filter((g) => family === "all" || (family === "new" ? g.isNew : !g.isNew));
    const key = (g: StrategyGroup) =>
      sort === "roi" ? (g.avgRoi ?? -1e9)
        : sort === "realized" ? g.totalRealized
          : sort === "deals" ? g.totalDeals
            : g.coins;
    return [...gs].sort((a, b) => key(b) - key(a));
  }, [groups, family, sort]);

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
  const current = selected ? groups.find((g) => g.slug === selected) : null;
  if (current) return <StrategyDetail group={current} onBack={back} />;

  const coins = new Set(all.map((v) => v.symbol)).size;
  const totalRealized = all.reduce((s, v) => s + (v.realized_pnl || 0), 0);
  const totalDeals = all.reduce((s, v) => s + (v.deals_done || 0), 0);
  const days = daysSince(status.started_at) ?? daysSince(all.flatMap((v) => v.slots || []).map((s) => s.opened_at).filter(Boolean).sort()[0]);
  const selCls = "rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm";

  return (
    <div>
      {isSample && (
        <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Showing <strong>example data</strong> — the live feed connects the moment the bot starts publishing. Layout and numbers are illustrative.
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile k="Strategies" v={String(groups.length)} />
        <Tile k="Coins covered" v={String(coins)} />
        <Tile k="Realized P&L" v={usd(totalRealized)} tone={totalRealized} />
        <Tile k="Closed deals" v={String(totalDeals)} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <div className="inline-flex overflow-hidden rounded-lg border border-[var(--border)]">
          {(["all", "new", "classic"] as const).map((f) => (
            <button key={f} onClick={() => setFamily(f)}
              className={`px-3 py-1.5 ${family === f ? "bg-white/10 font-semibold" : "text-[var(--muted)]"}`}>
              {f === "all" ? "All" : f === "new" ? "New" : "Classic"}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={selCls} aria-label="Sort by">
          <option value="roi">Sort: avg ROI</option>
          <option value="realized">Sort: realized P&L</option>
          <option value="deals">Sort: closed deals</option>
          <option value="coins">Sort: coins covered</option>
        </select>
        <span className="ml-auto text-[var(--muted)]">{filtered.length} strategies</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((g) => <GroupCard key={g.slug} g={g} onOpen={() => go(g.slug)} />)}
      </div>

      <p className="mt-6 text-xs text-[var(--muted)]">
        {isSample ? "Example snapshot" : `Updated ${status.updated_at ?? "—"} UTC`} · live strategy test on real market prices ·
        running {days != null ? `${days} days` : "—"} · refresh for the latest.
      </p>
    </div>
  );
}
