"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { parseDay, toIso } from "@/lib/backtest/engine";
import { runGridBacktest, type GridBacktestInput } from "@/lib/backtest/grid-engine";
import type { PriceHistory } from "@/lib/backtest/types";
import { GrowthChart } from "@/components/backtest/GrowthChart";
import { CoinLogo } from "@/components/CoinLogo";
import { track } from "@/lib/analytics";

export interface CoinOption {
  slug: string;
  name: string;
  symbol: string;
  color: string;
}

type Spacing = "arithmetic" | "geometric";

/**
 * Grid-bot backtester. Same one-request, nothing-uploaded model as the
 * investment calculator: a static JSON file per coin, replayed in the browser.
 */
export function GridBacktestApp({ coins }: { coins: CoinOption[] }) {
  const [slug, setSlug] = useState(coins[0]?.slug ?? "bitcoin");
  const [history, setHistory] = useState<PriceHistory | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const [investment, setInvestment] = useState("1000");
  const [grids, setGrids] = useState("20");
  const [feePct, setFeePct] = useState("0.1");
  const [spacing, setSpacing] = useState<Spacing>("arithmetic");
  const [from, setFrom] = useState<string | null>(null);
  const [lower, setLower] = useState<string>("");
  const [upper, setUpper] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetch(`/data/history/${slug}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: PriceHistory) => {
        if (cancelled) return;
        setHistory(data);
        setState("ready");
        setFrom((cur) => cur ?? defaultStart(data));
        // Default the range to the start price ±30% — a plausible forward guess,
        // not the period's realised high/low (that would be hindsight).
        const startP = priceAt(data, from ?? defaultStart(data)) ?? data.prices[data.prices.length - 1];
        setLower(round(startP * 0.7));
        setUpper(round(startP * 1.3));
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const input: GridBacktestInput | null = useMemo(() => {
    const inv = num(investment);
    const lo = num(lower);
    const up = num(upper);
    const g = Math.floor(num(grids));
    if (!history || !from || !(inv > 0) || !(up > lo) || !(lo > 0) || !(g >= 2)) return null;
    return {
      lower: lo,
      upper: up,
      grids: g,
      investment: inv,
      feePct: Math.max(0, num(feePct)),
      spacing,
      from,
      to: history.end,
    };
  }, [history, from, lower, upper, grids, investment, feePct, spacing]);

  const result = useMemo(
    () => (history && input ? runGridBacktest(history, input) : null),
    [history, input],
  );

  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => {
      track("grid_backtest_run", {
        coin: result.history.symbol,
        spacing: result.input.spacing,
        grids: result.input.grids,
        years: Math.round((parseDay(result.actualTo) - parseDay(result.actualFrom)) / (365 * 86_400_000)),
        profitable: result.profit >= 0,
        beat_hold: result.vsHoldPct >= 0,
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [result]);

  const coin = coins.find((c) => c.slug === slug);
  const startPrice = history && from ? priceAt(history, from) : null;

  return (
    <div className="mt-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
        {/* Controls */}
        <form className="card h-max p-6" onSubmit={(e) => e.preventDefault()}>
          <h2 className="eyebrow mb-5">The grid</h2>

          <label className="mb-5 block">
            <span className="mb-1 block text-sm font-medium">Coin</span>
            <select
              className="input-field"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setFrom(null);
                setLower("");
                setUpper("");
              }}
            >
              {coins.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </label>

          <label className="mb-5 block">
            <span className="mb-1 block text-sm font-medium">Total investment</span>
            <div className="relative">
              <input
                className="input-field"
                type="number"
                inputMode="decimal"
                min={1}
                step="any"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm muted">USD</span>
            </div>
          </label>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Lower price</span>
              <input className="input-field" type="number" inputMode="decimal" min={0} step="any" value={lower} onChange={(e) => setLower(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Upper price</span>
              <input className="input-field" type="number" inputMode="decimal" min={0} step="any" value={upper} onChange={(e) => setUpper(e.target.value)} />
            </label>
          </div>

          {startPrice != null && (
            <div className="mb-5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs muted">Price at start: {money(startPrice)}.</span>
              {[20, 30, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setLower(round(startPrice * (1 - pct / 100)));
                    setUpper(round(startPrice * (1 + pct / 100)));
                  }}
                  className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60"
                >
                  ±{pct}%
                </button>
              ))}
            </div>
          )}

          <div className="mb-5 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Grid lines</span>
              <input className="input-field" type="number" inputMode="numeric" min={2} step={1} value={grids} onChange={(e) => setGrids(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Fee per trade</span>
              <div className="relative">
                <input className="input-field" type="number" inputMode="decimal" min={0} step="any" value={feePct} onChange={(e) => setFeePct(e.target.value)} />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm muted">%</span>
              </div>
            </label>
          </div>

          <div className="mb-5">
            <span className="mb-1 block text-sm font-medium">Spacing</span>
            <div className="flex gap-2">
              {(
                [
                  ["arithmetic", "Equal $"],
                  ["geometric", "Equal %"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSpacing(id)}
                  aria-pressed={spacing === id}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    spacing === id ? "border-brand-500 bg-brand-500/10 text-brand-ink" : "border-[var(--border)] hover:border-brand-500/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Starting from</span>
            <input
              className="input-field"
              type="date"
              value={from ?? ""}
              min={history?.start}
              max={history?.end}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>

          {history && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[1, 2, 3, 5].map((years) => {
                const target = shiftYears(history.end, -years);
                if (target < history.start) return null;
                return (
                  <button key={years} type="button" onClick={() => setFrom(target)} className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60">
                    {years}y ago
                  </button>
                );
              })}
            </div>
          )}

          {history && (
            <p className="muted mt-5 text-xs leading-relaxed">
              Daily closes from {history.source}, {history.start} to {history.end}. Nothing you enter here leaves your browser.
            </p>
          )}
        </form>

        {/* Result */}
        <div>
          {state === "loading" && <div className="card p-6 muted">Loading price history…</div>}
          {state === "error" && (
            <div className="card p-6">
              <p className="font-semibold">No price history for this coin yet.</p>
              <p className="muted mt-1 text-sm">Try another asset — every coin with a history file is in the list.</p>
            </div>
          )}
          {state === "ready" && !result && (
            <div className="card p-6 muted">Set a range with the upper price above the lower, an amount and at least two grid lines.</div>
          )}

          {state === "ready" && result && (
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                {coin && <CoinLogo slug={coin.slug} name={coin.name} symbol={coin.symbol} color={coin.color} size={28} />}
                <h2 className="eyebrow">
                  Grid on {result.history.symbol} since {result.actualFrom}
                </h2>
              </div>

              <div className="mt-5 text-4xl font-extrabold leading-tight text-gradient break-words sm:text-5xl">
                {money(result.finalValue)}
              </div>
              <p className="mt-2 text-sm muted">
                from {money(result.totalInvested)} committed · {result.completedTrades.toLocaleString("en-US")} completed grid trades
              </p>

              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${
                  result.profit >= 0 ? "bg-emerald-500/10 text-gain" : "bg-red-500/10 text-loss"
                }`}
              >
                {result.profit >= 0 ? "▲" : "▼"} {money(Math.abs(result.profit))} ({result.roi >= 0 ? "+" : ""}
                {fmtPct(result.roi)})
              </div>

              {/* The comparison that matters for a grid: did it beat just holding? */}
              <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm muted">Buy &amp; hold the same {money(result.totalInvested)}</span>
                  <span className="font-semibold">{money(result.holdValue)}</span>
                </div>
                <div
                  className={`mt-2 text-sm font-bold ${result.vsHoldPct >= 0 ? "text-gain" : "text-loss"}`}
                >
                  {result.vsHoldPct >= 0 ? "The grid beat holding by " : "The grid trailed holding by "}
                  {fmtPct(Math.abs(result.vsHoldPct))}
                </div>
                <p className="muted mt-1 text-xs leading-relaxed">
                  A grid earns from price oscillating inside the range. In a straight trend, holding usually
                  wins; in a choppy, sideways market, the grid can pull ahead.
                </p>
              </div>

              {result.clampedStart && (
                <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                  {result.history.symbol} has no price history before {result.history.start}, so the backtest starts there rather than on the date you picked.
                </p>
              )}

              {(result.leftRangeLow || result.leftRangeHigh) && (
                <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                  Price spent {fmtPct(100 - result.inRangePct)} of the time outside your range
                  {result.leftRangeLow && " (it fell below the floor — the bot was left holding the position it bought on the way down)"}
                  {result.leftRangeLow && result.leftRangeHigh && " and"}
                  {result.leftRangeHigh && " (it rose above the ceiling — the bot sold out and stopped earning while price kept climbing)"}
                  . A grid only works while price stays inside its range.
                </p>
              )}

              <GrowthChart series={result.series} />

              <dl className="mt-6 divide-y divide-[var(--border)]">
                <Row label="Profit banked from grid trades" value={money(result.realizedProfit)} hint={`${result.completedTrades.toLocaleString("en-US")} completed buy→sell cycles`} emphasis />
                <Row label="Open position still held" value={money(result.openPositionValue)} hint="coin bought but not yet sold at a higher line" />
                <Row label="Time price stayed in range" value={fmtPct(result.inRangePct)} hint={`${result.daysInRange.toLocaleString("en-US")} of ${result.daysTotal.toLocaleString("en-US")} days`} />
                <Row label="Deepest fall along the way" value={`−${fmtPct(result.worstDrawdown.pct)}`} hint={`${result.worstDrawdown.from} → ${result.worstDrawdown.to}`} />
                <Row label={`Price on ${result.actualTo}`} value={money(result.lastPrice)} hint={`started at ${money(result.firstPrice)}`} />
              </dl>

              <p className="mt-6 rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-xs leading-relaxed muted">
                Past prices, not a forecast. Fills are modelled at the grid-line price on daily closes, so
                intraday wicks that would have triggered extra trades are not counted — real results vary
                with slippage and your exchange&apos;s fee tier.{" "}
                <Link href="/tools/grid-calculator" className="font-semibold text-brand-ink hover:underline">
                  Plan the grid itself →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, hint, emphasis }: { label: string; value: string; hint?: string; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 text-sm">
      <dt className="muted">
        {label}
        {hint && <span className="mt-0.5 block text-xs">{hint}</span>}
      </dt>
      <dd className={emphasis ? "text-right text-base font-bold text-brand-ink" : "text-right font-semibold"}>{value}</dd>
    </div>
  );
}

function num(s: string): number {
  return Number(String(s).replace(",", "."));
}

function priceAt(history: PriceHistory, iso: string): number | null {
  const DAY = 86_400_000;
  const idx = Math.round((parseDay(iso) - parseDay(history.start)) / DAY);
  if (idx < 0 || idx >= history.prices.length) return history.prices[history.prices.length - 1] ?? null;
  return history.prices[idx];
}

function defaultStart(history: PriceHistory): string {
  const twoYears = shiftYears(history.end, -2);
  return twoYears > history.start ? twoYears : history.start;
}

function shiftYears(iso: string, years: number): string {
  const d = new Date(parseDay(iso));
  return toIso(Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), d.getUTCDate()));
}

function round(v: number): string {
  if (!Number.isFinite(v) || v <= 0) return "";
  if (v >= 1000) return String(Math.round(v / 10) * 10);
  if (v >= 1) return v.toFixed(2);
  return v.toPrecision(3);
}

function money(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const digits = v !== 0 && Math.abs(v) < 1 ? 4 : 2;
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

function fmtPct(v: number): string {
  const abs = Math.abs(v);
  const digits = abs >= 1000 ? 0 : abs >= 100 ? 1 : 2;
  return `${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}
