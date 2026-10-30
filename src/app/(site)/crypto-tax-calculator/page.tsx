import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { countryCalculators, TAX_YEAR } from "@/lib/tax-calculator/countries";

const path = "/crypto-tax-calculator";

export const metadata: Metadata = {
  title: `Crypto Tax Calculator by Country (${TAX_YEAR}) — ${countryCalculators.length} Countries`,
  description:
    "Free crypto capital gains tax calculators for 12 countries. Each applies that country's real rules — holding-period relief, allowances and rates — then funnels to a full CSV report.",
  keywords: [
    "crypto tax calculator by country",
    "crypto capital gains tax calculator",
    "crypto tax calculator",
    "international crypto tax calculator",
    "crypto tax rates by country",
  ],
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    title: `Crypto Tax Calculator by Country | ${site.name}`,
    description:
      "Pick your country for a capital gains estimate that applies its real crypto tax rules.",
    images: [ogImage("tax-report", "Crypto tax calculator by country")],
  },
};

const FAQ = [
  {
    q: "Why a different calculator per country?",
    a: "Because the answer genuinely differs. Germany exempts a gain held over a year; Australia halves it; India taxes every gain at a flat 30% and ignores losses. Each calculator applies its own country's holding relief, allowance and rate, so the estimate is relevant to you rather than a generic number.",
  },
  {
    q: "Which should I use — this or the country-neutral calculator?",
    a: "Use your country's page here if it's listed: it pre-loads the real rules. Use the country-neutral quick calculator when you just want gain = proceeds − cost basis at a rate you type in.",
  },
  {
    q: "Is this tax advice?",
    a: "No. These are simplified single-sale estimates for general information. For filing, generate a full-year report from your transaction history and confirm with a professional.",
  },
];

export default function CryptoTaxCalculatorHubPage() {
  const jsonLd = [
    breadcrumbJsonLd([{ name: "Crypto tax calculator", path }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Crypto tax calculators by country",
      itemListElement: countryCalculators.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${c.jurisdiction.name} crypto tax calculator`,
        url: absoluteUrl(`${path}/${c.meta.slug}`),
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-content px-4 py-10">
      <JsonLd data={jsonLd} />

      <header className="max-w-3xl">
        <div className="eyebrow">Free · no signup · nothing uploaded</div>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto tax calculator <span className="text-gradient">by country</span>
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          Pick your country for a capital gains estimate that applies its real rules — the
          holding-period relief, the allowance or Freigrenze, the inclusion rate and the headline
          rate — not a one-size-fits-all number. Each page links through to a full {TAX_YEAR} report
          from your exchange CSV.
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {countryCalculators.map((c) => (
          <Link
            key={c.meta.id}
            href={`${path}/${c.meta.slug}`}
            className="card card-hover flex items-start gap-3 p-4"
          >
            <span className="text-2xl" aria-hidden>{c.jurisdiction.flag}</span>
            <span className="min-w-0">
              <span className="block font-semibold">{c.jurisdiction.name}</span>
              <span className="muted block text-sm leading-snug">{c.meta.headline}</span>
            </span>
          </Link>
        ))}
      </div>

      <AdSlot slot="tax-hub" className="mt-10" />

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Not in the list?</h2>
        <p className="muted mt-4 leading-relaxed">
          Two options cover everyone else. The{" "}
          <Link href="/crypto-tax-report" className="underline">free CSV tax report generator</Link>{" "}
          supports every country for a full-year capital gains report, and the{" "}
          <Link href="/tools/crypto-tax-calculator" className="underline">country-neutral calculator</Link>{" "}
          estimates a single sale at any rate you enter. For the rules side by side, see{" "}
          <Link href="/guides/crypto-tax-by-country" className="underline">crypto tax by country</Link>.
        </p>
      </section>

      <div className="max-w-3xl">
        <FaqSection faq={FAQ} />
      </div>

      <p className="muted mt-10 max-w-3xl text-xs leading-relaxed">
        General information, not tax advice. Crypto tax rules change and depend on your full
        circumstances — confirm with a qualified professional before filing.
      </p>
    </div>
  );
}
