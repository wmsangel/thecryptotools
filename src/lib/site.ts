/**
 * Global site configuration. Single source of truth for branding, URLs and
 * SEO defaults. Read from env where available so deploys can override.
 */
export const site = {
  name: "TheCryptoTools",
  shortName: "TheCryptoTools",
  tagline: "Free crypto tools, calculators & utilities",
  description:
    "TheCryptoTools is a free suite of crypto trading calculators, portfolio tools, live prices and developer utilities. Fast, no signup, no ads in your way.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "en_US",
  /**
   * Public contact address shown on /contact and in the legal pages. Set up a
   * forwarder for it (Cloudflare Email Routing is free) or override via env.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@thecryptotools.com",
  /**
   * Google AdSense publisher id. The loader script must be present in <head>
   * on every page for Google to verify the site and to serve Auto ads — that
   * happens regardless of NEXT_PUBLIC_ENABLE_ADS, which only gates our own
   * manually-placed <ins> units. Consent Mode v2 still starts denied, so no
   * advertising cookie is set before the visitor answers the banner.
   */
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5535516142831006",
  /**
   * Google Analytics 4 measurement id (the "G-" one, not the numeric stream id
   * 15375957614 — gtag.js never uses that). Loaded on every page under Consent
   * Mode v2, so it starts in cookieless ping mode and only sets the _ga cookie
   * after the visitor accepts analytics. Blank it to remove GA entirely.
   */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID || "G-E26K7W8NDZ",
  keywords: [
    "crypto calculator",
    "crypto tools",
    "crypto trading calculator",
    "crypto trade calculator",
    "crypto calc",
    "trading calculator",
    "crypto profit calculator",
    "dca calculator",
    "crypto market cap calculator",
    "free crypto utilities",
  ],
  // Owner / publisher used in schema.org Organization markup.
  organization: {
    name: "TheCryptoTools",
    logo: "/icon-512.png",
  },
  /**
   * Byline for the guides.
   *
   * An editorial name rather than a person's, chosen deliberately: the tax
   * guides ARE researched against primary sources, but nobody here holds a tax
   * qualification, and inventing a credentialed author for YMYL content would
   * be a lie that Google is specifically good at catching. What we can honestly
   * claim — which authority, which document, checked on which date — is
   * claimed instead, per guide, and the method is written down at
   * `editorial.policyPath`.
   *
   * To switch to a personal byline later, change `author` here and add an
   * author page; nothing else reads these strings.
   */
  editorial: {
    author: "TheCryptoTools Research",
    policyPath: "/editorial-policy",
    policyLabel: "How we verify these figures",
  },
} as const;

export type Site = typeof site;

/**
 * Absolute canonical URL.
 *
 * next.config sets `trailingSlash: true`, so every page is served at `/path/`
 * and the host 301s `/path` → `/path/`. This helper must therefore emit the
 * slashed form: without it the sitemap advertises 199 redirects and Google
 * files the lot under "Page with redirect" instead of indexing them.
 * File paths (anything with an extension, e.g. /sitemap.xml) are left alone.
 */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  const withSlash = isFile || clean.endsWith("/") ? clean : `${clean}/`;
  return `${site.url}${withSlash}`;
}
