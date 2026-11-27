import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Minimal inline markdown for the config-driven prose in guides, static pages
 * and tool copy. Supports exactly two things:
 *
 *   **bold**            → <strong>            (keyword emphasis)
 *   [label](/path)      → <Link> or <a>       (inline links, internal or external)
 *
 * Deliberately tiny — no italic (a lone `*` collides with plain text like
 * "2 * 3"), no nesting, no block syntax. A string containing none of these
 * markers renders byte-for-byte as it did when it was plain text, so existing
 * content is unaffected and new content can opt in. Internal hrefs (starting
 * "/") become a Next <Link> for client-side nav and internal-link equity;
 * everything else opens in a new tab with rel="noopener".
 */
const TOKEN = /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)/g;

/**
 * Other sites of our own network. A contextual link to a sibling is fine, but
 * always rel="nofollow" (owner decision 2026-11-24): a web of dofollow links
 * between domains of one owner reads as a link scheme.
 */
const NETWORK_HOSTS = [
  "calclumen.com", "costtrek.com", "almanackit.com", "izntools.com", "pawdget.com",
  "prodom-expert.ru", "24zdorovie.com", "izagorodnyi.dev", "ocrsnip.com", "testsweep.com",
  "bilimjol.com", "foundaday.com", "foldoutkit.com", "iznkit.com", "izngames.com",
  "gamerscalc.com", "rightweekend.com", "printmathsheets.com", "dasha-motion.com",
];

function isNetworkHost(href: string): boolean {
  try {
    const h = new URL(href).hostname.replace(/^www\./, "");
    return NETWORK_HOSTS.some((n) => h === n || h.endsWith("." + n));
  } catch {
    return false;
  }
}

export function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;

  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];

    if (m[1]) {
      // [label](href)
      const splitAt = tok.indexOf("](");
      const label = tok.slice(1, splitAt);
      const href = tok.slice(splitAt + 2, -1);
      const go = /^\/go\/([a-z0-9-]+)\/?$/i.exec(href);
      parts.push(
        go ? (
          // Affiliate link written in prose: a gated, tokenized /go anchor — never a
          // plain <Link> (Next would prefetch it, and a prefetch is a counted click).
          // The sub-id placement comes from the page path at press time.
          <a
            key={key++}
            href="#"
            target="_blank"
            rel="sponsored nofollow noopener"
            data-go={go[1].toLowerCase()}
            data-affiliate={go[1].toLowerCase()}
            data-affiliate-placement="inline"
            className="font-semibold text-brand-ink hover:underline"
          >
            {label}
          </a>
        ) : href.startsWith("/") ? (
          <Link key={key++} href={href} className="font-semibold text-brand-ink hover:underline">
            {label}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel={isNetworkHost(href) ? "nofollow noopener noreferrer" : "noopener noreferrer"}
            className="font-semibold text-brand-ink hover:underline"
          >
            {label}
          </a>
        ),
      );
    } else {
      // **bold**
      parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    }

    last = m.index + tok.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  // A string with no markers collapses to the original single string node.
  return parts.length === 1 ? parts[0] : parts;
}
