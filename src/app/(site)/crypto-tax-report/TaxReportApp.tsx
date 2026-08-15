"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { jurisdictions, getJurisdiction, taxYearsIn } from "@/lib/taxreport/jurisdictions";
import { useCsvIntake, CsvDropZone, CsvColumnMapper } from "@/components/taxreport/CsvIntake";
import { buildReport } from "@/lib/taxreport/engine";
import type { TaxReport } from "@/lib/taxreport/types";
import { track, bucket } from "@/lib/analytics";


const SAMPLE = `Date,Type,Sent Amount,Sent Currency,Received Amount,Received Currency,Fee Amount,Fee Currency,Net Value
2023-02-11,Buy,12000,EUR,0.45,BTC,15,EUR,12000
2023-08-04,Buy,6000,EUR,3.2,ETH,8,EUR,6000
2024-03-19,Trade,1.1,ETH,410,ADA,0,EUR,3900
2024-09-02,Income,,,120,ADA,,,96
2025-01-27,Sell,0.25,BTC,,,22,EUR,23500
2025-06-14,Sell,2.1,ETH,,,11,EUR,7200
2025-11-03,Sell,530,ADA,,,4,EUR,610`;

function money(n: number, code: string): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: code, maximumFractionDigits: 2 });
}
const qty = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 8 });
const day = (d: Date) => d.toISOString().slice(0, 10);

