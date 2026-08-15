/**
 * Writes `out/llms.txt` and a Markdown twin of every guide at
 * `out/guides/<slug>.md`, after `next build`. Wired into the `build` script.
 *
 * WHY: Cloudflare sells this as a Pro feature ("Markdown for Agents",
 * content-negotiated HTML→Markdown). We do not need it. Cloudflare has to
 * guess at structure from rendered HTML; we still have the guide as structured
 * data, so converting it is both free and lossless — a table stays a table, a
 * source list stays a source list.
 *
 * TWO SOURCES OF TRUTH, deliberately:
 *
 *  - Guide bodies come from the TypeScript registry, compiled to a temp dir by
 *    tsc. The guides subtree is self-contained (its only import is
 *    `import type`, which is erased) so this compiles in isolation, without
 *    dragging in the tool configs and their runtime dependencies. CommonJS is
 *    required: tsc emits extensionless specifiers, which Node's ESM resolver
 *    rejects and its CJS resolver handles.
 *
 *  - The llms.txt index reads titles and descriptions back out of the HTML
 *    Next just generated, the same trick generate-og.mjs uses. It cannot drift
 *    from what is actually published, and it needs no access to the tool or
 *    coin registries — whose configs carry `compute` functions and would pull
 *    half the app into this script.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFile, writeFile, readdir, rm, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const TMP = path.join(ROOT, ".next", "cache", "llms-guides");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://thecryptotools.com").replace(/\/$/, "");

const require = createRequire(import.meta.url);

/* ------------------------------------------------------------------ guides */

function compileGuides() {
  execFileSync(
    path.join(ROOT, "node_modules", ".bin", "tsc"),
    [
      "src/lib/guides/registry.ts",
      "--outDir", TMP,
      // Pinned, because tsc otherwise infers rootDir from the inputs and the
      // emitted path moves the moment the import graph changes shape.
      "--rootDir", "src/lib/guides",
      "--module", "commonjs",
      "--target", "es2020",
      "--moduleResolution", "node",
      "--skipLibCheck",
      // The registry is data; we want the emit, not a second type-check of the
      // whole project (the build already did that).
      "--noEmitOnError", "false",
    ],
    { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] },
  );
  return require(path.join(TMP, "registry.js")).guides;
}

/** Escape the pipe characters that would otherwise break a Markdown table. */
const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\n+/g, " ");

function blockToMarkdown(block) {
  switch (block.type) {
    case "h2":
      return `## ${block.text}`;
    case "p":
      return block.text;
    case "ul":
      return block.items.map((i) => `- ${i}`).join("\n");
    case "callout":
      return `> ${block.text}`;
    case "tool":
      return `→ Calculator: ${SITE}/tools/${block.slug}/`;
    case "cta":
      return `→ **${block.title}** — ${block.text}\n  ${SITE}${block.href}`;
    case "table": {
      const head = `| ${block.headers.map(cell).join(" | ")} |`;
      const rule = `| ${block.headers.map(() => "---").join(" | ")} |`;
      const rows = block.rows.map((r) => `| ${r.cells.map(cell).join(" | ")} |`);
      const caption = block.caption ? `\n\n*${block.caption}*` : "";
      return [head, rule, ...rows].join("\n") + caption;
    }
    default:
      return "";
  }
}

