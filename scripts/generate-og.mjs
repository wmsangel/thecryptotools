/**
 * Renders the OpenGraph / Twitter share cards into `out/og/*.png` after
 * `next build`. Wired into the `build` script — running `next build` alone
 * leaves every og:image URL pointing at a missing file.
 *
 * WHY NOT a Next `opengraph-image.tsx` route, which would be the idiomatic
 * choice: that convention emits the file as `out/opengraph-image` with NO
 * extension. This site is served by plain Apache on cPanel, which derives
 * Content-Type from the extension — an extension-less file is sent as
 * octet-stream (or with no type at all) and X, Telegram and Slack refuse to
 * render it. Writing real `.png` files sidesteps the whole question.
 *
 * The script reads the titles back out of the HTML that Next just generated,
 * so it needs no access to the TypeScript registries and cannot drift out of
 * sync with them. Page metadata points at `/og/<route>.png`, which is derived
 * from the route and therefore stays correct without any shared manifest.
 *
 * The only typeface available is the Noto Sans 400 bundled with next/og.
 * Satori does not synthesise bold, so hierarchy comes from size and colour —
 * setting fontWeight here would render no differently.
 */
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);

const OUT = path.join(process.cwd(), "out");
const OG_DIR = path.join(OUT, "og");

const BRAND = "#16b378";
const BRAND_LIGHT = "#2dd4bf";
const BG = "#070b14";
const TEXT = "#eef2f8";
const MUTED = "#93a4bd";
const BORDER = "#1c2740";

const el = (style, children) => ({ type: "div", props: { style, children } });

/** Longer titles step down in size so a 90-character guide title still fits. */
function titleSize(t) {
  if (t.length > 78) return 44;
  if (t.length > 56) return 52;
  if (t.length > 38) return 60;
  return 68;
}

/**
 * Flat background, with the brand carried by a top rule and the logo tile.
 * A full-canvas gradient was tried and dropped: PNG stores a smooth gradient
 * badly, taking each card from 22 KB to 88 KB — roughly 8 MB across the set,
 * for an effect that is invisible at feed-thumbnail size. Keep large areas
 * flat. Gradients are fine on small elements like the rule and the tile.
 */
