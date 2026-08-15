import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, site } from "@/lib/site";
import { ogImage } from "@/lib/seo";
import { platforms } from "@/lib/platforms";
import { compareData, CHECKED_ON } from "@/lib/compare/data";
import { getPair, pairSlug, validPairs } from "@/lib/compare/pairs";
import { JsonLd } from "@/components/JsonLd";
import { PlatformLogo } from "@/components/PlatformLogo";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";

export const dynamicParams = false;

export function generateStaticParams() {
  return validPairs().map((p) => ({ pair: pairSlug(p) }));
}

const platformBySlug = new Map(platforms.map((p) => [p.slug, p]));

export function generateMetadata({ params }: { params: { pair: string } }): Metadata {
  const pair = getPair(params.pair);
  const a = pair && platformBySlug.get(pair.a);
  const b = pair && platformBySlug.get(pair.b);
  if (!pair || !a || !b) return {};

  const title = `${a.name} vs ${b.name} — Which Should You Use?`;
  const description = `${a.name} vs ${b.name} compared on the things that do not change every month: who can open an account, who holds the keys, what each actually does, and the history worth knowing.`;
  return {
    title,
    description,
    keywords: [
      `${a.name.toLowerCase()} vs ${b.name.toLowerCase()}`,
      `${b.name.toLowerCase()} vs ${a.name.toLowerCase()}`,
      `${a.name.toLowerCase()} or ${b.name.toLowerCase()}`,
      `compare ${a.name.toLowerCase()} ${b.name.toLowerCase()}`,
    ],
    alternates: { canonical: absoluteUrl(`/compare/${params.pair}`) },
    openGraph: {
      type: "article",
      title,
      description,
      url: absoluteUrl(`/compare/${params.pair}`),
      images: [ogImage(`compare/${params.pair}`, title)],
    },
  };
}

/** Rows are the same for every pair, so the table always compares like with like. */
const ROWS = [
  { key: "founded", label: "Launched" },
  { key: "base", label: "Based / registered" },
  { key: "custody", label: "Who holds the assets" },
  { key: "kyc", label: "Identity verification" },
  { key: "us", label: "Available to US residents" },
] as const;

/** Heading, explanation and follow-up for the cost section, per category. */
function costSection(category: string): { heading: string; blurb: string; footer: React.ReactNode } {
  if (category === "wallet") {
    return {
      heading: "What do they cost?",
      blurb:
        "Both are one-off hardware purchases, and both run several models at different prices. We do not reprint a price list — it would be wrong the next time either runs a sale — so here are the official shops:",
      footer: (
        <p className="muted mt-4 text-sm leading-relaxed">
          Buy direct from the manufacturer, never from a marketplace listing. A hardware wallet
          bought second-hand or from a reseller can arrive pre-initialised with somebody else&rsquo;s
          recovery phrase, and the coins leave the moment you fund it.{" "}
          <Link href="/guides/how-to-choose-a-hardware-wallet" className="font-semibold text-brand-ink hover:underline">
            How to choose one →
          </Link>
        </p>
      ),
    };
  }
  if (category === "tax") {
    return {
      heading: "What do they cost?",
      blurb:
        "Both charge per tax year, and both scale the price with how many transactions you have — which means the cost depends entirely on your own history rather than on a headline number. Check yours against the live pricing:",
      footer: (
        <p className="muted mt-4 text-sm leading-relaxed">
          Before paying for either, it is worth trying{" "}
          <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
            our own tax report generator
          </Link>{" "}
          — it is free, covers 12 countries, and runs in your browser. For a straightforward history
          it may be all you need; for years of DeFi it will show you what you are up against.
        </p>
      ),
    };
  }
  if (category === "trading" || category === "earn") {
    return {
      heading: "What do they cost?",
      blurb:
        "Both are subscriptions with tiers, and both change their plans regularly. Rather than print a table that goes stale, here is each one&rsquo;s live pricing:",
      footer: (
        <p className="muted mt-4 text-sm leading-relaxed">
          Remember the subscription is not the only cost — every trade a bot makes still pays your
          exchange&rsquo;s fee.{" "}
          <Link href="/tools/trading-fee-calculator" className="font-semibold text-brand-ink hover:underline">
            The fee calculator
          </Link>{" "}
          will show you what a high-frequency strategy actually costs to run.
        </p>
      ),
    };
  }
  return {
    heading: "What about the fees?",
    blurb:
      "We do not print a fee table, and the reason is not laziness. Fee schedules change without notice — Kraken rebuilt its tier system in July 2026 — and a stale number on a page that earns from its links is worse than no number at all. So here are both live schedules, from the source:",
    footer: (
      <p className="muted mt-4 text-sm leading-relaxed">
        Once you have both numbers,{" "}
        <Link href="/tools/trading-fee-calculator" className="font-semibold text-brand-ink hover:underline">
          the trading fee calculator
        </Link>{" "}
        turns them into what a year of your actual trading would cost — which is the number that
        decides this, not the headline rate.
      </p>
    ),
  };
}

