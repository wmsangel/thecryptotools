"use client";

import { useEffect, useMemo, useState } from "react";
import type { Jurisdiction } from "@/lib/taxreport/jurisdictions";
import { estimateTax } from "@/lib/tax-calculator/estimate";
import { track } from "@/lib/analytics";

/**
 * The per-country landing calculator. One component, driven entirely by the
 * jurisdiction record, so every country gets its own correct calculation:
 * the holding toggle only appears where holding actually changes the tax, the
 * allowance/Freigrenze and inclusion rate are applied in order, and the
 * long-term rate kicks in automatically where a country has one.
 */
export function CountryTaxCalculator({ jurisdiction: j }: { jurisdiction: Jurisdiction }) {
  const hasRelief = j.relief.kind !== "none";
  const [proceeds, setProceeds] = useState("15000");
  const [costBasis, setCostBasis] = useState("10000");
  const [rate, setRate] = useState(String(j.defaultRate));
  const [longHeld, setLongHeld] = useState(false);

  const money = useMemo(
    () =>
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: j.currencyCode,
        maximumFractionDigits: 0,
      }),
    [j.currencyCode],
  );

  const result = useMemo(
    () =>
      estimateTax(j, {
        proceeds: Number(proceeds) || 0,
        costBasis: Number(costBasis) || 0,
        holdingDays: hasRelief ? (longHeld ? 400 : 100) : null,
        rate: Number(rate) || 0,
        longTermRate: j.defaultLongTermRate,
      }),
    [j, proceeds, costBasis, rate, longHeld, hasRelief],
  );

  // Fire one GA4 event per settled interaction (debounced), like the other tools.
  useEffect(() => {
    const t = setTimeout(() => {
      track("tool_used", {
        action: "calc",
        tool_slug: "crypto-tax-calculator",
        tool_category: "tax",
        country: j.id,
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [j.id, proceeds, costBasis, rate, longHeld]);

  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="card mt-6 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sale proceeds" suffix={j.currencyCode}>
          <input
            type="number" inputMode="decimal" min={0} value={proceeds}
            onChange={(e) => setProceeds(e.target.value)}
            className="input-field" aria-label="Sale proceeds"
          />
        </Field>
        <Field label="Cost basis (what you paid)" suffix={j.currencyCode}>
          <input
            type="number" inputMode="decimal" min={0} value={costBasis}
            onChange={(e) => setCostBasis(e.target.value)}
            className="input-field" aria-label="Cost basis"
          />
        </Field>

        <Field
          label={j.relief.kind === "rate" ? "Your income tax rate" : "Your tax rate"}
          suffix="%"
        >
          <input
            type="number" inputMode="decimal" min={0} max={100} step={0.1} value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="input-field" aria-label="Tax rate"
          />
        </Field>

        {hasRelief && (
          <div>
            <div className="mb-1.5 text-sm font-medium">How long did you hold?</div>
            <div className="flex rounded-lg border border-[var(--border)] p-0.5 text-sm">
              <button
                type="button" onClick={() => setLongHeld(false)}
                className={`flex-1 rounded-md px-3 py-2 font-medium transition ${!longHeld ? "bg-brand-500 text-white" : "muted"}`}
              >
                {j.relief.kind === "discount" ? "Under 12 months" : "Under 1 year"}
              </button>
              <button
                type="button" onClick={() => setLongHeld(true)}
                className={`flex-1 rounded-md px-3 py-2 font-medium transition ${longHeld ? "bg-brand-500 text-white" : "muted"}`}
              >
                {j.relief.kind === "discount" ? "Over 12 months" : "Over 1 year"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result */}
      <div className="mt-6 rounded-xl border border-brand-500/30 bg-brand-500/5 p-5">
        {result.isLoss ? (
          <>
            <div className="text-sm font-semibold uppercase tracking-wide text-brand-ink">Capital loss</div>
            <p className="mt-1 text-2xl font-extrabold">{money.format(result.grossGain)}</p>
            <p className="muted mt-2 text-sm leading-relaxed">
              {j.lossesDeductible
                ? "No tax is due on a loss. In most years a loss can offset other crypto gains — the full-year CSV tool handles that."
                : "No tax is due on this sale, but note: losses can't offset gains or be carried forward here, so each gain is still taxed on its own."}
            </p>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold uppercase tracking-wide text-brand-ink">Estimated tax owed</div>
            <p className="mt-1 text-3xl font-extrabold sm:text-4xl">{money.format(result.tax)}</p>
            <p className="muted mt-1 text-sm">
              Effective rate {pct(result.effectiveRate)} · you keep {money.format(result.gainAfterTax)} of the gain
            </p>

            <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <Row label="Capital gain" value={money.format(result.grossGain)} strong />
              {result.reliefNote && <Note text={result.reliefNote} />}
              {result.fullyExempt && <Row label="Tax-free (held long enough)" value={money.format(0)} />}
              {result.freigrenzeExempt && (
                <Note text={`Under the ${j.allowanceLabel} — the whole gain is exempt. One unit more and it would all be taxable.`} />
              )}
              {result.allowanceApplied > 0 && !result.freigrenzeExempt && (
                <Row label={`Less ${j.allowanceLabel}`} value={`− ${money.format(result.allowanceApplied)}`} />
              )}
              {!result.fullyExempt && (
                <Row label="Taxable gain" value={money.format(result.taxableGain)} strong />
              )}
              {j.inclusionRate < 1 && !result.fullyExempt && (
                <Row
                  label={`Taxable portion (${Math.round(j.inclusionRate * 100)}% included)`}
                  value={money.format(result.taxableIncome)}
                />
              )}
              {!result.fullyExempt && result.taxableGain > 0 && (
                <Row label="Rate applied" value={`${result.rateUsed}%`} />
              )}
            </dl>
          </>
        )}
      </div>

      <p className="muted mt-3 text-xs leading-relaxed">{j.rateNote} A rough single-sale estimate — not tax advice.</p>
    </div>
  );
}

function Field({ label, suffix, children }: { label: string; suffix?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}{suffix && <span className="muted font-normal"> ({suffix})</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? "font-semibold" : "muted"}>{label}</dt>
      <dd className={strong ? "font-bold tabular-nums" : "tabular-nums"}>{value}</dd>
    </div>
  );
}

function Note({ text }: { text: string }) {
  return <p className="muted text-xs leading-relaxed">↳ {text}</p>;
}
