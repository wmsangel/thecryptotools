import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { historyThrough } from "@/lib/backtest/history-index";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { PortfolioApp } from "./PortfolioApp";
import { portfolioCoinOptions, PORTFOLIO_PRESETS } from "./options";

const TITLE = "Crypto Portfolio Analyzer — Backtest, Rebalance, Correlate";
const DESCRIPTION =
  "Test a crypto portfolio against real daily prices: returns, volatility, drawdown, whether rebalancing helped, and whether your assets were ever actually different. Free, no account, runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto portfolio analyzer",
    "crypto portfolio backtest",
    "crypto portfolio rebalancing tool",
    "crypto rebalancing calculator",
    "crypto portfolio risk analysis",
    "crypto portfolio volatility calculator",
    "bitcoin ethereum portfolio allocation",
  ],
  alternates: { canonical: absoluteUrl("/portfolio") },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Backtest any mix of 62 coins against real daily prices — returns, risk, rebalancing and correlation, all in your browser.",
    url: absoluteUrl("/portfolio"),
    images: [ogImage("portfolio", "Crypto Portfolio Analyzer")],
  },
};

const FAQS = [
  {
    q: "Is this a portfolio tracker?",
    a: "No. A tracker watches what you hold right now and needs your wallet addresses or exchange keys to do it. This is the other question: how a given mix would have behaved over real history. It never asks who you are, and there is nothing to connect.",
  },
  {
    q: "Why is my start date being moved forward?",
    a: "Because the window is the stretch of time every asset in the mix actually existed for. Adding a coin that launched in 2024 to a portfolio starting in 2018 cannot give you a 2018 portfolio — the only honest options are to move the start or to invent six years of prices, and we do not invent prices. The page names the asset that set the limit so you can drop it and reach further back.",
  },
  {
    q: "Should I rebalance?",
    a: "The table on this page answers that for your mix over your window, and the answer genuinely goes both ways: rebalancing helps when assets take turns leading and hurts when one asset leads the whole way. Whatever it says, subtract the fees on every trade and, in most countries, the tax on every sale — a policy that wins by a couple of percent before costs usually loses after them.",
  },
  {
    q: "What does the correlation number mean for me?",
    a: "It is how closely two assets moved on the same days, from −1 to 1. Most large crypto assets sit between 0.6 and 0.9 against bitcoin, which means a portfolio of six of them is closer to one bet written six times than to six separate bets. That is the single most common thing this page tells people that they did not expect.",
  },
  {
    q: "Why do the returns ignore staking, fees and tax?",
    a: "Staking rewards, trading fees and tax all depend on facts this page does not have — which venue, which country, which year. Rather than guess, the backtest reports the price outcome only, and links to the tools that handle the other three properly.",
  },
  {
    q: "Where does the price data come from?",
    a: `Daily closes from Binance, Bitstamp and CoinGecko, snapshotted to files served from this domain and currently running to ${historyThrough}. Serving our own snapshot means the page makes no request to an exchange, works when their APIs are down, and does not tell anyone which coins you are researching.`,
  },
];

