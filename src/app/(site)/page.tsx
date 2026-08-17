import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import {
  getActiveCategories,
  getFeaturedTools,
  getPopularTools,
  countByCategory,
  tools,
} from "@/lib/tools/registry";
import { ToolCard } from "@/components/ToolCard";
import { JsonLd } from "@/components/JsonLd";
import { OG_DEFAULT, collectionJsonLd } from "@/lib/seo";
import { AdSlot, AffiliateBanner } from "@/components/ads/AdSlot";
import { MyTools } from "@/components/MyTools";
import { CoinCalcGrid } from "@/components/coins/CoinCalcGrid";
import { featuredCoinCalculators } from "@/lib/coins/featured-pairs";
import { CalendarPeek } from "@/components/calendar/CalendarPeek";
import { calendarEvents } from "@/lib/events/registry";

/**
 * The homepage is our bid for the head term "crypto calculator" (and its
 * variants — crypto calc, crypto tools, crypto trading calculator), so it gets
 * an explicit title rather than inheriting the generic site default.
 */
export const metadata: Metadata = {
  title: `Crypto Calculator — ${tools.length}+ Free Crypto Calculators & Tools`,
  description: `Free crypto calculator suite: profit, DCA, market cap, liquidation, staking and ${tools.length}+ more crypto trading calculators. No signup, runs in your browser.`,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: `Crypto Calculator — ${tools.length}+ Free Crypto Tools | ${site.name}`,
    description: `Free crypto calculator suite: profit, DCA, market cap, liquidation, staking and ${tools.length}+ more crypto trading calculators.`,
    images: [OG_DEFAULT],
  },
};

