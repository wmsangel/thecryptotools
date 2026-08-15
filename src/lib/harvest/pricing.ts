/**
 * ============================================================================
 * Valuing the holdings.
 * ============================================================================
 * A harvesting page is only as honest as its prices, so this module has one
 * hard rule: it returns a price or it returns nothing. There is no default, no
 * last-known-good from another asset, no zero. A holding we cannot value is
 * handed back as unpriced and excluded from every total, because a guessed
 * price does not just make one row wrong — it silently moves the headline
 * "tax you would save" that the whole page exists to state.
 *
 * The asset map is built on the server from the coin registry and passed in,
 * rather than imported here: the registry carries several thousand lines of
 * page copy, and none of it belongs in the browser bundle for the sake of 63
 * ticker symbols.
 */

/** Symbol → the identifiers needed to price it. */
export interface AssetMeta {
  coingeckoId: string;
  /** Slug of our own daily history file, where we have one. */
  historySlug?: string;
}

export type AssetMap = Record<string, AssetMeta>;

export interface PriceResult {
  prices: Record<string, number>;
  /** Human-readable provenance, rendered next to the valuations. */
  note: string;
  /** Symbols we could not price at all. */
  missing: string[];
}

/**
 * CoinGecko quotes directly in the report currency, which matters more than it
 * looks: our own price history is USD-only, and converting a USD close into
 * GBP without an FX rate would be inventing the very number we refuse to
 * invent. So a non-USD report can only use the live quote.
 */
const VS_CURRENCIES = new Set([
  "usd", "gbp", "eur", "aud", "cad", "nzd", "inr", "zar", "pln", "chf", "jpy", "brl", "sgd", "hkd",
]);

export function currencySupported(currencyCode: string): boolean {
  return VS_CURRENCIES.has(currencyCode.toLowerCase());
}

/**
 * Live spot for every held symbol, in one request.
 * Returns only what CoinGecko actually answered for — a symbol missing from
 * the response stays missing.
 */
async function fetchLive(
  symbols: string[],
  assets: AssetMap,
  currencyCode: string,
): Promise<Record<string, number>> {
  const vs = currencyCode.toLowerCase();
  if (!VS_CURRENCIES.has(vs)) return {};

  const ids = symbols
    .map((s) => assets[s]?.coingeckoId)
    .filter((id): id is string => !!id);
  if (ids.length === 0) return {};

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${[...new Set(ids)].join(",")}&vs_currencies=${vs}`,
  );
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = (await res.json()) as Record<string, Record<string, number>>;

  const out: Record<string, number> = {};
  for (const symbol of symbols) {
    const id = assets[symbol]?.coingeckoId;
    if (!id) continue;
    const price = data?.[id]?.[vs];
    if (typeof price === "number" && isFinite(price) && price > 0) out[symbol] = price;
  }
  return out;
}

/**
 * Last daily close from the history files we ship. USD only, and dated — the
 * label says which day it is, because "current value" that is three days old
 * is a different claim from "current value".
 */
async function fetchLastCloses(
  symbols: string[],
  assets: AssetMap,
): Promise<{ prices: Record<string, number>; asOf: string | null }> {
  const out: Record<string, number> = {};
  let asOf: string | null = null;

  await Promise.all(
    symbols.map(async (symbol) => {
      const slug = assets[symbol]?.historySlug;
      if (!slug) return;
      try {
        const res = await fetch(`/data/history/${slug}.json`);
        if (!res.ok) return;
        const data = (await res.json()) as { end?: string; prices?: number[] };
        const series = data.prices;
        if (!Array.isArray(series) || series.length === 0) return;
        const last = series[series.length - 1];
        if (typeof last === "number" && isFinite(last) && last > 0) {
          out[symbol] = last;
          if (data.end && (!asOf || data.end < asOf)) asOf = data.end;
        }
      } catch {
        /* leave it unpriced */
      }
    }),
  );

  return { prices: out, asOf };
}

/**
 * Price every held symbol, preferring the live quote and falling back to our
 * own last close only where the report currency is USD.
 */
export async function priceHoldings(
  symbols: string[],
  assets: AssetMap,
  currencyCode: string,
): Promise<PriceResult> {
  const unique = [...new Set(symbols.map((s) => s.toUpperCase()))];
  let prices: Record<string, number> = {};
  let note = "";

  try {
    prices = await fetchLive(unique, assets, currencyCode);
    if (Object.keys(prices).length > 0) {
      note = `Live prices from CoinGecko in ${currencyCode.toUpperCase()}, fetched just now.`;
    }
  } catch {
    /* fall through to the local history */
  }

  const stillMissing = unique.filter((s) => prices[s] === undefined);

  if (stillMissing.length > 0 && currencyCode.toUpperCase() === "USD") {
    const { prices: closes, asOf } = await fetchLastCloses(stillMissing, assets);
    if (Object.keys(closes).length > 0) {
      prices = { ...prices, ...closes };
      const fallback = `daily closes from our own price history${asOf ? ` (to ${asOf})` : ""}`;
      note = note ? `${note} The rest use ${fallback}.` : `Live prices unavailable — using ${fallback}.`;
    }
  } else if (stillMissing.length > 0 && !currencySupported(currencyCode)) {
    note = note || `No price source quotes in ${currencyCode.toUpperCase()}.`;
  }

  const missing = unique.filter((s) => prices[s] === undefined);

  if (missing.length > 0 && currencyCode.toUpperCase() !== "USD") {
    note += " Our stored price history is in US dollars only, so it cannot stand in for a missing quote in this currency — converting it without an exchange rate would be a guess.";
  }

  return { prices, note: note || "No prices could be fetched.", missing };
}
