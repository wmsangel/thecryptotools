import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { DcaBoard } from "./DcaBoard";
import { getStrategyGroups } from "@/lib/dca/build-snapshot";
import { strategyTypes } from "@/lib/dca/strategy-types";
import { pct } from "@/lib/dca/labels";

const TITLE = "Live DCA Strategy Lab — Real-Market Test Results";
const DESC =
  "Automated dollar-cost-averaging (DCA) grid strategies running live on the real market, 24/7. See each strategy's ROI, drawdown, safety-order grid and closed-deal history — genuine results, updated continuously. Not financial advice.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "dca strategy",
    "dca bot results",
    "dollar cost averaging crypto",
    "crypto grid bot performance",
    "dca backtest",
    "paper trading crypto",
    "best dca strategy crypto",
  ],
  alternates: { canonical: absoluteUrl("/dca") },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: absoluteUrl("/dca"),
    images: [ogImage("dca", "Live DCA strategy lab — paper trading results")],
  },
};

function pageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESC,
    url: absoluteUrl("/dca"),
    isFamilyFriendly: true,
  };
}

export default function DcaPage() {
  // Server-rendered explainer + crawlable links into every strategy page. The
  // board above is client-only (live feed), so without this the hub shipped zero
  // internal links to /dca/<slug>/ — crawlers found strategy pages via sitemap
  // only. Grouped by strategy TYPE (entry filter) with a plain-English write-up.
  const groups = getStrategyGroups();
  const byType = strategyTypes
    .map((t) => ({ type: t, list: groups.filter((g) => g.name.startsWith(t.lead)) }))
    .filter((x) => x.list.length > 0);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "DCA strategy lab", path: "/dca" }])} />
      <JsonLd data={pageJsonLd()} />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="max-w-3xl">
          <span className="chip">🧪 Live · real-market test</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Live DCA strategy lab</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Automated dollar-cost-averaging grid strategies running <strong>live against the real market, 24/7</strong>.
            Every number here — ROI, drawdown, the safety-order grid, each closed deal — is a genuine result of the rules
            on live prices, updated continuously. New strategies get added as we test them.
          </p>
        </header>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--muted)]">
          <strong className="text-brand-ink">Live strategy test — not advice.</strong> These strategies run in real time on
          real market prices, so the metrics are genuine outcomes of the rules. Past results never guarantee future returns.
          Try any strategy on a demo account before risking capital — nothing here is a recommendation to buy, sell or copy.
        </div>

        <div className="mt-8">
          <DcaBoard />
        </div>

        <AdSlot slot="dca-mid" className="mt-12" />

        <section className="mt-16">
          <h2 className="text-2xl font-bold sm:text-3xl">The strategies we test</h2>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            Every strategy here is a <strong>DCA grid</strong> — the difference is the <em>entry filter</em>, the rule that
            decides when a new cycle is allowed to start. Here is each type in plain terms, when it tends to work, its
            honest trade-off, and the live tests running it right now.
          </p>
          <div className="mt-8 space-y-10">
            {byType.map(({ type, list }) => (
              <div key={type.id} id={type.id} className="scroll-mt-24 border-t border-[var(--border)] pt-8">
                <h3 className="text-xl font-bold text-brand-ink">{type.title}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{type.tagline}</p>
                <p className="mt-3 max-w-3xl text-[var(--muted)]">{type.description}</p>
                <div className="mt-3 grid max-w-3xl gap-1 sm:grid-cols-2">
                  <p className="text-sm text-[var(--muted)]"><strong className="text-brand-ink">Best in:</strong> {type.whenGood}</p>
                  <p className="text-sm text-[var(--muted)]"><strong className="text-brand-ink">Trade-off:</strong> {type.tradeoff}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {list.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/dca/${g.slug}/`}
                      className="inline-flex items-baseline gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm transition hover:border-[color:var(--muted)] hover:text-brand-ink"
                    >
                      <span className="font-medium">{g.subtitle}</span>
                      <span className="text-xs text-[var(--muted)]">
                        {g.coins} coin{g.coins > 1 ? "s" : ""}{g.avgRoi != null ? ` · avg ${pct(g.avgRoi)}` : ""}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold">How to read this</h2>
          <div className="mt-4 space-y-4 text-[var(--muted)]">
            <p>
              Each strategy is a <strong>DCA grid</strong>: it opens a base position, then places a ladder of
              &quot;safety orders&quot; below it. If price falls, those orders fill and lower the average entry;
              a single take-profit target sits just above the average. The <em>entry filter</em> decides when a new
              cycle is allowed to start.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>ROI</strong> — total profit (realized + open) against the strategy&apos;s allocated capital.</li>
              <li><strong>Realized vs unrealized</strong> — booked profit vs the open position&apos;s current mark. We show the unrealized side on purpose: grid bots can look great on realized profit while a position quietly bleeds.</li>
              <li><strong>Drawdown</strong> — how far the open position is underwater right now.</li>
              <li><strong>Safety-order grid</strong> — every rung, how far below price it sits, and whether it has filled.</li>
            </ul>
            <p>
              The honest caveat: a grid without a stop-loss usually shows a 100% win rate because it only ever
              exits in profit — the risk lives in the open drawdown during a deep, sustained fall, not in the
              closed-deal record. Read both.
            </p>
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold">Run the numbers yourself</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Related href="/tools/dca-calculator" title="DCA calculator" desc="Model your own dollar-cost-averaging plan." />
            <Related href="/guides/dollar-cost-averaging-crypto" title="Dollar-cost averaging, explained" desc="Why DCA works and where it doesn't." />
            <Related href="/guides/grid-trading-explained" title="Grid trading, explained" desc="How the safety-order grid actually works." />
            <Related href="/guides/crypto-trading-bots-explained" title="Crypto trading bots" desc="Automating strategies — the honest version." />
          </div>
        </section>
      </div>
    </>
  );
}

function Related({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-[var(--border)] p-4 transition hover:border-[color:var(--muted)]">
      <div className="font-semibold text-brand-ink">{title} →</div>
      <div className="mt-1 text-sm text-[var(--muted)]">{desc}</div>
    </Link>
  );
}
