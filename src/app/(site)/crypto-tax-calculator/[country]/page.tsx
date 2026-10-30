import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { GuideAffiliateCTA } from "@/components/guides/GuideAffiliateCTA";
import type { Jurisdiction } from "@/lib/taxreport/jurisdictions";
import {
  countryCalculators,
  getCountryCalculator,
  TAX_YEAR,
  type CountryMeta,
} from "@/lib/tax-calculator/countries";
import { CountryTaxCalculator } from "./CountryTaxCalculator";

export const dynamicParams = false;

export function generateStaticParams() {
  return countryCalculators.map((c) => ({ country: c.meta.slug }));
}

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const c = getCountryCalculator(params.country);
  if (!c) return {};
  const { meta, jurisdiction: j } = c;
  const title = `${j.name} Crypto Tax Calculator (${TAX_YEAR}) — Capital Gains Estimate`;
  const description = `Estimate crypto capital gains tax in ${j.name}. ${meta.hook}`;
  const path = `/crypto-tax-calculator/${meta.slug}`;
  return {
    title,
    description: description.slice(0, 160),
    keywords: [
      `${j.name} crypto tax calculator`,
      `crypto tax calculator ${j.name}`,
      `crypto capital gains tax ${j.name}`,
      `bitcoin tax calculator ${j.name}`,
      `how much tax on crypto ${j.name}`,
    ],
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title: `${j.name} Crypto Tax Calculator | ${site.name}`,
      description: description.slice(0, 200),
      images: [ogImage("tax-report", `${j.name} crypto tax calculator`)],
    },
  };
}

/** The "how it works" rows, built straight from the verified jurisdiction record. */
function reliefText(j: Jurisdiction): string {
  switch (j.relief.kind) {
    case "exempt":
      return `Gain is tax-free once held ${j.relief.inclusive ? `${j.relief.days} days or more` : `more than ${j.relief.days} days`}.`;
    case "discount":
      return `${j.relief.pct}% discount once held more than ${j.relief.days} days.`;
    case "rate":
      return `Preferential ${j.defaultLongTermRate}% rate once held more than ${j.relief.days} days.`;
    default:
      return "None — holding longer doesn't change the tax.";
  }
}

function swapText(j: Jurisdiction): string {
  if (j.swapsTaxable) return "Taxable — swapping one coin for another is a disposal.";
  return j.swapsPreserveHoldingPeriod
    ? "Not taxed, and your original acquisition date carries through the swap."
    : "Not taxed — swaps sit outside the system entirely.";
}

function buildFaq(meta: CountryMeta, j: Jurisdiction) {
  const exemptAnswer =
    j.relief.kind === "exempt"
      ? `Partly. A gain on crypto held ${j.relief.inclusive ? `${j.relief.days} days or more` : `more than ${j.relief.days} days`} is exempt.${j.allowance > 0 ? ` Shorter holds get the ${j.allowanceLabel}.` : ""}`
      : j.allowance > 0
        ? `There's no blanket exemption, but your first ${j.allowanceLabel} of gains each year is free. Above that, ${j.defaultRate}% applies.`
        : `No — ${j.name} taxes crypto gains with no tax-free holding period or allowance.`;

  return [
    { q: `How much tax will I pay on crypto in ${j.name}?`, a: j.rateNote },
    { q: `Is crypto tax-free in ${j.name}?`, a: exemptAnswer },
    { q: `Are crypto-to-crypto swaps taxed in ${j.name}?`, a: swapText(j) },
    { q: `Which cost-basis method does ${j.name} use?`, a: `${j.methodLabel}. This calculator estimates a single sale; the full CSV tool applies the method across your whole history.` },
    {
      q: `Can I file my ${j.name} tax return with this?`,
      a: "No — it's a quick single-sale estimate, not tax advice. For your actual filing, generate a full-year report from your exchange CSV or use dedicated tax software, and confirm with a professional.",
    },
  ];
}

