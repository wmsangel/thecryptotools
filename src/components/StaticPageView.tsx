import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site, absoluteUrl } from "@/lib/site";
import { OG_DEFAULT, ORGANIZATION_ID } from "@/lib/seo";
import { getStaticPage } from "@/lib/pages/registry";
import type { PageBlock, StaticPage } from "@/lib/pages/types";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { renderInline } from "@/components/RichText";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";

/** Metadata builder shared by every thin legal/info route file. */
export function buildStaticPageMetadata(slug: string): Metadata {
  const page = getStaticPage(slug);
  if (!page) return {};
  return {
    title: page.seo.title ?? page.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: { canonical: absoluteUrl(`/${page.slug}`) },
    robots: page.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title: page.title,
      description: page.seo.description,
      url: absoluteUrl(`/${page.slug}`),
      images: [OG_DEFAULT],
    },
  };
}

function Block({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-10 text-2xl font-extrabold tracking-tight">{block.text}</h2>;
    case "p":
      return <p className="mt-4 leading-relaxed text-[var(--text)]/90">{renderInline(block.text)}</p>;
    case "ul":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-1 text-brand-ink">•</span>
              <span className="text-[var(--text)]/90">{renderInline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <p className="mt-5 rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm font-medium">
          {renderInline(block.text)}
        </p>
      );
    case "cookieSettings":
      return (
        <div className="mt-5">
          <CookieSettingsButton className="btn-ghost !py-2 text-sm" />
        </div>
      );
    default:
      return null;
  }
}

/**
 * schema.org for a static page. /about and /contact get their specific types
 * (a small but real E-E-A-T signal — this is the page that says who runs the
 * site); everything else is a plain WebPage. The visible "Last updated" date
 * becomes machine-readable dateModified.
 */
function pageJsonLd(page: StaticPage): Record<string, unknown> {
  const type =
    page.slug === "about" ? "AboutPage" : page.slug === "contact" ? "ContactPage" : "WebPage";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: page.seo.title ?? page.title,
    description: page.seo.description,
    url: absoluteUrl(`/${page.slug}`),
    dateModified: page.updatedAt,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Universal renderer for every page in the static-page registry. */
export function StaticPageView({ slug }: { slug: string }) {
  const page = getStaticPage(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={pageJsonLd(page)} />
      <Breadcrumbs trail={[{ name: page.title, path: `/${page.slug}` }]} />

      <header>
        <div className="eyebrow">{page.eyebrow}</div>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {page.title}
        </h1>
        <p className="muted mt-3 text-lg leading-relaxed">{page.description}</p>
        <p className="muted mt-2 text-xs">
          Last updated:{" "}
          <time dateTime={page.updatedAt}>
            {new Date(page.updatedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </p>
      </header>

      <div className="mt-6">
        {page.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </article>
  );
}
