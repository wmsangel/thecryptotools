import type { Metadata } from "next";
import { site, absoluteUrl } from "./site";
import type { ToolConfig } from "./tools/types";
import { categories, type Category } from "./categories";

/**
 * Share cards. The PNGs are rendered after `next build` by scripts/generate-og.mjs
 * straight into `out/og/` — see that file for why they are not a Next
 * opengraph-image route. Any page whose metadata sets `openGraph` must repeat
 * the images field, because Next replaces the whole object rather than merging.
 */
export const OG_DEFAULT = {
  url: absoluteUrl("/og/default.png"),
  width: 1200,
  height: 630,
  alt: `${site.name} — free crypto calculators and tools`,
};

/** Share card for a generated per-page PNG, e.g. ogImage("tools/dca-calculator"). */
export function ogImage(path: string, alt: string) {
  return { url: absoluteUrl(`/og/${path}.png`), width: 1200, height: 630, alt };
}

/** Base metadata applied at the root layout; pages override pieces of it. */
export function buildBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [...site.keywords],
    applicationName: site.name,
    authors: [{ name: site.organization.name }],
    creator: site.organization.name,
    publisher: site.organization.name,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: [{ url: "/favicon.ico" }],
    },
    category: "finance",
    // Site-ownership verification for the Mitgo/Awin affiliate network.
    verification: { other: { "mitgo-verification": "d8806337-8721-40ec-a330-8759e370ab62" } },
    alternates: { canonical: site.url },
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: site.url,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      images: [OG_DEFAULT],
    },
    twitter: {
      // No `site`/`creator`: there is no X account, and pointing the card at a
      // handle we do not own would credit someone else on every share.
      card: "summary_large_image",
      // Deliberately NO `images` here. Next replaces the whole `twitter` object
      // rather than merging it, so a default set at the base was inherited by
      // every page that overrides only `openGraph` — which was all of them —
      // and pinned twitter:image to the generic card even on pages with a card
      // of their own. With the field absent, X falls back to og:image, which is
      // always the right one. Pages that want a distinct Twitter image set the
      // whole `twitter` object themselves.
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/** Per-tool metadata: unique title, description, canonical, OG + Twitter. */
export function buildToolMetadata(tool: ToolConfig): Metadata {
  const url = absoluteUrl(`/tools/${tool.slug}`);
  const title = tool.seo.title ?? tool.title;
  const description = tool.seo.description || tool.description;
  return {
    title,
    description,
    keywords: tool.seo.keywords,
    // Off-topic utilities are crawlable but kept out of the index so they do not
    // drag the site's content-quality signal; links out of them are still followed.
    robots: tool.noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${site.name}`,
      description,
      images: [ogImage(`tools/${tool.slug}`, title)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage(`tools/${tool.slug}`, title).url],
    },
  };
}

export function buildCategoryMetadata(category: Category): Metadata {
  const url = absoluteUrl(`/category/${category.id}`);
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${category.title} | ${site.name}`,
      description: category.description,
      images: [ogImage(`category/${category.id}`, category.title)],
    },
  };
}

// --- JSON-LD builders -------------------------------------------------------

/**
 * schema.org markup for a tool page. We emit a `WebApplication` (the tool
 * itself) plus a `FAQPage` when the tool has FAQ entries. Both help rich
 * results in Google Search.
 */
export function toolJsonLd(tool: ToolConfig): Record<string, unknown>[] {
  const url = absoluteUrl(`/tools/${tool.slug}`);
  const blocks: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.title,
      url,
      description: tool.seo.description || tool.description,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
      publisher: {
        "@type": "Organization",
        name: site.organization.name,
        url: site.url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: categories[tool.category].title,
          item: absoluteUrl(`/category/${tool.category}`),
        },
        { "@type": "ListItem", position: 3, name: tool.title, item: url },
      ],
    },
  ];

  if (tool.faq.length > 0) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return blocks;
}

/**
 * BreadcrumbList for any page that shows a breadcrumb trail.
 *
 * Tool and category pages built their own inline; everything else — all 54
 * guides, the hubs, the static pages — had a visible trail in the HTML and
 * nothing machine-readable behind it, so Google rendered the bare URL in the
 * result instead of a path. Pass the trail WITHOUT Home (added here) and
 * without the current page's own item URL if it is the last crumb.
 *
 * @param trail e.g. [{ name: "Guides", path: "/guides" }, { name: guide.title, path: `/guides/${slug}` }]
 */
export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      ...trail.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        item: absoluteUrl(c.path),
      })),
    ],
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: site.organization.name,
      url: site.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** ItemList of tools + breadcrumbs for a category landing page. */
export function categoryJsonLd(
  category: Category,
  tools: ToolConfig[],
): Record<string, unknown>[] {
  const url = absoluteUrl(`/category/${category.id}`);
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.title,
      url,
      description: category.description,
      isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: tools.length,
        itemListElement: tools.map((t, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: t.title,
          url: absoluteUrl(`/tools/${t.slug}`),
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: category.title, item: url },
      ],
    },
  ];
}

/** CollectionPage + ItemList for the homepage / all-tools index. */
export function collectionJsonLd(tools: ToolConfig[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${site.name} — all crypto tools`,
    url: site.url,
    description: site.description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, 30).map((t, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: t.title,
        url: absoluteUrl(`/tools/${t.slug}`),
      })),
    },
  };
}
