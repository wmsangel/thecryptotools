import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { renderInline } from "@/components/RichText";
import { AmazonPicks } from "@/components/AmazonPicks";
import { glossaryTerms, GLOSSARY_CATEGORIES } from "@/lib/glossary/terms";

const PATH = "/glossary";
const TITLE = "Crypto Glossary";
const DESCRIPTION = `Plain-English definitions of ${glossaryTerms.length}+ crypto terms — from market cap, DCA and leverage to seed phrases, staking and the Fear & Greed Index — each linked to a free calculator or guide that puts it to work.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto glossary",
    "crypto terms explained",
    "cryptocurrency glossary",
    "crypto definitions",
    "what is market cap crypto",
    "crypto terminology",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), images: [ogImage("glossary", "Crypto Glossary")] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function pageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    hasDefinedTerm: glossaryTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.short,
      url: absoluteUrl(`${PATH}#${t.slug}`),
    })),
  };
}

export default function GlossaryPage() {
  const byCat = GLOSSARY_CATEGORIES.map((c) => ({
    cat: c,
    terms: glossaryTerms.filter((t) => t.category === c.id).sort((a, b) => a.term.localeCompare(b.term)),
  })).filter((g) => g.terms.length);

  return (
    <>
      <JsonLd data={pageJsonLd()} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs trail={[{ name: "Glossary", path: PATH }]} />

        <header className="mt-4 max-w-3xl">
          <span className="chip">📖 Learn</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Crypto Glossary</h1>
          <p className="mt-4 text-lg muted">
            The crypto terms that actually matter, in plain English — and for each one, the free calculator or guide that
            lets you use it. {glossaryTerms.length} definitions, no jargon for its own sake.
          </p>
        </header>

        {/* category jump-nav */}
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Glossary sections">
          {byCat.map(({ cat }) => (
            <a key={cat.id} href={`#${cat.id}`} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm muted transition hover:border-[color:var(--muted)] hover:text-brand-ink">
              {cat.title}
            </a>
          ))}
        </nav>

        <AdSlot slot="glossary-top" className="mt-8" />

        <div className="mt-10 space-y-12">
          {byCat.map(({ cat, terms }) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight">{cat.title}</h2>
              <p className="mt-1 text-sm muted">{cat.blurb}</p>
              <div className="mt-5 space-y-4">
                {terms.map((t) => (
                  <article key={t.slug} id={t.slug} className="scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-5">
                    <h3 className="text-lg font-bold text-brand-ink">{t.term}</h3>
                    {t.aliases && t.aliases.length > 0 && (
                      <div className="mt-0.5 text-xs muted">also: {t.aliases.join(", ")}</div>
                    )}
                    <p className="mt-2 font-medium">{t.short}</p>
                    <p className="mt-2 text-sm muted">{renderInline(t.body)}</p>
                    {t.links && t.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {t.links.map((l) => (
                          <Link key={l.href} href={l.href} className="font-semibold text-brand-ink hover:underline">
                            {l.label} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold">Put the terms to work</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Related href="/tools" title="All calculators" desc="69+ free crypto tools, no signup." />
            <Related href="/guides" title="All guides" desc="Plain-English deep dives on every topic here." />
            <Related href="/fear-and-greed-index" title="Fear & Greed Index" desc="Today's market sentiment, 0–100." />
            <Related href="/dca" title="Live DCA strategy lab" desc="See strategies run on the real market." />
          </div>
        </section>

        <div className="max-w-3xl">
          <AmazonPicks topic="books" placement="glossary" />
        </div>
      </div>
    </>
  );
}

function Related({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-[var(--border)] p-4 transition hover:border-[color:var(--muted)]">
      <div className="font-semibold text-brand-ink">{title} →</div>
      <div className="mt-1 text-sm muted">{desc}</div>
    </Link>
  );
}
