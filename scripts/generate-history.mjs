/**
 * Builds the daily price history the investment calculator replays, into
 * `public/data/history/<slug>.json`.
 *
 * RUN MANUALLY (`npm run history`), not as part of `build`. It makes hundreds
 * of exchange requests and takes minutes; wiring it into every build would make
 * a routine rebuild slow and rate-limited for no benefit. Re-run it when you
 * want the backtests to reach closer to today — the pages state the last date
 * they have, so stale data is visible rather than silently wrong.
 *
 * WHY NOT COINGECKO, which the rest of the site uses: its public API now caps
 * historical queries at 365 days (error 10012). A backtest that cannot go back
 * further than a year is not a backtest, so the history comes from exchanges
 * instead — and only falls back to CoinGecko's 365 days for coins neither
 * exchange lists.
 *
 * Two sources are tried for every coin and the LONGER series wins:
 *   - Bitstamp, which reaches back to 2011 for BTC and is deepest for the
 *     majors, but only listed most altcoins recently.
 *   - Binance, which listed altcoins years earlier than Bitstamp did.
 * Neither is reliably deeper than the other, so guessing per coin would be
 * wrong about half the time. Fetching both costs a few minutes, once.
 *
 * The output is a plain array of daily closes plus a start date, with gaps
 * forward-filled, so the client can index it as `prices[daysSince(start)]`
 * with no date arithmetic and no interpolation at read time.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "data", "history");
const TMP = path.join(ROOT, ".next", "cache", "history-coins");
const DAY = 86_400_000;

const require = createRequire(import.meta.url);

/** Same isolated-compile trick as generate-llms — see the note there. */
function loadCoins() {
  execFileSync(
    path.join(ROOT, "node_modules", ".bin", "tsc"),
    ["src/lib/coins/registry.ts", "--outDir", TMP, "--rootDir", "src/lib/coins",
     "--module", "commonjs", "--target", "es2020", "--moduleResolution", "node", "--skipLibCheck"],
    { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] },
  );
  return require(path.join(TMP, "registry.js")).coins;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const utcDay = (ms) => Math.floor(ms / DAY);
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

async function getJson(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "thecryptotools-history/1.0" } });
      if (res.status === 429) { await sleep(5000 * (attempt + 1)); continue; }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      await sleep(1500);
    }
  }
  return null;
}

/**
 * Page forward through a candle endpoint until it stops giving us new days.
 *
 * The stop condition is "the cursor did not advance", NOT "we got back fewer
 * rows than we asked for". Bitstamp caps each response by TIME WINDOW rather
 * than by row count — asking for 1000 daily candles from 2011 returns 771 and
 * stops at 2013 — so a `rows.length < limit` break silently truncated every
 * Bitstamp series at its first page. That bug is why Binance appeared to have
 * deeper history than Bitstamp for every single coin, which is false for the
 * majors: Bitstamp has BTC from 2011, six years before Binance existed.
 */
async function pageThrough(fetchPage, firstCursor) {
  const out = [];
  let cursor = firstCursor;
  const now = Date.now();
  for (let page = 0; page < 40; page++) {
    const rows = await fetchPage(cursor);
    if (!rows || rows.length === 0) break;
    for (const row of rows) out.push(row);
    const nextCursor = rows[rows.length - 1][0] + DAY;
    if (nextCursor <= cursor || nextCursor > now + DAY) break;
    cursor = nextCursor;
    await sleep(300);
  }
  return out;
}

/** Binance daily klines. */
function fromBinance(pair) {
  return pageThrough(async (start) => {
    const rows = await getJson(
      `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&startTime=${start}&limit=1000`,
    );
    return Array.isArray(rows) ? rows.map((r) => [r[0], Number(r[4])]) : null;
  }, Date.UTC(2013, 0, 1));
}

/** Bitstamp daily OHLC. */
function fromBitstamp(symbol) {
  return pageThrough(async (start) => {
    const j = await getJson(
      `https://www.bitstamp.net/api/v2/ohlc/${symbol}usd/?step=86400&limit=1000&start=${Math.floor(start / 1000)}`,
    );
    const rows = j?.data?.ohlc;
    if (!Array.isArray(rows)) return null;
    // Bitstamp emits zero-volume placeholder rows before a pair really traded;
    // a 0 close would read as a 100% loss in the backtest.
    return rows
      .map((r) => [Number(r.timestamp) * 1000, Number(r.close)])
      .filter(([, close]) => close > 0);
  }, Date.UTC(2011, 0, 1));
}

