"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { jurisdictions, getJurisdiction, taxYearFor, taxYearsIn } from "@/lib/taxreport/jurisdictions";
import { compareMethods, buildSample, type MethodComparison, type MethodResult } from "@/lib/costbasis/compare";
import { useCsvIntake, CsvDropZone, CsvColumnMapper } from "@/components/taxreport/CsvIntake";
import { track, bucket } from "@/lib/analytics";

function money(n: number, code: string): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: code, maximumFractionDigits: 2 });
}
const day = (d: Date) => d.toISOString().slice(0, 10);

const isDisposal = (type: string, swapsTaxable: boolean) =>
  type === "sell" || type === "spend" || (type === "trade" && swapsTaxable);

export function CostBasisApp({ buildDate }: { buildDate: string }) {
  // Two-pass date, the pattern the calendar and harvesting pages use: computing
  // `new Date()` during first render would not match HTML exported on an earlier
  // day. The build date renders first, then a mount effect swaps in real today.
  const [today, setToday] = useState(() => new Date(`${buildDate}T00:00:00Z`));
  useEffect(() => {
    const now = new Date();
    setToday(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())));
  }, []);

  const [jurisdictionId, setJurisdictionId] = useState("us");
  const [countryChosenByUser, setCountryChosenByUser] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [ltRate, setLtRate] = useState<number | null>(null);
  const [chosenYear, setChosenYear] = useState<string | null>(null);

  const jurisdiction = getJurisdiction(jurisdictionId)!;

  const intake = useCsvIntake((fiat) => {
    if (countryChosenByUser) return;
    const match = jurisdictions.find((j) => j.currencyCode === fiat);
    if (match) setJurisdictionId(match.id);
  });

  const normalised = useMemo(
    () => intake.normalisedFor(jurisdiction.currencyCode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intake.parsed, intake.mapping, intake.dateOrder, jurisdiction.currencyCode],
  );

  // Tax years present in the file, newest first, and the sensible default: the
  // newest year that actually contains a disposal — a year of pure buys has
  // nothing to compare.
  const years = useMemo(
    () => (normalised ? taxYearsIn(jurisdiction, normalised.txs.map((t) => t.date)) : []),
    [normalised, jurisdiction],
  );
  const defaultYear = useMemo(() => {
    if (!normalised) return "";
    const disposalYears = new Set(
      normalised.txs
        .filter((t) => isDisposal(t.type, jurisdiction.swapsTaxable))
        .map((t) => taxYearFor(jurisdiction, t.date).label),
    );
    return years.find((y) => disposalYears.has(y.label))?.label ?? years[0]?.label ?? "";
  }, [normalised, jurisdiction, years]);

  // A user pick only sticks while it still exists in the current file/country.
  const yearLabel = chosenYear && years.some((y) => y.label === chosenYear) ? chosenYear : defaultYear;

  const comparison: MethodComparison | null = useMemo(() => {
    if (!normalised?.txs.length || !yearLabel) return null;
    return compareMethods(normalised.txs, normalised.issues, {
      jurisdiction,
      taxYearLabel: yearLabel,
      rate: rate ?? jurisdiction.defaultRate,
      longTermRate: ltRate ?? jurisdiction.defaultLongTermRate,
    });
  }, [normalised, jurisdiction, yearLabel, rate, ltRate]);

  // One event per country × year × method-count, not per rate keystroke. Nothing
  // describing the holdings leaves the browser — the saving is bucketed.
  const lastTracked = useRef("");
  useEffect(() => {
    if (!comparison) return;
    const key = `${jurisdiction.id}|${comparison.taxYearLabel}|${comparison.results.length}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;
    track("cost_basis_compared", {
      country: jurisdiction.id,
      allows_choice: comparison.allowsChoice,
      best_method: comparison.best.method,
      saving: bucket(Math.round(comparison.maxSaving)),
      methods: comparison.results.length,
    });
  }, [comparison, jurisdiction]);

  const cur = jurisdiction.currencyCode;
  const errors = comparison?.issues.filter((i) => i.severity === "error") ?? [];
  const warnings = comparison?.issues.filter((i) => i.severity === "warning") ?? [];

  return (
    <div className="mt-8 space-y-8">
      <CsvDropZone
        intake={intake}
        heading="1 · Load your transaction history"
        onSample={() => intake.ingest(buildSample(today), "sample.csv", "sample")}
        sampleLabel="Try a sample portfolio"
      />

      <CsvColumnMapper intake={intake} heading="2 · Check the columns" />

      {normalised && normalised.txs.length > 0 && (
        <section className="card p-6">
          <h2 className="text-xl font-bold">3 · Country, year and rate</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-semibold" htmlFor="cb-jur">Country</label>
              <select
                id="cb-jur"
                value={jurisdictionId}
                onChange={(e) => {
                  setJurisdictionId(e.target.value);
                  setCountryChosenByUser(true);
                  setRate(null);
                  setLtRate(null);
                }}
                className="input-field mt-1.5 w-full text-sm"
              >
                {jurisdictions.map((j) => (
                  <option key={j.id} value={j.id}>{j.flag} {j.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="cb-year">Tax year</label>
              <select
                id="cb-year"
                value={yearLabel}
                onChange={(e) => setChosenYear(e.target.value)}
                className="input-field mt-1.5 w-full text-sm"
              >
                {years.map((y) => (
                  <option key={y.label} value={y.label}>{y.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="cb-rate">
                {jurisdiction.relief.kind === "rate" ? "Short-term rate" : "Your tax rate"} (%)
              </label>
              <input
                id="cb-rate"
                type="number"
                min={0}
                max={60}
                step={0.5}
                value={rate ?? jurisdiction.defaultRate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="input-field mt-1.5 w-full text-sm"
              />
            </div>
            {jurisdiction.relief.kind === "rate" && (
              <div>
                <label className="block text-sm font-semibold" htmlFor="cb-ltrate">Long-term rate (%)</label>
                <input
                  id="cb-ltrate"
                  type="number"
                  min={0}
                  max={60}
                  step={0.5}
                  value={ltRate ?? jurisdiction.defaultLongTermRate ?? 15}
                  onChange={(e) => setLtRate(Number(e.target.value))}
                  className="input-field mt-1.5 w-full text-sm"
                />
              </div>
            )}
          </div>

          {intake.fileCurrency && intake.fileCurrency !== jurisdiction.currencyCode && (
            <p className="mt-4 rounded-xl border-l-4 border-amber-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
              <strong>Currency mismatch.</strong> Your file looks like it is in {intake.fileCurrency}, but{" "}
              {jurisdiction.name} reports in {jurisdiction.currencyCode}. Nothing here converts currencies,
              so the figures would be read as {jurisdiction.currencyCode}. Pick a country using{" "}
              {intake.fileCurrency}, or convert the file first.
            </p>
          )}
        </section>
      )}

      {comparison && <ComparisonView comparison={comparison} cur={cur} errors={errors} warnings={warnings} />}
    </div>
  );
}

// --- results ----------------------------------------------------------------

function ComparisonView({
  comparison, cur, errors, warnings,
}: {
  comparison: MethodComparison;
  cur: string;
  errors: { line: number; message: string }[];
  warnings: { line: number; message: string }[];
}) {
  const { results, best, fifo, allowsChoice, jurisdiction, taxYearLabel } = comparison;

  return (
    <section className="space-y-6" aria-live="polite">
      <div>
        <div className="eyebrow">Method comparison</div>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
          {jurisdiction.flag} {jurisdiction.name} · {taxYearLabel}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border-l-4 border-red-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          <strong>{errors.length} row{errors.length > 1 ? "s" : ""} could not be valued</strong> and are
          excluded from every figure below. A guessed number in a tax total is the one mistake that costs you.
          <ul className="muted mt-2 list-disc space-y-1 pl-5">
            {errors.slice(0, 4).map((e, i) => (
              <li key={i}>Line {e.line}: {e.message}</li>
            ))}
            {errors.length > 4 && <li>…and {errors.length - 4} more.</li>}
          </ul>
        </div>
      )}

      {allowsChoice ? (
        <>
          {/* headline */}
          {comparison.maxSaving > 0 ? (
            <div className="rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-4">
              <p className="text-lg font-bold">
                {best.short} cuts this year&apos;s bill to {money(best.estimatedTax, cur)} — {money(comparison.maxSaving, cur)} less than FIFO.
              </p>
              <p className="muted mt-1 text-sm leading-relaxed">
                But it also leaves {money(best.basisDeferredVsFifo, cur)} less cost basis on the lots you
                still hold, so that much extra gain is waiting for you when you eventually sell them.{" "}
                <strong className="text-[var(--text)]">HIFO and LIFO defer tax, they do not erase it</strong> —
                the saving is real only if a lower bill this year is worth more to you than a higher one later.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border-l-4 border-amber-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
              <strong>No method beats FIFO for this file and year.</strong> With these disposals every
              method lands on the same bill — usually because a single lot, or a pooled/averaged result,
              leaves nothing to choose between.
            </div>
          )}

          {/* method cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {results.map((r) => (
              <MethodCard key={r.method} r={r} cur={cur} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-4">
          <p className="text-lg font-bold">
            {jurisdiction.name} mandates {fifo.label} — there is no method to choose.
          </p>
          <p className="muted mt-1 text-sm leading-relaxed">
            FIFO/LIFO/HIFO selection is a US specific-identification feature. {jurisdiction.name} requires
            one method by law, so this file has a single answer: an estimated{" "}
            <strong className="text-[var(--text)]">{money(fifo.estimatedTax, cur)}</strong> on{" "}
            {money(fifo.taxableGain, cur)} of taxable gain. Switch the country to the United States to
            compare methods.
          </p>
        </div>
      )}

      {/* the numbers table */}
      <div className="card p-6">
        <h3 className="font-bold">Side by side</h3>
        <div className="mt-4 overflow-x-auto" tabIndex={0} role="group" aria-label="Method comparison">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-2 pr-3 font-semibold">Method</th>
                <th className="py-2 pr-3 font-semibold">Proceeds</th>
                <th className="py-2 pr-3 font-semibold">Cost used</th>
                <th className="py-2 pr-3 font-semibold">Net gain</th>
                <th className="py-2 pr-3 font-semibold">Taxable gain</th>
                <th className="py-2 pr-3 font-semibold">Estimated tax</th>
                {allowsChoice && <th className="py-2 pr-3 font-semibold">vs FIFO</th>}
                <th className="py-2 pr-3 font-semibold">Cost basis left</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={r.method}
                  className={`border-b border-[var(--border)] last:border-0 ${r.isBest && allowsChoice ? "bg-brand-500/5" : ""}`}
                >
                  <td className="py-2 pr-3 font-semibold">
                    {r.short}
                    {r.isBest && allowsChoice && results.length > 1 && (
                      <span className="ml-1.5 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-ink">
                        Lowest
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">{money(r.proceeds, cur)}</td>
                  <td className="py-2 pr-3">{money(r.costUsed, cur)}</td>
                  <td className={`py-2 pr-3 ${r.netGain < 0 ? "text-gain" : ""}`}>{money(r.netGain, cur)}</td>
                  <td className="py-2 pr-3">{money(r.taxableGain, cur)}</td>
                  <td className="py-2 pr-3 font-semibold">{money(r.estimatedTax, cur)}</td>
                  {allowsChoice && (
                    <td className="py-2 pr-3">
                      {r.isFifo ? (
                        <span className="muted">baseline</span>
                      ) : r.savedVsFifo > 0 ? (
                        <span className="font-semibold text-gain">−{money(r.savedVsFifo, cur)}</span>
                      ) : r.savedVsFifo < 0 ? (
                        <span className="text-loss">+{money(-r.savedVsFifo, cur)}</span>
                      ) : (
                        <span className="muted">same</span>
                      )}
                    </td>
                  )}
                  <td className="py-2 pr-3">{money(r.remainingBasis, cur)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted mt-3 text-xs leading-relaxed">
          &quot;Cost basis left&quot; is the allowable cost still attached to the coins you did not sell.
          Total basis is fixed, so a smaller figure here means more gain — and more tax — waiting in a
          future year. It is the clearest sign that a method is deferring rather than saving.
        </p>
        {warnings.length > 0 && (
          <p className="muted mt-3 text-xs">
            {warnings.length} warning{warnings.length > 1 ? "s" : ""} while reading the file (e.g. a
            disposal with no earlier purchase). Check the first few lines if a number looks off.
          </p>
        )}
      </div>

      <p className="muted text-sm">
        Want the full return, not just the method question?{" "}
        <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
          Run the same file through the tax report →
        </Link>
      </p>
    </section>
  );
}

function MethodCard({ r, cur }: { r: MethodResult; cur: string }) {
  return (
    <div className={`card p-5 ${r.isBest ? "ring-1 ring-brand-500/50" : ""}`}>
      <div className="flex items-baseline justify-between">
        <span className="font-bold">{r.short}</span>
        {r.isBest ? (
          <span className="text-xs font-semibold text-brand-ink">Lowest tax</span>
        ) : (
          r.savedVsFifo < 0 && <span className="text-xs text-loss">+{money(-r.savedVsFifo, cur)} vs FIFO</span>
        )}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{money(r.estimatedTax, cur)}</div>
      <div className="muted mt-0.5 text-xs">estimated tax this year</div>
      {!r.isFifo && r.savedVsFifo > 0 && (
        <div className="mt-2 text-sm font-semibold text-gain">Saves {money(r.savedVsFifo, cur)} vs FIFO</div>
      )}
      <div className="muted mt-3 border-t border-[var(--border)] pt-3 text-xs leading-relaxed">
        {money(r.taxableGain, cur)} taxable gain · {money(r.remainingBasis, cur)} basis left for later
      </div>
    </div>
  );
}
