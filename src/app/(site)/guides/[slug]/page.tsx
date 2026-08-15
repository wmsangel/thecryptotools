import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { getAllGuideSlugs, getGuide } from "@/lib/guides/registry";
import type { Guide, GuideBlock } from "@/lib/guides/types";
import { getTool } from "@/lib/tools/registry";
import { ToolCard } from "@/components/ToolCard";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};
  return {
    title: guide.seo.title ?? guide.title,
    description: guide.seo.description,
    keywords: guide.seo.keywords,
    alternates: {
      canonical: absoluteUrl(`/guides/${guide.slug}`),
      // Points at the Markdown twin written by scripts/generate-llms.mjs, so an
      // agent that prefers Markdown can find it from the page itself rather
      // than only via llms.txt. Note the missing trailing slash: this is a
      // real file, not a route.
      types: { "text/markdown": `${site.url}/guides/${guide.slug}.md` },
    },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.seo.description,
      url: absoluteUrl(`/guides/${guide.slug}`),
      images: [ogImage(`guides/${guide.slug}`, guide.title)],
    },
  };
}

function guideJsonLd(guide: Guide) {
  const blocks: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.seo.description,
      datePublished: guide.updatedAt,
      // The later of the two: re-confirming a rate against HMRC is a
      // modification of the page's usefulness even when no prose changed.
      dateModified: guide.reviewedAt ?? guide.updatedAt,
      author: {
        "@type": "Organization",
        name: site.editorial.author,
        url: absoluteUrl(site.editorial.policyPath),
      },
      publisher: {
        "@type": "Organization",
        name: site.name,
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl(site.organization.logo) },
      },
      // `citation` is how a page states, in machine-readable form, that its
      // numbers came from the authority rather than from another blog.
      ...(guide.sources?.length
        ? {
            citation: guide.sources.map((s) => ({
              "@type": "CreativeWork",
              name: s.label,
              publisher: { "@type": "Organization", name: s.publisher },
              url: s.url,
            })),
          }
        : {}),
      isAccessibleForFree: true,
      mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
    },
  ];
  if (guide.faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return blocks;
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-10 text-2xl font-extrabold tracking-tight sm:text-3xl">{block.text}</h2>;
    case "p":
      return <p className="mt-4 leading-relaxed text-[var(--text)]/90">{block.text}</p>;
    case "ul":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-1 text-brand-ink">•</span>
              <span className="text-[var(--text)]/90">{it}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <p className="mt-5 rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm font-medium">
          {block.text}
        </p>
      );
    case "tool": {
      const tool = getTool(block.slug);
      if (!tool) return null;
      return (
        <div className="mt-6">
          <ToolCard tool={tool} />
        </div>
      );
    }
    case "cta":
      return (
        <Link href={block.href} className="card card-hover group mt-6 block border-brand-500/40 p-6">
          <div className="eyebrow">{block.title}</div>
          <p className="mt-2 leading-relaxed text-[var(--text)]/90">{block.text}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-ink group-hover:underline">
            {block.label} →
          </span>
        </Link>
      );
    case "table":
      return (
        // The table scrolls inside its own box so a wide comparison never makes
        // the whole page scroll sideways on a phone.
        <figure className="mt-6">
          <div className="card overflow-x-auto p-0" tabIndex={0} role="group" aria-label="Table, scrolls horizontally">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs muted">
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-3 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-[var(--border)] align-top last:border-0 hover:bg-[var(--bg-elevated)]">
                    {row.cells.map((cell, c) => (
                      <td key={c} className="px-3 py-3 leading-snug">
                        {c === 0 && row.href ? (
                          <Link href={row.href} className="font-semibold text-brand-ink hover:underline">
                            {cell}
                          </Link>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="muted mt-2 text-xs">{block.caption}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

/** Long-form date. Fixed to en-GB so the output cannot drift with the locale. */
function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Who wrote this, when it was last checked, and against what.
 *
 * This is the part a reader of a tax page looks for and, until now, could not
 * find anywhere on the site — the figures were verified against primary
 * sources, but the page gave no way to tell that apart from a page that made
 * them up. The named authorities come from the guide's own `sources`, so the
 * claim can never overstate what is actually cited below.
 */
function Byline({ guide }: { guide: Guide }) {
  const authorities = [...new Set((guide.sources ?? []).map((s) => s.publisher))];
  const verified = guide.reviewedAt && authorities.length > 0;
  // Guides written and fact-checked in one pass carry the same date twice.
  // Printing it twice reads like padding, so the two lines merge into one.
  const sameDay = guide.reviewedAt === guide.updatedAt;

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-semibold">{site.editorial.author}</span>
        <span className="muted">·</span>
        <span className="muted">
          Updated <time dateTime={guide.updatedAt}>{longDate(guide.updatedAt)}</time>
          {verified && sameDay && <> · figures checked against {listAuthorities(authorities)}</>}
        </span>
      </div>
      {verified && (
        <p className="muted mt-1.5 text-xs leading-relaxed">
          {!sameDay && (
            <>
              Figures checked against {listAuthorities(authorities)} on{" "}
              <time dateTime={guide.reviewedAt}>{longDate(guide.reviewedAt!)}</time>.{" "}
            </>
          )}
          <Link href={site.editorial.policyPath} className="font-semibold text-brand-ink hover:underline">
            {site.editorial.policyLabel} →
          </Link>
        </p>
      )}
    </div>
  );
}

/** "HMRC", "HMRC and GOV.UK", "HMRC, GOV.UK and the OECD". */
function listAuthorities(names: string[]): string {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * The sources themselves, at the foot of the guide.
 *
 * Followed links, deliberately — see the note on GuideSource. Opening in a new
 * tab keeps a half-read tax guide from being lost to a trip to gov.uk.
 */
function Sources({ guide }: { guide: Guide }) {
  if (!guide.sources?.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold tracking-tight">Sources</h2>
      {/*
        Deliberately does NOT say "the tax authority or the legislation itself".
        That was written when every guide carrying sources was a tax guide, and
        it became false the moment one cited a block explorer — an inaccurate
        claim about our own sourcing, printed directly above the sources that
        disprove it. The wording below is true for a statute, a regulator and a
        network data source alike; the byline above already names the publishers.
      */}
      <p className="muted mt-2 text-sm leading-relaxed">
        Every figure on this page was checked against the primary source below — whoever actually
        publishes it, never a secondary summary.
      </p>
      <ol className="mt-5 space-y-3">
        {guide.sources.map((source, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed">
            <span className="muted shrink-0 font-mono text-xs">{i + 1}.</span>
            <span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-ink hover:underline"
              >
                {source.label}
              </a>
              <span className="muted"> — {source.publisher}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const related = guide.relatedTools.map((s) => getTool(s)).filter(Boolean);
  const hub = guide.partOf ? getGuide(guide.partOf) : undefined;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={guideJsonLd(guide)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-brand-ink">Guides</Link>
        <span>/</span>
        <span className="text-[var(--text)] line-clamp-1">{guide.title}</span>
      </nav>

      <header className="mb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs muted">
          <span className="chip !px-2.5 !py-0.5">Guide</span>
          <span>{guide.readingMinutes} min read</span>
          {hub && (
            <>
              <span>·</span>
              <Link href={`/guides/${hub.slug}`} className="font-semibold text-brand-ink hover:underline">
                Part of: Crypto Tax by Country
              </Link>
            </>
          )}
        </div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{guide.title}</h1>
        <p className="muted mt-3 text-lg leading-relaxed">{guide.description}</p>
        <Byline guide={guide} />
      </header>

      <AdSlot slot="guide-top" className="my-8" />

      <div>
        {guide.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      {guide.faq && guide.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">Frequently asked questions</h2>
          <dl className="mt-5 divide-y divide-[var(--border)]">
            {guide.faq.map((f, i) => (
              <div key={i} className="py-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="muted mt-1.5 text-sm leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <Sources guide={guide} />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">Related tools</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((tool) => tool && <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}

      {hub && (
        <section className="mt-12">
          <Link href={`/guides/${hub.slug}`} className="card card-hover group block p-6">
            <div className="eyebrow">Compare every country</div>
            <div className="mt-2 font-bold group-hover:text-brand-ink">{hub.title}</div>
            <p className="muted mt-1.5 text-sm leading-relaxed">{hub.description}</p>
          </Link>
        </section>
      )}

      <div className="mt-12 border-t border-[var(--border)] pt-6">
        <Link href="/guides" className="text-sm font-semibold text-brand-ink hover:underline">
          ← All guides
        </Link>
      </div>
    </article>
  );
}
