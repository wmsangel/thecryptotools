import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getCorrelationStudy } from "@/lib/research/crypto-correlation";

const TITLE = "Crypto Research & Data Studies";
const DESCRIPTION =
  "Original crypto market research computed from real daily price data — correlation, diversification, volatility and drawdown studies you can cite. Free and updated as new data arrives.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["crypto research", "crypto data study", "crypto market data", "crypto correlation research"],
  alternates: { canonical: absoluteUrl("/research") },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/research"),
    images: [ogImage("research", "Crypto research & data studies")],
  },
};

export default function Page() {
  const study = getCorrelationStudy();

  const studies = [
    {
      href: "/research/crypto-correlation",
      title: "How correlated is the crypto market?",
      blurb: study
        ? `The ${study.assetCount} largest cryptocurrencies moved together at an average correlation of ${study.rho.toFixed(2)} over the last year. What that means for diversification.`
        : "How closely the largest cryptocurrencies actually move together, from real daily closes.",
      stat: study ? study.rho.toFixed(2) : "0.80",
      statLabel: "avg correlation",
      updated: study?.through,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "Research", path: "/research" }])} />

      <header>
        <div className="eyebrow">Research</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto research &amp; data studies
        </h1>
        <p className="muted mt-4 max-w-2xl text-lg leading-relaxed">
          We ship a lot of calculators, and they run on real market data. These studies turn that same
          data into findings worth citing — measured, dated, and free to quote with a link back.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {studies.map((s) => (
          <Link key={s.href} href={s.href} className="card card-hover flex flex-wrap items-center gap-6 p-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold">{s.title}</h2>
              <p className="muted mt-1.5 leading-relaxed">{s.blurb}</p>
              {s.updated && <p className="muted mt-2 text-xs">Updated {s.updated}</p>}
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold tracking-tight text-brand-ink">{s.stat}</div>
              <div className="muted text-xs uppercase tracking-wide">{s.statLabel}</div>
            </div>
          </Link>
        ))}
      </div>

      <p className="muted mt-10 text-sm">
        Working on a story and need a specific cut of the data? The{" "}
        <Link href="/portfolio/correlation" className="font-semibold text-brand-ink hover:underline">
          correlation tool
        </Link>{" "}
        and{" "}
        <Link href="/prices" className="font-semibold text-brand-ink hover:underline">
          live market table
        </Link>{" "}
        are open to everyone, and more studies are on the way.
      </p>
    </div>
  );
}
