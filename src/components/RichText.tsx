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
      parts.push(
        href.startsWith("/") ? (
          <Link key={key++} href={href} className="font-semibold text-brand-ink hover:underline">
            {label}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
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
