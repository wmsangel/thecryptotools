"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  compareRebalancing,
  correlationMatrix,
  diversification,
  runPortfolio,
} from "@/lib/portfolio/engine";
import type {
  Allocation,
  PortfolioInput,
  PriceHistory,
  RebalanceFrequency,
} from "@/lib/portfolio/types";
import { parseDay, toIso } from "@/lib/backtest/engine";
import { GrowthChart } from "@/components/backtest/GrowthChart";
import { CorrelationHeatmap } from "@/components/portfolio/CorrelationHeatmap";
import { CoinLogo } from "@/components/CoinLogo";
import { track } from "@/lib/analytics";
import type { PortfolioCoinOption, PortfolioPreset } from "./options";

const MAX_ASSETS = 8;

/**
 * The portfolio analyser.
 *
 * Every price file is fetched from our own domain and every figure is computed
 * in the browser, so a portfolio typed in here is never transmitted anywhere —
 * which is the entire reason this can be given away while the same analysis is
 * a paid feature elsewhere. There is no account to make and nothing to upload.
 */
export function PortfolioApp({
  coins,
  presets,
  historyThrough,
}: {
  coins: PortfolioCoinOption[];
  presets: PortfolioPreset[];
  historyThrough: string;
}) {
  const [allocations, setAllocations] = useState<Allocation[]>(presets[2].allocations);
  const [initial, setInitial] = useState("10000");
  const [monthly, setMonthly] = useState("0");
  const [rebalance, setRebalance] = useState<RebalanceFrequency>("quarterly");
  const [riskFree, setRiskFree] = useState("4");
  const [from, setFrom] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Every history file fetched so far, kept for the life of the page: switching
  // back to an asset already looked at must not cost another 20 KB download.
  const cache = useRef(new Map<string, PriceHistory>());
  const [histories, setHistories] = useState<PriceHistory[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const byId = useMemo(() => new Map(coins.map((c) => [c.slug, c])), [coins]);
  const slugs = useMemo(() => allocations.map((a) => a.slug), [allocations]);
  const slugKey = slugs.join(",");

  // ------------------------------------------------------------- URL state
  // Read once on mount. A shared link has to reproduce the exact portfolio the
  // sender was looking at, or sharing a result is pointless.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("a");
    if (encoded) {
      const parsed = decodeAllocations(encoded, byId);
      if (parsed.length > 0) setAllocations(parsed);
    }
    const number = (key: string) => {
      const raw = params.get(key);
      return raw && Number.isFinite(Number(raw)) && Number(raw) >= 0 ? raw : null;
    };
    const i = number("i");
    if (i) setInitial(i);
    const m = number("m");
    if (m) setMonthly(m);
    const r = params.get("r");
    if (r === "none" || r === "monthly" || r === "quarterly" || r === "yearly") setRebalance(r);
    const f = params.get("f");
    if (f && /^\d{4}-\d{2}-\d{2}$/.test(f)) setFrom(f);
    // Mount only: later edits must not be overwritten by a stale query string.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------- price histories
  useEffect(() => {
    let cancelled = false;
    const wanted = slugKey ? slugKey.split(",") : [];
    const missing = wanted.filter((s) => !cache.current.has(s));

    if (missing.length === 0) {
      setHistories(wanted.map((s) => cache.current.get(s) as PriceHistory));
      setState(wanted.length > 0 ? "ready" : "error");
      return;
    }

    setState("loading");
    Promise.all(
      missing.map((slug) =>
        fetch(`/data/history/${slug}.json`)
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
          .then((data: PriceHistory) => [slug, data] as const),
      ),
    )
      .then((loaded) => {
        if (cancelled) return;
        for (const [slug, data] of loaded) cache.current.set(slug, data);
        setHistories(wanted.map((s) => cache.current.get(s) as PriceHistory));
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slugKey]);

  // The earliest date this particular mix can be tested from — the latest start
  // among its assets. Shown, not silently applied, so dropping the newest coin
  // to reach further back is an obvious move rather than a discovery.
  const earliest = useMemo(() => {
    const starts = slugs.map((s) => byId.get(s)?.start).filter(Boolean) as string[];
    return starts.length > 0 ? starts.reduce((a, b) => (a > b ? a : b)) : null;
  }, [slugs, byId]);

  // The date the visitor asked for, NOT clamped to what the mix supports.
  //
  // Clamping here would be the obvious thing and would be wrong: the engine
  // decides the real window and sets `clamped`/`limitedBy` by comparing what was
  // asked for against what exists, so pre-clamping makes those two agree and the
  // "this mix only goes back to …" warning can never fire. Silently moving
  // someone's start date is exactly the failure that warning exists to prevent.
  const requestedFrom = useMemo(() => {
    if (!earliest) return null;
    return from ?? defaultStart(earliest, historyThrough);
  }, [from, earliest, historyThrough]);

  const input: PortfolioInput | null = useMemo(() => {
    const start = Number(String(initial).replace(",", "."));
    const perMonth = Number(String(monthly).replace(",", ".")) || 0;
    const rf = Number(String(riskFree).replace(",", ".")) || 0;
    if (!requestedFrom || !(start > 0) || allocations.length === 0) return null;
    return {
      allocations,
      initial: start,
      monthlyContribution: Math.max(0, perMonth),
      from: requestedFrom,
      to: historyThrough,
      rebalance,
      riskFreeRate: rf,
    };
  }, [allocations, initial, monthly, riskFree, requestedFrom, rebalance, historyThrough]);

  const ready = state === "ready" && histories.length === allocations.length;

  const result = useMemo(
    () => (ready && input ? runPortfolio(histories, input) : null),
    [ready, histories, input],
  );

  const rebalanceRows = useMemo(
    () => (ready && input ? compareRebalancing(histories, input) : []),
    [ready, histories, input],
  );

  const spread = useMemo(
    () =>
      result && input
        ? diversification(histories, input.allocations, result.actualFrom, result.actualTo)
        : null,
    [histories, input, result],
  );

  const matrix = useMemo(
    () =>
      result && histories.length > 1
        ? correlationMatrix(histories, result.actualFrom, result.actualTo)
        : null,
    [histories, result],
  );

  // One event per settled configuration. Records the shape of the question —
  // how many assets, which policy, how long — and none of the amounts typed.
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => {
      track("portfolio_run", {
        assets: result.assets.length,
        rebalance: result.input.rebalance,
        contributions: result.input.monthlyContribution > 0,
        years: Math.round(
          (parseDay(result.actualTo) - parseDay(result.actualFrom)) / (365 * 86_400_000),
        ),
        profitable: result.profit >= 0,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [result]);

  // ------------------------------------------------------------- mutations
  const setWeight = useCallback((slug: string, weight: number) => {
    setAllocations((current) =>
      current.map((a) => (a.slug === slug ? { ...a, weight } : a)),
    );
  }, []);

  const removeAsset = useCallback((slug: string) => {
    setAllocations((current) =>
      current.length > 1 ? current.filter((a) => a.slug !== slug) : current,
    );
  }, []);

  const swapAsset = useCallback((from_: string, to_: string) => {
    setAllocations((current) => {
      if (current.some((a) => a.slug === to_)) return current;
      return current.map((a) => (a.slug === from_ ? { ...a, slug: to_ } : a));
    });
  }, []);

  const addAsset = useCallback(() => {
    setAllocations((current) => {
      if (current.length >= MAX_ASSETS) return current;
      const taken = new Set(current.map((a) => a.slug));
      const next = coins.find((c) => !taken.has(c.slug));
      if (!next) return current;
      return [...current, { slug: next.slug, weight: 10 }];
    });
  }, [coins]);

  const applyPreset = useCallback((preset: PortfolioPreset) => {
    setAllocations(preset.allocations.map((a) => ({ ...a })));
    // The new mix may not reach as far back; let the start re-derive.
    setFrom(null);
  }, []);

  const share = useCallback(() => {
    if (!input) return;
    const params = new URLSearchParams({
      a: encodeAllocations(input.allocations),
      i: String(input.initial),
      r: input.rebalance,
      f: input.from,
    });
    if (input.monthlyContribution > 0) params.set("m", String(input.monthlyContribution));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        track("share_click", { tool_slug: "portfolio" });
        setTimeout(() => setCopied(false), 2000);
      },
      () => setCopied(false),
    );
  }, [input]);

  const weightTotal = allocations.reduce((sum, a) => sum + (a.weight > 0 ? a.weight : 0), 0);

  return (
    <div className="mt-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-8">
        {/* ------------------------------------------------------ controls */}
        <form className="card h-max p-6" onSubmit={(e) => e.preventDefault()}>
          <h2 className="eyebrow mb-4">The portfolio</h2>

          <div className="mb-5 flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                title={preset.note}
                className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <ul className="mb-3 space-y-2">
            {allocations.map((allocation) => {
              const coin = byId.get(allocation.slug);
              const share_ = weightTotal > 0 ? (allocation.weight / weightTotal) * 100 : 0;
              return (
                <li key={allocation.slug} className="flex items-center gap-2">
                  {coin && (
                    <CoinLogo
                      slug={coin.slug}
                      name={coin.name}
                      symbol={coin.symbol}
                      color={coin.color}
                      size={24}
                    />
                  )}
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Asset</span>
                    <select
                      className="input-field !py-1.5 text-sm"
                      value={allocation.slug}
                      onChange={(e) => swapAsset(allocation.slug, e.target.value)}
                    >
                      {coins
                        .filter((c) => c.slug === allocation.slug || !slugs.includes(c.slug))
                        .map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name} ({c.symbol})
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="w-20 shrink-0">
                    <span className="sr-only">Weight for {coin?.name ?? allocation.slug}</span>
                    <input
                      className="input-field !py-1.5 text-right text-sm"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={allocation.weight}
                      onChange={(e) => setWeight(allocation.slug, Number(e.target.value))}
                    />
                  </label>
                  <span className="w-11 shrink-0 text-right text-xs muted tabular-nums">
                    {share_.toFixed(0)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAsset(allocation.slug)}
                    disabled={allocations.length < 2}
                    className="shrink-0 rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40 hover:border-red-500/50"
                    aria-label={`Remove ${coin?.name ?? allocation.slug}`}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={addAsset}
              disabled={allocations.length >= MAX_ASSETS}
              className="chip !px-2.5 !py-1 text-xs disabled:opacity-40 hover:border-brand-500/60"
            >
              + Add asset
            </button>
            {Math.abs(weightTotal - 100) > 0.5 && weightTotal > 0 && (
              <span className="text-xs muted">
                Adds up to {weightTotal.toFixed(0)} — scaled to 100%
              </span>
            )}
          </div>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium">Starting amount</span>
            <div className="relative">
              <input
                className="input-field"
                type="number"
                inputMode="decimal"
                min={1}
                step="any"
                value={initial}
                onChange={(e) => setInitial(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm muted">
                USD
              </span>
            </div>
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium">Added every month</span>
            <div className="relative">
              <input
                className="input-field"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm muted">
                USD
              </span>
            </div>
            <span className="muted mt-1 block text-xs">Leave at 0 for a one-off investment.</span>
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium">Rebalance</span>
            <select
              className="input-field"
              value={rebalance}
              onChange={(e) => setRebalance(e.target.value as RebalanceFrequency)}
            >
              <option value="none">Never — just hold</option>
              <option value="yearly">Once a year</option>
              <option value="quarterly">Every quarter</option>
              <option value="monthly">Every month</option>
            </select>
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium">Starting from</span>
            <input
              className="input-field"
              type="date"
              value={requestedFrom ?? ""}
              min={earliest ?? undefined}
              max={historyThrough}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>

          {earliest && (
            <div className="mb-5 flex flex-wrap gap-1.5">
              {[1, 3, 5, 10].map((years) => {
                const target = shiftYears(historyThrough, -years);
                if (target < earliest) return null;
                return (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setFrom(target)}
                    className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60"
                  >
                    {years}y
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setFrom(earliest)}
                className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60"
              >
                As far back as this mix goes
              </button>
            </div>
          )}

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Risk-free rate</span>
            <div className="relative">
              <input
                className="input-field"
                type="number"
                inputMode="decimal"
                min={0}
                max={25}
                step="any"
                value={riskFree}
                onChange={(e) => setRiskFree(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm muted">
                % a year
              </span>
            </div>
            <span className="muted mt-1 block text-xs">
              What cash would have paid. Only used for the Sharpe and Sortino ratios.
            </span>
          </label>

          <p className="muted mt-5 text-xs leading-relaxed">
            Daily closes to {historyThrough}. Everything is computed in your browser — the
            portfolio you type here is never sent anywhere.
          </p>
        </form>

        {/* -------------------------------------------------------- results */}
        <div>
          {state === "loading" && <div className="card p-6 muted">Loading price history…</div>}
          {state === "error" && (
            <div className="card p-6">
              <p className="font-semibold">Could not load the price history.</p>
              <p className="muted mt-1 text-sm">
                Check your connection and try again, or pick a different set of assets.
              </p>
            </div>
          )}
          {ready && !result && (
            <div className="card p-6 muted">
              Enter a starting amount and give at least one asset a weight above zero.
            </div>
          )}

          {ready && result && (
            <>
              <div className="card p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="eyebrow">
                    {result.actualFrom} → {result.actualTo}
                  </h2>
                  <button
                    type="button"
                    onClick={share}
                    className="chip !px-2.5 !py-1 text-xs hover:border-brand-500/60"
                  >
                    {copied ? "Link copied" : "Copy link to this portfolio"}
                  </button>
                </div>

                <div className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gradient break-words sm:text-5xl">
                  {money(result.finalValue)}
                </div>
                <p className="muted mt-2 text-sm">
                  from {money(result.totalInvested)} put in
                  {result.input.monthlyContribution > 0 &&
                    ` (${money(result.input.initial)} to start, then ${money(
                      result.input.monthlyContribution,
                    )} a month)`}
                </p>

                <div
                  className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${
                    result.profit >= 0 ? "bg-emerald-500/10 text-gain" : "bg-red-500/10 text-loss"
                  }`}
                >
                  {result.profit >= 0 ? "▲" : "▼"} {money(Math.abs(result.profit))} (
                  {result.roi >= 0 ? "+" : ""}
                  {pct(result.roi)})
                </div>

                {result.limitedBy && result.clamped && (
                  <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                    This mix can only be tested back to {result.actualFrom}, because{" "}
                    {result.limitedBy.symbol} has no price history before then. Nothing has been
                    extrapolated backwards — drop {result.limitedBy.symbol} to reach further back.
                  </p>
                )}

                <GrowthChart series={result.series} />

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Stat
                    label="Growth rate a year"
                    value={pct(result.risk.cagr)}
                    hint="time-weighted — contributions removed"
                  />
                  <Stat
                    label="Volatility a year"
                    value={pct(result.risk.volatility)}
                    hint="how far it swung around, annualised"
                  />
                  <Stat
                    label="Deepest fall"
                    value={`−${pct(result.worstDrawdown.pct)}`}
                    hint={`${result.worstDrawdown.from} → ${result.worstDrawdown.to}`}
                    tone="negative"
                  />
                  <Stat
                    label="Return per unit of risk"
                    value={result.risk.sharpe == null ? "—" : result.risk.sharpe.toFixed(2)}
                    hint={`Sharpe, against ${pct(result.input.riskFreeRate)} cash`}
                  />
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold">
                    More numbers
                  </summary>
                  <dl className="mt-2 divide-y divide-[var(--border)]">
                    {result.moneyWeighted != null && (
                      <Row
                        label="Money-weighted return"
                        value={`${pct(result.moneyWeighted)} a year`}
                        hint="what your actual payment schedule earned"
                      />
                    )}
                    {result.risk.sortino != null && (
                      <Row
                        label="Sortino ratio"
                        value={result.risk.sortino.toFixed(2)}
                        hint="like Sharpe, but only counting the days that lost money"
                      />
                    )}
                    <Row
                      label="Best day"
                      value={`+${pct(result.risk.best.pct)}`}
                      hint={result.risk.best.date}
                    />
                    <Row
                      label="Worst day"
                      value={pct(result.risk.worst.pct)}
                      hint={result.risk.worst.date}
                    />
                  </dl>
                </details>
              </div>

              {/* --------------------------------------------- per asset */}
              <section className="card mt-6 p-6 sm:p-7">
                <h2 className="text-lg font-bold">Where the money actually went</h2>
                <p className="muted mt-1 text-sm leading-relaxed">
                  {result.input.rebalance === "none"
                    ? "Nothing was rebalanced, so the winners grew into a bigger share of the portfolio than you chose."
                    : "The mix was dragged back to target, so the end weights sit close to the ones you set."}
                </p>
                <div
                  className="mt-4 overflow-x-auto"
                  tabIndex={0}
                  role="group"
                  aria-label="Per-asset table, scrolls horizontally"
                >
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th scope="col" className="py-2 font-semibold">Asset</th>
                        <th scope="col" className="py-2 text-right font-semibold">Target</th>
                        <th scope="col" className="py-2 text-right font-semibold">Ended at</th>
                        <th scope="col" className="py-2 text-right font-semibold">Its own return</th>
                        <th scope="col" className="py-2 text-right font-semibold">Profit from it</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...result.assets]
                        .sort((a, b) => b.profitContribution - a.profitContribution)
                        .map((asset) => (
                          <tr key={asset.slug} className="border-b border-[var(--border)] last:border-0">
                            <th scope="row" className="py-2.5 font-semibold">
                              <Link
                                href={`/coins/${asset.slug}`}
                                className="hover:text-brand-ink hover:underline"
                              >
                                {asset.symbol}
                              </Link>
                            </th>
                            <td className="py-2.5 text-right tabular-nums muted">
                              {asset.targetWeight.toFixed(0)}%
                            </td>
                            <td className="py-2.5 text-right tabular-nums">
                              {asset.finalWeight.toFixed(1)}%
                            </td>
                            <td className="py-2.5 text-right tabular-nums">
                              {asset.priceReturn >= 0 ? "+" : ""}
                              {pct(asset.priceReturn)}
                            </td>
                            <td
                              className={`py-2.5 text-right font-semibold tabular-nums ${
                                asset.profitContribution >= 0 ? "text-gain" : "text-loss"
                              }`}
                            >
                              {asset.profitContribution >= 0 ? "+" : "−"}
                              {money(Math.abs(asset.profitContribution))}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <p className="muted mt-3 text-xs leading-relaxed">
                  &ldquo;Profit from it&rdquo; is each asset&rsquo;s own contribution to the
                  portfolio&rsquo;s gain, accumulated day by day. Under rebalancing that is not the
                  same as what the holding is worth at the end, because money moved between assets
                  along the way. The column adds up to the total profit.
                </p>
              </section>

              {/* ------------------------------------------ rebalancing */}
              {rebalanceRows.length > 1 && (
                <section className="card mt-6 p-6 sm:p-7">
                  <h2 className="text-lg font-bold">Did rebalancing pay for itself?</h2>
                  <RebalanceVerdict rows={rebalanceRows} />
                  <div
                    className="mt-4 overflow-x-auto"
                    tabIndex={0}
                    role="group"
                    aria-label="Rebalancing comparison, scrolls horizontally"
                  >
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)]">
                          <th scope="col" className="py-2 font-semibold">Policy</th>
                          <th scope="col" className="py-2 text-right font-semibold">Final value</th>
                          <th scope="col" className="py-2 text-right font-semibold">Growth a year</th>
                          <th scope="col" className="py-2 text-right font-semibold">Volatility</th>
                          <th scope="col" className="py-2 text-right font-semibold">Deepest fall</th>
                          <th scope="col" className="py-2 text-right font-semibold">Rebalances</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rebalanceRows.map((row) => {
                          const current = row.frequency === result.input.rebalance;
                          return (
                            <tr
                              key={row.frequency}
                              className={`border-b border-[var(--border)] last:border-0 ${
                                current ? "bg-brand-500/5" : ""
                              }`}
                            >
                              <th scope="row" className="py-2.5 font-semibold">
                                {REBALANCE_LABEL[row.frequency]}
                                {current && <span className="muted ml-1.5 text-xs">(chosen)</span>}
                              </th>
                              <td className="py-2.5 text-right font-semibold tabular-nums">
                                {money(row.finalValue)}
                              </td>
                              <td className="py-2.5 text-right tabular-nums">{pct(row.cagr)}</td>
                              <td className="py-2.5 text-right tabular-nums">{pct(row.volatility)}</td>
                              <td className="py-2.5 text-right tabular-nums">
                                −{pct(row.maxDrawdown)}
                              </td>
                              <td className="py-2.5 text-right tabular-nums muted">
                                {row.events}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="muted mt-3 text-xs leading-relaxed">
                    The rebalance count is the reason this table is not a recommendation: each one
                    means up to {result.assets.length} trades, every trade pays a fee, and outside a
                    tax-sheltered account each sale is a disposal that has to be reported.{" "}
                    <Link href="/tools/trading-fee-calculator" className="font-semibold text-brand-ink hover:underline">
                      Price the fees
                    </Link>{" "}
                    and{" "}
                    <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
                      work out the tax
                    </Link>{" "}
                    before treating a higher row as free money.
                  </p>
                </section>
              )}

              {/* --------------------------------------- diversification */}
              {spread && matrix && (
                <section className="card mt-6 p-6 sm:p-7">
                  <h2 className="text-lg font-bold">Was it actually diversified?</h2>
                  <DiversificationVerdict
                    average={spread.averageCorrelation}
                    benefit={spread.benefit}
                    portfolioVolatility={spread.portfolioVolatility}
                    weightedAverage={spread.weightedAverageVolatility}
                    highest={matrix.highest}
                    lowest={matrix.lowest}
                  />
                  <CorrelationHeatmap matrix={matrix} />
                  <p className="muted mt-3 text-xs leading-relaxed">
                    <Link href="/portfolio/correlation" className="font-semibold text-brand-ink hover:underline">
                      The full correlation matrix
                    </Link>{" "}
                    covers every asset we hold history for, over three different windows.
                  </p>
                </section>
              )}

              <p className="muted mt-6 rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-xs leading-relaxed">
                Past prices, not a forecast. This ignores trading fees, spreads and tax, all of
                which would have reduced the result, and it replays one path that already happened
                — a mix that looks good here is not for that reason a good mix to hold next. Prices
                are daily closes through {historyThrough}.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** How the verdict sentence refers to each policy, mid-sentence. */
const REBALANCE_CADENCE: Record<RebalanceFrequency, string> = {
  none: "never",
  yearly: "once a year",
  quarterly: "every quarter",
  monthly: "every month",
};

const REBALANCE_LABEL: Record<RebalanceFrequency, string> = {
  none: "Never — just hold",
  yearly: "Once a year",
  quarterly: "Every quarter",
  monthly: "Every month",
};

/**
 * The plain-English answer, computed rather than asserted.
 *
 * "Rebalancing is good discipline" is the sort of thing every article says and
 * nobody checks. For this mix over this window it either helped or it did not,
 * and the difference between the best and worst policy is often small enough
 * that the fees would have eaten it — which the verdict says out loud.
 */
function RebalanceVerdict({ rows }: { rows: { frequency: RebalanceFrequency; finalValue: number }[] }) {
  const hold = rows.find((r) => r.frequency === "none");
  if (!hold) return null;
  const best = rows.reduce((a, b) => (b.finalValue > a.finalValue ? b : a));
  const gap = ((best.finalValue - hold.finalValue) / hold.finalValue) * 100;

  if (best.frequency === "none") {
    const worst = rows.reduce((a, b) => (b.finalValue < a.finalValue ? b : a));
    const cost = ((hold.finalValue - worst.finalValue) / hold.finalValue) * 100;
    return (
      <p className="mt-2 text-sm leading-relaxed">
        <strong>No — holding won.</strong> Every rebalancing policy sold the best performer on the
        way up, and the most active one gave up {pct(cost)} against simply leaving it alone. That is
        what rebalancing does in a run led by one asset.
      </p>
    );
  }

  if (gap < 5) {
    return (
      <p className="mt-2 text-sm leading-relaxed">
        <strong>Barely.</strong> The best policy here beat holding by {pct(gap)} before costs —
        close enough that trading fees and the tax on each disposal could have taken all of it.
      </p>
    );
  }

  return (
    <p className="mt-2 text-sm leading-relaxed">
      <strong>Yes, on this mix.</strong> Rebalancing {REBALANCE_CADENCE[best.frequency]} ended{" "}
      {pct(gap)} ahead of just holding, because the assets took turns leading and rebalancing kept
      selling whichever had run.
    </p>
  );
}

/**
 * The finding most portfolios do not want to hear.
 *
 * Holding six things that all follow bitcoin is one bet written six times. The
 * numbers here say so plainly, because the alternative — a matrix and no
 * interpretation — leaves the reader to conclude whatever they already believed.
 */
function DiversificationVerdict({
  average,
  benefit,
  portfolioVolatility,
  weightedAverage,
  highest,
  lowest,
}: {
  average: number;
  benefit: number;
  portfolioVolatility: number;
  weightedAverage: number;
  highest: { a: string; b: string; value: number } | null;
  lowest: { a: string; b: string; value: number } | null;
}) {
  const verdict =
    average >= 0.8
      ? "These assets are close to the same bet."
      : average >= 0.6
        ? "These assets mostly move together."
        : average >= 0.35
          ? "There is real separation between these assets."
          : "These assets are genuinely different from each other.";

  return (
    <div className="mt-2 space-y-3 text-sm leading-relaxed">
      <p>
        <strong>{verdict}</strong> Their average pairwise correlation is{" "}
        <strong>{average.toFixed(2)}</strong>. Held at the weights you set, the mix swung{" "}
        {pct(portfolioVolatility)} a year against {pct(weightedAverage)} for the same assets held
        separately — so spreading the money cut the ride by{" "}
        <strong>{benefit > 0 ? pct(benefit) : "nothing"}</strong>.
      </p>
      {highest && lowest && highest.value !== lowest.value && (
        <p className="muted">
          Closest pair: {highest.a} and {highest.b} at {highest.value.toFixed(2)}. Least alike:{" "}
          {lowest.a} and {lowest.b} at {lowest.value.toFixed(2)}.
        </p>
      )}
      {average >= 0.7 && (
        <p className="muted">
          Correlations also rise in a crash, which is exactly when the diversification is supposed
          to help: assets that drift apart in calm markets tend to fall together in a bad week.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "negative";
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] px-4 py-3">
      <div className="text-xs muted">{label}</div>
      <div
        className={`mt-0.5 text-xl font-bold tabular-nums ${
          tone === "negative" ? "text-loss" : "text-brand-ink"
        }`}
      >
        {value}
      </div>
      {hint && <div className="muted mt-0.5 text-xs leading-snug">{hint}</div>}
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
      <dt className="muted">
        {label}
        {hint && <span className="mt-0.5 block text-xs">{hint}</span>}
      </dt>
      <dd className="text-right font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

/** Five years back, or the start of the mix when it is younger than that. */
function defaultStart(earliest: string, through: string): string {
  const fiveYears = shiftYears(through, -5);
  return fiveYears > earliest ? fiveYears : earliest;
}

function shiftYears(iso: string, years: number): string {
  const d = new Date(parseDay(iso));
  return toIso(Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), d.getUTCDate()));
}

function encodeAllocations(allocations: Allocation[]): string {
  return allocations.map((a) => `${a.slug}:${Math.round(a.weight)}`).join(",");
}

/** Parse `?a=bitcoin:60,ethereum:40`, ignoring anything unrecognised. */
function decodeAllocations(
  raw: string,
  known: Map<string, PortfolioCoinOption>,
): Allocation[] {
  const seen = new Set<string>();
  const out: Allocation[] = [];
  for (const part of raw.split(",")) {
    const [slug, weight] = part.split(":");
    const value = Number(weight);
    if (!known.has(slug) || seen.has(slug) || !(value > 0)) continue;
    seen.add(slug);
    out.push({ slug, weight: value });
    if (out.length >= MAX_ASSETS) break;
  }
  return out;
}

function money(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const digits = v !== 0 && Math.abs(v) < 1 ? 4 : 2;
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

function pct(v: number): string {
  const abs = Math.abs(v);
  const digits = abs >= 1000 ? 0 : abs >= 100 ? 1 : 2;
  return `${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}
