/**
 * ============================================================================
 * Static page (legal / info) schema.
 * ============================================================================
 * Same config-driven idea as tools and guides: each page is ONE object and a
 * universal renderer turns it into markup + metadata. Used for the pages every
 * ad network and privacy law expects a site to have — privacy policy, cookie
 * policy, terms, disclaimer, affiliate disclosure, about and contact.
 */

export type PageBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  /** Renders the cookie-settings button so users can change consent inline. */
  | { type: "cookieSettings" };

export interface StaticPage {
  slug: string;
  title: string;
  /** Short intro under the H1 and meta-description fallback. */
  description: string;
  /** ISO date — shown as "Last updated" and used for sitemap lastmod. */
  updatedAt: string;
  /** Small label above the H1. */
  eyebrow: string;
  seo: {
    title?: string;
    description: string;
    keywords: string[];
  };
  /** Legal pages carry no SEO value and are better kept out of the index. */
  noindex?: boolean;
  body: PageBlock[];
}
