"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { runBacktest, parseDay, toIso } from "@/lib/backtest/engine";
import type { BacktestInput, Frequency, PriceHistory, Strategy } from "@/lib/backtest/types";
import { GrowthChart } from "@/components/backtest/GrowthChart";
import { CoinLogo } from "@/components/CoinLogo";
import { track, bucket } from "@/lib/analytics";

const DAY = 86_400_000;

export interface CoinOption {
  slug: string;
  name: string;
  symbol: string;
  /** Fallback badge tint when the logo image fails — CoinLogo requires it. */
  color: string;
}

/**
 * The backtest UI.
 *
 * Everything runs on a static JSON file fetched from our own domain, so the
 * page makes exactly one request, sends nothing anywhere, and does not depend
 * on an exchange API staying up under a traffic spike.
 */
export function BacktestApp({
  coins,
  lockedCoin,
}: {
  coins: CoinOption[];
  /** Set on /investment-calculator/<coin>/ — the page is about one asset. */
  lockedCoin?: string;
}) {
  const [slug, setSlug] = useState(lockedCoin ?? coins[0]?.slug ?? "bitcoin");
  const [history, setHistory] = useState<PriceHistory | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const [strategy, setStrategy] = useState<Strategy>("dca");
  const [amount, setAmount] = useState("100");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    fetch(`/data/history/${slug}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: PriceHistory) => {
        if (cancelled) return;
        setHistory(data);
        setState("ready");
        // Default to five years back, or the whole series when it is shorter —
        // long enough to include a full cycle, short enough to stay believable.
        setFrom((current) => current ?? defaultStart(data));
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const input: BacktestInput | null = useMemo(() => {
    const value = Number(String(amount).replace(",", "."));
    if (!history || !from || !(value > 0)) return null;
    return { strategy, amount: value, from, to: history.end, frequency };
  }, [history, from, strategy, amount, frequency]);

  const result = useMemo(
    () => (history && input ? runBacktest(history, input) : null),
    [history, input],
  );

  // One event per settled configuration, debounced so dragging the amount does
  // not send a hit per keystroke. Records the shape of the question, never the
  // numbers the visitor typed.
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => {
      track("backtest_run", {
        coin: result.history.symbol,
        strategy: result.input.strategy,
        frequency: result.input.strategy === "dca" ? result.input.frequency : undefined,
        years: Math.round((parseDay(result.actualTo) - parseDay(result.actualFrom)) / (365 * DAY)),
        contributions: bucket(result.contributions.length),
        profitable: result.profit >= 0,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [result]);

  const coin = coins.find((c) => c.slug === slug);

  return (
    <div className="mt-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
        {/* Controls */}
        <form className="card h-max p-6" onSubmit={(e) => e.preventDefault()}>
          <h2 className="eyebrow mb-5">The plan</h2>

          {!lockedCoin && (
            <label className="mb-5 block">
              <span className="mb-1 block text-sm font-medium">Coin</span>
              <select
                className="input-field"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  // The new coin may not reach back as far; let it re-default.
                  setFrom(null);
                }}
              >
                {coins.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="mb-5">
            <span className="mb-1 block text-sm font-medium">Strategy</span>
            <div className="flex gap-2">
              {(
                [
                  ["dca", "Buy regularly"],
                  ["lump", "One lump sum"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStrategy(id)}
                  aria-pressed={strategy === id}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    strategy === id
                      ? "border-brand-500 bg-brand-500/10 text-brand-ink"
                      : "border-[var(--border)] hover:border-brand-500/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="mb-5 block">
            <span className="mb-1 block text-sm font-medium">
              {strategy === "dca" ? "Amount each time" : "Amount invested"}
            </span>
            <div className="relative">
              <input
                className="input-field"
                type="number"
                inputMode="decimal"
                min={1}
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm muted">USD</span>
            </div>
          </label>

          {strategy === "dca" && (
            <label className="mb-5 block">
              <span className="mb-1 block text-sm font-medium">How often</span>
              <select
                className="input-field"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
              >
                <option value="weekly">Every week</option>
                <option value="biweekly">Every two weeks</option>
                <option value="monthly">Every month</option>
              </select>
            </label>
          )}

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
              {[1, 3, 5, 10].map((years) => {
                const target = shiftYears(history.end, -years);
                const available = target >= history.start;
                if (!available) return null;
                return (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setFrom(target)}
                    className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60"
                  >
                    {years}y ago
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setFrom(history.start)}
                className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60"
              >
                All time
              </button>
            </div>
          )}

          {history && (
            <p className="muted mt-5 text-xs leading-relaxed">
              Daily closes from {history.source}, {history.start} to {history.end}. Nothing you enter
              here leaves your browser.
            </p>
          )}
        </form>

        {/* Result */}
        <div>
          {state === "loading" && <div className="card p-6 muted">Loading price history…</div>}
          {state === "error" && (
            <div className="card p-6">
              <p className="font-semibold">No price history for this coin yet.</p>
              <p className="muted mt-1 text-sm">
                Try another asset — every coin with a history file is in the list.
              </p>
            </div>
          )}

          {state === "ready" && !result && (
            <div className="card p-6 muted">Enter an amount to see the result.</div>
          )}

          {state === "ready" && result && (
            <>
              <div className="card p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  {coin && (
                    <CoinLogo
                      slug={coin.slug}
                      name={coin.name}
                      symbol={coin.symbol}
                      color={coin.color}
                      size={28}
                    />
                  )}
                  <h2 className="eyebrow">
                    {result.input.strategy === "dca" ? "Buying regularly" : "One purchase"} since{" "}
                    {result.actualFrom}
                  </h2>
                </div>

                <div className="mt-5 text-4xl font-extrabold leading-tight text-gradient break-words sm:text-5xl">
                  {money(result.finalValue)}
                </div>
                <p className="mt-2 text-sm muted">
                  from {money(result.totalInvested)} invested
                  {result.contributions.length > 1 && ` across ${result.contributions.length} purchases`}
                </p>

                <div
                  className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${
                    result.profit >= 0
                      ? "bg-emerald-500/10 text-gain"
                      : "bg-red-500/10 text-loss"
                  }`}
                >
                  {result.profit >= 0 ? "▲" : "▼"} {money(Math.abs(result.profit))} (
                  {result.roi >= 0 ? "+" : ""}
                  {fmtPct(result.roi)})
                </div>

                {result.clampedStart && (
                  <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                    {result.history.symbol} has no price history before {result.history.start}, so the
                    backtest starts there rather than on the date you picked. It has not been
                    extrapolated backwards.
                  </p>
                )}

                <GrowthChart series={result.series} />

                <dl className="mt-6 divide-y divide-[var(--border)]">
                  <Row label="Coins accumulated" value={`${fmtUnits(result.units)} ${result.history.symbol}`} />
                  <Row label="Average price paid" value={money(result.averageEntry)} />
                  <Row
                    label={`Price on ${result.actualTo}`}
                    value={money(result.lastPrice)}
                    hint={
                      result.lastPrice >= result.averageEntry
                        ? "above your average entry"
                        : "below your average entry"
                    }
                  />
                  {result.cagr != null && (
                    <Row label="Annual growth rate (CAGR)" value={`${fmtPct(result.cagr)} a year`} emphasis />
                  )}
                  {result.cagr == null && result.annualised != null && (
                    <Row
                      label="Annualised return"
                      value={`${fmtPct(result.annualised)} a year`}
                      hint="money-weighted — later contributions were invested for less time"
                      emphasis
                    />
                  )}
                  <Row
                    label="Deepest fall along the way"
                    value={`−${fmtPct(result.worstDrawdown.pct)}`}
                    hint={`${result.worstDrawdown.from} → ${result.worstDrawdown.to}`}
                  />
                  <Row label="Best it ever reached" value={money(result.bestDay.value)} hint={result.bestDay.date} />
                </dl>

                <p className="mt-6 rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-xs leading-relaxed muted">
                  Past prices, not a forecast. This ignores trading fees, spreads, withdrawal costs
                  and tax, all of which would have reduced the result — and it is the outcome of one
                  path that already happened, which says nothing about the next one.{" "}
                  <Link href="/guides/dollar-cost-averaging-crypto" className="font-semibold text-brand-ink hover:underline">
                    How DCA actually behaves →
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 text-sm">
      <dt className="muted">
        {label}
        {/* No opacity-70: muted text at 70% measures 2.95:1 on white. The hint
            is already smaller and already muted — dimming it further only made
            it unreadable. */}
        {hint && <span className="mt-0.5 block text-xs">{hint}</span>}
      </dt>
      <dd className={emphasis ? "text-right text-base font-bold text-brand-ink" : "text-right font-semibold"}>
        {value}
      </dd>
    </div>
  );
}

/** Five years back, or the start of the series when it is shorter. */
function defaultStart(history: PriceHistory): string {
  const fiveYears = shiftYears(history.end, -5);
  return fiveYears > history.start ? fiveYears : history.start;
}

function shiftYears(iso: string, years: number): string {
  const d = new Date(parseDay(iso));
  return toIso(Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), d.getUTCDate()));
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

/** Sub-cent coins need many places; BTC needs few. */
function fmtUnits(v: number): string {
  if (v >= 1000) return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (v >= 1) return v.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return v.toLocaleString("en-US", { maximumFractionDigits: 8 });
}