export default function HomePage() {
  const featured = getFeaturedTools(6);
  const popular = getPopularTools(8);
  const counts = countByCategory();
  const activeCategories = getActiveCategories();

  return (
    <div>
      <JsonLd data={collectionJsonLd(tools)} />
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 py-20 text-center sm:py-28">
          <span className="chip mx-auto mb-6 animate-fade-up">
            ⚡ {tools.length}+ free tools · no signup · works on mobile
          </span>
          <h1 className="mx-auto max-w-4xl animate-fade-up text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Every crypto <span className="text-gradient">calculator</span> you need,
            in one place
          </h1>
          <p className="muted mx-auto mt-6 max-w-2xl animate-fade-up text-lg sm:text-xl">
            {site.description}
          </p>
          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/tools" className="btn-primary btn-lg w-full sm:w-auto">
              Browse all tools →
            </Link>
            <Link href="#categories" className="btn-ghost btn-lg w-full sm:w-auto">
              Explore categories
            </Link>
          </div>

          {/* Quick stat strip */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { n: `${tools.length}+`, l: "Free tools" },
              { n: activeCategories.length, l: "Categories" },
              { n: "0₮", l: "Cost, forever" },
            ].map((s) => (
              <div key={s.l} className="card px-4 py-5">
                <div className="text-3xl font-extrabold text-gradient">{s.n}</div>
                <div className="muted mt-1 text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4">
        {/* Returning visitors land straight on what they used last; renders
            nothing at all for a first-time visitor. */}
        <MyTools className="pt-12" />

        {/* ---------- FEATURE BAND ---------- */}
        {/* h2, not h3: these are the first headings after the h1, and a jump
            from h1 to h3 breaks the outline a screen reader navigates by. */}
        <section className="grid gap-5 py-16 sm:grid-cols-3" aria-label="Why this site">
          {[
            { icon: "⚡", t: "Instant & offline", d: "Everything runs in your browser. No waiting, no accounts, no tracking." },
            { icon: "🎯", t: "Trader-grade", d: "Profit, liquidation, risk, DCA, grid, DeFi — accurate formulas with breakdowns." },
            { icon: "🧩", t: "Always growing", d: `New tools added constantly — ${tools.length}+ and counting across ${activeCategories.length} categories.` },
          ].map((f) => (
            <div key={f.t} className="card card-hover p-6">
              <div className="icon-badge">{f.icon}</div>
              <h2 className="mt-4 text-lg font-bold">{f.t}</h2>
              <p className="muted mt-1 text-sm leading-relaxed">{f.d}</p>
            </div>
          ))}
        </section>

        <AdSlot slot="home-leaderboard" className="mb-16" />

        {/* ---------- FLAGSHIP TOOL ---------- */}
        <section className="pb-16">
          <div className="hero-glow relative overflow-hidden rounded-2xl border border-brand-500/40 p-8 sm:p-10">
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div>
                <span className="chip !px-3 !py-1 text-xs">🆕 New · free · nothing uploaded</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Turn your exchange CSV into a{" "}
                  <span className="text-gradient">crypto tax report</span>
                </h2>
                <p className="muted mt-4 text-base leading-relaxed sm:text-lg">
                  Capital gains for 12 countries, with the right cost-basis method, holding-period
                  relief and allowance already applied. Most tools charge $50–300 a year for this.
                  Here it is free — and it runs entirely in your browser, so your transaction
                  history never leaves your device.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/crypto-tax-report" className="btn-primary btn-lg w-full sm:w-auto">
                    Generate my report →
                  </Link>
                  <Link href="/guides/crypto-tax-by-country" className="btn-ghost btn-lg w-full sm:w-auto">
                    Compare 22 countries
                  </Link>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { icon: "🔒", t: "Nothing is uploaded", d: "There is no server to upload to. Your CSV is read and computed in the browser." },
                  { icon: "🧮", t: "The right method per country", d: "FIFO, adjusted cost base, or HMRC's same-day, 30-day and Section 104 pooling." },
                  { icon: "📅", t: "Holding-period rules applied", d: "Germany's one-year exemption, Australia's 50% discount, Portugal's 365-day rule." },
                  { icon: "🔁", t: "Swaps handled per jurisdiction", d: "Taxable in most places, tax-free in France and Poland, clock-preserving in Portugal." },
                ].map((f) => (
                  <li key={f.t} className="card flex items-start gap-3 p-4">
                    <span className="icon-badge h-9 w-9 shrink-0 text-base">{f.icon}</span>
                    <div>
                      <div className="text-sm font-bold">{f.t}</div>
                      <div className="muted mt-0.5 text-xs leading-relaxed">{f.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- BACKTEST ---------- */}
        <section className="pb-16">
          <div className="card overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div>
                <span className="chip !px-3 !py-1 text-xs">📈 Real prices · 62 coins</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  What if you had <span className="text-gradient">actually invested</span>?
                </h2>
                <p className="muted mt-4 text-base leading-relaxed sm:text-lg">
                  $100 a month into Bitcoin since 2011 would be worth over $20 million today — and
                  would have meant sitting through an 85% fall to get there. Replay any plan against
                  real daily closes and see both halves of the story.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/investment-calculator" className="btn-primary btn-lg w-full sm:w-auto">
                    Run a backtest →
                  </Link>
                  <Link href="/investment-calculator/bitcoin" className="btn-ghost btn-lg w-full sm:w-auto">
                    Bitcoin since 2011
                  </Link>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { icon: "📉", t: "The drawdown, not just the gain", d: "Every backtest shows the deepest fall you would have had to hold through." },
                  { icon: "🗓️", t: "Lump sum or regular buying", d: "Same dates, two strategies — see how much of a result was timing." },
                  { icon: "🧾", t: "Honest annualised figures", d: "CAGR for a lump sum; money-weighted return for a schedule, which is the only fair one." },
                  { icon: "🔌", t: "No API to rate-limit", d: "The history is served from this site, so the page works even when exchanges are down." },
                ].map((f) => (
                  <li key={f.t} className="flex items-start gap-3 rounded-xl bg-[var(--bg-subtle)] px-4 py-3">
                    <span className="text-lg">{f.icon}</span>
                    <div>
                      <div className="text-sm font-bold">{f.t}</div>
                      <div className="muted mt-0.5 text-xs leading-relaxed">{f.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- CALENDAR ---------- */}
        <section className="pb-16">
          <div className="card overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <span className="chip !px-3 !py-1 text-xs">🗓️ Known in advance</span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  What is <span className="text-gradient">coming up</span>
                </h2>
                <p className="muted mt-4 text-base leading-relaxed sm:text-lg">
                  Tax deadlines and tax year ends in 14 countries, halvings estimated from live
                  block heights, and the regulatory dates already written into law. The year ends
                  are the ones that cost money — an unused allowance does not carry forward.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/calendar" className="btn-primary btn-lg w-full sm:w-auto">
                    Open the calendar →
                  </Link>
                  <Link href="/unlocks" className="btn-ghost btn-lg w-full sm:w-auto">
                    Token unlocks
                  </Link>
                </div>
              </div>

              <CalendarPeek
                events={calendarEvents}
                buildDate={new Date().toISOString().slice(0, 10)}
                limit={5}
              />
            </div>
          </div>
        </section>

        {/* ---------- FEATURED ---------- */}
        <section className="pb-16">
          <SectionHead eyebrow="Hand-picked" title="Featured tools" href="/tools" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <ToolCard key={t.slug} tool={t} large />
            ))}
          </div>
        </section>

        {/* ---------- POPULAR COIN CALCULATORS ---------- */}
        <section className="pb-16">
          <SectionHead
            eyebrow="By coin"
            title="Popular coin calculators"
            href="/coins"
          />
          <p className="muted mt-3 max-w-2xl">
            The same calculators, preloaded with each coin&apos;s live price, realistic defaults and a
            read of its own recent history — profit, DCA and staking for the most-searched assets.
          </p>
          <div className="mt-8">
            <CoinCalcGrid items={featuredCoinCalculators(12)} />
          </div>
        </section>

        {/* ---------- CATEGORIES ---------- */}
        <section id="categories" className="scroll-mt-28 pb-16">
          <SectionHead eyebrow="Browse by topic" title="Explore categories" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="card card-hover group flex items-start gap-4 p-6"
              >
                <span className="icon-badge">{c.icon}</span>
                <div>
                  <div className="flex items-center gap-2 font-bold group-hover:text-brand-ink">
                    {c.title}
                    <span className="chip !px-2 !py-0.5 text-xs">{counts[c.id] ?? 0}</span>
                  </div>
                  <p className="muted mt-1.5 line-clamp-2 text-sm leading-relaxed">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- POPULAR + sidebar ---------- */}
        <section className="grid gap-8 pb-16 lg:grid-cols-[1fr_300px]">
          <div>
            <SectionHead eyebrow="Most used" title="Popular tools" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {popular.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
          {/* A plain div: <aside> is a complementary landmark, and nesting one
              inside <main> is a landmark structure error. */}
          <div className="space-y-4 lg:pt-20">
            <AffiliateBanner />
            <AdSlot slot="home-sidebar" />
          </div>
        </section>

        {/* ---------- SEO COPY ---------- */}
        <section className="pb-16">
          <SectionHead eyebrow="Start here" title="What can you calculate?" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="muted space-y-4 text-base leading-relaxed">
              <p>
                A crypto calculator turns the numbers you already have — an entry price, a
                position size, a reward rate — into the one you actually need. Most traders
                end up doing the same handful of sums by hand in a notes app:{" "}
                <em>what did that trade make after fees, where does this leverage get me
                liquidated, what is my real average entry after averaging down.</em> Each of
                those is a tool here, and every one of them runs entirely in your browser.
                Nothing you type is uploaded, stored or logged.
              </p>
              <p>
                The catalog covers five broad jobs. <strong>Trading maths</strong> — profit
                and ROI, position sizing, risk/reward, stop-loss and take-profit levels, win
                rate and expectancy. <strong>Futures</strong> — liquidation price, leverage,
                funding, PnL. <strong>Portfolio</strong> — average entry, rebalancing,
                drawdown, volatility and tax. <strong>Market and token data</strong> — market
                cap, fully diluted valuation, tokenomics and unlock dilution.{" "}
                <strong>Earning</strong> — staking rewards, APY, compound interest and mining
                profitability. Where a calculation needs a live price, there is a button to
                pull one in.
              </p>
              <p>
                Everything is free and there is no account. If you want the reasoning behind a
                number rather than just the number, most tools link to a{" "}
                <Link href="/guides" className="font-semibold text-brand-ink hover:underline">
                  guide
                </Link>{" "}
                explaining the formula, and the majors have their own{" "}
                <Link href="/coins" className="font-semibold text-brand-ink hover:underline">
                  coin-specific calculators
                </Link>{" "}
                prefilled with live prices.
              </p>
            </div>
            <div className="card p-6">
              <div className="eyebrow">Most searched</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { href: "/tools/profit-calculator", label: "Crypto profit & trade calculator" },
                  { href: "/tools/market-cap-calculator", label: "Crypto market cap calculator" },
                  { href: "/tools/dca-calculator", label: "Free crypto DCA calculator" },
                  { href: "/tools/dca-bot-calculator", label: "DCA bot calculator" },
                  { href: "/tools/compound-interest-calculator", label: "Crypto compound interest calculator" },
                  { href: "/tools/liquidation-calculator", label: "Liquidation price calculator" },
                  { href: "/tools/win-rate-calculator", label: "Win rate calculator" },
                  { href: "/tools/tokenomics-calculator", label: "Crypto tokenomics calculator" },
                  { href: "/tools/stop-loss-take-profit-calculator", label: "Crypto stop loss calculator" },
                  { href: "/tools/staking-rewards-calculator", label: "Staking rewards calculator" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-brand-ink hover:underline">
                      → {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- CTA BAND ---------- */}
      <section className="relative overflow-hidden border-t border-[var(--border)]">
        <div className="hero-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-content px-4 py-20 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Start calculating in <span className="text-gradient">seconds</span>
          </h2>
          <p className="muted mx-auto mt-3 max-w-xl">
            No signup. No paywall. Just fast, free crypto tools.
          </p>
          <Link href="/tools" className="btn-primary btn-lg mt-8">
            Open all tools →
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-brand-ink hover:underline">
          View all →
        </Link>
      )}
    </div>
  );
}
