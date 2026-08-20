import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { getDrawdownStudy, type CoinDrawdown } from "@/lib/research/crypto-drawdowns";

const PATH = "/research/crypto-drawdowns";
const TITLE = "How Deep Do Crypto Crashes Go? A Drawdown Study";

const study = getDrawdownStudy();
const avgDepth = study ? Math.round(study.avgWorstDepth) : 80;

const DESCRIPTION = study
  ? `The ${study.count} largest cryptocurrencies have fallen an average of ${avgDepth}% from their peak, and spent roughly ${Math.round(study.avgUnderwater)}% of their history more than 20% underwater. How deep crypto crashes really go, and how long recovery takes — from real daily closes.`
  : "How far the largest cryptocurrencies fall from their peaks, and how long recovery takes, from real daily closes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto drawdown",
    "bitcoin drawdown",
    "how much has crypto fallen",
    "crypto crash history",
    "bitcoin recovery time",
    "crypto maximum drawdown",
    "worst crypto crashes",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    images: [ogImage("research/crypto-drawdowns", "How deep do crypto crashes go?")],
  },
};

const pct = (n: number, d = 0) => n.toLocaleString("en-US", { maximumFractionDigits: d });

/** Days as a readable span, e.g. "1,140 days (~3.1 yr)". */
function span(days: number): string {
  const yr = days / 365.25;
  return yr >= 1 ? `${days.toLocaleString("en-US")} days (~${yr.toFixed(1)} yr)` : `${days} days`;
}

