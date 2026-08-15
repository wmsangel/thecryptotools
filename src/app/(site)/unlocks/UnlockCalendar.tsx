"use client";

import { useEffect, useMemo, useState } from "react";
import type { UnlockData, UnlockRow } from "@/lib/unlocks/types";
import { CATEGORY_LABELS, unlockSeverity } from "@/lib/unlocks/types";
import { track, bucket } from "@/lib/analytics";

type SortKey = "date" | "pct" | "usd";

const HORIZONS = [30, 90, 180, 400] as const;

export function UnlockCalendar() {
  const [data, setData] = useState<UnlockData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const [days, setDays] = useState<number>(90);
  const [sort, setSort] = useState<SortKey>("pct");
  // Linear vesting is a background drip, not an event. Showing it by default
  // would bury every cliff under thousands of daily rows.
  const [showLinear, setShowLinear] = useState(false);
  const [minPct, setMinPct] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/data/unlocks.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: UnlockData) => {
        setData(d);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const cutoff = new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    const q = query.trim().toLowerCase();

    const filtered = data.rows.filter((r) => {
      if (r.date < today || r.date > cutoff) return false;
      if (!showLinear && r.type !== "cliff") return false;
      // An unknown share is kept: it is a gap in the data, not a small unlock.
      if (minPct > 0 && r.pctOfCirculating != null && r.pctOfCirculating < minPct) return false;
      if (q && !`${r.name} ${r.symbol ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === "pct") return (b.pctOfCirculating ?? -1) - (a.pctOfCirculating ?? -1);
      if (sort === "usd") return (b.usd ?? -1) - (a.usd ?? -1);
      return a.date.localeCompare(b.date) || (b.pctOfCirculating ?? 0) - (a.pctOfCirculating ?? 0);
    });
  }, [data, days, sort, showLinear, minPct, query]);

  useEffect(() => {
    if (state !== "ready") return;
    const timer = setTimeout(() => {
      track("unlocks_filter", {
        horizon_days: days,
        sort,
        min_pct: minPct,
        include_linear: showLinear,
        results: bucket(rows.length),
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [state, days, sort, minPct, showLinear, rows.length]);

  if (state === "loading") return <div className="card mt-8 p-6 muted">Loading the schedule…</div>;
  if (state === "error")
    return (
      <div className="card mt-8 p-6">
        <p className="font-semibold">Could not load the unlock data.</p>
        <p className="muted mt-1 text-sm">Reload the page — nothing is cached server-side.</p>
      </div>
    );

  const grouped = groupByDate(rows);

  return (
    <div className="mt-8">
      {/* ---- Controls ---- */}
      <div className="card p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold muted">Looking ahead</span>
            <select className="input-field" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              {HORIZONS.map((d) => (
                <option key={d} value={d}>
                  {d === 400 ? "Everything scheduled" : `Next ${d} days`}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold muted">Sort by</span>
            <select className="input-field" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="pct">Share of circulating supply</option>
              <option value="date">Date</option>
              <option value="usd">Dollar value</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 flex items-center justify-between text-xs font-semibold muted">
              <span>At least</span>
              <span>{minPct === 0 ? "any size" : `${minPct}% of float`}</span>
            </span>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={minPct}
              onChange={(e) => setMinPct(Number(e.target.value))}
              className="mt-2 w-full accent-brand-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold muted">Find a token</span>
            <input
              type="search"
              className="input-field"
              placeholder="e.g. ARB"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 border-t border-[var(--border)] pt-4">
          <input
            type="checkbox"
            checked={showLinear}
            onChange={(e) => setShowLinear(e.target.checked)}
            className="mt-0.5 accent-brand-500"
          />
          <span className="text-sm">
            <span className="font-semibold">Include linear vesting</span>
            <span className="muted mt-0.5 block text-xs leading-relaxed">
              Off by default. A linear schedule releases a slice every day, so it produces thousands
              of tiny rows that bury the cliffs — which are the ones that actually arrive as an
              event.
            </span>
          </span>
        </label>
      </div>

      {/* ---- Results ---- */}
      <p className="muted mt-5 text-sm">
        {rows.length === 0
          ? "Nothing matches those filters — try a longer window or a lower threshold."
          : `${rows.length} scheduled ${rows.length === 1 ? "release" : "releases"} across ${new Set(rows.map((r) => r.slug)).size} tokens.`}
      </p>

      <div className="mt-5 space-y-8">
        {grouped.map(([date, list]) => (
          <section key={date}>
            <h3 className="sticky top-[var(--header-h,0)] z-10 flex items-baseline gap-3 border-b border-[var(--border)] bg-[var(--bg)] pb-2">
              <span className="text-lg font-extrabold tracking-tight">{longDate(date)}</span>
              <span className="muted text-xs">{relativeDays(date)}</span>
            </h3>
            <div className="mt-3 space-y-2">
              {list.map((row, i) => (
                <UnlockCard key={`${row.slug}-${row.category}-${i}`} row={row} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function UnlockCard({ row }: { row: UnlockRow }) {
  const severity = unlockSeverity(row.pctOfCirculating);
  const tone =
    severity === "high"
      ? "border-red-500/50 bg-red-500/5"
      : severity === "medium"
        ? "border-amber-500/40 bg-amber-500/5"
        : "border-[var(--border)]";

  return (
    <div className={`rounded-xl border px-4 py-3 ${tone}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-bold">{row.symbol || row.name}</span>
          {row.symbol && <span className="muted text-xs">{row.name}</span>}
          <span className="chip !px-2 !py-0.5 text-[11px]">
            {CATEGORY_LABELS[row.category] ?? row.category}
          </span>
          {row.type === "linear" && (
            <span className="muted text-[11px]">daily vesting, not a cliff</span>
          )}
        </div>
        <div className="text-right">
          {row.pctOfCirculating != null ? (
            <span
              className={`font-bold ${
                severity === "high"
                  ? "text-loss"
                  : severity === "medium"
                    ? "text-amber-600 dark:text-amber-400"
                    : ""
              }`}
            >
              {fmtPct(row.pctOfCirculating)} of float
            </span>
          ) : (
            <span className="muted text-sm">share unknown</span>
          )}
          <span className="muted ml-2 text-sm">
            {row.usd != null ? fmtUsd(row.usd) : "—"}
          </span>
        </div>
      </div>

      <div className="muted mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span>{fmtTokens(row.tokens)} {row.symbol || "tokens"}</span>
        {row.groups.length > 0 && <span>· {row.groups.slice(0, 3).join(", ")}</span>}
        {row.marketCap != null && <span>· {fmtUsd(row.marketCap)} market cap</span>}
      </div>
    </div>
  );
}

function groupByDate(rows: UnlockRow[]): [string, UnlockRow[]][] {
  const map = new Map<string, UnlockRow[]>();
  for (const row of rows) {
    const list = map.get(row.date);
    if (list) list.push(row);
    else map.set(row.date, [row]);
  }
  return [...map.entries()];
}

function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function relativeDays(iso: string): string {
  const days = Math.round(
    (Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`)) /
      86_400_000,
  );
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 7) return `in ${days} days`;
  if (days < 60) return `in ${Math.round(days / 7)} weeks`;
  return `in ${Math.round(days / 30)} months`;
}

function fmtPct(v: number): string {
  return `${v >= 10 ? v.toFixed(0) : v.toFixed(v >= 1 ? 1 : 2)}%`;
}

function fmtUsd(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v.toFixed(0)}`;
}

function fmtTokens(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
