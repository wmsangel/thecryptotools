import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { unlocksAsOf, unlocksProjectCount, unlocksRowCount } from "@/lib/unlocks/meta";
import { UnlockCalendar } from "./UnlockCalendar";

export const metadata: Metadata = {
  title: "Token Unlock Calendar — Ranked by Share of Circulating Supply",
  description:
    "Upcoming token unlocks ranked by how much of the circulating supply they release, not by dollar value. Cliff releases separated from linear vesting.",
  keywords: [
    "token unlock calendar",
    "crypto unlocks",
    "upcoming token unlocks",
    "vesting schedule crypto",
    "token unlock tracker",
    "crypto cliff unlock",
  ],
  alternates: { canonical: absoluteUrl("/unlocks") },
  openGraph: {
    type: "website",
    title: "Token Unlock Calendar",
    description:
      "Upcoming token unlocks ranked by share of circulating supply — the number that actually predicts impact.",
    url: absoluteUrl("/unlocks"),
    images: [ogImage("unlocks", "Token unlock calendar")],
  },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
    <JsonLd data={breadcrumbJsonLd([{ name: "Token unlocks", path: "/unlocks" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Token Unlock Calendar",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: absoluteUrl("/unlocks"),
          description:
            "Upcoming crypto token unlocks ranked by share of circulating supply.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Token unlocks</span>
      </nav>

      <header>
        <div className="eyebrow">Calendar</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Token unlock calendar
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          {unlocksRowCount.toLocaleString("en-US")} scheduled releases across {unlocksProjectCount}{" "}
          tokens, ranked by how much of the circulating supply each one adds — because that is what
          decides whether an unlock matters, and a dollar ranking just sorts by market cap.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm">
          <span className="font-semibold">{site.editorial.author}</span>
          <span className="muted"> · Schedules and prices read {unlocksAsOf}</span>
          <p className="muted mt-1.5 text-xs leading-relaxed">
            Vesting schedules are fixed months ahead, so the dates and token amounts stay true
            between refreshes. Dollar values are at the price on that date, not live.
          </p>
        </div>
      </header>

      <UnlockCalendar />

      <AdSlot slot="unlocks-below" className="my-10" />

      <section className="mt-8 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">How to read this</h2>

        <h3 className="mt-6 text-lg font-bold">Percentage of float, not dollars</h3>
        <p className="muted mt-2 leading-relaxed">
          A $40 million unlock sounds enormous until you notice the token has a $6 billion float, at
          which point it is less than a day&rsquo;s volume. The same $40 million against a $120
          million float is the only thing that will matter to that token this quarter. Sorting by
          dollar value ranks tokens by market cap with extra steps, which is why every &ldquo;biggest
          unlocks&rdquo; list is the same large caps every week. The default sort here is share of
          circulating supply; you can switch if you want the dollar view.
        </p>

        <h3 className="mt-6 text-lg font-bold">A cliff is an event, a linear vest is weather</h3>
        <p className="muted mt-2 leading-relaxed">
          Cliff unlocks release a block of tokens on one date — those are shown by default. Linear
          vesting drips a slice out every single day, which produces thousands of tiny rows and
          usually reflects emissions the market has already priced. You can turn them on, but expect
          the signal-to-noise ratio to fall through the floor.
        </p>

        <h3 className="mt-6 text-lg font-bold">Who receives it changes what happens</h3>
        <p className="muted mt-2 leading-relaxed">
          An unlock to team and insiders or to private-sale investors behaves differently from one
          into staking rewards or an ecosystem fund. Early investors bought far below market and
          have a much lower bar for selling; a treasury allocation may never reach an exchange at
          all. The category is on every row, with the project&rsquo;s own allocation names beside it.
        </p>

        <h3 className="mt-6 text-lg font-bold">What this does not tell you</h3>
        <p className="muted mt-2 leading-relaxed">
          Whether the price will fall. Unlocks are among the most-watched events in crypto, which
          means they are frequently priced in well before the date — and sometimes the anticipation
          moves the price more than the event. This is a calendar of what is scheduled, not a
          forecast of what it will do.
        </p>

        <h3 className="mt-6 text-lg font-bold">Where the numbers come from</h3>
        <p className="muted mt-2 leading-relaxed">
          Vesting schedules are from DefiLlama&rsquo;s public emissions dataset; prices and
          circulating supplies from CoinGecko, both read on {unlocksAsOf}. Tokenised equities —
          pre-IPO shares wrapped as tokens — are excluded: their &ldquo;unlocks&rdquo; are ordinary
          share lock-up expiries, and the share count and the token supply are not the same thing.{" "}
          <Link href="/editorial-policy" className="font-semibold text-brand-ink hover:underline">
            How we verify things →
          </Link>
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link href="/guides/token-unlocks-and-vesting" className="card card-hover p-4">
            <div className="font-semibold">Token unlocks and vesting explained</div>
            <p className="muted mt-1 text-xs leading-relaxed">
              What a cliff is, why FDV matters, and how to read a vesting chart.
            </p>
          </Link>
          <Link href="/guides/crypto-tokenomics-explained" className="card card-hover p-4">
            <div className="font-semibold">Reading tokenomics</div>
            <p className="muted mt-1 text-xs leading-relaxed">
              The FDV gap, who holds the unissued supply, and whether burns do anything.
            </p>
          </Link>
          <Link href="/tools/token-vesting-dilution-calculator" className="card card-hover p-4">
            <div className="font-semibold">Vesting dilution calculator</div>
            <p className="muted mt-1 text-xs leading-relaxed">
              Work out what a specific unlock does to supply and to your position.
            </p>
          </Link>
          <Link href="/calendar" className="card card-hover p-4">
            <div className="font-semibold">The crypto calendar</div>
            <p className="muted mt-1 text-xs leading-relaxed">
              Tax deadlines, tax year ends, halvings and regulation dates.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
