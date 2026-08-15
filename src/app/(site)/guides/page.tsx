import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { guides } from "@/lib/guides/registry";
import { assertGuideToolRefs } from "@/lib/guides/validate";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Crypto Guides & Tutorials",
  description:
    "Plain-English guides to crypto trading and investing concepts — liquidation, DCA, position sizing, the Sharpe ratio and more, each linked to a free calculator.",
  keywords: ["crypto guides", "crypto tutorials", "crypto trading guides", "learn crypto investing"],
  alternates: { canonical: absoluteUrl("/guides") },
  // Same reason as /tools: inheriting the base openGraph pointed og:url at the
  // homepage.
  openGraph: {
    type: "website",
    url: absoluteUrl("/guides"),
    title: "Crypto Guides & Tutorials",
    description: `Plain-English crypto guides from ${site.name}, researched against primary sources.`,
    images: [ogImage("guides", "Crypto guides and tutorials")],
  },
};

export default function GuidesPage() {
  // Build-time guard: a guide pointing at a non-existent tool slug loses both
  // its tool card and the reverse link on the tool page, silently.
  assertGuideToolRefs();

  return (
    <div className="mx-auto max-w-content px-4 py-10">
    <JsonLd data={breadcrumbJsonLd([{ name: "Guides", path: "/guides" }])} />
      <header className="mb-8">
        <div className="eyebrow">Learn</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Crypto guides</h1>
        <p className="muted mt-3 max-w-2xl text-lg">
          Clear, practical explainers on the concepts behind our tools — from liquidation
          and DCA to position sizing and risk-adjusted returns.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover group flex h-full flex-col p-6">
            <div className="flex items-center gap-2 text-xs muted">
              <span className="chip !px-2.5 !py-0.5">Guide</span>
              <span>{g.readingMinutes} min read</span>
            </div>
            <h2 className="mt-3 text-xl font-bold group-hover:text-brand-ink">{g.title}</h2>
            <p className="muted mt-2 line-clamp-3 text-sm leading-relaxed">{g.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink opacity-0 transition group-hover:opacity-100">
              Read guide →
            </span>
          </Link>
        ))}
      </div>

      <AdSlot slot="guides-footer" className="mt-10" />

      <p className="muted mt-6 text-xs">
        {site.name} guides are for education only — not financial advice.
      </p>
    </div>
  );
}
