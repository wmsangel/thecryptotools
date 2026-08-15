/**
 * Overwrites `out/404.html` with the real 404 page.
 *
 * WHY THIS EXISTS: Next builds `out/404.html` from a root `app/not-found.tsx`,
 * and this app cannot have one — it has two root layouts (site and embed), so
 * a root not-found has no layout to sit under and the build fails outright.
 * What Next ships instead is its unstyled built-in page: no `<html lang>`, no
 * header, no footer, no links onward. Apache serves that file for every bad URL
 * on the domain, so it is not a page anyone should be sent to.
 *
 * `src/app/(site)/404/page.tsx` renders the same content as a normal route, so
 * it gets the site layout, the language attribute and the navigation. This
 * script copies it into place. Verified afterwards, not assumed: the copy is
 * checked for `<html lang` before it is written.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const out = path.join(process.cwd(), "out");
const src = path.join(out, "404", "index.html");

let html;
try {
  html = await readFile(src, "utf8");
} catch {
  console.error("generate-404: out/404/index.html is missing — is src/app/(site)/404/page.tsx still there?");
  process.exit(1);
}

if (!html.includes("<html lang")) {
  console.error("generate-404: the rendered 404 has no <html lang> — refusing to ship it");
  process.exit(1);
}

await writeFile(path.join(out, "404.html"), html);
console.error(`generate-404: wrote out/404.html (${(html.length / 1024).toFixed(1)} KB)`);
