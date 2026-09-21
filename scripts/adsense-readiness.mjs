/**
 * ============================================================================
 * AdSense-readiness check — is the site "alive" enough to re-apply?
 * ============================================================================
 * Pulls the last 28 days of Search Console traffic, compares it to sane
 * thresholds, spot-checks that a sample of pages is actually indexed, and prints
 * a READY / NOT YET verdict — so we re-apply on data, not on a hunch.
 *
 * WHY TRAFFIC (not "indexed count"): Search Console's Pages/Coverage report — the
 * "N indexed" number — has NO public API. The API exposes Search Analytics
 * (clicks/impressions/CTR/position) and URL Inspection (per-URL, quota-limited).
 * So the verdict is driven by traffic (reliable) plus a small URL-Inspection
 * sample as an indexing sanity check. That matches the ask: "traffic reached the
 * threshold → time to apply."
 *
 * ZERO npm deps: signs the service-account JWT with node:crypto and calls the
 * REST API with global fetch (Node 18+).
 *
 * ---------------------------------------------------------------------------
 * ONE-TIME SETUP (yours — needs a Google account with access to the property):
 *   1. Google Cloud Console → enable "Google Search Console API".
 *   2. Create a Service Account → Keys → add key → JSON. Download it.
 *   3. Search Console → the thecryptotools.com property → Settings → Users and
 *      permissions → add the service account's client_email as a Full/Restricted
 *      user (Restricted is enough — read only).
 *   4. Save the JSON key OUTSIDE this repo (never commit it) and point the script
 *      at it:  export GSC_SA_KEYFILE=/absolute/path/to/key.json
 *      (GOOGLE_APPLICATION_CREDENTIALS also works.)
 *   5. Set the property URL if it differs from the default below:
 *      export GSC_SITE_URL="sc-domain:thecryptotools.com"   # domain property
 *      or  export GSC_SITE_URL="https://thecryptotools.com/" # URL-prefix property
 *
 * RUN:  npm run adsense:check
 * WEEKLY (cron, Mondays 09:00):
 *   0 9 * * 1  cd /path/to/repo && GSC_SA_KEYFILE=/path/key.json npm run adsense:check >> ~/adsense-readiness.log 2>&1
 * ---------------------------------------------------------------------------
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createSign } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HISTORY = join(ROOT, "scripts", "adsense-readiness-history.json");

const SITE_URL = process.env.GSC_SITE_URL || "https://thecryptotools.com/";

/** Bars for "the site is alive enough that a repeat 'low value' rejection is
 *  unlikely". Tune freely — they are intentionally modest, not ambitious. */
const THRESHOLDS = {
  clicks28d: 100,
  impressions28d: 3000,
  distinctQueries: 50, // breadth: many queries beats one lucky term
  requireNonDeclining: true, // clicks this 28d >= previous 28d
  indexedSampleMinPct: 80, // of the sampled URLs, % that must be indexed
};

/** Small, representative sample for the URL-Inspection indexing check. Mixes a
 *  hub, guides, tools and — deliberately — coin×tool pages, since those are the
 *  thin cluster whose indexing is the real AdSense risk. */
const SAMPLE_URLS = [
  "https://thecryptotools.com/",
  "https://thecryptotools.com/guides/stablecoins-explained/",
  "https://thecryptotools.com/guides/ethereum-staking-guide/",
  "https://thecryptotools.com/tools/fake-wallet-generator/",
  "https://thecryptotools.com/tools/staking-rewards-calculator/",
  "https://thecryptotools.com/coins/bitcoin/",
  "https://thecryptotools.com/coins/bitcoin/profit-calculator/",
  "https://thecryptotools.com/coins/ethereum/dca-calculator/",
];

const b64url = (input) => Buffer.from(input).toString("base64url");

