/**
 * ============================================================================
 * Guide (SEO article) schema.
 * ============================================================================
 * Each guide is ONE object. The universal guide page renders the body, FAQ,
 * related-tool cards, metadata and Article/FAQ JSON-LD from this object — no
 * per-guide page code. Guides exist to rank for informational queries and to
 * funnel readers into the matching tools via internal links.
 */

/**
 * One row of a comparison table. When `href` is set the FIRST cell renders as
 * a link — that is how a hub page links out to the guides it summarises,
 * without needing a markup parser inside cell text.
 */
export interface GuideTableRow {
  cells: string[];
  href?: string;
}

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "tool"; slug: string }
  | { type: "table"; headers: string[]; rows: GuideTableRow[]; caption?: string }
  /** Card link to a page that is not a ToolConfig — e.g. the tax report app. */
  | { type: "cta"; title: string; text: string; href: string; label: string };

export interface GuideFaqItem {
  q: string;
  a: string;
}

/**
 * A primary source a guide's figures were checked against.
 *
 * The bar for what belongs here is deliberately high: the tax authority, the
 * statute, or the regulator itself — HMRC, the ATO, Revenue, SARS — never an
 * accounting firm's blog summarising them. Every number in the tax guides was
 * already verified this way; listing the sources is what makes that visible to
 * a reader (and to Google, which cannot otherwise tell this apart from the
 * scraped tax content it demotes).
 *
 * These links are followed on purpose. Outbound links to authorities are a
 * quality signal, not leaked equity — do NOT add rel="nofollow".
 */
export interface GuideSource {
  /** Document or page title, as the authority names it. */
  label: string;
  /** The authority, shown after the label — "HMRC", "IRS", "Revenue". */
  publisher: string;
  url: string;
}

export interface Guide {
  slug: string;
  title: string;
  /** Short intro / list subtitle / meta description fallback. */
  description: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  /** ISO date — used in sitemap lastmod and Article schema. */
  updatedAt: string;
  /**
   * ISO date the figures were last checked against the sources below. Distinct
   * from `updatedAt`: prose can be reworded without re-opening HMRC, and a
   * rate can be re-confirmed as unchanged without the page being edited. Shown
   * to the reader as "figures verified against X on <date>", which is a claim
   * we can only make where it is true — so it renders only when set.
   */
  reviewedAt?: string;
  /** Primary sources behind the figures. Rendered as a "Sources" section. */
  sources?: GuideSource[];
  seo: {
    keywords: string[];
    description: string;
    title?: string;
  };
  /** Tool slugs surfaced as cards at the end (internal linking). */
  relatedTools: string[];
  /**
   * Slug of a hub guide this one belongs to. Renders a link back to the hub at
   * the top and bottom of the page — the return leg of hub-and-spoke internal
   * linking, which is what makes a large guide set crawlable.
   */
  partOf?: string;
  body: GuideBlock[];
  faq?: GuideFaqItem[];
}
