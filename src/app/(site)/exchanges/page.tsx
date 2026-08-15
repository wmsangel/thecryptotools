import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import {
  sortedPlatformCategories,
  platformsByCategory,
  platforms,
  type Platform,
} from "@/lib/platforms";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { PlatformLogo } from "@/components/PlatformLogo";

export const metadata: Metadata = {
  title: "Best Crypto Platforms — Exchanges, Wallets & Tools",
  description:
    "A curated directory of the best crypto exchanges, hardware and software wallets, tax software and trading tools — compared side by side.",
  keywords: [
    "best crypto exchange",
    "crypto exchanges compared",
    "best crypto wallet",
    "crypto tax software",
    "crypto trading tools",
  ],
  alternates: { canonical: absoluteUrl("/exchanges") },
  openGraph: {
    title: "Best Crypto Platforms — Exchanges, Wallets & Tools",
    description:
      "Compare the best crypto exchanges, wallets, tax software and trading tools in one place.",
    url: absoluteUrl("/exchanges"),
    images: [ogImage("exchanges", "Best crypto platforms")],
  },
};

function itemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best Crypto Platforms",
    itemListElement: platforms.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      description: p.description,
    })),
  };
}

export default function ExchangesPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-10">
    <JsonLd data={breadcrumbJsonLd([{ name: "Crypto platforms", path: "/exchanges" }])} />
      <JsonLd data={itemListJsonLd()} />

      {/* ---------- Header ---------- */}
      <header className="mb-6">
        <div className="eyebrow">Recommended</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Best crypto <span className="text-gradient">platforms</span>
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg">
          Hand-picked exchanges, wallets, tax software and trading tools — with
          the essentials on each so you can pick what fits.
        </p>
      </header>

      {/* ---------- Affiliate disclosure ---------- */}
      <div className="card mb-8 border-dashed p-4 text-sm muted">
        <strong className="text-[var(--text)]">Disclosure:</strong> some links on
        this page are affiliate links. If you sign up through them we may earn a
        commission — at no extra cost to you. We only list platforms we consider
        worth knowing about. Nothing here is financial advice; always do your own
        research.
      </div>

      {/* ---------- Jump nav ---------- */}
      <nav className="mb-10 flex flex-wrap gap-2" aria-label="Categories">
        {sortedPlatformCategories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="chip hover:text-brand-ink"
          >
            {c.icon} {c.title}
          </a>
        ))}
      </nav>

      {/* ---------- Sections ---------- */}
      <div className="space-y-14">
        {sortedPlatformCategories.map((cat) => {
          const items = platformsByCategory(cat.id);
          if (!items.length) return null;
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-28">
              <div className="mb-6 flex items-start gap-3">
                <span className="icon-badge">{cat.icon}</span>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {cat.title}
                  </h2>
                  <p className="muted mt-1 text-sm">{cat.blurb}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <PlatformCard key={p.slug} platform={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AdSlot slot="exchanges-footer" className="mt-14" />
    </div>
  );
}

function PlatformCard({ platform: p }: { platform: Platform }) {
  return (
    <div className="card card-hover flex flex-col p-6">
      <div className="flex items-center gap-3">
        <span className="icon-badge">
          <PlatformLogo slug={p.slug} name={p.name} emoji={p.icon} className="text-2xl" />
        </span>
        <div>
          <div className="font-bold leading-tight">{p.name}</div>
          <span className="chip !px-2 !py-0.5 text-xs">{p.bestFor}</span>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium">{p.tagline}</p>
      <p className="muted mt-1 text-sm leading-relaxed">{p.description}</p>

      <ul className="mt-4 space-y-1.5 text-sm">
        {p.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-ink">✓</span>
            <span className="muted">{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg bg-[var(--bg-elevated)] px-3 py-2 text-xs">
        <span className="font-semibold text-brand-ink">Perk:</span>{" "}
        <span className="muted">{p.bonus}</span>
      </div>

      <a
        href={p.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        data-affiliate={p.slug}
        data-affiliate-placement="exchanges"
        className="btn-primary mt-5 w-full justify-center"
      >
        Visit {p.name} →
      </a>
    </div>
  );
}