export default function Page() {
  if (!study) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Crypto drawdown study</h1>
        <p className="muted mt-4">The dataset is being rebuilt. Please check back shortly.</p>
      </div>
    );
  }

  const updated = study.through;
  const citation = `TheCryptoTools (${updated.slice(0, 4)}). How Deep Do Crypto Crashes Go? Retrieved from ${absoluteUrl(PATH)}`;
  const stillDown = study.coins.filter((c) => c.belowHighPct > 5).sort((a, b) => b.belowHighPct - a.belowHighPct);

  const FAQS = [
    {
      q: "What is a drawdown in crypto?",
      a: `A drawdown is the fall from a peak to the following trough, measured as a percentage. Across the ${study.count} largest cryptocurrencies the worst drawdown in our data averaged ${avgDepth}% — that is the peak-to-trough loss a holder would have sat through at least once.`,
    },
    {
      q: "How long does crypto take to recover from a crash?",
      a: study.longestRecovery
        ? `Longer than most people expect. Among these assets the longest recovery from a worst-crash trough back to the old peak was ${study.longestRecovery.symbol}, at ${span(study.longestRecovery.recoveryDays as number)}.${study.neverRecovered.length ? ` And ${study.neverRecovered.length} of the ${study.count} have not reclaimed the peak their worst crash fell from at all within our data.` : ""}`
        : "Recovery can take years, and some assets never reclaim their old peak within our window.",
    },
    {
      q: "Which crypto has fallen the most?",
      a: `In our data the deepest single crash among the majors was ${study.deepest.symbol}, down ${pct(study.deepest.depthPct)}% from its ${study.deepest.peakDate} peak to the ${study.deepest.troughDate} trough. Deeper falls exist among smaller coins; this study covers the ten largest.`,
    },
    {
      q: "Does a big drawdown mean the asset is bad?",
      a: "Not on its own — the same assets that fell the hardest also produced the largest long-run gains. The point of measuring drawdown is position sizing and expectations: if you cannot hold through a fall of this size, you will sell at the bottom, and the long-run return becomes irrelevant.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Research", path: "/research" },
        { name: "Crypto drawdowns", path: PATH },
      ])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Crypto maximum drawdown and recovery",
          description: `Worst peak-to-trough drawdown, recovery time, time spent underwater and count of 50%+ crashes for the ${study.count} largest cryptocurrencies, through ${updated}.`,
          url: absoluteUrl(PATH),
          creator: { "@type": "Organization", name: site.organization.name, url: site.url },
          license: "https://creativecommons.org/licenses/by/4.0/",
          isAccessibleForFree: true,
          variableMeasured: "Peak-to-trough drawdown, recovery days, underwater share",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: "2026-08-18",
          dateModified: updated,
          author: { "@type": "Organization", name: site.organization.name, url: site.url },
          publisher: { "@type": "Organization", name: site.organization.name, url: site.url },
          mainEntityOfPage: absoluteUrl(PATH),
          image: ogImage("research/crypto-drawdowns", TITLE).url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <Link href="/research" className="hover:text-brand-ink">Research</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Crypto drawdowns</span>
      </nav>

      <header>
        <div className="eyebrow">Data study · updated {updated}</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          How deep do crypto crashes go?
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          Every price chart shows the climbs. This measures the falls: how far the {study.count} largest
          cryptocurrencies dropped from their peaks, how long the climb back took, and how much of their
          life they spent underwater — from real daily closes.
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
        <div className="text-5xl font-extrabold tracking-tight text-brand-ink sm:text-6xl">−{avgDepth}%</div>
        <p className="mt-2 max-w-2xl text-lg font-medium">
          the average worst drawdown of the {study.count} largest cryptocurrencies — the peak-to-trough
          fall a holder sat through at least once. They also spent about {pct(study.avgUnderwater)}% of
          their history more than 20% below a prior peak.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Key findings</h2>
        <ul className="mt-5 space-y-3">
          {[
            `The deepest single crash in our data was ${study.deepest.symbol}, down ${pct(study.deepest.depthPct)}% from its ${study.deepest.peakDate} peak to the ${study.deepest.troughDate} trough.`,
            study.longestRecovery
              ? `The longest climb back from a worst-crash low was ${study.longestRecovery.symbol}: ${span(study.longestRecovery.recoveryDays as number)} to reclaim the old peak.`
              : "",
            study.neverRecovered.length
              ? `${study.neverRecovered.length} of the ${study.count} — ${study.neverRecovered.map((c) => c.symbol).join(", ")} — have not reclaimed the peak their worst crash fell from within our data.`
              : `Every one of the ${study.count} eventually reclaimed the peak its worst crash fell from.`,
            `${study.mostCrashes.symbol} has endured the most 50%+ crashes in our window: ${study.mostCrashes.crashCount}. A fall of half or more is not a tail event in crypto — it is a recurring feature.`,
            `Even the calmest of the group spent a meaningful share of its life underwater; the average across all ${study.count} is ${pct(study.avgUnderwater)}% of days more than 20% below a prior high.`,
          ]
            .filter(Boolean)
            .map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Every major, ranked by its worst fall</h2>
        <p className="muted mt-2 leading-relaxed">
          Worst peak-to-trough drawdown in our data, how long the climb back took, how many 50%+ crashes
          each has seen, and how far below its own peak it still sits today.
        </p>
        <div className="mt-5 overflow-x-auto" tabIndex={0} role="group" aria-label="Crypto drawdowns table">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-2 pr-3 font-semibold">Asset</th>
                <th className="py-2 pr-3 font-semibold">Worst drawdown</th>
                <th className="py-2 pr-3 font-semibold">To the bottom</th>
                <th className="py-2 pr-3 font-semibold">Recovery</th>
                <th className="py-2 pr-3 font-semibold">50%+ crashes</th>
                <th className="py-2 pr-3 font-semibold">Below peak now</th>
              </tr>
            </thead>
            <tbody>
              {study.coins.map((c: CoinDrawdown) => (
                <tr key={c.slug} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-3 font-semibold">
                    <Link href={`/investment-calculator/${c.slug}`} className="hover:text-brand-ink hover:underline">
                      {c.symbol}
                    </Link>
                  </td>
                  <td className="py-2 pr-3 text-loss">−{pct(c.depthPct)}%</td>
                  <td className="py-2 pr-3">{c.daysToTrough} days</td>
                  <td className="py-2 pr-3">
                    {c.recovered ? span(c.recoveryDays as number) : <span className="text-loss">not yet</span>}
                  </td>
                  <td className="py-2 pr-3">{c.crashCount}</td>
                  <td className="py-2 pr-3">{c.belowHighPct > 1 ? `−${pct(c.belowHighPct)}%` : "at/near high"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted mt-3 text-xs">
          Each asset&apos;s history starts on a different date — Bitcoin&apos;s series runs the longest,
          so figures are bounded by the window we hold, not all-time claims. &quot;Below peak now&quot;
          is the current distance from the highest close in that window.
        </p>
      </section>

      <AdSlot slot="research-below" className="my-10" />

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Why the fall matters more than the return</h2>
        <p className="muted mt-2 leading-relaxed">
          The assets that fell the hardest here are, in many cases, the same ones that produced the
          biggest long-run gains — the two are not opposites, they are the same coin seen from two ends.
          What decides whether an investor actually captured the gain is whether they could hold through
          the fall. A {avgDepth}% drawdown means watching {avgDepth} cents of every dollar disappear and
          not selling; the historical return only belongs to the people who did exactly that. This is the
          honest use of a drawdown figure: not to scare, but to size a position you can hold through the
          worst the asset has actually done, so you are never forced to sell at the bottom.
        </p>
        {stillDown.length > 0 && (
          <p className="muted mt-3 leading-relaxed">
            It is also a reminder that &quot;all-time high&quot; is rarer than the headlines suggest: as
            of {updated}, {stillDown.length} of the {study.count} still sit more than 5% below their own
            in-window peak, led by {stillDown[0].symbol} at −{pct(stillDown[0].belowHighPct)}%.
          </p>
        )}
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Methodology</h2>
        <ul className="muted mt-4 space-y-2 leading-relaxed">
          <li>
            <strong className="text-[var(--text)]">Data:</strong> our own daily closing prices for the{" "}
            {study.count} assets, through {updated}. Each series is as long as we reliably hold; a coin is
            never back-filled before its data begins.
          </li>
          <li>
            <strong className="text-[var(--text)]">Drawdown:</strong> the largest peak-to-trough fall in
            the window, as a positive percentage. Recovery is the number of days from that trough until
            the price first closed back at the old peak — &quot;not yet&quot; where it never has in-window.
          </li>
          <li>
            <strong className="text-[var(--text)]">Underwater:</strong> the share of days spent more than
            20% below the running peak — a fall a holder would actually register, not every minor dip.
          </li>
          <li>
            <strong className="text-[var(--text)]">50%+ crashes</strong> counts distinct episodes where
            the price fell at least half from a running peak before making a new one.
          </li>
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Cite or share this study</h2>
        <p className="muted mt-2 leading-relaxed">
          The figures update as new data comes in. A link back keeps the citation live and lets your
          readers see the current numbers.
        </p>
        <blockquote className="mt-4 rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          {citation}
        </blockquote>
        <p className="muted mt-3 text-sm">
          Want to feel a specific number? The{" "}
          <Link href="/investment-calculator" className="font-semibold text-brand-ink hover:underline">
            investment calculator
          </Link>{" "}
          replays any of these coins day by day, drawdowns included, and the{" "}
          <Link href="/research/crypto-correlation" className="font-semibold text-brand-ink hover:underline">
            correlation study
          </Link>{" "}
          shows why holding several of them together helps less than you would hope in exactly these falls.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/research/crypto-correlation", title: "Crypto correlation study", note: "Why 10 coins diversify less than you think" },
            { href: "/investment-calculator", title: "Investment calculator", note: "Replay any coin, drawdowns and all" },
            { href: "/tools/max-drawdown-calculator", title: "Max drawdown calculator", note: "Work out the drawdown on your own numbers" },
          ].map((r) => (
            <Link key={r.href} href={r.href} className="card card-hover p-4">
              <span className="block font-semibold">{r.title}</span>
              <span className="muted mt-0.5 block text-xs">{r.note}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