export default function Page() {
  const coins = portfolioCoinOptions();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "Portfolio analyzer", path: "/portfolio" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Crypto Portfolio Analyzer",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: absoluteUrl("/portfolio"),
          description:
            "Backtest a multi-asset crypto portfolio against real daily prices, with rebalancing comparison, risk metrics and a correlation matrix.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Multi-asset portfolio backtest",
            "Rebalancing comparison",
            "Volatility, Sharpe and Sortino",
            "Maximum drawdown",
            "Correlation matrix",
          ],
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Portfolio analyzer</span>
      </nav>

      <header>
        <div className="eyebrow">Portfolio</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto portfolio analyzer
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          Build a mix, pick a starting date, and this replays it against real daily closes — what it
          returned, how hard the ride was, whether rebalancing was worth the trades, and whether the
          assets were ever actually different from each other.
        </p>
      </header>

      <PortfolioApp coins={coins} presets={PORTFOLIO_PRESETS} historyThrough={historyThrough} />

      <AdSlot slot="portfolio-below" className="my-10" />

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">
          The four questions this page exists to answer
        </h2>

        <h3 className="mt-6 text-lg font-bold">&ldquo;Did my mix beat just holding bitcoin?&rdquo;</h3>
        <p className="muted mt-2 leading-relaxed">
          Set the preset to <strong>Bitcoin only</strong>, note the number, then switch back. Most
          diversified crypto portfolios lose this comparison over long windows, and the ones that
          win usually do so because of a single asset rather than the diversification. The per-asset
          table shows which one, in dollars.
        </p>

        <h3 className="mt-6 text-lg font-bold">&ldquo;Was the ride survivable?&rdquo;</h3>
        <p className="muted mt-2 leading-relaxed">
          The deepest fall matters more than the final number, because it is the point at which
          people actually sell. A mix that ended up ahead but was down 80% in the middle only
          returned that number to someone who held through the 80%. Look at the drawdown dates: they
          are usually more than a year apart, which is how long you would have had to sit there.
        </p>

        <h3 className="mt-6 text-lg font-bold">&ldquo;Should I be rebalancing?&rdquo;</h3>
        <p className="muted mt-2 leading-relaxed">
          Rebalancing sells whatever ran and buys whatever lagged. That is profitable when assets
          take turns and costly when one leads the whole way — so the honest answer is a table, not
          a rule. The one part that is a rule: every rebalance is a set of trades, each trade pays a
          fee, and in most countries each sale is a taxable disposal. A policy that wins by two
          percent before costs is not winning.
        </p>

        <h3 className="mt-6 text-lg font-bold">&ldquo;Is this actually diversified?&rdquo;</h3>
        <p className="muted mt-2 leading-relaxed">
          Usually less than it looks. Large-cap crypto assets correlate with bitcoin at roughly 0.6
          to 0.9, which means holding six of them is much closer to one position than to six. The
          correlation matrix on this page shows the real figure for your mix, and the volatility
          comparison converts it into the only unit anyone feels: how much calmer the combination
          was than its parts.{" "}
          <Link href="/portfolio/correlation" className="font-semibold text-brand-ink hover:underline">
            See the full matrix across every asset →
          </Link>
        </p>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">What this deliberately does not do</h2>
        <p className="muted mt-2 leading-relaxed">
          It does not connect to your exchange or your wallet, because it does not need to and
          because asking for that access is how a free tool turns into a data business. It does not
          model staking rewards, trading fees, spreads or tax — all four depend on facts this page
          has no way of knowing, and a made-up assumption dressed as a result is worse than a
          missing one. And it does not forecast: everything here is one path that already happened,
          which says nothing certain about the next one.
        </p>
        <p className="muted mt-3 leading-relaxed">
          For the parts it leaves out:{" "}
          <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
            the tax report
          </Link>{" "}
          works out the real capital gain for your country,{" "}
          <Link href="/tools/trading-fee-calculator" className="font-semibold text-brand-ink hover:underline">
            the fee calculator
          </Link>{" "}
          prices the trades, and{" "}
          <Link href="/tools/staking-rewards-calculator" className="font-semibold text-brand-ink hover:underline">
            the staking calculator
          </Link>{" "}
          covers rewards.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/portfolio/correlation",
              title: "Crypto correlation matrix",
              note: "Which assets actually move apart",
            },
            {
              href: "/guides/crypto-portfolio-diversification",
              title: "Why ten coins behave like one bet",
              note: "What 0.80 correlation does to a portfolio",
            },
            {
              href: "/investment-calculator",
              title: "What if you had invested?",
              note: "The same replay, one asset at a time",
            },
            {
              href: "/tools/portfolio-rebalance-calculator",
              title: "Rebalance calculator",
              note: "What to buy and sell to hit your targets today",
            },
            {
              href: "/tools/max-drawdown-calculator",
              title: "Max drawdown calculator",
              note: "Measure the worst fall in your own series",
            },
            {
              href: "/tools/portfolio-volatility-calculator",
              title: "Portfolio volatility calculator",
              note: "Volatility from weights and correlations",
            },
            {
              href: "/crypto-tax-report",
              title: "Crypto tax report",
              note: "The cost every rebalance actually carries",
            },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="card card-hover p-4">
              <span className="block font-semibold">{item.title}</span>
              <span className="muted mt-0.5 block text-xs">{item.note}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
