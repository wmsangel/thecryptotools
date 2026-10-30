import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { halvingData, halvingComputedAt } from "@/lib/events/halving-data";
import { HalvingCountdown } from "./HalvingCountdown";

const path = "/crypto-halving-countdown";
const coinList = halvingData.map((h) => h.name).join(", ").replace(/, ([^,]*)$/, " and $1");

export const metadata: Metadata = {
  title: "Crypto Halving Countdown — Bitcoin, Litecoin, Bitcoin Cash & Zcash",
  description:
    "Live halving countdowns for Bitcoin, Litecoin, Bitcoin Cash and Zcash, each estimated from the chain's current block height — with the block, reward change and source shown. Dates drift, so every one is marked an estimate.",
  keywords: [
    "crypto halving countdown",
    "bitcoin halving countdown",
    "litecoin halving countdown",
    "bitcoin cash halving",
    "zcash halving",
    "next halving dates",
    "crypto halving dates",
    "when is the next halving",
  ],
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    title: "Crypto Halving Countdown — Bitcoin, Litecoin, Bitcoin Cash & Zcash",
    description:
      "Live, block-height countdowns to the next halving on every proof-of-work chain we track. Each estimate names the block and source it came from.",
    images: [ogImage("calendar", "Crypto halving countdown")],
  },
};

const FAQ = [
  {
    q: "When is the next Bitcoin halving?",
    a: `The next Bitcoin halving is at block 1,050,000, estimated around ${new Date(halvingData.find((h) => h.slug === "bitcoin")?.estimatedISO ?? "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}. The subsidy drops from 3.125 to 1.5625 BTC. The exact day shifts with block times, so treat it as an estimate.`,
  },
  {
    q: "Why is a halving date only an estimate?",
    a: "A halving is triggered by a block number, not a calendar date. The date is projected from the chain's current height and its target block time, so it moves as hash rate changes — faster blocks pull it earlier. That is why every date here is shown as 'around' and names the block height it was computed from.",
  },
  {
    q: "What happens at a halving?",
    a: "The block subsidy paid to miners is cut in half, halving the rate at which new coins are created. It does not change anyone's balance; it only slows new supply. On Bitcoin this has happened roughly every four years and is why supply is capped at 21 million.",
  },
  {
    q: "Which coins have a halving?",
    a: `${coinList} all halve on a fixed block schedule and are shown above. Many coins do not halve at all — Dogecoin pays a fixed reward, Monero has a flat tail emission, and Ethereum is proof-of-stake with no halving.`,
  },
  {
    q: "Do all these coins halve at the same time?",
    a: "No. Bitcoin and Bitcoin Cash share the same 210,000-block schedule so they land close together, around 2028. Litecoin halves every 840,000 blocks at a faster block time (next around 2027), and Zcash halves every 1,680,000 blocks (next around November 2028).",
  },
];

export default function Page() {
  const jsonLd = [
    breadcrumbJsonLd([{ name: "Halving countdown", path }]),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Crypto Halving Countdown",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url: absoluteUrl(path),
      description:
        "Live halving countdowns for Bitcoin, Litecoin, Bitcoin Cash and Zcash, estimated from current block heights.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: site.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-content px-4 py-10">
      <JsonLd data={jsonLd} />
      <Breadcrumbs trail={[{ name: "Halving countdown", path }]} />

      <header className="max-w-3xl">
        <div className="eyebrow">Live · estimated from block height</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto <span className="text-gradient">halving</span> countdown
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          The next halving on every proof-of-work chain we track — {coinList} — counted down live.
          Each estimate is derived from the chain&apos;s current block height and its target block
          time, not copied from anyone, and every card names the block and the source it came from.
        </p>
      </header>

      <div className="mt-8">
        <HalvingCountdown data={halvingData} computedAt={halvingComputedAt} />
      </div>

      <AdSlot slot="halving-below" className="my-10" />

      <section className="mt-6 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">What a halving actually is</h2>
        <p className="muted mt-4 leading-relaxed">
          On a proof-of-work chain, miners earn a <strong>block subsidy</strong> — newly created coins
          paid for each block they add. At fixed intervals the protocol cuts that subsidy in half. It
          changes nobody&apos;s balance and moves no coins; it simply halves the rate at which new
          supply enters. Bitcoin has done this every 210,000 blocks — about four years — since 2012,
          and it is the mechanism behind its 21-million cap.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold tracking-tight sm:text-3xl">Why every date here says &ldquo;around&rdquo;</h2>
        <p className="muted mt-4 leading-relaxed">
          A halving is a <em>block number</em>, not a date. The only honest way to put a day on it is
          to take how many blocks are left and multiply by the chain&apos;s target block time. That
          projection drifts: when hash rate rises blocks come faster and the halving arrives earlier;
          when it falls, later. So we compute each estimate from the live tip rather than hardcoding a
          date — the arithmetic re-corrects itself every time the chains are read, and each card shows
          the block height it was computed from so you can check it against a block explorer yourself.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold tracking-tight sm:text-3xl">Coins that don&apos;t have a halving</h2>
        <p className="muted mt-4 leading-relaxed">
          Plenty of major coins never halve — a countdown for them would be fiction:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted">
              <strong className="text-[var(--text)]">Dogecoin</strong> pays a fixed 10,000 DOGE per
              block with no end — a steady, uncapped issuance since 2015, not a halving schedule.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted">
              <strong className="text-[var(--text)]">Monero</strong> switched to a flat <em>tail
              emission</em> of 0.6 XMR per block in 2022, so its reward no longer halves at all.
            </span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted">
              <strong className="text-[var(--text)]">Ethereum</strong> is proof-of-stake: issuance
              scales with how much ETH is staked and is partly offset by fee burning — there is no
              halving event.
            </span>
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-extrabold tracking-tight sm:text-3xl">How these are computed</h2>
        <p className="muted mt-4 leading-relaxed">
          For each chain we read the current block height live, find the next block that is a halving
          boundary, and project the date from the blocks remaining at the protocol&apos;s target block
          time. Heights come from the sources linked on each card. The halving intervals and rewards
          are protocol constants: Bitcoin and Bitcoin Cash halve every 210,000 blocks, Litecoin every
          840,000, and Zcash every 1,680,000 since its Blossom upgrade. Block heights were last read{" "}
          {halvingComputedAt}.
        </p>
      </section>

      <div className="max-w-3xl">
        <FaqSection faq={FAQ} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/calendar" className="card card-hover p-4">
            <div className="font-semibold">Crypto calendar</div>
            <p className="muted mt-1 text-xs leading-relaxed">Halvings, tax deadlines and regulation dates in one place.</p>
          </Link>
          <Link href="/bitcoin-stock-to-flow" className="card card-hover p-4">
            <div className="font-semibold">Bitcoin stock-to-flow</div>
            <p className="muted mt-1 text-xs leading-relaxed">The scarcity model the halving feeds, charted.</p>
          </Link>
          <Link href="/unlocks" className="card card-hover p-4">
            <div className="font-semibold">Token unlock calendar</div>
            <p className="muted mt-1 text-xs leading-relaxed">Scheduled releases ranked by share of supply.</p>
          </Link>
        </div>
      </section>

      <p className="muted mt-10 max-w-3xl text-xs leading-relaxed">
        Estimates for information only, not financial advice. Halving dates are projections from live
        block heights and shift with network hash rate — confirm against a block explorer before
        relying on any specific day.
      </p>
    </div>
  );
}
