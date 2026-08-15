"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { correlationMatrix } from "@/lib/portfolio/engine";
import type { PriceHistory } from "@/lib/portfolio/types";
import { CorrelationHeatmap } from "@/components/portfolio/CorrelationHeatmap";
import { track } from "@/lib/analytics";
import type { PortfolioCoinOption } from "../options";

const MAX_ASSETS = 10;

/**
 * Custom correlation matrix over any assets the visitor picks.
 *
 * A progressive enhancement on top of the three matrices already rendered into
 * the page: those cover the assets most people are asking about and are present
 * without JavaScript, and this exists for the visitor whose portfolio is not on
 * that list. It deliberately renders nothing but a picker until asked, so the
 * page does not fetch a dozen price files nobody looked at.
 */
export function CorrelationExplorer({
  coins,
  initial,
  through,
}: {
  coins: PortfolioCoinOption[];
  initial: string[];
  through: string;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [years, setYears] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const cache = useRef(new Map<string, PriceHistory>());
  const [histories, setHistories] = useState<PriceHistory[]>([]);

  const key = selected.join(",");

  useEffect(() => {
    let cancelled = false;
    const wanted = key ? key.split(",") : [];
    if (wanted.length < 2) {
      setHistories([]);
      setState("idle");
      return;
    }
    const missing = wanted.filter((s) => !cache.current.has(s));
    if (missing.length === 0) {
      setHistories(wanted.map((s) => cache.current.get(s) as PriceHistory));
      setState("ready");
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
  }, [key]);

  const from = useMemo(() => yearsBefore(through, years), [through, years]);

  // Assets younger than the window are dropped rather than measured over a
  // shorter stretch — the same rule the static matrices above follow.
  const eligible = useMemo(() => histories.filter((h) => h.start <= from), [histories, from]);
  const dropped = useMemo(() => histories.filter((h) => h.start > from), [histories, from]);

  const matrix = useMemo(
    () => (eligible.length > 1 ? correlationMatrix(eligible, from, through) : null),
    [eligible, from, through],
  );

  useEffect(() => {
    if (!matrix) return;
    const timer = setTimeout(() => {
      track("correlation_view", { assets: matrix.symbols.length, years });
    }, 1200);
    return () => clearTimeout(timer);
  }, [matrix, years]);

  const toggle = (slug: string) => {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : current.length >= MAX_ASSETS
          ? current
          : [...current, slug],
    );
  };

  return (
    <div className="mt-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold">Build your own</h3>
          <span className="muted text-xs">
            {selected.length} of {MAX_ASSETS} picked
          </span>
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium">Window</span>
          <div className="flex flex-wrap gap-2">
            {[
              [1, "1 year"],
              [2, "2 years"],
              [3, "3 years"],
              [5, "5 years"],
            ].map(([value, label]) => (
              <button
                key={value as number}
                type="button"
                onClick={() => setYears(value as number)}
                aria-pressed={years === value}
                className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                  years === value
                    ? "border-brand-500 bg-brand-500/10 text-brand-ink"
                    : "border-[var(--border)] hover:border-brand-500/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 block text-sm font-medium">Assets</legend>
          <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto" tabIndex={0}>
            {coins.map((coin) => {
              const on = selected.includes(coin.slug);
              return (
                <button
                  key={coin.slug}
                  type="button"
                  onClick={() => toggle(coin.slug)}
                  aria-pressed={on}
                  disabled={!on && selected.length >= MAX_ASSETS}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition disabled:opacity-40 ${
                    on
                      ? "border-brand-500 bg-brand-500/10 text-brand-ink"
                      : "border-[var(--border)] hover:border-brand-500/50"
                  }`}
                >
                  {coin.symbol}
                </button>
              );
            })}
          </div>
        </fieldset>

        {selected.length < 2 && (
          <p className="muted mt-4 text-sm">Pick at least two assets to compare.</p>
        )}
        {state === "loading" && <p className="muted mt-4 text-sm">Loading price history…</p>}
        {state === "error" && (
          <p className="mt-4 text-sm">Could not load the price history. Try again.</p>
        )}

        {matrix && (
          <>
            <CorrelationHeatmap matrix={matrix} />
            <p className="mt-3 text-sm leading-relaxed">
              Average pairwise correlation: <strong>{matrix.average.toFixed(2)}</strong>
              {matrix.highest && matrix.lowest && matrix.highest.value !== matrix.lowest.value && (
                <>
                  {" "}
                  — closest {matrix.highest.a}/{matrix.highest.b} at{" "}
                  {matrix.highest.value.toFixed(2)}, least alike {matrix.lowest.a}/
                  {matrix.lowest.b} at {matrix.lowest.value.toFixed(2)}.
                </>
              )}
            </p>
          </>
        )}

        {dropped.length > 0 && (
          <p className="muted mt-3 text-xs leading-relaxed">
            Left out of this window:{" "}
            {dropped.map((h) => `${h.symbol} (starts ${h.start})`).join(", ")}. Measuring them over
            the shorter stretch they do have would put a different period in the same table.
          </p>
        )}
      </div>
    </div>
  );
}

/** ISO date `years` before `iso`, keeping the day of month. */
function yearsBefore(iso: string, years: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y - years, m - 1, d)).toISOString().slice(0, 10);
}
