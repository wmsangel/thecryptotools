/**
 * ============================================================================
 * Standalone IndexNow ping — for the Cloudflare Pages deploy path.
 * ============================================================================
 * The GoDaddy deploy (scripts/deploy.mjs) pings IndexNow off the tar.gz diff it
 * already computes (`changed` vs `previous`). The Pages path has no such diff —
 * `wrangler pages deploy` (or a Git-integration build) just ships out/ — so this
 * script recreates the SAME "only brand-new routes" signal a different way: it
 * diffs the routes currently in out/ against a snapshot committed to the repo.
 *
 * WHY only brand-new routes (identical reasoning to deploy.mjs): any code change
 * rehashes the shared JS chunk, which byte-changes almost every HTML file, so
 * "changed file" is a useless proxy for "meaningfully updated page". A brand-new
 * route is a small, honest signal. Edits to existing pages are left to the normal
 * sitemap recrawl. Bing/Yandex/Seznam/Naver consume IndexNow; Google ignores it.
 *
 * STATE: scripts/indexnow-known.json holds the route paths IndexNow already
 * knows. Commit it so the diff survives across runs and machines. First run with
 * no state file records a baseline and pings NOTHING (those routes are already
 * live and indexed) — so this is safe to run for the first time against a site
 * that is already up.
 *
 * USAGE:
 *   node scripts/indexnow.mjs             ping brand-new routes, then update state
 *   node scripts/indexnow.mjs --dry-run   list what would be pinged; ping nothing,
 *                                          write nothing
 *   node scripts/indexnow.mjs --baseline  record current routes as known WITHOUT
 *                                          pinging (reset the diff to "now")
 *
 * Run it AFTER the deploy so the new URLs are live when the engines fetch them.
 * `npm run deploy:pages` wires build → wrangler deploy → this script.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const STATE = join(ROOT, "scripts", "indexnow-known.json");

// Same key/host as scripts/deploy.mjs. The key is validated by the engines
// against https://<HOST>/<KEY>.txt, which ships from public/ into out/.
const INDEXNOW_KEY = "ca926f030bf003a521911ee7d9801f72";
const INDEXNOW_HOST = "thecryptotools.com";

// Above this many new routes we skip pinging (a bulk change is what the sitemap
// is for; a per-URL flood reads as abuse). Mirrors deploy.mjs.
const MAX_URLS = 500;

const dryRun = process.argv.includes("--dry-run");
const baseline = process.argv.includes("--baseline");

/** Every route in out/, as a path with a trailing slash: "", "guides/foo/". */
function currentRoutes() {
  const routes = new Set();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "index.html") {
        // "index.html" → "", "guides/foo/index.html" → "guides/foo/"
        routes.add(relative(OUT, full).replace(/index\.html$/, ""));
      }
    }
  };
  walk(OUT);
  return routes;
}

function loadKnown() {
  if (!existsSync(STATE)) return null;
  try {
    const arr = JSON.parse(readFileSync(STATE, "utf8"));
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return null;
  }
}

function saveKnown(routes) {
  const sorted = [...routes].sort();
  writeFileSync(STATE, JSON.stringify(sorted, null, 2) + "\n");
}

/** Ping one URL via the single-URL GET endpoint (not the JSON batch form, which
 *  Bing flags as "batch mode" even for one URL). Returns true on 200/202. */
async function ping(url) {
  const keyLocation = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
  const endpoint =
    `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}` +
    `&key=${INDEXNOW_KEY}&keyLocation=${encodeURIComponent(keyLocation)}`;
  try {
    const res = await fetch(endpoint);
    if (res.status === 200 || res.status === 202) return true;
    console.log(`  ⚠ IndexNow: ${res.status} ${res.statusText} — ${url}`);
  } catch (e) {
    console.log(`  ⚠ IndexNow не отправлен (${url}): ${e.message}`);
  }
  return false;
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("indexnow: out/ не найден — сначала соберите сайт (npm run build).");
    process.exit(1);
  }

  const current = currentRoutes();
  const known = loadKnown();

  // First run (or --baseline): record and ping nothing. These routes are already
  // live; there is nothing new to announce.
  if (known === null || baseline) {
    if (dryRun) {
      console.log(`indexnow: базовый снапшот (${current.size} маршрутов) — сухой прогон, файл не записан.`);
      return;
    }
    saveKnown(current);
    console.log(
      `indexnow: записан базовый снапшот — ${current.size} маршрутов, ` +
        `ничего не пинговалось (они уже в индексе). Файл: scripts/indexnow-known.json`,
    );
    return;
  }

  const newRoutes = [...current].filter((r) => !known.has(r)).sort();

  if (newRoutes.length === 0) {
    console.log("indexnow: новых маршрутов нет — пинговать нечего (правки уйдут по sitemap).");
    if (!dryRun) saveKnown(current); // absorb any removals so state stays exact
    return;
  }

  const urls = newRoutes.map((r) => `https://${INDEXNOW_HOST}/${r}`);

  if (dryRun) {
    console.log(`indexnow: сухой прогон — ${urls.length} новых маршрутов:`);
    for (const u of urls) console.log(`  + ${u}`);
    return;
  }

  if (urls.length > MAX_URLS) {
    console.log(
      `indexnow: ${urls.length} новых маршрутов — слишком много для поштучного пинга; ` +
        `пропускаю (sitemap переобойдут сами) и обновляю снапшот.`,
    );
    saveKnown(current);
    return;
  }

  let ok = 0;
  for (const url of urls) if (await ping(url)) ok++;
  console.log(`indexnow: уведомлено ${ok}/${urls.length} новых URL по одному (не пачкой).`);

  // Update state to the exact current set: new routes are now "known", and any
  // deleted routes drop out so a future re-add would ping again correctly.
  saveKnown(current);
}

main();
