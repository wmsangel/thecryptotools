import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { renderInline } from "@/components/RichText";
import { glossaryTerms, GLOSSARY_CATEGORIES } from "@/lib/glossary/terms";

export const dynamicParams = false;

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ slug: t.slug }));
}

function getTerm(slug: string) {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = getTerm(params.slug);
  if (!t) return {};
  const path = `/glossary/${t.slug}`;
  const title = `${t.term} — Crypto Glossary`;
  const description = t.short.length > 155 ? t.short.slice(0, 152) + "…" : t.short;
  return {
    title,
    description,
    keywords: [t.term.toLowerCase(), `what is ${t.term.toLowerCase()}`, `${t.term.toLowerCase()} crypto`, "crypto glossary", ...(t.aliases ?? [])],
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "article",
      title: `${t.term} — Crypto Glossary`,
      description,
      url: absoluteUrl(path),
      images: [ogImage("glossary", t.term)],
    },
    twitter: { card: "summary_large_image", title: `${t.term} — Crypto Glossary`, description },
  };
}

export default function GlossaryTermPage({ params }: { params: { slug: string } }) {
  const t = getTerm(params.slug);
  if (!t) notFound();

  const cat = GLOSSARY_CATEGORIES.find((c) => c.id === t.category);
  const path = `/glossary/${t.slug}`;
  const related = glossaryTerms
    .filter((x) => x.category === t.category && x.slug !== t.slug)
    .sort((a, b) => a.term.localeCompare(b.term))
    .slice(0, 6);

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Glossary", path: "/glossary" },
      { name: t.term, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: t.term,
      description: t.short,
      url: absoluteUrl(path),
      termCode: t.slug,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Crypto Glossary",
        url: absoluteUrl("/glossary"),
      },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs
          trail={[
            { name: "Glossary", path: "/glossary" },
            { name: t.term, path },
          ]}
        />

        <header className="mt-4">
          {cat && (
            <Link href={`/glossary#${cat.id}`} className="chip hover:text-brand-ink">
              📖 {cat.title}
            </Link>
          )}
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.term}</h1>
          {t.aliases && t.aliases.length > 0 && (
            <div className="mt-2 text-sm muted">also known as: {t.aliases.join(", ")}</div>
          )}
          <p className="mt-4 text-xl font-medium leading-relaxed">{t.short}</p>
        </header>

        <div className="mt-6 leading-relaxed text-[var(--text)]/90">{renderInline(t.body)}</div>

        {t.links && t.links.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide muted">Use it</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {t.links.map((l) => (
                <Link key={l.href} href={l.href} className="font-semibold text-brand-ink hover:underline">
                  {l.label} →
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="glossary-term" className="my-10" />

        {related.length > 0 && (
          <section className="mt-6">
            <h2 className="text-2xl font-bold tracking-tight">Related terms</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}`}
                  className="block rounded-xl border border-[var(--border)] p-4 transition hover:border-[color:var(--muted)]"
                >
                  <div className="font-semibold text-brand-ink">{r.term} →</div>
                  <div className="mt-1 line-clamp-2 text-sm muted">{r.short}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <Link href="/glossary" className="text-sm font-semibold text-brand-ink hover:underline">
            ← All {glossaryTerms.length} crypto terms
          </Link>
        </div>

        <p className="muted mt-8 text-xs leading-relaxed">
          Plain-English definition for general information, not financial advice. {site.name} links each
          term to a free calculator or guide that puts it to work.
        </p>
      </div>
    </>
  );
}
