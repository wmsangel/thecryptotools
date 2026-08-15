/**
 * ============================================================================
 * CSV import — parsing, column detection and normalisation.
 * ============================================================================
 * Hand-written rather than pulled from npm, because the whole site ships with
 * three runtime dependencies and a transaction parser is not worth a fourth.
 * It handles the parts that actually break real exchange exports: quoted
 * fields containing commas and newlines, CRLF, BOM, semicolon and tab
 * delimiters, European decimal commas, and ambiguous day/month ordering.
 */

import type { RawRow, Tx, TxType, ReportIssue } from "./types";

// --- Parsing ---------------------------------------------------------------

/** Guess the delimiter from the header line — the one that splits it most. */
function detectDelimiter(text: string): string {
  const firstLine = text.slice(0, text.indexOf("\n") === -1 ? text.length : text.indexOf("\n"));
  const candidates = [",", ";", "\t", "|"];
  let best = ",";
  let bestCount = 0;
  for (const d of candidates) {
    // Count only delimiters outside quotes.
    let count = 0;
    let inQuotes = false;
    for (let i = 0; i < firstLine.length; i++) {
      const ch = firstLine[i];
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === d && !inQuotes) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      best = d;
    }
  }
  return best;
}

/** RFC 4180-style parse into rows of raw strings. */
export function parseCsv(input: string): { header: string[]; rows: string[][]; delimiter: string } {
  const text = input.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const delimiter = detectDelimiter(text);

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      field = "";
      // Skip blank lines rather than emitting empty rows.
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);

  const header = (rows.shift() ?? []).map((h) => h.trim());
  return { header, rows, delimiter };
}

// --- Column detection ------------------------------------------------------

export type FieldKey =
  | "date" | "type"
  | "sentAmount" | "sentAsset"
  | "receivedAmount" | "receivedAsset"
  | "feeAmount" | "feeAsset"
  | "fiatValue";

/**
 * Header aliases, lower-cased and stripped of punctuation before matching.
 * Ordered longest-intent first so "sent amount" wins over a bare "amount".
 */
const ALIASES: Record<FieldKey, string[]> = {
  date: ["date utc", "utc time", "timestamp utc", "date time", "datetime", "timestamp", "date", "time", "created at", "executed at"],
  type: ["transaction type", "operation type", "tx type", "type", "operation", "label", "side", "action", "category"],
  sentAmount: ["sent amount", "sell amount", "amount sent", "from amount", "sold amount", "out amount", "amount out", "debit"],
  sentAsset: ["sent currency", "sent asset", "sell currency", "from currency", "sold currency", "out currency", "sent symbol"],
  receivedAmount: ["received amount", "buy amount", "amount received", "to amount", "bought amount", "in amount", "amount in", "credit"],
  receivedAsset: ["received currency", "received asset", "buy currency", "to currency", "bought currency", "in currency", "received symbol"],
  feeAmount: ["fee amount", "fee value", "commission", "fees", "fee"],
  feeAsset: ["fee currency", "fee asset", "fee coin", "commission asset", "fee symbol"],
  fiatValue: ["net worth amount", "net value", "fiat value", "market value", "total value", "subtotal", "gross value", "value", "total"],
};

function normaliseHeader(h: string): string {
  return h.toLowerCase().replace(/[_\-.]/g, " ").replace(/[()]/g, " ").replace(/\s+/g, " ").trim();
}

/** Best-effort mapping from the file's headers to our fields. */
export function detectColumns(header: string[]): Partial<Record<FieldKey, string>> {
  const norm = header.map(normaliseHeader);
  const mapping: Partial<Record<FieldKey, string>> = {};
  const taken = new Set<number>();

  // Exact matches first, then prefix matches — so a precise header always wins.
  for (const pass of ["exact", "loose"] as const) {
    for (const key of Object.keys(ALIASES) as FieldKey[]) {
      if (mapping[key]) continue;
      for (const alias of ALIASES[key]) {
        const idx = norm.findIndex(
          (h, i) => !taken.has(i) && (pass === "exact" ? h === alias : h.includes(alias)),
        );
        if (idx !== -1) {
          mapping[key] = header[idx];
          taken.add(idx);
          break;
        }
      }
    }
  }
  return mapping;
}

// --- Value parsing ---------------------------------------------------------

/**
 * Parse a number that may carry currency symbols, thousands separators, or a
 * European decimal comma. Returns null rather than 0 for anything unreadable —
 * a silent zero in a tax report is worse than a visible error.
 */
