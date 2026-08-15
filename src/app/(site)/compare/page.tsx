import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { platforms, platformCategories } from "@/lib/platforms";
import { CHECKED_ON } from "@/lib/compare/data";
import { pairSlug, validPairs } from "@/lib/compare/pairs";
import { JsonLd } from "@/components/JsonLd";
import { PlatformLogo } from "@/components/PlatformLogo";

export const metadata: Metadata = {
  title: "Crypto Platform Comparisons — Exchanges, Wallets and Tax Tools",
  description:
    "Head-to-head comparisons of crypto exchanges, hardware wallets and tax software, built on facts that do not go stale — availability, custody, and the history worth knowing.",
  keywords: [
    "crypto exchange comparison",
    "binance vs bybit",
    "ledger vs trezor",
    "best crypto exchange comparison",
    "koinly vs cointracker",
  ],
  alternates: { canonical: absoluteUrl("/compare") },
  openGraph: {
    type: "website",
    title: "Crypto Platform Comparisons",
    description: "Exchanges, wallets and tax tools compared head to head.",
    url: absoluteUrl("/compare"),
    images: [ogImage("compare", "Crypto platform comparisons")],
  },
};

export default function Page() {
  const pairs = validPairs();
  const platformBySlug = new Map(platforms.map((p) => [p.slug, p]));

  // Grouped by the category of the left-hand platform, so exchanges, wallets
  // and tax tools do not interleave.
  const groups = platformCategories
    .map((cat) => ({
      cat,
      pairs: pairs.filter((p) => platformBySlug.get(p.a)?.category === cat.id),
    }))
    .filter((g) => g.pairs.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">

    <JsonLd data={breadcrumbJsonLd([{ name: "Compare platforms", path: "/compare" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Crypto Platform Comparisons",
          url: absoluteUrl("/compare"),
          hasPart: pairs.map((p) => ({
            "@type": "Article",
            headline: `${platformBySlug.get(p.a)?.name} vs ${platformBySlug.get(p.b)?.name}`,
            url: absoluteUrl(`/compare/${pairSlug(p)}`),
          })),
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Compare</span>
      </nav>

      <header>
        <div className="eyebrow">Head to head</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Which one should you actually use?
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          {pairs.length} comparisons, each ending in a straight answer rather than &ldquo;it
          depends&rdquo;. Built on the things that stay true for years — who can open an account, who
          holds the keys, and the history worth knowing — instead of a fee table that is wrong by
          next quarter.
        </p>
      </header>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-5 py-4 text-sm leading-relaxed">
        <strong>How to read these.</strong> The links are affiliate links, so every entry also
        carries a drawback — including the ones we would earn most from. Where one option is simply
        better for most people, the page says so.{" "}
        <Link href="/affiliate-disclosure" className="font-semibold text-brand-ink hover:underline">
          Full disclosure
        </Link>
        . Last checked {CHECKED_ON}.
      </div>

      {groups.map(({ cat, pairs: list }) => (
        <section key={cat.id} className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {cat.icon} {cat.title}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {list.map((pair) => {
              const a = platformBySlug.get(pair.a)!;
              const b = platformBySlug.get(pair.b)!;
              return (
                <Link
                  key={pairSlug(pair)}
                  href={`/compare/${pairSlug(pair)}`}
                  className="card card-hover p-4"
                >
                  <div className="flex items-center gap-2">
                    <PlatformLogo slug={a.slug} name={a.name} emoji={a.icon} className="text-base" />
                    <span className="font-semibold">{a.name}</span>
                    <span className="muted text-xs">vs</span>
                    <PlatformLogo slug={b.slug} name={b.name} emoji={b.icon} className="text-base" />
                    <span className="font-semibold">{b.name}</span>
                  </div>
                  <p className="muted mt-2 line-clamp-2 text-xs leading-relaxed">{pair.intro}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Why there are no fee tables</h2>
        <p className="muted mt-3 leading-relaxed">
          Every other comparison site leads with a fee table, and most of them are out of date.
          Kraken rebuilt its tier structure in July 2026; exchanges change promotional rates
          monthly. A number that is wrong, printed next to a link we earn from, is not a small
          mistake — it is an inaccurate commercial claim about somebody else&rsquo;s business.
        </p>
        <p className="muted mt-3 leading-relaxed">
          So each comparison links to both platforms&rsquo; own live pricing pages, and then to{" "}
          <Link href="/tools/trading-fee-calculator" className="font-semibold text-brand-ink hover:underline">
            our fee calculator
          </Link>{" "}
          so you can turn those rates into what a year of your trading would actually cost. That
          number decides it — not the headline percentage.
        </p>
        <p className="muted mt-3 leading-relaxed">
          What we do compare is what holds still: whether the platform will accept you, who controls
          the assets, what it genuinely does well, and what happened to it in the past.{" "}
          <Link href="/editorial-policy" className="font-semibold text-brand-ink hover:underline">
            How we verify things →
          </Link>
        </p>
      </section>
    </div>
  );
}