export function TaxReportApp() {
  const [jurisdictionId, setJurisdictionId] = useState("uk");
  // Once the user picks a country we stop overriding it from the file.
  const [countryChosenByUser, setCountryChosenByUser] = useState(false);
  const [yearLabel, setYearLabel] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [ltRate, setLtRate] = useState<number | null>(null);
  const [showAllRows, setShowAllRows] = useState(false);

  const jurisdiction = getJurisdiction(jurisdictionId)!;

  // Nothing converts currencies, so start on a country that uses the same one
  // as the file rather than silently reading EUR figures as GBP. Once the user
  // has picked a country themselves we stop overriding it.
  const intake = useCsvIntake((fiat) => {
    if (countryChosenByUser) return;
    const match = jurisdictions.find((j) => j.currencyCode === fiat);
    if (match) setJurisdictionId(match.id);
  });

  // A newly loaded file starts from a collapsed table, not the previous one's
  // expanded state.
  useEffect(() => { setShowAllRows(false); }, [intake.raw]);

  const normalised = useMemo(
    () => intake.normalisedFor(jurisdiction.currencyCode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intake.parsed, intake.mapping, intake.dateOrder, jurisdiction.currencyCode],
  );

  const years = useMemo(() => {
    if (!normalised?.txs.length) return [];
    return taxYearsIn(jurisdiction, normalised.txs.map((t) => t.date));
  }, [normalised, jurisdiction]);

  const activeYear = yearLabel && years.some((y) => y.label === yearLabel) ? yearLabel : years[0]?.label ?? "";

  const report: TaxReport | null = useMemo(() => {
    if (!normalised?.txs.length || !activeYear) return null;
    return buildReport(normalised.txs, normalised.issues, {
      jurisdiction,
      taxYearLabel: activeYear,
      rate: rate ?? jurisdiction.defaultRate,
      longTermRate: ltRate ?? jurisdiction.defaultLongTermRate,
    });
  }, [normalised, jurisdiction, activeYear, rate, ltRate]);

  /**
   * One `tax_report_built` per distinct country × tax year, not per recompute —
   * the report object is rebuilt by every rate tweak and row expansion, and a
   * visitor comparing five countries should read as five, not fifty.
   *
   * Country is the field to watch: it says which jurisdiction to deepen next,
   * and whether anyone is reaching for the twelve that already exist.
   */
  const lastReportKey = useRef("");
  useEffect(() => {
    if (!report) return;
    const key = `${jurisdiction.id}|${activeYear}`;
    if (lastReportKey.current === key) return;
    lastReportKey.current = key;
    track("tax_report_built", {
      country: jurisdiction.id,
      method: jurisdiction.method,
      disposals: bucket(report.disposals.length),
      has_errors: report.issues.some((i) => i.severity === "error"),
    });
  }, [report, jurisdiction, activeYear]);

  function downloadCsv() {
    if (!report) return;
    // The end of the funnel: someone walked a CSV all the way to a filing-ready
    // export. This is the closest thing the site has to a conversion.
    track("tax_report_export", {
      country: jurisdiction.id,
      disposals: bucket(report.disposals.length),
    });
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const head = ["Date", "Asset", "Quantity", "Proceeds", "Cost", "Fee", "Gain", "Holding days", "Treatment", "Basis", "Source row"];
    const lines = report.disposals.map((d) =>
      [
        day(d.date), d.asset, d.quantity, d.proceeds.toFixed(2), d.cost.toFixed(2), d.fee.toFixed(2),
        d.gain.toFixed(2), d.holdingDays ?? "", d.unvalued ? "UNVALUED — check this row" : d.exempt ? (d.gain >= 0 ? "Exempt" : "Exempt — loss not allowable") : d.longTerm ? "Long-term" : "Taxable",
        d.basis, d.line,
      ].map(esc).join(","),
    );
    const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crypto-tax-${jurisdiction.id}-${activeYear.replace("–", "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const errors = report?.issues.filter((i) => i.severity === "error") ?? [];
  const warnings = report?.issues.filter((i) => i.severity === "warning") ?? [];
  const cur = jurisdiction.currencyCode;
  const shownRows = showAllRows ? report?.disposals ?? [] : (report?.disposals ?? []).slice(0, 50);

  return (
    <div className="space-y-8">
      {/* ---------- 1. INPUT ---------- */}
      <CsvDropZone
        intake={intake}
        heading="1 · Load your transactions"
        onSample={() => intake.ingest(SAMPLE, "sample.csv", "sample")}
      />

      {/* ---------- 2. MAPPING ---------- */}
      <CsvColumnMapper intake={intake} heading="2 · Check the columns" />

      {/* ---------- 3. RULES ---------- */}
      {normalised && normalised.txs.length > 0 && (
        <section className="card p-6">
          <h2 className="text-xl font-bold">3 · Your rules</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-semibold" htmlFor="jur">Country</label>
              <select
                id="jur"
                value={jurisdictionId}
                onChange={(e) => { setJurisdictionId(e.target.value); setCountryChosenByUser(true); setRate(null); setLtRate(null); }}
                className="input-field mt-1.5 w-full text-sm"
              >
                {jurisdictions.map((j) => (
                  <option key={j.id} value={j.id}>{j.flag} {j.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="year">Tax year</label>
              <select
                id="year"
                value={activeYear}
                onChange={(e) => setYearLabel(e.target.value)}
                className="input-field mt-1.5 w-full text-sm"
              >
                {years.map((y) => (
                  <option key={y.label} value={y.label}>
                    {y.label} ({day(y.start)} → {day(y.end)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="rate">
                {jurisdiction.relief.kind === "rate" ? "Short-term rate" : "Your tax rate"}
              </label>
              <input
                id="rate"
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
                <label className="block text-sm font-semibold" htmlFor="ltrate">Long-term rate</label>
                <input
                  id="ltrate"
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
              <strong>Currency mismatch.</strong> Your file looks like it is denominated in{" "}
              {intake.fileCurrency}, but {jurisdiction.name} reports in {jurisdiction.currencyCode}. No
              conversion is applied — the figures would be read as {jurisdiction.currencyCode}. Pick
              a country using {intake.fileCurrency}, or convert your file first.
            </p>
          )}

          <div className="muted mt-4 space-y-1.5 text-xs">
            <p><strong className="text-[var(--text)]">Method:</strong> {jurisdiction.methodLabel}</p>
            <p><strong className="text-[var(--text)]">Swaps:</strong> {jurisdiction.swapsTaxable ? "crypto-to-crypto is a taxable disposal" : "crypto-to-crypto is not taxed"}</p>
            <p><strong className="text-[var(--text)]">Allowance:</strong> {jurisdiction.allowanceLabel}</p>
            <p>{jurisdiction.rateNote}</p>
          </div>
        </section>
      )}

      {/* ---------- 4. REPORT ---------- */}
      {report && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="eyebrow">Report</div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                {jurisdiction.flag} {jurisdiction.name} · {report.taxYearLabel}
              </h2>
            </div>
            <button type="button" className="btn-primary" onClick={downloadCsv}>
              ↓ Download CSV
            </button>
          </div>

          {errors.length > 0 && (
            <div className="rounded-xl border-l-4 border-red-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
              <strong>{errors.length} row{errors.length === 1 ? "" : "s"} could not be valued and {errors.length === 1 ? "is" : "are"} excluded from the totals.</strong>{" "}
              The figures below are therefore incomplete. Fix these rows and re-run.
              <ul className="mt-2 space-y-1">
                {errors.slice(0, 6).map((i, n) => (
                  <li key={n} className="muted">Row {i.line}: {i.message}</li>
                ))}
                {errors.length > 6 && <li className="muted">…and {errors.length - 6} more.</li>}
              </ul>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Proceeds" value={money(report.totals.proceeds, cur)} />
            <Stat label="Cost basis" value={money(report.totals.cost, cur)} />
            <Stat
              label="Net gain"
              value={money(report.totals.netGain, cur)}
              tone={report.totals.netGain >= 0 ? "up" : "down"}
            />
            <Stat label="Estimated tax" value={money(report.totals.estimatedTax, cur)} emphasis />
          </div>

          <div className="card p-6">
            <h3 className="font-bold">How that was worked out</h3>
            <dl className="mt-4 divide-y divide-[var(--border)] text-sm">
              <Row label="Gains" value={money(report.totals.grossGain, cur)} />
              <Row label="Losses" value={`−${money(report.totals.grossLoss, cur).replace("-", "")}`} />
              {report.totals.exemptGain > 0 && (
                <Row label={`Exempt — held over ${jurisdiction.relief.kind !== "none" ? jurisdiction.relief.days : 365} days`} value={`−${money(report.totals.exemptGain, cur)}`} />
              )}
              {report.totals.exemptLoss > 0 && (
                <Row
                  label="Loss on an exempt asset — not allowable"
                  value={`+${money(report.totals.exemptLoss, cur)}`}
                />
              )}
              {report.totals.discountedAway > 0 && (
                <Row label="Removed by the 50% long-term discount" value={`−${money(report.totals.discountedAway, cur)}`} />
              )}
              <Row label="Net gain" value={money(report.totals.netGain, cur)} />
              {jurisdiction.allowance > 0 && (
                <Row
                  label={jurisdiction.allowanceKind === "freigrenze" ? "Freigrenze (all-or-nothing)" : "Annual allowance"}
                  value={report.totals.allowanceUsed > 0 ? `−${money(report.totals.allowanceUsed, cur)}` : "not available"}
                />
              )}
              {jurisdiction.inclusionRate !== 1 && (
                <Row label={`Inclusion rate (${Math.round(jurisdiction.inclusionRate * 100)}%)`} value={money(report.totals.taxableGain, cur)} />
              )}
              <Row label="Taxable gain" value={money(report.totals.taxableGain, cur)} strong />
              <Row label="Estimated tax" value={money(report.totals.estimatedTax, cur)} strong />
              {report.totals.incomeTotal > 0 && (
                <Row label="Income received (staking, mining, airdrops)" value={money(report.totals.incomeTotal, cur)} />
              )}
            </dl>
            {report.totals.incomeTotal > 0 && (
              <p className="muted mt-4 text-xs">
                Income is shown separately because it is usually taxed at income rates, not capital gains
                rates, and in most countries in the year you received it.
              </p>
            )}
          </div>

          {report.disposals.length > 0 && (
            <div className="card overflow-x-auto p-0" tabIndex={0} role="group" aria-label="Disposals table, scrolls horizontally">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs muted">
                    {["Date", "Asset", "Quantity", "Proceeds", "Cost", "Gain", "Held", "Treatment"].map((h) => (
                      <th key={h} className="px-3 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shownRows.map((d, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-3 py-2.5 tabular-nums">{day(d.date)}</td>
                      <td className="px-3 py-2.5 font-medium">{d.asset}</td>
                      <td className="px-3 py-2.5 tabular-nums muted">{qty(d.quantity)}</td>
                      <td className="px-3 py-2.5 tabular-nums">{d.unvalued ? "—" : money(d.proceeds, cur)}</td>
                      <td className="px-3 py-2.5 tabular-nums muted">{money(d.cost, cur)}</td>
                      <td className={`px-3 py-2.5 tabular-nums font-semibold ${d.unvalued ? "muted" : d.gain >= 0 ? "text-gain" : "text-loss"}`}>
                        {d.unvalued ? "—" : money(d.gain, cur)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums muted">{d.holdingDays === null ? "pooled" : `${d.holdingDays}d`}</td>
                      <td className="px-3 py-2.5">
                        {d.unvalued ? (
                          <span className="text-loss">Needs a value</span>
                        ) : d.exempt ? (
                          <span className="text-gain">
                            {d.gain >= 0 ? "Exempt" : "Exempt — loss not allowable"}
                          </span>
                        ) : d.longTerm ? (
                          <span className="text-brand-ink">Long-term</span>
                        ) : (
                          <span className="muted">Taxable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {report.disposals.length > 50 && !showAllRows && (
                <div className="border-t border-[var(--border)] px-3 py-3 text-center">
                  <button type="button" className="text-sm font-semibold text-brand-ink hover:underline" onClick={() => setShowAllRows(true)}>
                    Show all {report.disposals.length} rows
                  </button>
                </div>
              )}
            </div>
          )}

          {report.holdings.length > 0 && (
            <div className="card p-6">
              <h3 className="font-bold">Still held at the end of {report.taxYearLabel}</h3>
              <p className="muted mt-1 text-sm">Carried into the next year at this cost basis.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {report.holdings.slice(0, 12).map((h) => (
                  <div key={h.asset} className="flex items-baseline justify-between rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
                    <span className="font-semibold">{h.asset}</span>
                    <span className="muted tabular-nums">{qty(h.quantity)} · {money(h.cost, cur)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="card p-6">
              <h3 className="font-bold">{warnings.length} thing{warnings.length === 1 ? "" : "s"} to check</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {warnings.slice(0, 10).map((i, n) => (
                  <li key={n} className="muted">Row {i.line}: {i.message}</li>
                ))}
                {warnings.length > 10 && <li className="muted">…and {warnings.length - 10} more.</li>}
              </ul>
            </div>
          )}

          <div className="card p-6">
            <h3 className="font-bold">What this report does not do</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {jurisdiction.caveats.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="mt-1 text-brand-ink">•</span>
                  <span className="muted">{c}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <span className="mt-1 text-brand-ink">•</span>
                <span className="muted">
                  This is an estimate to check your own figures against, not a filing. Read the{" "}
                  <Link href={`/guides/${jurisdiction.guideSlug}`} className="font-semibold text-brand-ink hover:underline">
                    {jurisdiction.name} tax guide
                  </Link>{" "}
                  and confirm with a professional before you file.
                </span>
              </li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, tone, emphasis }: { label: string; value: string; tone?: "up" | "down"; emphasis?: boolean }) {
  return (
    <div className={`card p-5 ${emphasis ? "border-brand-500" : ""}`}>
      <div className="muted text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div
        className={`mt-2 text-2xl font-extrabold tabular-nums ${
          emphasis ? "text-gradient" : tone === "up" ? "text-gain" : tone === "down" ? "text-loss" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className={strong ? "font-semibold" : "muted"}>{label}</dt>
      <dd className={`tabular-nums ${strong ? "font-bold" : ""}`}>{value}</dd>
    </div>
  );
}