export default function Page({ params }: { params: { pair: string } }) {
  const pair = getPair(params.pair);
  const a = pair && platformBySlug.get(pair.a);
  const b = pair && platformBySlug.get(pair.b);
  if (!pair || !a || !b) notFound();

  const da = compareData[pair.a];
  const db = compareData[pair.b];
  const productLabel =
    a.category === "wallet" ? "Supports" : a.category === "tax" ? "Includes" : "Products";
  const cost = costSection(a.category);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${a.name} vs ${b.name}`,
            datePublished: CHECKED_ON,
            dateModified: CHECKED_ON,
            author: { "@type": "Organization", name: site.editorial.author, url: absoluteUrl(site.editorial.policyPath) },
            publisher: {
              "@type": "Organization",
              name: site.name,
              url: absoluteUrl("/"),
              logo: { "@type": "ImageObject", url: absoluteUrl(site.organization.logo) },
            },
            mainEntityOfPage: absoluteUrl(`/compare/${params.pair}`),
          },
          ...(pair.faq?.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: pair.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                },
              ]
            : []),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Compare", item: absoluteUrl("/compare") },
              { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: absoluteUrl(`/compare/${params.pair}`) },
            ],
          },
        ]}
      />

      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-brand-ink">Compare</Link>
        <span>/</span>
        <span className="text-[var(--text)]">{a.name} vs {b.name}</span>
      </nav>

      <header>
        <div className="flex items-center gap-3">
          <span className="icon-badge"><PlatformLogo slug={a.slug} name={a.name} emoji={a.icon} className="text-xl" /></span>
          <span className="muted text-sm font-semibold">vs</span>
          <span className="icon-badge"><PlatformLogo slug={b.slug} name={b.name} emoji={b.icon} className="text-xl" /></span>
        </div>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {a.name} vs {b.name}
        </h1>
        <p className="muted mt-3 text-lg leading-relaxed">{pair.intro}</p>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm">
          <span className="font-semibold">{site.editorial.author}</span>
          <span className="muted"> · Checked {CHECKED_ON}</span>
          <p className="muted mt-1.5 text-xs leading-relaxed">
            Both links below are affiliate links —{" "}
            <Link href="/affiliate-disclosure" className="font-semibold text-brand-ink hover:underline">
              what that means
            </Link>
            . It does not change what is written here; every entry carries a drawback for the same
            reason.
          </p>
        </div>
      </header>

      <AdSlot slot="compare-top" className="my-8" />

      {/* ---- The verdict, first ---- */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Short answer</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { p: a, d: da, why: pair.pickA },
            { p: b, d: db, why: pair.pickB },
          ].map(({ p, d, why }) => (
            <div key={p.slug} className="card p-6">
              <div className="flex items-center gap-2">
                <PlatformLogo slug={p.slug} name={p.name} emoji={p.icon} className="text-lg" />
                <span className="font-bold">Choose {p.name} if…</span>
              </div>
              <p className="muted mt-3 text-sm leading-relaxed">{why}</p>
              <a
                href={p.url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                data-affiliate={p.slug}
                data-affiliate-placement={`compare-${params.pair}`}
                className="btn-primary mt-5 w-full justify-center"
              >
                Visit {p.name} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Side by side ---- */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Side by side</h2>
        <div className="card mt-5 overflow-x-auto p-0" tabIndex={0} role="group" aria-label="Comparison table, scrolls horizontally">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                {/* The corner cell labels the row headers below it; a blank
                    <th> gives a screen reader nothing to announce the column by. */}
                <th className="px-4 py-3 text-xs font-semibold muted" scope="col">
                  <span className="sr-only">What is being compared</span>
                </th>
                <th className="px-4 py-3 font-bold">{a.name}</th>
                <th className="px-4 py-3 font-bold">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key} className="border-b border-[var(--border)] align-top last:border-0">
                  <th scope="row" className="px-4 py-3 text-left text-xs font-semibold muted">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 leading-snug">{da[row.key]}</td>
                  <td className="px-4 py-3 leading-snug">{db[row.key]}</td>
                </tr>
              ))}
              <tr className="align-top">
                <td className="px-4 py-3 text-xs font-semibold muted">{productLabel}</td>
                {[da, db].map((d, i) => (
                  <td key={i} className="px-4 py-3">
                    <ul className="space-y-1">
                      {d.products.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 leading-snug">
                          <span className="mt-0.5 text-brand-ink">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- Strength and caveat ---- */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">What each one is actually good at</h2>
        <div className="mt-5 space-y-5">
          {[
            { p: a, d: da },
            { p: b, d: db },
          ].map(({ p, d }) => (
            <div key={p.slug} className="card p-6">
              <div className="flex items-center gap-2">
                <PlatformLogo slug={p.slug} name={p.name} emoji={p.icon} className="text-lg" />
                <span className="font-bold">{p.name}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{d.standout}</p>
              <p className="mt-3 rounded-xl border-l-4 border-amber-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm leading-relaxed">
                <strong>Worth knowing.</strong> {d.watchOut}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Cost ----
          Category-aware, because "fees" means four different things here. An
          exchange has a trading schedule that changes monthly; a hardware
          wallet is a one-off purchase; tax software is billed per tax year;
          a bot is a subscription. Rendering the exchange wording on a
          Ledger-vs-Trezor page produced a paragraph about Kraken's fee tiers
          under a comparison of two USB devices. */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">{cost.heading}</h2>
        <p className="muted mt-3 leading-relaxed">{cost.blurb}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { p: a, d: da },
            { p: b, d: db },
          ].map(({ p, d }) => (
            <a
              key={p.slug}
              href={d.feesUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="card card-hover flex items-center justify-between gap-3 p-4"
            >
              <span className="font-semibold">{p.name} pricing</span>
              <span className="muted text-xs">official page ↗</span>
            </a>
          ))}
        </div>
        {cost.footer}
      </section>

      {pair.faq?.length ? <FaqSection faq={pair.faq} /> : null}

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Before you commit</h2>
        <p className="muted mt-3 leading-relaxed">
          Availability changes. Regulators bar platforms, platforms withdraw from markets, and this
          page was last checked on {CHECKED_ON} — confirm on the platform&rsquo;s own terms that it
          serves your country before you sign up.
        </p>
        {a.category === "exchange" && (
          <p className="muted mt-3 leading-relaxed">
            And whichever you pick: an exchange balance is a trading float, not storage. Anything
            you are not actively trading belongs in{" "}
            <Link href="/guides/how-to-move-crypto-off-an-exchange" className="font-semibold text-brand-ink hover:underline">
              a wallet you hold the keys to
            </Link>
            .
          </p>
        )}
        {a.category === "wallet" && (
          <p className="muted mt-3 leading-relaxed">
            And whichever you pick, the device is the easy half. The recovery phrase is what
            actually protects the coins —{" "}
            <Link href="/guides/how-to-store-a-seed-phrase" className="font-semibold text-brand-ink hover:underline">
              how to store one properly
            </Link>{" "}
            matters more than which brand you bought.
          </p>
        )}
        {a.category === "tax" && (
          <p className="muted mt-3 leading-relaxed">
            And before paying either: the rules for your own country decide most of the answer.{" "}
            <Link href="/guides/crypto-tax-by-country" className="font-semibold text-brand-ink hover:underline">
              Crypto tax in 22 countries
            </Link>{" "}
            covers what the software is actually applying on your behalf.
          </p>
        )}
      </section>

      <div className="mt-12 border-t border-[var(--border)] pt-6">
        <Link href="/compare" className="text-sm font-semibold text-brand-ink hover:underline">
          ← All comparisons
        </Link>
      </div>
    </div>
  );
}
