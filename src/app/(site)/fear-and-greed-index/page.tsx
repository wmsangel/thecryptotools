import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage, datasetJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { getFearGreed, classify, dayOf } from "@/lib/fear-greed/data";
import { FearGreedBoard } from "./FearGreedBoard";

const PATH = "/fear-and-greed-index";
const data = getFearGreed();
const V = data.current.value;
const LABEL = classify(V);

const TITLE = "Crypto Fear & Greed Index";
const DESCRIPTION = `The crypto Fear & Greed Index is ${V}/100 — ${LABEL} (as of ${dayOf(data.current)}). See today's reading, yesterday, last week and last month, a 180-day chart, what the index measures, and how to read it. Updated daily.`;

export const metadata: Metadata = {
  title: `${TITLE} — Today: ${V} (${LABEL})`,
  description: DESCRIPTION,
  keywords: [
    "crypto fear and greed index",
    "fear and greed index",
    "bitcoin fear and greed index",
    "crypto fear index",
    "fear greed index crypto",
    "crypto market sentiment",
    "crypto fear and greed index today",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "website",
    title: `${TITLE} — ${V} (${LABEL})`,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    images: [ogImage("fear-and-greed-index", "Crypto Fear & Greed Index")],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} — ${V} (${LABEL})`, description: DESCRIPTION },
};

const FAQ = [
  {
    q: "What is the Crypto Fear & Greed Index?",
    a: "It is a 0–100 gauge of overall crypto market sentiment. Low readings (0–24) mean Extreme Fear — investors are anxious and selling; high readings (75–100) mean Extreme Greed — the market may be overheated. The index is published daily by alternative.me and summarises several market signals into one number.",
  },
  {
    q: "How is the index calculated?",
    a: "alternative.me blends several weighted factors: price volatility (25%), market momentum and volume (25%), social-media activity (15%), Bitcoin dominance (10%) and Google Trends (10%), with a survey component (15%) that is currently paused. Each is scored and combined into the final 0–100 value.",
  },
  {
    q: "What do the bands mean?",
    a: "0–24 Extreme Fear, 25–44 Fear, 45–54 Neutral, 55–74 Greed, 75–100 Extreme Greed. The colour on the gauge runs from red (fear) through yellow (neutral) to green (greed).",
  },
  {
    q: "How do people use the Fear & Greed Index?",
    a: "Most use it as a contrarian signal, echoing \"be fearful when others are greedy, and greedy when others are fearful.\" Extreme Fear can flag that an asset is oversold; Extreme Greed can warn of a correction. It measures mood, not value, so it is one input among many — not a buy or sell signal on its own.",
  },
  {
    q: "How often does it update?",
    a: `The index updates once a day. This page shows ${V} (${LABEL}) as of ${dayOf(data.current)} and refreshes to the latest reading when you open it.`,
  },
];

function pageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function FearGreedPage() {
  return (
    <>
      <JsonLd data={pageJsonLd()} />
      <JsonLd data={datasetJsonLd({
        name: "Crypto Fear & Greed Index (daily)",
        description: "Daily Crypto Fear & Greed Index values (0–100) and their classification, with current, yesterday, last-week and last-month readings and a ~1-year history.",
        path: PATH,
        variableMeasured: "Crypto Fear & Greed Index value (0–100)",
        temporalCoverage: `${dayOf(data.history[0])}/${dayOf(data.current)}`,
      })} />
      <JsonLd data={faqJsonLd()} />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs trail={[{ name: "Fear & Greed Index", path: PATH }]} />

        <header className="mt-4 max-w-3xl">
          <span className="chip">😨 Market sentiment · 😤</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Crypto Fear &amp; Greed Index</h1>
          <p className="mt-4 text-lg muted">
            One number for the mood of the whole crypto market, from 0 (Extreme Fear) to 100 (Extreme Greed).
            Today it reads <strong className="text-brand-ink">{V} — {LABEL}</strong>. Updated daily.
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-5 sm:p-7">
          <FearGreedBoard initial={data} />
        </div>

        <AdSlot slot="fng-mid" className="mt-12" />

        <section className="mt-14 max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold">What the Fear &amp; Greed Index is</h2>
          <p className="muted">
            The index condenses the market&apos;s emotional state into a single daily figure. The idea behind it is simple:
            investors get greedy when prices rise and fearful when they fall, and those extremes often mark turning points.
            A reading deep in <strong>Extreme Fear</strong> says the crowd is selling and may have oversold; a reading in
            <strong> Extreme Greed</strong> says the market is euphoric and may be due a cool-off.
          </p>
          <p className="muted">
            It is published daily by alternative.me, the most widely cited source for crypto sentiment. The value above is
            the current reading; the chart shows how mood has swung over the last 180 days.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold">What goes into the number</h2>
          <p className="mt-3 muted">alternative.me combines several weighted signals:</p>
          <ul className="mt-4 space-y-2">
            {[
              ["Volatility — 25%", "How far today's price swings sit above their recent average. Sharp drops read as fear."],
              ["Market momentum & volume — 25%", "Buying volume and momentum versus the recent norm. High greedy volume pushes the index up."],
              ["Social media — 15%", "The pace and sentiment of crypto posts and hashtags."],
              ["Bitcoin dominance — 10%", "A rising BTC share often means fear flowing out of altcoins into \"safer\" Bitcoin."],
              ["Google Trends — 10%", "Search interest in crypto terms, and whether those searches lean fearful."],
              ["Surveys — 15% (currently paused)", "Polls of market participants; alternative.me has this component on hold."],
            ].map(([h, d]) => (
              <li key={h} className="rounded-xl border border-[var(--border)] px-4 py-3">
                <div className="font-semibold text-brand-ink">{h}</div>
                <div className="mt-1 text-sm muted">{d}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold">How to read it</h2>
          <p className="muted">
            Most traders use the index as a <strong>contrarian</strong> gauge — the old line, &quot;be fearful when others
            are greedy, and greedy when others are fearful.&quot; Extreme Fear can be where bottoms form; Extreme Greed can
            precede corrections. But the index measures <em>mood, not value</em>: it says nothing about a specific coin&apos;s
            fundamentals, and markets can stay fearful or greedy far longer than feels reasonable.
          </p>
          <div className="rounded-xl bg-[var(--bg-subtle)] px-4 py-3 text-sm muted">
            Treat it as one input among many, not a buy or sell signal on its own. Nothing here is financial advice.
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold">Put sentiment to work</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Related href="/tools/dca-calculator" title="DCA calculator" desc="Averaging in beats timing the mood swings — model a plan." />
            <Related href="/dca" title="Live DCA strategy lab" desc="See automated strategies run through fear and greed in real time." />
            <Related href="/guides/dollar-cost-averaging-crypto" title="Dollar-cost averaging, explained" desc="Why a schedule tends to beat reacting to sentiment." />
            <Related href="/coins" title="Coin calculators" desc="Profit, market cap and staking math for 60+ coins." />
          </div>
        </section>

        <div className="mt-12">
          <FaqSection faq={FAQ} />
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
