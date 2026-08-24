import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, site } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { getUnlockStudy } from "@/lib/research/token-unlocks";

const PATH = "/research/token-unlocks";
const TITLE = "The Biggest Token Unlocks of the Next 12 Months";

const study = getUnlockStudy();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const prettyDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};
const pct = (n: number | null, d = 1) => (n == null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: d }));
function big(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e12) return "$" + (n / 1e12).toFixed(1) + "T";
  if (a >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (a >= 1e6) return "$" + (n / 1e6).toFixed(0) + "M";
  if (a >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Math.round(n).toLocaleString("en-US");
}

const DESCRIPTION = study
  ? `${big(study.totalUsd)} of crypto tokens unlock in the year from ${study.asOf} — but the dollar total is the wrong number to watch. ${study.over10} of them release more than 10% of their circulating supply in a single cliff. Ranked by share of float, from real vesting-schedule data.`
  : "Upcoming crypto token unlocks ranked by share of circulating supply, not dollars.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "token unlocks",
    "biggest token unlocks",
    "crypto token unlocks 2026",
    "token unlock schedule",
    "crypto vesting unlocks",
    "upcoming token unlocks",
    "token unlock impact",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    images: [ogImage("research/token-unlocks", "The biggest token unlocks of the next 12 months")],
  },
};

