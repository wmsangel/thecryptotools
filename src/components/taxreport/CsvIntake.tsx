"use client";

/**
 * ============================================================================
 * Shared CSV intake — "load a file, tell us what the columns mean".
 * ============================================================================
 * Both /crypto-tax-report/ and /tax-loss-harvesting/ start from the same
 * transaction history and the same auto-detection, so they share this rather
 * than keeping two copies of a column mapper that would drift apart the first
 * time an exchange changes a header.
 *
 * The hook owns the file and the mapping; the caller owns the jurisdiction,
 * because normalisation needs the report currency and the country selector
 * belongs to the page, not to the file picker.
 *
 * Nothing here uploads anything. The FileReader runs in the browser and the
 * text never leaves it — that is the product, not a detail.
 */

import { useMemo, useRef, useState } from "react";
import {
  parseCsv, detectColumns, normalise, datesAreAmbiguous, sampleValues, detectFiatCurrency,
  type FieldKey, type DateOrder,
} from "@/lib/taxreport/csv";
import { track, bucket } from "@/lib/analytics";

export const CSV_FIELDS: { key: FieldKey; label: string; required: boolean; hint: string }[] = [
  { key: "date", label: "Date", required: true, hint: "When the transaction happened" },
  { key: "type", label: "Type", required: false, hint: "Buy / Sell / Trade / Income — guessed if absent" },
  { key: "sentAmount", label: "Sent amount", required: false, hint: "What left your account" },
  { key: "sentAsset", label: "Sent currency", required: false, hint: "BTC, EUR, …" },
  { key: "receivedAmount", label: "Received amount", required: false, hint: "What came in" },
  { key: "receivedAsset", label: "Received currency", required: false, hint: "BTC, EUR, …" },
  { key: "feeAmount", label: "Fee amount", required: false, hint: "Optional" },
  { key: "feeAsset", label: "Fee currency", required: false, hint: "Optional" },
  { key: "fiatValue", label: "Value in your currency", required: false, hint: "Needed for crypto-to-crypto swaps" },
];

export interface CsvIntake {
  raw: string;
  fileName: string;
  mapping: Partial<Record<FieldKey, string>>;
  dateOrder: DateOrder;
  setMapping: React.Dispatch<React.SetStateAction<Partial<Record<FieldKey, string>>>>;
  setDateOrder: (o: DateOrder) => void;
  ingest: (text: string, name?: string, source?: "file" | "sample" | "paste") => void;
  onFile: (file?: File | null) => void;
  parsed: { header: string[]; rows: string[][] } | null;
  ambiguousDates: boolean;
  /** Fiat the file appears to be denominated in, or null. */
  fileCurrency: string | null;
  normalisedFor: (reportCurrency: string) => ReturnType<typeof normalise> | null;
}

/**
 * @param onDetectCurrency called with the fiat detected in a freshly loaded
 *   file, so the page can preselect a country that uses it. Nothing converts
 *   currencies anywhere in this codebase, so reading EUR figures as GBP is a
 *   real failure mode and this is what prevents it.
 */
export function useCsvIntake(onDetectCurrency?: (fiat: string) => void): CsvIntake {
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState("");
  const [mapping, setMapping] = useState<Partial<Record<FieldKey, string>>>({});
  const [dateOrder, setDateOrder] = useState<DateOrder>("auto");

  const parsed = useMemo(() => {
    if (!raw.trim()) return null;
    try {
      const { header, rows } = parseCsv(raw);
      if (header.length < 2 || rows.length === 0) return null;
      return { header, rows };
    } catch {
      return null;
    }
  }, [raw]);

  function ingest(text: string, name = "", source: "file" | "sample" | "paste" = "file") {
    setRaw(text);
    setFileName(name);
    try {
      const { header, rows } = parseCsv(text);
      const guessed = detectColumns(header);
      setMapping(guessed);
      // How often auto-detection fails is the number that decides whether
      // exchange-specific parsers are worth building. Row count is bucketed and
      // the file name is never sent — nothing here describes the holdings.
      track("tax_csv_loaded", {
        source,
        rows: bucket(rows.length),
        columns: header.length,
        detected_date: !!guessed.date,
        detected_type: !!guessed.type,
        detected_fiat: !!guessed.fiatValue,
        auto_mapped: Object.keys(guessed).length,
      });
      const fiat = detectFiatCurrency(header, rows, guessed);
      if (fiat && onDetectCurrency) onDetectCurrency(fiat);
    } catch {
      setMapping({});
      track("tax_csv_parse_failed", { source });
    }
  }

  function onFile(file?: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => ingest(String(reader.result ?? ""), file.name);
    reader.readAsText(file);
  }

  const fileCurrency = useMemo(() => {
    if (!parsed) return null;
    return detectFiatCurrency(parsed.header, parsed.rows, mapping);
  }, [parsed, mapping]);

  const ambiguousDates = useMemo(() => {
    if (!parsed || !mapping.date) return false;
    return datesAreAmbiguous(sampleValues(parsed.header, parsed.rows, mapping.date, 60));
  }, [parsed, mapping.date]);

  function normalisedFor(reportCurrency: string) {
    if (!parsed || !mapping.date) return null;
    return normalise(parsed.header, parsed.rows, { mapping, dateOrder, reportCurrency });
  }

  return {
    raw, fileName, mapping, dateOrder,
    setMapping, setDateOrder, ingest, onFile,
    parsed, ambiguousDates, fileCurrency, normalisedFor,
  };
}