function guideToMarkdown(guide) {
  const url = `${SITE}/guides/${guide.slug}/`;
  const parts = [`# ${guide.title}`, "", `> ${guide.description}`, ""];

  // A metadata line rather than YAML front matter: this file is read by
  // agents inline, and an unrendered `---` block at the top is noise.
  const meta = [`Source: ${url}`, `Updated: ${guide.updatedAt}`];
  if (guide.reviewedAt) meta.push(`Figures verified: ${guide.reviewedAt}`);
  meta.push(`Reading time: ${guide.readingMinutes} min`);
  parts.push(meta.join(" · "), "");

  for (const block of guide.body) {
    const md = blockToMarkdown(block);
    if (md) parts.push(md, "");
  }

  if (guide.faq?.length) {
    parts.push("## Frequently asked questions", "");
    for (const f of guide.faq) parts.push(`### ${f.q}`, "", f.a, "");
  }

  if (guide.sources?.length) {
    parts.push("## Sources", "");
    parts.push(
      "Every figure above was taken from the primary source below — the tax authority or the legislation itself, never a secondary summary.",
      "",
    );
    for (const s of guide.sources) parts.push(`- [${s.label}](${s.url}) — ${s.publisher}`);
    parts.push("");
  }

  if (guide.relatedTools?.length) {
    parts.push("## Related calculators", "");
    for (const slug of guide.relatedTools) parts.push(`- ${SITE}/tools/${slug}/`);
    parts.push("");
  }

  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

/* --------------------------------------------------------------- llms.txt */

/** Every generated page, as { route, title, description }. */
async function readPages(dir = OUT, base = "") {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name === "og") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await readPages(full, `${base}/${entry.name}`)));
      continue;
    }
    if (entry.name !== "index.html") continue;
    const html = await readFile(full, "utf8");
    // Skip anything we have told search engines to ignore — the 67 embeddable
    // widgets are noindex duplicates of the tool pages, and listing them here
    // would pad the index with 67 near-identical entries pointing at chrome-less
    // copies of pages already in it.
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    // The description meta is emitted with the attributes in either order.
    const description = html.match(
      /<meta name="description" content="([^"]*)"|<meta content="([^"]*)" name="description"/,
    );
    if (!title) continue;
    out.push({
      route: `${base}/`,
      title: decode(title).replace(/\s*\|\s*TheCryptoTools$/, ""),
      description: decode(description?.[1] ?? description?.[2] ?? ""),
    });
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/");

const line = (p) => `- [${p.title}](${SITE}${p.route})${p.description ? `: ${p.description}` : ""}`;

function buildLlmsTxt(pages) {
  const byPrefix = (prefix, depth) =>
    pages
      .filter((p) => p.route.startsWith(prefix) && p.route.split("/").filter(Boolean).length === depth)
      .sort((a, b) => a.title.localeCompare(b.title));

  const tools = byPrefix("/tools/", 2);
  const guides = byPrefix("/guides/", 2);
  const coins = byPrefix("/coins/", 2);
  const coinTools = byPrefix("/coins/", 3);
  const categories = byPrefix("/category/", 2);

  const listed = new Set(
    [...tools, ...guides, ...coins, ...coinTools, ...categories].map((p) => p.route),
  );
  const rest = pages
    .filter((p) => !listed.has(p.route) && p.route !== "/404/")
    .sort((a, b) => a.route.localeCompare(b.route));

  return [
    "# TheCryptoTools",
    "",
    "> Free crypto calculators, tax tools and reference guides. Everything runs in the",
    "> browser: there is no account, no upload and no server to send figures to. The",
    "> crypto tax report parses your CSV locally and never transmits it.",
    "",
    "Editorial policy, including how the tax figures are sourced and dated:",
    `${SITE}/editorial-policy/`,
    "",
    "Every guide is also available as Markdown at the same path with a `.md`",
    "extension — e.g. /guides/crypto-taxes-uk.md.",
    "",
    `## Guides (${guides.length})`,
    "",
    ...guides.map((p) => `${line(p)} [md](${SITE}${p.route.replace(/\/$/, "")}.md)`),
    "",
    `## Calculators and tools (${tools.length})`,
    "",
    ...tools.map(line),
    "",
    `## Coin pages (${coins.length})`,
    "",
    ...coins.map(line),
    "",
    `## Coin calculators (${coinTools.length})`,
    "",
    ...coinTools.map(line),
    "",
    `## Categories (${categories.length})`,
    "",
    ...categories.map(line),
    "",
    "## Other pages",
    "",
    ...rest.map(line),
    "",
  ].join("\n");
}

/* -------------------------------------------------------------------- run */

const guides = compileGuides();
await mkdir(path.join(OUT, "guides"), { recursive: true });
for (const guide of guides) {
  await writeFile(path.join(OUT, "guides", `${guide.slug}.md`), guideToMarkdown(guide), "utf8");
}

const pages = await readPages();
await writeFile(path.join(OUT, "llms.txt"), buildLlmsTxt(pages), "utf8");
await rm(TMP, { recursive: true, force: true });

console.log(`generate-llms: wrote out/llms.txt (${pages.length} pages) + ${guides.length} guide .md files`);
