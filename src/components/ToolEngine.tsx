"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getTool } from "@/lib/tools/registry";
import { runTool, defaultInputs } from "@/lib/tools/run";
import type { ToolInput, ToolInputs, StructuredResult } from "@/lib/tools/types";
import { LIVE_COINS, fetchLivePrice, fetchCoinSpot } from "@/lib/market/live";
import { recordToolUse } from "@/lib/tool-prefs";
import { track } from "@/lib/analytics";

/**
 * Live-price prefill used by the coin pages: fetch the coin's spot price once
 * and drop it into the named fields, each scaled by its multiplier (e.g. an
 * entry price at 0.8× spot so the worked example isn't a flat zero).
 */
export interface EnginePrefill {
  coingeckoId: string;
  /** Absent for coins with no Binance listing — the fallback is then skipped. */
  binance?: string;
  symbol: string;
  fields: Record<string, number>;
}

/**
 * The universal tool renderer. Takes a slug (NOT the config object — the config
 * carries a `compute` function that can't cross the server→client boundary), so
 * it looks the tool up in the registry on the client. It builds the form,
 * executes the formula and renders the result — no per-tool code.
 *
 * Computation runs in an effect (client-only) so tools that use Math.random or
 * Date (generators, timestamp tool) never cause a hydration mismatch.
 */