// --- UI ---------------------------------------------------------------------

export function CsvDropZone({
  intake,
  heading,
  onSample,
  sampleLabel = "Try a sample",
}: {
  intake: CsvIntake;
  heading: string;
  onSample: () => void;
  sampleLabel?: string;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">{heading}</h2>
        <span className="chip !px-2.5 !py-0.5 text-xs">🔒 Never leaves your browser</span>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          intake.onFile(e.dataTransfer.files?.[0]);
        }}
        className="mt-4 rounded-xl border-2 border-dashed border-[var(--border)] px-4 py-8 text-center"
      >
        <p className="muted text-sm">Drop a CSV here, or</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-primary" onClick={() => fileInput.current?.click()}>
            Choose file
          </button>
          <button type="button" className="btn-ghost" onClick={onSample}>
            {sampleLabel}
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv,text/plain"
          className="hidden"
          onChange={(e) => intake.onFile(e.target.files?.[0])}
        />
        {intake.fileName && <p className="muted mt-3 text-xs">Loaded {intake.fileName}</p>}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-brand-ink">Or paste CSV text</summary>
        <textarea
          value={intake.raw}
          onChange={(e) => intake.ingest(e.target.value, "", "paste")}
          rows={6}
          placeholder="Date,Type,Sent Amount,Sent Currency,Received Amount,Received Currency…"
          className="input-field mt-3 w-full font-mono text-xs"
          aria-label="Paste CSV text"
        />
      </details>

      {intake.raw && !intake.parsed && (
        <p className="mt-4 rounded-xl border-l-4 border-red-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          That does not look like a CSV with a header row. Export &quot;transaction history&quot; from your
          exchange and try again.
        </p>
      )}
    </section>
  );
}

export function CsvColumnMapper({ intake, heading }: { intake: CsvIntake; heading: string }) {
  const { parsed, mapping } = intake;
  if (!parsed) return null;

  return (
    <section className="card p-6">
      <h2 className="text-xl font-bold">{heading}</h2>
      <p className="muted mt-1 text-sm">
        Detected {parsed.rows.length} rows. We guessed the mapping — correct anything wrong.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CSV_FIELDS.map((f) => {
          const chosen = mapping[f.key] ?? "";
          const samples = chosen ? sampleValues(parsed.header, parsed.rows, chosen) : [];
          return (
            <div key={f.key}>
              <label className="block text-sm font-semibold" htmlFor={`map-${f.key}`}>
                {f.label} {f.required && <span className="text-loss">*</span>}
              </label>
              <select
                id={`map-${f.key}`}
                value={chosen}
                onChange={(e) => intake.setMapping((m) => ({ ...m, [f.key]: e.target.value || undefined }))}
                className="input-field mt-1.5 w-full text-sm"
              >
                <option value="">— not in file —</option>
                {parsed.header.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <p className="muted mt-1 text-xs">
                {samples.length ? `e.g. ${samples.join(", ")}` : f.hint}
              </p>
            </div>
          );
        })}
      </div>

      {!mapping.date && (
        <p className="mt-4 rounded-xl border-l-4 border-red-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          Pick the date column to continue — nothing can be computed without it.
        </p>
      )}

      {intake.ambiguousDates && (
        <div className="mt-4 rounded-xl border-l-4 border-amber-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          <strong>Which way round are these dates?</strong> Every date in this file could be read either
          way (e.g. 03/05 is 3 May or March 5), and getting it wrong changes your holding periods.
          <div className="mt-2 flex flex-wrap gap-2">
            {([
              ["dmy", "Day first — 03/05 = 3 May"],
              ["mdy", "Month first — 03/05 = March 5"],
            ] as const).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => intake.setDateOrder(v)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  intake.dateOrder === v
                    ? "border-brand-500 bg-brand-500/10 text-brand-ink"
                    : "border-[var(--border)] muted hover:border-brand-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