function loadServiceAccount() {
  const path = process.env.GSC_SA_KEYFILE || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!path) {
    console.error(
      "adsense-readiness: no service-account key.\n" +
        "  Set GSC_SA_KEYFILE=/abs/path/to/key.json (see the setup notes at the top of this file).",
    );
    process.exit(2);
  }
  if (!existsSync(path)) {
    console.error(`adsense-readiness: key file not found: ${path}`);
    process.exit(2);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  signer.end();
  const signature = b64url(signer.sign(sa.private_key));
  const assertion = `${header}.${claim}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`token exchange failed: ${JSON.stringify(json)}`);
  return json.access_token;
}

const isoDaysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

async function searchAnalytics(token, startDate, endDate, dimensions = []) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE_URL,
  )}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit: dimensions.length ? 25000 : 1 }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`searchAnalytics: ${json.error.message}`);
  return json.rows ?? [];
}

async function inspectIndexed(token, inspectionUrl) {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl, siteUrl: SITE_URL, languageCode: "en-US" }),
  });
  const json = await res.json();
  if (json.error) return null; // quota or permission — skip gracefully
  const verdict = json.inspectionResult?.indexStatusResult?.verdict;
  return verdict === "PASS";
}

function fmt(n) {
  return Number(n).toLocaleString("en-US", { maximumFractionDigits: n < 10 ? 2 : 0 });
}

async function main() {
  const sa = loadServiceAccount();
  let token;
  try {
    token = await getAccessToken(sa);
  } catch (e) {
    console.error("adsense-readiness: auth failed —", e.message);
    process.exit(2);
  }

  // GSC data lags ~2–3 days; end the window at T-3 for complete data.
  const endDate = isoDaysAgo(3);
  const startDate = isoDaysAgo(30);
  const prevEnd = isoDaysAgo(31);
  const prevStart = isoDaysAgo(58);

  let totals, prevTotals, queryRows;
  try {
    [totals, prevTotals, queryRows] = await Promise.all([
      searchAnalytics(token, startDate, endDate),
      searchAnalytics(token, prevStart, prevEnd),
      searchAnalytics(token, startDate, endDate, ["query"]),
    ]);
  } catch (e) {
    console.error("adsense-readiness:", e.message);
    process.exit(2);
  }

  const t = totals[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const p = prevTotals[0] ?? { clicks: 0, impressions: 0 };
  const distinctQueries = queryRows.length;
  const clicksTrend = t.clicks - p.clicks;

  // Indexing spot-check (best-effort; skipped silently on quota/permission).
  let indexedOk = 0;
  let indexedChecked = 0;
  for (const u of SAMPLE_URLS) {
    const r = await inspectIndexed(token, u);
    if (r === null) continue;
    indexedChecked++;
    if (r) indexedOk++;
  }
  const indexedPct = indexedChecked ? Math.round((indexedOk / indexedChecked) * 100) : null;

  // ---- Verdict ----
  const checks = [
    { name: `Clicks (28d) ≥ ${THRESHOLDS.clicks28d}`, val: fmt(t.clicks), ok: t.clicks >= THRESHOLDS.clicks28d },
    { name: `Impressions (28d) ≥ ${fmt(THRESHOLDS.impressions28d)}`, val: fmt(t.impressions), ok: t.impressions >= THRESHOLDS.impressions28d },
    { name: `Distinct queries ≥ ${THRESHOLDS.distinctQueries}`, val: fmt(distinctQueries), ok: distinctQueries >= THRESHOLDS.distinctQueries },
  ];
  if (THRESHOLDS.requireNonDeclining) {
    checks.push({
      name: "Clicks not declining vs prev 28d",
      val: `${clicksTrend >= 0 ? "+" : ""}${fmt(clicksTrend)} (${fmt(p.clicks)} → ${fmt(t.clicks)})`,
      ok: clicksTrend >= 0,
    });
  }
  if (indexedPct !== null) {
    checks.push({
      name: `Indexed sample ≥ ${THRESHOLDS.indexedSampleMinPct}%`,
      val: `${indexedPct}% (${indexedOk}/${indexedChecked})`,
      ok: indexedPct >= THRESHOLDS.indexedSampleMinPct,
    });
  }

  const ready = checks.every((c) => c.ok);

  console.log(`\n  AdSense-readiness — ${SITE_URL}`);
  console.log(`  Window: ${startDate} → ${endDate} (28 days)\n`);
  console.log(`  Clicks: ${fmt(t.clicks)}  ·  Impressions: ${fmt(t.impressions)}  ·  CTR: ${(t.ctr * 100).toFixed(2)}%  ·  Avg pos: ${Number(t.position).toFixed(1)}`);
  if (indexedPct !== null) console.log(`  Indexed sample: ${indexedOk}/${indexedChecked} (${indexedPct}%)`);
  else console.log(`  Indexed sample: skipped (URL Inspection quota/permission)`);
  console.log("");
  for (const c of checks) console.log(`  ${c.ok ? "✓" : "✗"} ${c.name.padEnd(38)} ${c.val}`);
  console.log("");
  if (ready) {
    console.log("  ✅ READY — traffic has reached the bar. Re-apply to AdSense now.");
    console.log("     (Verify the Pages/Coverage 'indexed' number in GSC once by eye, then submit.)");
  } else {
    const failing = checks.filter((c) => !c.ok).map((c) => c.name);
    console.log("  ⏳ NOT YET — still below threshold:");
    for (const f of failing) console.log(`     • ${f}`);
  }
  console.log("");

  // Append a weekly snapshot so the trend is visible over time.
  let history = [];
  if (existsSync(HISTORY)) {
    try {
      history = JSON.parse(readFileSync(HISTORY, "utf8"));
    } catch {
      history = [];
    }
  }
  history.push({
    date: new Date().toISOString().slice(0, 10),
    window: { startDate, endDate },
    clicks: t.clicks,
    impressions: t.impressions,
    ctr: Number((t.ctr * 100).toFixed(2)),
    position: Number(Number(t.position).toFixed(1)),
    distinctQueries,
    clicksPrev28d: p.clicks,
    indexedSamplePct: indexedPct,
    ready,
  });
  writeFileSync(HISTORY, JSON.stringify(history, null, 2) + "\n");

  process.exit(ready ? 0 : 1);
}

main();