export default function Page() {
  if (!study) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Token unlock study</h1>
        <p className="muted mt-4">The dataset is being rebuilt. Please check back shortly.</p>
      </div>
    );
  }

  const citation = `TheCryptoTools (${study.asOf.slice(0, 4)}). The Biggest Token Unlocks of the Next 12 Months. Retrieved from ${absoluteUrl(PATH)}`;

  const FAQS = [
    {
      q: "Why rank token unlocks by share of supply instead of dollars?",
      a: `Because dollars just re-sort by market cap. A ${big(40_000_000)} unlock against a multi-billion float is inside a normal trading day; the same amount against a small float can be more than the token trades in a week. Ranking by share of circulating supply is what actually predicts price impact — it is why the dollar-sorted "biggest unlocks" list is the same large caps every week.`,
    },
    {
      q: "How many tokens unlock more than 10% of their supply in the next year?",
      a: `${study.over10}, as of ${study.asOf} — each releasing, in a single cliff, more than a tenth of everything currently circulating. ${study.over5} release more than 5%, and ${study.over1} more than 1%. Those are the events worth watching.`,
    },
    {
      q: "What is a cliff unlock vs linear vesting?",
      a: "A cliff is one scheduled release on a single date — an event. Linear vesting is a small daily drip from a vesting curve — a background condition. This study counts cliffs, because summing the two would bury every dated event under the constant emissions of whatever token vests fastest.",
    },
    {
      q: "Does a big unlock always crash the price?",
      a: "No. Markets often price a scheduled unlock in advance, and not every unlocked token is sold. But a release larger than a token trades in a week is a real supply shock, and the ones going to team and early investors are the most likely to be sold. Treat share of float as the size of the risk, not a guarantee of a dump.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Research", path: "/research" },
        { name: "Token unlocks", path: PATH },
      ])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Upcoming crypto token unlocks by share of supply",
          description: `Scheduled crypto token cliff unlocks in the 12 months from ${study.asOf}, ranked by share of circulating supply, with dollar value and category.`,
          url: absoluteUrl(PATH),
          creator: { "@type": "Organization", name: site.organization.name, url: site.url },
          license: "https://creativecommons.org/licenses/by/4.0/",
          isAccessibleForFree: true,
          temporalCoverage: `${study.asOf}/${study.windowEnd}`,
          variableMeasured: "Unlock share of circulating supply, USD value",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: "2026-08-24",
          dateModified: study.asOf,
          author: { "@type": "Organization", name: site.organization.name, url: site.url },
          publisher: { "@type": "Organization", name: site.organization.name, url: site.url },
          mainEntityOfPage: absoluteUrl(PATH),
          image: ogImage("research/token-unlocks", TITLE).url,
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
        <span className="text-[var(--text)]">Token unlocks</span>
      </nav>

      <header>
        <div className="eyebrow">Data study · snapshot {study.asOf}</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          The biggest token unlocks of the next 12 months
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          Roughly {big(study.totalUsd)} of vesting tokens are scheduled to unlock across {study.projectCount}{" "}
          projects in the year ahead — but the dollar total is the wrong number to watch. Here is the one
          that actually predicts impact: share of circulating supply.
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
        <div className="text-5xl font-extrabold tracking-tight text-brand-ink sm:text-6xl">{study.over10}</div>
        <p className="mt-2 max-w-2xl text-lg font-medium">
          tokens release more than 10% of their entire circulating supply in a single cliff over the next
          year — more than most of them trade in a week. {study.over5} clear 5%, {study.over1} clear 1%.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Key findings</h2>
        <ul className="mt-5 space-y-3">
          {[
            `${study.over10} cliff unlocks exceed 10% of the token's circulating supply in the year from ${study.asOf}; ${study.over5} exceed 5%. These are supply shocks, not routine emissions.`,
            study.topByPct[0]
              ? `The single biggest by share of float is ${study.topByPct[0].symbol ?? study.topByPct[0].name} — ${pct(study.topByPct[0].pctOfCirculating)}% of its circulating supply in one release on ${prettyDate(study.topByPct[0].date)}.`
              : "",
            `The dollar total (~${big(study.totalUsd)}) is dominated by a few large caps — but by share of supply the list is completely different (see below). That gap is exactly why dollar-ranked unlock lists mislead.`,
            study.categories[0]
              ? `Of the impactful (5%+) unlocks, the largest source is "${study.categories[0].label}" (${study.categories[0].count} of them) — the allocations most likely to actually be sold.`
              : "",
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

      {/* dollar vs % of float — the thesis, made concrete */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Two different “biggest unlocks” lists</h2>
        <p className="muted mt-2 leading-relaxed">
          The same window, ranked two ways. By dollars you get the household names. By share of supply —
          the number that moves a price — you get tokens most people have never seen on an unlock list.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-wide muted">Ranked by dollars</div>
            <ol className="mt-3 space-y-2 text-sm">
              {study.topByDollar.map((r) => (
                <li key={`d-${r.slug}-${r.date}`} className="flex justify-between gap-3 border-b border-[var(--border)] pb-2 last:border-0">
                  <span className="font-semibold">{r.symbol ?? r.name}</span>
                  <span className="muted">{big(r.usd ?? 0)} · {pct(r.pctOfCirculating)}% of float</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="card p-5 ring-1 ring-brand-500/40">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Ranked by share of float</div>
            <ol className="mt-3 space-y-2 text-sm">
              {study.topByPct.map((r) => (
                <li key={`p-${r.slug}-${r.date}`} className="flex justify-between gap-3 border-b border-[var(--border)] pb-2 last:border-0">
                  <span className="font-semibold">{r.symbol ?? r.name}</span>
                  <span className="muted">{pct(r.pctOfCirculating)}% · {big(r.usd ?? 0)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <AdSlot slot="research-below" className="my-10" />

      {/* the full ranked table */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">The 12 biggest unlocks by share of supply</h2>
        <div className="mt-5 overflow-x-auto" tabIndex={0} role="group" aria-label="Biggest token unlocks">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-2 pr-3 font-semibold">Token</th>
                <th className="py-2 pr-3 font-semibold">% of circulating supply</th>
                <th className="py-2 pr-3 font-semibold">Value</th>
                <th className="py-2 pr-3 font-semibold">Date</th>
                <th className="py-2 pr-3 font-semibold">Going to</th>
              </tr>
            </thead>
            <tbody>
              {study.biggest.map((r) => (
                <tr key={`${r.slug}-${r.date}`} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-3 font-semibold">
                    {r.symbol ?? r.name}
                    {r.symbol && <span className="muted block text-xs">{r.name}</span>}
                  </td>
                  <td className="py-2 pr-3 font-semibold text-brand-ink">{pct(r.pctOfCirculating)}%</td>
                  <td className="py-2 pr-3">{r.usd != null ? big(r.usd) : "—"}</td>
                  <td className="py-2 pr-3">{prettyDate(r.date)}</td>
                  <td className="py-2 pr-3 muted">{r.groups?.[0] ?? r.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted mt-3 text-xs">
          Cliff releases only, in the 12 months from {study.asOf}. Share of supply is against circulating
          supply at the snapshot; a low-float token can legitimately unlock more than 100% of what is
          circulating today. Figures are a dated snapshot, not live.
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Why the dollar figure fools people</h2>
        <p className="muted mt-2 leading-relaxed">
          Every unlock tracker leads with dollar value, and every week it surfaces the same handful of
          large caps — because a big market cap mechanically produces a big dollar unlock. But a
          {" "}{big(200_000_000)} release from a {big(20_000_000_000)} token is a rounding error against its daily
          volume, while a {big(20_000_000)} release from a {big(80_000_000)} micro-float is a quarter of everything
          in circulation hitting the market at once. Only the second one is going to move. Share of float is
          the honest ranking, and it is why this list looks nothing like the dollar one above — the tokens
          that will actually feel their unlock are rarely the famous ones.
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Methodology</h2>
        <ul className="muted mt-4 space-y-2 leading-relaxed">
          <li>
            <strong className="text-[var(--text)]">Data:</strong> a dated snapshot of published vesting
            schedules (from DefiLlama&apos;s emissions dataset), taken {study.asOf}, covering the following
            12 months. It is a snapshot, not a live feed — dates and token amounts are fixed by the vesting
            contracts; dollar values are stamped at the snapshot price.
          </li>
          <li>
            <strong className="text-[var(--text)]">Cliffs only:</strong> single scheduled releases, not the
            daily drip of linear vesting — an event, not a background condition.
          </li>
          <li>
            <strong className="text-[var(--text)]">Share of supply</strong> is the release divided by the
            token&apos;s circulating supply at the snapshot. Tokenised equities and obvious data errors
            (impossibly large shares) are excluded so a bad row cannot top the list.
          </li>
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">Cite or share this study</h2>
        <p className="muted mt-2 leading-relaxed">
          The figures refresh as new schedules are published. A link back keeps the citation live.
        </p>
        <blockquote className="mt-4 rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
          {citation}
        </blockquote>
        <p className="muted mt-3 text-sm">
          The full, filterable list of every upcoming release is in the{" "}
          <Link href="/unlocks" className="font-semibold text-brand-ink hover:underline">
            token unlock calendar
          </Link>
          , and the{" "}
          <Link href="/guides/token-unlocks-and-vesting" className="font-semibold text-brand-ink hover:underline">
            unlocks &amp; vesting guide
          </Link>{" "}
          explains how to read one.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/unlocks", title: "Token unlock calendar", note: "Every upcoming release, filterable" },
            { href: "/research/crypto-correlation", title: "Crypto correlation study", note: "Why the majors barely diversify" },
            { href: "/research/crypto-drawdowns", title: "Crypto drawdown study", note: "How deep crypto crashes go" },
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
