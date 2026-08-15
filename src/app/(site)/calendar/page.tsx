import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { calendarEvents } from "@/lib/events/registry";
import { CalendarView } from "./CalendarView";

export const metadata: Metadata = {
  title: "Crypto Calendar — Tax Deadlines, Halvings and Regulation Dates",
  description:
    "Every crypto date worth knowing in advance: tax deadlines and tax year ends in 14 countries, halvings estimated from live block heights, and regulatory milestones already written into law.",
  keywords: [
    "crypto calendar",
    "crypto tax deadline",
    "crypto tax deadline 2027",
    "bitcoin halving date",
    "litecoin halving",
    "crypto events calendar",
    "tax year end crypto",
  ],
  alternates: { canonical: absoluteUrl("/calendar") },
  openGraph: {
    type: "website",
    title: "Crypto Calendar — Deadlines, Halvings and Regulation",
    description:
      "Tax deadlines and tax year ends across 14 countries, halving estimates and regulatory milestones — everything that is known in advance.",
    url: absoluteUrl("/calendar"),
    images: [ogImage("calendar", "Crypto calendar")],
  },
};

export default function Page() {
  const taxCountries = new Set(
    calendarEvents.filter((e) => e.category === "tax" && e.country).map((e) => e.country!.name),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">

    <JsonLd data={breadcrumbJsonLd([{ name: "Calendar", path: "/calendar" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Crypto Calendar",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: absoluteUrl("/calendar"),
          description:
            "Crypto tax deadlines, tax year ends, halving estimates and regulatory milestones.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Calendar</span>
      </nav>

      <header>
        <div className="eyebrow">What is coming</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          The crypto calendar
        </h1>
        <p className="muted mt-3 text-lg leading-relaxed">
          Everything that is known in advance: tax dates in {taxCountries.size} countries — filing
          deadlines, and the tax year ends that decide whether a loss is still usable — halvings
          estimated from live block heights, and the regulatory dates already written into law.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm">
          <span className="font-semibold">{site.editorial.author}</span>
          <p className="muted mt-1.5 text-xs leading-relaxed">
            Deadlines are for individuals filing their own return — an accountant usually extends
            them. Each entry links to our full guide for that country, which carries the primary
            source it was checked against.
          </p>
        </div>
      </header>

      {/* The day this HTML was generated. The client renders from it first so
          hydration matches the exported markup, then switches to the visitor's
          real today — see CalendarView. */}
      <CalendarView events={calendarEvents} buildDate={new Date().toISOString().slice(0, 10)} />

      <AdSlot slot="calendar-below" className="my-10" />

      <section className="mt-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Why this calendar is short</h2>
        <p className="muted mt-3 leading-relaxed">
          There is no news here, and no &ldquo;expected&rdquo; dates. Every entry is either written
          into law, fixed by a protocol, or computed from a block height — things that will still be
          true next month whether or not anybody updates this page.
        </p>
        <p className="muted mt-3 leading-relaxed">
          Deliberately missing: ETF decision deadlines, exchange listings, conference schedules and
          rumoured network upgrades. Those move without notice, and a calendar that is confidently
          wrong about a date is worse than one that stays quiet about it.
        </p>

        <h3 className="mt-6 text-lg font-bold">The dates most people miss</h3>
        <p className="muted mt-3 leading-relaxed">
          Filing deadlines get attention; <strong>tax year ends</strong> do not, and they are the
          ones that cost money. The UK&rsquo;s £3,000 annual exempt amount vanishes on 5 April if
          unused. Realising a loss on 1 January instead of 31 December moves the relief a whole year
          away. Ireland wants payment on 15 December — almost a year before the return is even due.
        </p>
        <p className="muted mt-3 leading-relaxed">
          If a loss is what you are planning around,{" "}
          <Link href="/tools/tax-loss-harvesting-calculator" className="font-semibold text-brand-ink hover:underline">
            the tax-loss harvesting calculator
          </Link>{" "}
          shows what realising it is actually worth, and{" "}
          <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
            the tax report
          </Link>{" "}
          works out the whole year for your jurisdiction.
        </p>

        <h3 className="mt-6 text-lg font-bold">Why halvings say &ldquo;around&rdquo;</h3>
        <p className="muted mt-3 leading-relaxed">
          A halving is a block number, not a date. The estimate is derived from the chain&rsquo;s
          current height and its target block time, so it moves as hash rate changes — faster blocks
          pull it earlier. Every halving entry names the height it was computed from.{" "}
          <Link href="/tools/halving-countdown" className="font-semibold text-brand-ink hover:underline">
            The live countdown →
          </Link>
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link href="/unlocks" className="card card-hover p-4">
            <div className="font-semibold">Token unlock calendar</div>
            <p className="muted mt-1 text-xs leading-relaxed">
              Scheduled releases ranked by share of circulating supply.
            </p>
          </Link>
          <Link href="/guides/crypto-tax-by-country" className="card card-hover p-4">
            <div className="font-semibold">Crypto tax in 22 countries</div>
            <p className="muted mt-1 text-xs leading-relaxed">
              Rates, allowances and whether swaps are taxable, compared.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