/** Last resort: CoinGecko's 365-day window. */
async function fromCoinGecko(id) {
  const j = await getJson(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365`,
  );
  return Array.isArray(j?.prices) ? j.prices.map(([t, p]) => [t, Number(p)]) : [];
}

/**
 * Collapse raw points to one close per calendar day and forward-fill the gaps,
 * so the array index is exactly the number of days since `start`. Exchanges do
 * miss days — an outage, a halted market — and without filling, every date
 * after the gap would silently refer to the wrong day.
 */
function toDailySeries(points) {
  if (points.length === 0) return null;
  const byDay = new Map();
  for (const [ts, price] of points) {
    if (!Number.isFinite(price) || price <= 0) continue;
    byDay.set(utcDay(ts), price);
  }
  const days = [...byDay.keys()].sort((a, b) => a - b);
  if (days.length === 0) return null;

  const first = days[0];
  const last = days[days.length - 1];
  const prices = [];
  let carried = byDay.get(first);
  let filled = 0;
  for (let d = first; d <= last; d++) {
    const price = byDay.get(d);
    if (price === undefined) filled++;
    else carried = price;
    // Six significant digits keeps sub-cent coins honest (SHIB, BONK) while
    // keeping the files small — full float precision roughly doubles them.
    prices.push(Number(carried.toPrecision(6)));
  }
  return { start: iso(first * DAY), end: iso(last * DAY), prices, filled };
}

const coins = loadCoins();
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const index = [];
for (const coin of coins) {
  const symbol = coin.symbol.toLowerCase();
  const candidates = [];

  const bitstamp = toDailySeries(await fromBitstamp(symbol));
  if (bitstamp) candidates.push({ ...bitstamp, source: "Bitstamp" });

  if (coin.binance) {
    const binance = toDailySeries(await fromBinance(coin.binance));
    if (binance) candidates.push({ ...binance, source: "Binance" });
  }

  // Longest series wins — see the note at the top on why this is not a
  // per-coin decision made in advance.
  let best = candidates.sort((a, b) => b.prices.length - a.prices.length)[0];

  // CoinGecko is tried whenever the exchanges gave us LESS than their 365-day
  // window, not only when they gave us nothing. A renamed ticker is the case
  // that forces this: GRAMUSDT only exists from the June 2026 Toncoin rename,
  // so Binance offers 35 days, while CoinGecko tracks the asset across the
  // rename under its original id. Thirty-five days is not a backtest, and
  // silently shipping one would look like the page was broken.
  if (!best || best.prices.length < 365) {
    const gecko = toDailySeries(await fromCoinGecko(coin.coingeckoId));
    if (gecko && (!best || gecko.prices.length > best.prices.length)) {
      best = { ...gecko, source: "CoinGecko" };
    }
    await sleep(2500);
  }

  if (!best) {
    console.error(`  !! no history for ${coin.slug}`);
    continue;
  }

  await writeFile(
    path.join(OUT, `${coin.slug}.json`),
    JSON.stringify({
      slug: coin.slug,
      symbol: coin.symbol,
      source: best.source,
      start: best.start,
      end: best.end,
      prices: best.prices,
    }),
  );
  index.push({ slug: coin.slug, symbol: coin.symbol, source: best.source, start: best.start, end: best.end, days: best.prices.length });
  console.error(
    `ok ${coin.slug.padEnd(38)} ${best.source.padEnd(10)} ${best.start} → ${best.end}  ${String(best.prices.length).padStart(5)}d  (${best.filled} filled)`,
  );
}

await writeFile(path.join(OUT, "index.json"), JSON.stringify(index));

/**
 * The same index as a TypeScript module.
 *
 * The JSON is what the browser fetches; this is what the BUILD needs — the
 * sitemap has to date the backtest pages by the data they replay, and the
 * pages have to tell the reader how far the history reaches. Importing JSON
 * from `public/` into the app would work but hides a build-time dependency
 * inside a directory whose contract is "static files served verbatim". A
 * generated .ts file is visible in the diff and type-checked.
 */
await writeFile(
  path.join(ROOT, "src", "lib", "backtest", "history-index.ts"),
  `// GENERATED by scripts/generate-history.mjs — do not edit by hand.\n` +
    `// Re-run \`npm run history\` to refresh both this file and public/data/history/.\n\n` +
    `export interface HistoryMeta {\n  slug: string;\n  symbol: string;\n  source: string;\n  start: string;\n  end: string;\n  days: number;\n}\n\n` +
    `export const historyIndex: HistoryMeta[] = ${JSON.stringify(index, null, 2)};\n\n` +
    `const byslug = new Map(historyIndex.map((h) => [h.slug, h]));\n\n` +
    `export function getHistoryMeta(slug: string): HistoryMeta | undefined {\n  return byslug.get(slug);\n}\n\n` +
    `/** The newest day any series reaches — what the site can honestly claim. */\n` +
    `export const historyThrough: string = ${JSON.stringify(
      index.map((h) => h.end).sort().pop() ?? "",
    )};\n`,
);

await rm(TMP, { recursive: true, force: true });
console.error(`\ngenerate-history: wrote ${index.length}/${coins.length} coin histories to public/data/history/`);