export function parseNumber(raw: string): number | null {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s) return null;

  const negative = /^\(.*\)$/.test(s) || s.startsWith("-");
  s = s.replace(/[()]/g, "").replace(/^[-+]/, "");
  // Strip currency symbols, codes and spaces (including non-breaking).
  s = s.replace(/[^\d.,eE+-]/g, "").replace(/ /g, "");
  if (!s) return null;

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");
  if (hasDot && hasComma) {
    // Rightmost separator is the decimal point; the other groups thousands.
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (hasComma) {
    const parts = s.split(",");
    // "1,234" → thousands. "0,5" / "1,23" → decimal comma.
    if (parts.length > 2 || parts[parts.length - 1].length === 3) s = s.replace(/,/g, "");
    else s = s.replace(",", ".");
  }

  const n = Number(s);
  if (!isFinite(n)) return null;
  return negative ? -n : n;
}

export type DateOrder = "auto" | "dmy" | "mdy";

/**
 * Parse a date. ISO forms are taken literally; slash/dot forms are resolved
 * using `order`, falling back to whichever component cannot be a month.
 */
export function parseDate(raw: string, order: DateOrder = "auto"): Date | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;

  // ISO-ish: 2024-01-15, 2024-01-15 10:30:00, 2024-01-15T10:30:00Z
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (iso) {
    const [, y, m, d, hh = "0", mm = "0", ss = "0"] = iso;
    return new Date(Date.UTC(+y, +m - 1, +d, +hh, +mm, +ss));
  }

  // 15/01/2024, 01.15.2024, 15-01-2024 (with optional time)
  const parts = s.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})(?:[T ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (parts) {
    const [, aRaw, bRaw, yRaw, hh = "0", mm = "0", ss = "0"] = parts;
    let a = +aRaw;
    let b = +bRaw;
    let year = +yRaw;
    if (year < 100) year += year < 70 ? 2000 : 1900;

    let day: number;
    let month: number;
    if (order === "dmy") [day, month] = [a, b];
    else if (order === "mdy") [month, day] = [a, b];
    else if (a > 12) [day, month] = [a, b];
    else if (b > 12) [month, day] = [a, b];
    else [day, month] = [a, b]; // ambiguous — day-first is the world majority
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return new Date(Date.UTC(year, month - 1, day, +hh, +mm, +ss));
  }

  // Unix seconds or milliseconds.
  if (/^\d{10}$/.test(s)) return new Date(+s * 1000);
  if (/^\d{13}$/.test(s)) return new Date(+s);

  const fallback = new Date(s);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/** True when a slash-format file could be read either way round. */
export function datesAreAmbiguous(values: string[]): boolean {
  let sawSlash = false;
  for (const v of values) {
    const m = String(v).trim().match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})/);
    if (!m) continue;
    sawSlash = true;
    if (+m[1] > 12 || +m[2] > 12) return false; // one component settles it
  }
  return sawSlash;
}

const TYPE_WORDS: { match: RegExp; type: TxType }[] = [
  { match: /^(buy|purchase|bought)/i, type: "buy" },
  { match: /^(sell|sold|sale)/i, type: "sell" },
  { match: /(trade|swap|convert|exchange)/i, type: "trade" },
  { match: /(staking|stake reward|reward|mining|mined|airdrop|interest|earn|dividend|income)/i, type: "income" },
  { match: /(spend|payment|purchase with|gift sent)/i, type: "spend" },
  { match: /(deposit|withdraw|transfer|send|receive)/i, type: "transfer" },
];

function classify(typeRaw: string, hasSent: boolean, hasReceived: boolean, fiatAssets: Set<string>, sentAsset?: string, receivedAsset?: string): TxType {
  const label = (typeRaw ?? "").trim();
  for (const { match, type } of TYPE_WORDS) {
    if (match.test(label)) {
      // A labelled "trade" between fiat and crypto is really a buy or a sell.
      if (type === "trade" || type === "buy" || type === "sell") break;
      return type;
    }
  }
  const sentIsFiat = sentAsset ? fiatAssets.has(sentAsset.toUpperCase()) : false;
  const recvIsFiat = receivedAsset ? fiatAssets.has(receivedAsset.toUpperCase()) : false;

  if (hasSent && hasReceived) {
    if (sentIsFiat && !recvIsFiat) return "buy";
    if (!sentIsFiat && recvIsFiat) return "sell";
    if (!sentIsFiat && !recvIsFiat) return "trade";
    return "transfer"; // fiat → fiat, nothing to tax
  }
  if (!hasSent && hasReceived) return "income";
  if (hasSent && !hasReceived) return "spend";
  return "unknown";
}

export const FIAT_CODES = new Set([
  "USD", "EUR", "GBP", "AUD", "CAD", "NZD", "ZAR", "PLN", "INR", "CHF", "JPY",
  "SEK", "NOK", "DKK", "CZK", "HUF", "SGD", "HKD", "AED", "BRL", "MXN", "TRY", "KRW",
]);

export interface NormaliseOptions {
  mapping: Partial<Record<FieldKey, string>>;
  dateOrder: DateOrder;
  /** Fiat the report is denominated in — used to derive value from a fiat leg. */
  reportCurrency: string;
}

