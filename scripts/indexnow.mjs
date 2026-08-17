/**
 * IndexNow submitter.
 *
 * One POST tells Bing, Yandex, Seznam, Naver and every other IndexNow partner
 * that our URLs changed — no per-engine dashboard, no sitemap ping (Google and
 * Bing both retired those). Google does NOT use IndexNow; it keeps crawling the
 * sitemap declared in robots.txt.
 *
 * The key is public by design: it lives at KEY_LOCATION as plain text, and the
 * engines fetch it to prove we own the host before accepting the submission.
 *
 * Reads the built sitemap (out/sitemap.xml) so it always submits exactly what we
 * ship. Run AFTER a deploy, so the key file and the URLs are actually live:
 *
 *   npm run deploy && npm run indexnow
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HOST = "thecryptotools.com";
const KEY = "ca926f030bf003a521911ee7d9801f72";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10000; // IndexNow's per-request cap.

const here = dirname(fileURLToPath(import.meta.url));
const SITEMAP = join(here, "..", "out", "sitemap.xml");

async function main() {
  let xml;
  try {
    xml = await readFile(SITEMAP, "utf8");
  } catch {
    console.error(`Cannot read ${SITEMAP}. Run "npm run build" first.`);
    process.exit(1);
  }

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => u.startsWith(`https://${HOST}/`));

  if (urls.length === 0) {
    console.error("No URLs found in the sitemap — nothing to submit.");
    process.exit(1);
  }

  console.log(`IndexNow: submitting ${urls.length} URLs for ${HOST} …`);

  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    const body = await res.text().catch(() => "");
    // 200 = accepted, 202 = accepted pending key validation. Both are success.
    if (res.status === 200 || res.status === 202) {
      console.log(`  ✓ batch ${i / BATCH + 1}: ${urlList.length} URLs — ${res.status} ${res.statusText}`);
    } else {
      console.error(`  ✗ batch ${i / BATCH + 1}: ${res.status} ${res.statusText} ${body.slice(0, 200)}`);
      process.exitCode = 1;
    }
  }

  console.log("Done. Bing/Yandex/Seznam/Naver have been notified (Google uses the sitemap, not IndexNow).");
}

main().catch((e) => {
  console.error("IndexNow failed:", e);
  process.exit(1);
});