export function ToolEngine({
  slug,
  overrides,
  prefill,
}: {
  slug: string;
  /** Static field values layered over the tool's own defaults. */
  overrides?: Record<string, number | string>;
  /** Fill price fields from the live market price of one coin. */
  prefill?: EnginePrefill;
}) {
  const tool = getTool(slug);

  const [inputs, setInputs] = useState<ToolInputs>(() =>
    tool ? { ...defaultInputs(tool), ...(overrides ?? {}) } : {},
  );
  const [result, setResult] = useState<StructuredResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const didMount = useRef(false);
  const interacted = useRef(false);
  const trackedUse = useRef(false);

  // Opening a tool page counts as using it — that's the signal the "recently
  // used" list wants, and it's the only place every tool page passes through.
  useEffect(() => {
    if (tool) recordToolUse(tool.slug);
  }, [tool]);

  // Seed inputs from the URL query string once, so shared links prefill the form.
  useEffect(() => {
    if (!tool) return;
    const params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length === 0) return;
    setInputs((prev) => {
      const next = { ...prev };
      for (const input of tool.inputs) {
        const raw = params.get(input.name);
        if (raw !== null) next[input.name] = raw;
      }
      return next;
    });
  }, [tool]);

  // Coin pages: seed the price fields from the live market price. Skipped when
  // the URL already carries inputs, so a shared link always wins.
  useEffect(() => {
    if (!tool || !prefill) return;
    if (new URLSearchParams(window.location.search).toString()) return;
    let cancelled = false;
    fetchCoinSpot(prefill.coingeckoId, prefill.binance).then((price) => {
      if (cancelled || price == null) return;
      setLivePrice(price);
      setInputs((prev) => {
        const next = { ...prev };
        for (const [field, multiplier] of Object.entries(prefill.fields)) {
          next[field] = roundPrice(price * multiplier);
        }
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, prefill?.coingeckoId]);

  // Reflect the current inputs in the URL (no history spam) so it's shareable.
  // Skip the very first run so we never clobber URL params before they're read.
  useEffect(() => {
    if (!tool) return;
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const params = new URLSearchParams();
    for (const input of tool.inputs) {
      const v = inputs[input.name];
      if (v !== "" && v !== undefined && v !== null) params.set(input.name, String(v));
    }
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }, [tool, inputs]);

  useEffect(() => {
    if (!tool) return;
    const outcome = runTool(tool, inputs);
    if (outcome.ok && outcome.result) {
      setResult(outcome.result);
      setError(null);
    } else {
      setResult(null);
      setError(outcome.error ?? "Calculation failed");
    }
  }, [tool, inputs]);

  /**
   * Exactly ONE `tool_used` per page view, and only once the visitor has edited
   * a field and that edit produced a result.
   *
   * The compute effect above re-runs on every keystroke, so a naive event here
   * would send one hit per character. Two guards prevent that: `trackedUse`
   * caps it at one per mount, and the 1.2s timer — reset by each new `result`
   * identity — means a half-typed number never counts.
   *
   * Landing on the page is already `page_view`, so page_view ÷ tool_used is the
   * number worth reading: what share of visitors actually used the calculator
   * rather than bouncing off it.
   */
  useEffect(() => {
    if (!tool || !interacted.current || trackedUse.current || !result) return;
    const timer = setTimeout(() => {
      trackedUse.current = true;
      track("tool_used", {
        tool_slug: tool.slug,
        tool_category: tool.category,
        coin: prefill?.symbol,
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [tool, result, prefill?.symbol]);

  if (!tool) {
    return <div className="card p-6 muted">Tool not found.</div>;
  }

  function update(name: string, value: string) {
    interacted.current = true;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      {/* Form */}
      <form className="card p-6 sm:p-7" onSubmit={(e) => e.preventDefault()}>
        <h2 className="eyebrow mb-5">Inputs</h2>
        <div className="space-y-5">
          {tool.inputs.map((input) => (
            <Field
              key={input.name}
              input={input}
              value={inputs[input.name] ?? ""}
              onChange={(v) => update(input.name, v)}
              prefill={prefill}
            />
          ))}
        </div>
        {prefill && livePrice != null && (
          <p className="mt-5 text-xs muted">
            Prefilled with the live {prefill.symbol} price (
            {roundPrice(livePrice).toLocaleString("en-US", { maximumFractionDigits: 8 })} USD). Edit
            any field — nothing is sent anywhere.
          </p>
        )}
      </form>

      {/* Result */}
      <div className="md:sticky md:top-28 md:self-start">
        <ResultPanel result={result} error={error} toolSlug={tool.slug} />
      </div>
    </div>
  );
}

function Field({
  input,
  value,
  onChange,
  prefill,
}: {
  input: ToolInput;
  value: string | number;
  onChange: (v: string) => void;
  prefill?: EnginePrefill;
}) {
  const label = input.label ?? prettify(input.name);
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-2">
        <span className="block text-sm font-medium">{label}</span>
        {input.livePrice &&
          (prefill ? (
            // Coin pages: no picker — the page IS about one coin.
            <CoinPriceButton prefill={prefill} onPrice={(p) => onChange(String(p))} />
          ) : (
            <LivePriceButton onPrice={(p) => onChange(String(p))} />
          ))}
      </span>
      <div className="relative">
        {input.type === "select" ? (
          <select className="input-field" value={String(value)} onChange={(e) => onChange(e.target.value)}>
            {input.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <input
            className="input-field"
            type={input.type === "number" ? "number" : "text"}
            inputMode={input.type === "number" ? "decimal" : undefined}
            value={String(value)}
            placeholder={input.placeholder}
            min={input.min}
            max={input.max}
            step={input.step}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {input.suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm muted">
            {input.suffix}
          </span>
        )}
      </div>
      {input.help && <span className="mt-1 block text-xs muted">{input.help}</span>}
    </label>
  );
}

function ResultPanel({
  result,
  error,
  toolSlug,
}: {
  result: StructuredResult | null;
  error: string | null;
  toolSlug: string;
}) {
  const isTextBlock = useMemo(
    () => typeof result?.value === "string" && String(result.value).includes("\n"),
    [result],
  );

  return (
    /**
     * `aria-live="polite"` is the single most important accessibility line on
     * this site. The whole product is "type a number, read the answer" — and
     * the answer appears without any navigation, so without a live region a
     * screen-reader user types into the form and is told nothing at all.
     *
     * polite (not assertive) because the value recomputes on every keystroke:
     * assertive would interrupt the user mid-typing on each character.
     * `aria-atomic` makes it read the whole answer, not the digits that changed.
     */
    <div
      className="card overflow-hidden p-6 sm:p-7"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="eyebrow">Result</h2>
        {result && !error && <ShareButton toolSlug={toolSlug} />}
      </div>

      {error ? (
        <div className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          {error}
        </div>
      ) : result ? (
        <div>
          {isTextBlock ? (
            <CopyBlock text={String(result.value)} toolSlug={toolSlug} />
          ) : (
            <>
              <div
                className={`text-4xl font-extrabold leading-tight break-words sm:text-5xl ${
                  result.tone === "negative"
                    ? "text-loss"
                    : result.tone === "neutral"
                      ? "text-[var(--text)]"
                      : "text-gradient"
                }`}
              >
                {result.value}
                {result.unit ? (
                  <span className="ml-2 text-lg font-semibold muted">{result.unit}</span>
                ) : null}
              </div>
              {result.label && <div className="mt-2 text-sm muted">{result.label}</div>}
            </>
          )}

          {result.breakdown && result.breakdown.length > 0 && (
            <dl className="mt-6 divide-y divide-[var(--border)]">
              {result.breakdown.map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="muted">{row.label}</dt>
                  <dd
                    className={
                      row.emphasis
                        ? "text-right text-base font-bold text-brand-ink"
                        : "text-right font-semibold"
                    }
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Machine-readable payload, offered alongside the readable answer
              rather than instead of it — see `copyText` in tools/types.ts. */}
          {result.copyText && (
            <details className="group mt-6 rounded-xl border border-[var(--border)]">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold">
                <span>{result.copyLabel ?? "Copy"}</span>
                <span className="muted text-xs group-open:hidden">show ▾</span>
                <span className="muted hidden text-xs group-open:inline">hide ▴</span>
              </summary>
              <div className="border-t border-[var(--border)] p-3">
                <CopyBlock text={result.copyText} toolSlug={toolSlug} />
              </div>
            </details>
          )}

          {result.note && (
            <p className="mt-5 rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-xs muted">
              {result.note}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm muted">Enter values to see the result.</p>
      )}
    </div>
  );
}

/** Single-coin refresh button used on the /coins pages. */
function CoinPriceButton({
  prefill,
  onPrice,
}: {
  prefill: EnginePrefill;
  onPrice: (price: number) => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  return (
    <button
      type="button"
      className="btn-ghost px-2 py-0.5 text-xs"
      onClick={async (e) => {
        e.preventDefault();
        setState("loading");
        const price = await fetchCoinSpot(prefill.coingeckoId, prefill.binance);
        if (price == null) {
          setState("error");
          track("live_price_error", { coin: prefill.symbol });
          return;
        }
        onPrice(roundPrice(price));
        setState("idle");
        track("live_price_click", { coin: prefill.symbol });
      }}
    >
      {state === "loading" ? "…" : state === "error" ? "Retry" : `↧ Live ${prefill.symbol} price`}
    </button>
  );
}

function LivePriceButton({ onPrice }: { onPrice: (price: number) => void }) {
  const [coin, setCoin] = useState("BTC");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  return (
    <span className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
      <select
        value={coin}
        onChange={(e) => setCoin(e.target.value)}
        aria-label="Coin for live price"
        className="rounded-md border border-[var(--border)] bg-transparent px-1.5 py-0.5 text-xs"
      >
        {LIVE_COINS.map((c) => (
          <option key={c.symbol} value={c.symbol}>{c.symbol}</option>
        ))}
      </select>
      <button
        type="button"
        className="btn-ghost px-2 py-0.5 text-xs"
        onClick={async () => {
          setState("loading");
          try {
            const p = await fetchLivePrice(coin);
            if (p != null) {
              onPrice(p);
              setState("idle");
              // Which coins people pull prices for is the cheapest read we have
              // on which coin should get its own page set next.
              track("live_price_click", { coin });
            } else {
              setState("error");
              track("live_price_error", { coin });
            }
          } catch {
            setState("error");
            track("live_price_error", { coin });
          }
        }}
      >
        {state === "loading" ? "…" : state === "error" ? "Retry" : "↧ Live price"}
      </button>
    </span>
  );
}

function ShareButton({ toolSlug }: { toolSlug: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost shrink-0 px-2.5 py-1 text-xs"
      aria-label="Copy shareable link with your inputs"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          // Only on success — a rejected clipboard write is not a share.
          track("share_click", { tool_slug: toolSlug });
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? "✓ Link copied!" : "🔗 Share"}
    </button>
  );
}

function CopyBlock({ text, toolSlug }: { text: string; toolSlug: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="btn-primary mb-2 px-3 py-1 text-xs"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            // The generators (fake wallet, JSON, random data) end here — copying
            // the output IS the conversion for that whole category.
            track("result_copy", { tool_slug: toolSlug });
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* ignore */
          }
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="max-h-80 overflow-auto rounded-lg bg-[var(--bg)] p-3 text-xs">{text}</pre>
    </div>
  );
}

/**
 * Round a price to a sensible number of places for its magnitude — whole
 * dollars for BTC, eight places for SHIB — so prefilled fields never show a
 * 12-decimal float.
 */
function roundPrice(price: number): number {
  if (price >= 1000) return Math.round(price);
  if (price >= 1) return Math.round(price * 100) / 100;
  if (price >= 0.01) return Math.round(price * 10000) / 10000;
  return Number(price.toPrecision(4));
}

function prettify(name: string): string {
  return name.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase());
}
