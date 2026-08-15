/**
 * Market data layer — READY but OPTIONAL.
 *
 * Core tools never call these functions; they exist so market-aware tools and
 * "live price" widgets can opt in later. Each provider is a thin, cached fetch
 * with a graceful fallback so a provider outage never breaks a page.
 *
 * Wire a tool to live data by calling `getSpotPrice()` in a client component and
 * feeding the result into the tool's inputs.
 */

export interface SpotPrice {
  symbol: string;
  usd: number;
  source: "coingecko" | "binance" | "mock";
  fetchedAt: string;
}

const MOCK_PRICES: Record<string, number> = {
  BTC: 30000,
  ETH: 2000,
  SOL: 60,
  BNB: 300,
};

/** CoinGecko simple-price endpoint. `id` uses CoinGecko coin ids (e.g. "bitcoin"). */
export async function getCoinGeckoPrice(id: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, { usd?: number }>;
    return data[id]?.usd ?? null;
  } catch {
    return null;
  }
}

/** Binance spot price. `symbol` is a Binance pair, e.g. "BTCUSDT". */
export async function getBinancePrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(symbol)}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { price?: string };
    return data.price ? parseFloat(data.price) : null;
  } catch {
    return null;
  }
}

/**
 * Best-effort spot price for a ticker (e.g. "BTC"). Tries Binance, then
 * CoinGecko, then a mock so tools always have a number to work with.
 */
export async function getSpotPrice(symbol: string): Promise<SpotPrice> {
  const upper = symbol.toUpperCase();
  const now = new Date().toISOString();

  const binance = await getBinancePrice(`${upper}USDT`);
  if (binance !== null) return { symbol: upper, usd: binance, source: "binance", fetchedAt: now };

  const cgIds: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum", SOL: "solana", BNB: "binancecoin" };
  const cgId = cgIds[upper];
  if (cgId) {
    const cg = await getCoinGeckoPrice(cgId);
    if (cg !== null) return { symbol: upper, usd: cg, source: "coingecko", fetchedAt: now };
  }

  return { symbol: upper, usd: MOCK_PRICES[upper] ?? 0, source: "mock", fetchedAt: now };
}
