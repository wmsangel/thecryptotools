import type { Metadata } from "next";
import NotFound from "../not-found";

/**
 * The 404 page as a REAL route, not just a not-found boundary.
 *
 * Next only exports `out/404.html` from a root `app/not-found.tsx`, and this
 * app cannot have one: with two root layouts (site and embed) there is no root
 * layout for it to sit under, and Next refuses to build. The result was that
 * every bad URL on the domain fell through to Apache's own "404 Not Found" —
 * thirteen bytes, no header, no way back to the site.
 *
 * So the page is rendered here, inside the site layout, and
 * `scripts/generate-404.mjs` copies it over `out/404.html` after the build.
 * `.htaccess` then points Apache's ErrorDocument at that file.
 */
export const metadata: Metadata = {
  // The layout template already appends " | TheCryptoTools".
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <NotFound />;
}
