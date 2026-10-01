/**
 * Fetches the Crypto Fear & Greed Index from alternative.me into a committed
 * snapshot (src/lib/fear-greed/snapshot.json), read synchronously at build time
 * so the page ships crawlable, server-rendered values. Runs in `npm run build`
 * (before next build), and the daily /dca re-deploy refreshes it — the index
 * only updates once a day, so a daily rebuild keeps it current. The page also
 * refreshes the current value client-side (the API sends CORS *), so a visitor
 * sees the latest even between rebuilds.
 *
 * Resilient: if the API hiccups, keep the existing committed snapshot rather
 * than failing the build or shipping an empty page.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "lib", "fear-greed", "snapshot.json");
const API = "https://api.alternative.me/fng/?limit=400&format=json";

try {
  const res = await fetch(API, { headers: { "User-Agent": "thecryptotools-fng/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const data = (json.data || [])
    .map((d) => ({ value: Number(d.value), classification: d.value_classification, timestamp: Number(d.timestamp) }))
    .filter((d) => Number.isFinite(d.value) && Number.isFinite(d.timestamp));
  if (data.length < 2) throw new Error("empty/short data");
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), source: "alternative.me", data }));
  console.log(`fng-snapshot: ${data.length} rows → ${OUT}`);
} catch (e) {
  if (existsSync(OUT)) {
    console.warn(`fng-snapshot: fetch failed (${e.message}) — keeping existing snapshot.`);
  } else {
    console.warn(`fng-snapshot: fetch failed (${e.message}) and no snapshot on disk — writing a placeholder.`);
    mkdirSync(dirname(OUT), { recursive: true });
    const now = Math.floor(Date.now() / 1000);
    writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), source: "alternative.me", data: [{ value: 50, classification: "Neutral", timestamp: now }] }));
  }
}