/** Turn raw rows into typed transactions, collecting problems as it goes. */
export function normalise(
  header: string[],
  rows: string[][],
  opts: NormaliseOptions,
): { txs: Tx[]; issues: ReportIssue[] } {
  const { mapping, dateOrder, reportCurrency } = opts;
  const idx = (key: FieldKey): number => {
    const name = mapping[key];
    return name ? header.indexOf(name) : -1;
  };
  const cols: Record<FieldKey, number> = {
    date: idx("date"), type: idx("type"),
    sentAmount: idx("sentAmount"), sentAsset: idx("sentAsset"),
    receivedAmount: idx("receivedAmount"), receivedAsset: idx("receivedAsset"),
    feeAmount: idx("feeAmount"), feeAsset: idx("feeAsset"),
    fiatValue: idx("fiatValue"),
  };

  const txs: Tx[] = [];
  const issues: ReportIssue[] = [];
  const get = (row: string[], c: number) => (c >= 0 ? (row[c] ?? "").trim() : "");

  rows.forEach((row, i) => {
    const line = i + 2; // +1 for the header, +1 for 1-based counting
    const date = parseDate(get(row, cols.date), dateOrder);
    if (!date) {
      issues.push({ line, severity: "error", message: `Could not read a date from "${get(row, cols.date) || "(empty)"}". Row skipped.` });
      return;
    }

    const sentAmount = parseNumber(get(row, cols.sentAmount)) ?? undefined;
    const receivedAmount = parseNumber(get(row, cols.receivedAmount)) ?? undefined;
    const feeAmount = parseNumber(get(row, cols.feeAmount)) ?? undefined;
    const sentAsset = get(row, cols.sentAsset).toUpperCase() || undefined;
    const receivedAsset = get(row, cols.receivedAsset).toUpperCase() || undefined;
    const feeAsset = get(row, cols.feeAsset).toUpperCase() || undefined;

    const hasSent = !!sentAsset && !!sentAmount && sentAmount > 0;
    const hasReceived = !!receivedAsset && !!receivedAmount && receivedAmount > 0;
    if (!hasSent && !hasReceived) {
      issues.push({ line, severity: "warning", message: "No amounts on this row — skipped." });
      return;
    }

    const type = classify(get(row, cols.type), hasSent, hasReceived, FIAT_CODES, sentAsset, receivedAsset);

    // Value the row in the report currency: prefer the fiat leg (exact), then
    // an explicit value column. Anything else stays undefined and is flagged
    // later by the engine only if the row actually needs a value.
    let fiatValue = parseNumber(get(row, cols.fiatValue)) ?? undefined;
    if (sentAsset === reportCurrency && sentAmount) fiatValue = sentAmount;
    else if (receivedAsset === reportCurrency && receivedAmount) fiatValue = receivedAmount;
    if (fiatValue !== undefined) fiatValue = Math.abs(fiatValue);

    let fiatFee: number | undefined;
    if (feeAmount && feeAsset === reportCurrency) fiatFee = Math.abs(feeAmount);

    txs.push({
      line, date, type,
      sentAsset: hasSent ? sentAsset : undefined,
      sentAmount: hasSent ? Math.abs(sentAmount!) : undefined,
      receivedAsset: hasReceived ? receivedAsset : undefined,
      receivedAmount: hasReceived ? Math.abs(receivedAmount!) : undefined,
      feeAsset, feeAmount: feeAmount ? Math.abs(feeAmount) : undefined,
      fiatValue, fiatFee,
    });
  });

  txs.sort((a, b) => a.date.getTime() - b.date.getTime() || a.line - b.line);
  return { txs, issues };
}

/**
 * The fiat currency the file is actually denominated in, by counting the fiat
 * codes appearing in its asset columns. Used to preselect a matching country —
 * nothing here converts between currencies, so a file in EUR reported against
 * a GBP country would silently treat one as the other.
 */
export function detectFiatCurrency(
  header: string[],
  rows: string[][],
  mapping: Partial<Record<FieldKey, string>>,
): string | null {
  const cols = [mapping.sentAsset, mapping.receivedAsset, mapping.feeAsset]
    .map((name) => (name ? header.indexOf(name) : -1))
    .filter((i) => i >= 0);
  if (!cols.length) return null;

  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const c of cols) {
      const code = (row[c] ?? "").trim().toUpperCase();
      if (FIAT_CODES.has(code)) counts.set(code, (counts.get(code) ?? 0) + 1);
    }
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [code, n] of counts) {
    if (n > bestCount) {
      bestCount = n;
      best = code;
    }
  }
  return best;
}

/** Sample rows for the mapping preview. */
export function sampleValues(header: string[], rows: string[][], column: string, n = 3): string[] {
  const i = header.indexOf(column);
  if (i < 0) return [];
  return rows.slice(0, 40).map((r) => (r[i] ?? "").trim()).filter(Boolean).slice(0, n);
}

export type { RawRow };