export default function CountryTaxCalculatorPage({ params }: { params: { country: string } }) {
  const c = getCountryCalculator(params.country);
  if (!c) notFound();
  const { meta, jurisdiction: j } = c;
  const faq = buildFaq(meta, j);

  const rows: { label: string; value: string }[] = [
    { label: "Headline treatment", value: j.rateNote },
    { label: "Cost-basis method", value: j.methodLabel },
    { label: "Long-term relief", value: reliefText(j) },
    { label: "Annual allowance", value: j.allowanceLabel },
    { label: "Crypto-to-crypto swaps", value: swapText(j) },
    {
      label: "Losses",
      value: j.lossesDeductible
        ? "Deductible — losses can offset gains."
        : "Not deductible — losses can't offset gains or be carried forward.",
    },
  ];

  const jsonLd = () => [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${j.name} Crypto Tax Calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url: absoluteUrl(`/crypto-tax-calculator/${meta.slug}`),
      description: `Estimate crypto capital gains tax in ${j.name}, with the country's holding relief, allowance and rate applied.`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: site.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-content px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Crypto tax calculator", path: "/crypto-tax-calculator" },
          { name: j.name, path: `/crypto-tax-calculator/${meta.slug}` },
        ])}
      />
      <JsonLd data={jsonLd()} />

      <header className="max-w-3xl">
        <div className="eyebrow">{j.flag} Crypto tax · {j.name} · {TAX_YEAR}</div>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {j.name} <span className="text-gradient">crypto tax</span> calculator
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">{meta.hook}</p>
      </header>

      <div className="max-w-3xl">
        <CountryTaxCalculator jurisdiction={j} />
      </div>

      {/* Funnel to the real product — a full-year report from a CSV. */}
      <div className="mt-6 max-w-3xl">
        <Link
          href="/crypto-tax-report"
          className="card card-hover flex items-center justify-between gap-4 p-5"
        >
          <div>
            <div className="font-semibold">More than one sale? Do your whole {TAX_YEAR} year →</div>
            <p className="muted mt-1 text-sm leading-relaxed">
              Drop in an exchange CSV and get a full {j.name} capital gains report — {j.methodLabel.split(" (")[0]},
              relief and allowances applied across every trade. Free, and nothing leaves your browser.
            </p>
          </div>
          <span className="text-gradient text-2xl font-bold" aria-hidden>→</span>
        </Link>
      </div>

      <AdSlot slot="tax-country" className="mt-10 max-w-3xl" />

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          How crypto tax works in {j.name}
        </h2>
        <dl className="mt-5 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)]">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
              <dt className="text-sm font-semibold">{row.label}</dt>
              <dd className="muted text-sm leading-relaxed">{row.value}</dd>
            </div>
          ))}
        </dl>

        {j.caveats.length > 0 && (
          <div className="mt-6 rounded-xl border border-[var(--border)] p-5">
            <div className="text-sm font-semibold">What this estimate leaves out</div>
            <ul className="muted mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {j.caveats.map((caveat, i) => (
                <li key={i}>{caveat}</li>
              ))}
            </ul>
            <p className="muted mt-3 text-xs">
              The full-year <Link href="/crypto-tax-report" className="underline">CSV report tool</Link> applies
              the method, relief and allowances across all your trades.
            </p>
          </div>
        )}
      </section>

      <div className="mt-10 max-w-3xl">
        <GuideAffiliateCTA kind="tax" placement={`tool-crypto-tax-calculator-${j.id}`} />
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-bold">Keep reading</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href={`/guides/${j.guideSlug}`} className="underline">Full {j.name} crypto tax guide</Link>
            <span className="muted"> — the rules in depth, with sources.</span>
          </li>
          <li>
            <Link href="/crypto-tax-calculator" className="underline">Compare crypto tax by country</Link>
            <span className="muted"> — all {countryCalculators.length} calculators side by side.</span>
          </li>
          <li>
            <Link href="/tools/crypto-tax-calculator" className="underline">Quick capital-gains calculator</Link>
            <span className="muted"> — country-neutral, enter your own rate.</span>
          </li>
        </ul>
      </section>

      <div className="max-w-3xl">
        <FaqSection faq={faq} />
      </div>

      <p className="muted mt-10 max-w-3xl text-xs leading-relaxed">
        This is general information, not tax advice, and a simplified single-sale estimate. Crypto tax rules change
        and depend on your full circumstances — confirm with a qualified professional before filing.
      </p>
    </div>
  );
}