function card({ title, eyebrow, footnote }) {
  return el(
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: BG,
    },
    [
      el({
        display: "flex",
        height: 12,
        backgroundImage: `linear-gradient(90deg, ${BRAND}, ${BRAND_LIGHT})`,
      }),
      el(
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flexGrow: 1,
      padding: "58px 72px 64px 72px",
    },
    [
      // Masthead
      el({ display: "flex", alignItems: "center" }, [
        el(
          {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            borderRadius: 20,
            backgroundImage: `linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT})`,
            color: "#ffffff",
            fontSize: 30,
            letterSpacing: -1,
            marginRight: 22,
          },
          "TCT",
        ),
        el({ display: "flex", flexDirection: "column" }, [
          el({ fontSize: 34, color: TEXT, letterSpacing: -0.5 }, "TheCryptoTools"),
          el({ fontSize: 21, color: MUTED }, "Free crypto calculators & tools"),
        ]),
      ]),

      // Headline
      el({ display: "flex", flexDirection: "column" }, [
        el(
          {
            fontSize: 24,
            color: BRAND_LIGHT,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 18,
          },
          eyebrow,
        ),
        el(
          {
            display: "flex",
            fontSize: titleSize(title),
            color: TEXT,
            lineHeight: 1.15,
            letterSpacing: -1.5,
            maxHeight: 300,
            overflow: "hidden",
          },
          title,
        ),
      ]),

      // Footer
      el(
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${BORDER}`,
          paddingTop: 26,
        },
        [
          el({ fontSize: 26, color: MUTED }, "thecryptotools.com"),
          el({ fontSize: 26, color: BRAND }, footnote),
        ],
      ),
    ],
      ),
    ],
  );
}

async function render(relPath, spec) {
  const res = new ImageResponse(card(spec), { width: 1200, height: 630 });
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(OG_DIR, `${relPath}.png`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buf);
}

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'", nbsp: " ",
};

/** Pull the page title Next rendered, minus the " | TheCryptoTools" suffix. */
async function titleOf(dir) {
  const html = await readFile(path.join(OUT, dir, "index.html"), "utf8");
  const m = html.match(/<title>([^<]*)<\/title>/);
  if (!m) throw new Error(`no <title> in ${dir}/index.html`);
  return m[1]
    .replace(/&([a-z]+|#x?[0-9a-f]+);/gi, (s, e) => ENTITIES[e.toLowerCase()] ?? s)
    .replace(/\s*\|\s*TheCryptoTools\s*$/, "")
    .trim();
}

async function slugsIn(dir) {
  try {
    const entries = await readdir(path.join(OUT, dir), { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    // A route that was not built this time is not an error — it just has no
    // cards. Failing the build over a missing directory would make adding or
    // removing a page section a two-step change.
    return [];
  }
}

const CTA = "No signup · Runs in your browser";

/**
 * Run `jobs` with at most `limit` in flight.
 *
 * Rendering ~620 cards one after another is several minutes of a build that
 * already takes a few; satori is CPU-bound and single-threaded per call, so a
 * small pool uses the cores that are otherwise idle. Kept small on purpose —
 * each render holds a full 1200×630 bitmap, and an unbounded pool would hold
 * 620 of them at once.
 */
async function pool(jobs, limit = 4) {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, jobs.length) }, async () => {
    for (;;) {
      const i = index++;
      if (i >= jobs.length) return;
      await jobs[i]();
    }
  });
  await Promise.all(workers);
}

/**
 * Re-encode every card as a 256-colour palette PNG.
 *
 * These cards are flat: one background, one gradient tile, three text colours.
 * Truecolour PNG spends 45 KB on that; a palette holds it in 18 KB, and the two
 * are indistinguishable side by side (checked at 1:1 on the title text, where
 * the antialiasing is). At ~620 cards that is the difference between roughly
 * 28 MB and 11 MB in a zip the user uploads by hand.
 *
 * ImageMagick is not a build dependency — if it is missing the cards are simply
 * left as truecolour, which is correct, just larger. A share card is not worth
 * failing a build over.
 */
async function quantise(files) {
  if (files.length === 0) return null;
  try {
    await run("magick", ["-version"]);
  } catch {
    console.warn("generate-og: ImageMagick not found — cards left uncompressed");
    return null;
  }
  const before = files.length;
  // In batches: one process per file would spawn hundreds, and a single
  // invocation with 620 paths risks the argument-length limit.
  for (let i = 0; i < files.length; i += 60) {
    await run("magick", [
      "mogrify",
      "-colors",
      "256",
      "-define",
      "png:color-type=3",
      ...files.slice(i, i + 60),
    ]);
  }
  return before;
}

async function main() {
  await mkdir(OG_DIR, { recursive: true });
  const written = [];
  const queue = [];

  /** Queue a card, recording where it landed so it can be compressed after. */
  const add = (relPath, spec) => {
    queue.push(async () => {
      await render(relPath, await spec());
      written.push(path.join(OG_DIR, `${relPath}.png`));
    });
  };

  // Site-wide fallback. Still used by the homepage and by anything without a
  // card of its own — every family below exists to shrink that set.
  add("default", async () => ({
    eyebrow: "Crypto calculators",
    title: "Free crypto tools, calculators & tax reports",
    footnote: CTA,
  }));

  // The flagship free tool — the page most likely to be shared and linked.
  add("tax-report", async () => ({
    eyebrow: "Free crypto tax report",
    title: await titleOf("crypto-tax-report"),
    footnote: "12 countries · 100% in your browser",
  }));

  // The seasonal companion to the tax report — shared hardest in the weeks
  // before each country's year end, so it gets its own card rather than the
  // generic one.
  add("tax-loss-harvesting", async () => ({
    eyebrow: "Tax loss harvesting",
    title: await titleOf("tax-loss-harvesting"),
    footnote: "12 countries · 100% in your browser",
  }));

  // Flat families: one card per directory under each of these.
  for (const [dir, eyebrow] of [
    ["tools", "Crypto calculator"],
    ["guides", "Guide"],
    ["coins", "Coin"],
    ["investment-calculator", "Backtest"],
    ["compare", "Head to head"],
    ["category", "Tool category"],
  ]) {
    for (const slug of await slugsIn(dir)) {
      add(`${dir}/${slug}`, async () => ({
        eyebrow,
        title: await titleOf(`${dir}/${slug}`),
        footnote: CTA,
      }));
    }
  }

  // Coin × tool: the largest family on the site by far, and until now the one
  // sharing a single generic card between 343 pages.
  for (const coin of await slugsIn("coins")) {
    for (const tool of await slugsIn(`coins/${coin}`)) {
      add(`coins/${coin}/${tool}`, async () => ({
        eyebrow: "Coin calculator",
        title: await titleOf(`coins/${coin}/${tool}`),
        footnote: CTA,
      }));
    }
  }

  // One-off pages worth their own card.
  for (const [dir, eyebrow] of [
    ["portfolio", "Portfolio analysis"],
    ["portfolio/correlation", "Correlation"],
    ["calendar", "Crypto calendar"],
    ["unlocks", "Token unlocks"],
    ["widgets", "Embeddable widgets"],
    ["exchanges", "Platforms"],
    ["prices", "Live prices"],
    ["donate", "Donate"],
    // Section indexes. `og/coins.png` sits happily alongside the `og/coins/`
    // directory holding the per-coin cards.
    ["tools", "All tools"],
    ["guides", "All guides"],
    ["coins", "All coins"],
    ["compare", "Comparisons"],
    ["investment-calculator", "Backtest"],
  ]) {
    add(dir, async () => ({
      eyebrow,
      title: await titleOf(dir),
      footnote: CTA,
    }));
  }

  await pool(queue);
  const compressed = await quantise(written);

  console.log(
    `generate-og: wrote ${written.length} share cards to out/og/` +
      (compressed ? " (256-colour)" : ""),
  );

  await verifyReferences();
}

/**
 * Every `/og/…` URL in the built HTML must exist on disk.
 *
 * The card path a page asks for and the path this script writes are derived
 * separately — one from the route in a TSX file, one from the directory tree in
 * `out/` — so they can drift apart, and nothing else notices: the page renders,
 * the build passes, and the breakage only shows up as a blank rectangle in
 * somebody else's chat client. This caught exactly that on the correlation page
 * (`portfolio-correlation.png` asked for, `portfolio/correlation.png` written).
 *
 * Hard failure rather than a warning: a build that quietly ships broken share
 * cards is the situation this whole script exists to prevent.
 */
async function verifyReferences() {
  const missing = new Map();
  const seen = new Set();

  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith(".html")) {
        const html = await readFile(full, "utf8");
        for (const m of html.matchAll(/content="[^"]*?(\/og\/[^"]+\.png)"/g)) {
          const url = m[1];
          if (seen.has(url)) continue;
          seen.add(url);
          try {
            await readFile(path.join(OUT, url.slice(1)));
          } catch {
            missing.set(url, full);
          }
        }
      }
    }
  };
  await walk(OUT);

  if (missing.size > 0) {
    for (const [url, page] of missing) {
      console.error(`generate-og: ${url} is referenced by ${page} but was not written`);
    }
    throw new Error(`${missing.size} share card(s) referenced but missing`);
  }
  console.log(`generate-og: all ${seen.size} referenced cards exist`);
}

main().catch((err) => {
  console.error("generate-og failed:", err);
  process.exit(1);
});
