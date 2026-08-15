/**
 * Client-side live price helpers shared by the header ticker and the
 * "use live price" buttons inside tools.
 *
 * Source: CoinGecko free API (no key, CORS-enabled, includes 24h change), with
 * a Binance fallback. All fetches run in the visitor's browser so everything
 * works on the fully static export.
 */

export interface LiveCoin {
  /** CoinGecko id. */
  id: string;
  /** Display ticker. */
  symbol: string;
  /** Binance pair (fallback source). */
  binance: string;
}

export const LIVE_COINS: LiveCoin[] = [
  { id: "bitcoin", symbol: "BTC", binance: "BTCUSDT" },
  { id: "ethereum", symbol: "ETH", binance: "ETHUSDT" },
  { id: "solana", symbol: "SOL", binance: "SOLUSDT" },
  { id: "binancecoin", symbol: "BNB", binance: "BNBUSDT" },
  { id: "ripple", symbol: "XRP", binance: "XRPUSDT" },
  { id: "dogecoin", symbol: "DOGE", binance: "DOGEUSDT" },
  { id: "cardano", symbol: "ADA", binance: "ADAUSDT" },
];

export interface LiveQuote {
  symbol: string;
  price: number;
  change: number; // 24h % change
}

async function fetchFromCoinGecko(): Promise<LiveQuote[]> {
  const ids = LIVE_COINS.map((c) => c.id).join(",");
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
  );
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = (await res.json()) as Record<
    string,
    { usd?: number; usd_24h_change?: number }
  >;
  return LIVE_COINS.flatMap((c) => {
    const row = data[c.id];
    if (!row || typeof row.usd !== "number") return [];
    return [{ symbol: c.symbol, price: row.usd, change: row.usd_24h_change ?? 0 }];
  });
}

async function fetchFromBinance(): Promise<LiveQuote[]> {
  const symbols = JSON.stringify(LIVE_COINS.map((c) => c.binance));
  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`,
  );
  if (!res.ok) throw new Error(`Binance ${res.status}`);
  const data = (await res.json()) as {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
  }[];
  const bySymbol = new Map(data.map((d) => [d.symbol, d]));
  return LIVE_COINS.flatMap((c) => {
    const row = bySymbol.get(c.binance);
    if (!row) return [];
    return [{ symbol: c.symbol, price: parseFloat(row.lastPrice), change: parseFloat(row.priceChangePercent) }];
  });
}

/** All quotes at once (used by the ticker). Falls back CoinGecko → Binance. */
export async function fetchLiveQuotes(): Promise<LiveQuote[]> {
  try {
    return await fetchFromCoinGecko();
  } catch {
    return await fetchFromBinance();
  }
}

/** Single coin price by ticker symbol (used by the "use live price" buttons). */
export async function fetchLivePrice(symbol: string): Promise<number | null> {
  const quotes = await fetchLiveQuotes();
  return quotes.find((q) => q.symbol === symbol)?.price ?? null;
}

/**
 * Spot price for ANY coin by CoinGecko id — used by the /coins pages, which
 * cover assets outside the small LIVE_COINS ticker set. Falls back to a single
 * Binance pair so the prefill still works if CoinGecko rate-limits.
 */
export async function fetchCoinSpot(
  coingeckoId: string,
  binancePair?: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
    );
    if (res.ok) {
      const data = (await res.json()) as Record<string, { usd?: number }>;
      const price = data?.[coingeckoId]?.usd;
      if (typeof price === "number" && isFinite(price)) return price;
    }
  } catch {
    /* fall through to Binance */
  }
  if (binancePair) {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${binancePair}`,
      );
      if (res.ok) {
        const data = (await res.json()) as { price?: string };
        const price = parseFloat(String(data.price));
        if (isFinite(price)) return price;
      }
    } catch {
      /* give up — the page still works with its static defaults */
    }
  }
  return null;
}

// --- Full market list (used by the /prices page) ----------------------------

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  rank: number;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume: number;
  /**
   * 7-day price series for the row sparkline. CoinGecko returns 168 hourly
   * points; we downsample to keep the SVG path short — a 60px-wide chart can't
   * resolve more than a few dozen points anyway.
   */
  sparkline: number[];
}

/** Every nth point, always keeping the last one so the line ends at "now". */
function downsample(series: number[], target = 32): number[] {
  if (series.length <= target) return series;
  const step = Math.ceil(series.length / target);
  const out = series.filter((_, i) => i % step === 0);
  const last = series[series.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

/** Top coins by market cap from CoinGecko (name, price, 24h/7d change, cap, volume, 7d series). */
export async function fetchMarketList(count = 100): Promise<MarketCoin[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&price_change_percentage=7d&sparkline=true`,
  );
  if (!res.ok) throw new Error(`CoinGecko markets ${res.status}`);
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data.map((c) => {
    const spark = (c.sparkline_in_7d as { price?: unknown } | undefined)?.price;
    return {
    id: String(c.id ?? ""),
    symbol: String(c.symbol ?? "").toUpperCase(),
    name: String(c.name ?? ""),
    image: String(c.image ?? ""),
    rank: Number(c.market_cap_rank ?? 0),
    price: Number(c.current_price ?? 0),
    change24h: Number(c.price_change_percentage_24h ?? 0),
    change7d: Number(c.price_change_percentage_7d_in_currency ?? 0),
    marketCap: Number(c.market_cap ?? 0),
    volume: Number(c.total_volume ?? 0),
    sparkline: Array.isArray(spark)
      ? downsample(spark.map(Number).filter((n) => isFinite(n)))
      : [],
    };
  });
}
