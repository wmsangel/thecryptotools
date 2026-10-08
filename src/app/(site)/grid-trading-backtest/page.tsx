import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { AdSlot } from "@/components/ads/AdSlot";
import { GuideAffiliateCTA } from "@/components/guides/GuideAffiliateCTA";
import { historyThrough } from "@/lib/backtest/history-index";
import { GridBacktestApp } from "./GridBacktestApp";
import { coinOptions } from "./options";

const FAQ = [
  {
    q: "What does a grid backtest actually show?",
    a: "It replays a spot grid bot against real daily closing prices: it places your grid between the lower and upper price, buys as price falls to each line and sells one line up, and tracks what the pot would have been worth day by day. It then compares that against simply buying and holding the same money over the same period — the only benchmark that tells you whether the grid was worth running.",
  },
  {
    q: "Why does holding sometimes beat the grid?",
    a: "A grid earns from price oscillating inside a fixed range. In a straight rally it sells its coins off into the rise and then sits in cash while price keeps climbing, so it captures far less than holding. Grids tend to win in choppy, sideways markets and lose in strong trends — the backtest lets you see which one each period actually was.",
  },
  {
    q: "What happens when price leaves the range?",
    a: "Below the floor, the bot has bought at every rung on the way down and is left holding the whole position at a loss until price recovers. Above the ceiling, it has sold everything and stops earning while price runs away. The result flags how much of the time price stayed inside your range, because a grid only works while it does.",
  },
  {
    q: "Are the results after fees?",
    a: "Yes — a fee is charged on both legs of every trade, using the rate you enter, and the buy-and-hold benchmark pays one entry fee too. What the model leaves out is slippage and intraday wicks: fills are taken at the grid-line price on daily closes, so a real bot trading tick data would make more trades. Treat the figure as a conservative, directional estimate, not a promise.",
  },
  {
    q: "Which settings should I test?",
    a: "Start with a range around the price at the time (the ±20/30/50% buttons set one), 20 grid lines and your exchange's real fee. Then widen or tighten the range and change the grid count to see the trade-off: more lines trade more often but each cycle earns less, and tight spacing below twice your fee loses money on every trade. Plan the exact spacing on the grid calculator.",
  },
];

export const metadata: Metadata = {
  title: "Grid Trading Bot Backtest — Test a Grid on Real History",
  description:
    "Backtest a crypto grid bot against real daily prices. See the profit it would have banked, the open position it would hold, and whether it beat simply buying and holding — free, in your browser.",
  keywords: [
    "grid trading backtest",
    "grid bot backtest",
    "crypto grid bot backtest",
    "grid trading simulator",
    "backtest grid strategy crypto",
    "grid bot historical returns",
    "does grid trading work",
  ],
  alternates: { canonical: absoluteUrl("/grid-trading-backtest") },
  openGraph: {
    type: "website",
    title: `Grid Trading Bot Backtest | ${site.name}`,
    description:
      "Replay a grid bot against real daily prices across dozens of coins, and compare it to buy-and-hold. Runs entirely in your browser.",
    url: absoluteUrl("/grid-trading-backtest"),
    images: [ogImage("grid-trading-backtest", "Grid trading bot backtest")],
  },
};

function jsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Grid Trading Bot Backtest",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url: absoluteUrl("/grid-trading-backtest"),
      description:
        "Backtest a crypto grid bot against real daily price history and compare it to buy-and-hold. Runs entirely client-side.",
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
}

export default function GridBacktestPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "Grid trading backtest", path: "/grid-trading-backtest" }])} />
      <JsonLd data={jsonLd()} />

      <Breadcrumbs trail={[{ name: "Grid trading backtest", path: "/grid-trading-backtest" }]} />

      <header>
        <div className="eyebrow">Backtest</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Would a <span className="text-gradient">grid bot</span> have worked?
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          Set a range, a grid and a starting date, and this replays the bot against real daily
          closes — the profit it would have banked, the position it would still be holding, and
          whether it actually beat just buying and holding the same money.
        </p>
      </header>

      <GridBacktestApp coins={coinOptions()} />

      <div className="mx-auto mt-10 max-w-3xl">
        <GuideAffiliateCTA kind="bot" placement="tool-bot-grid-trading-backtest" />
      </div>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight">Reading the result honestly</h2>
        <div className="muted mt-5 space-y-4 leading-relaxed">
          <p>
            The headline figure is only half the story — the number that matters is the one next to
            it: what the same money would have done sitting in the coin untouched. A grid that made
            money in a bull market still <em>lost</em> to holding, because it kept selling into the
            rise. The backtest puts both side by side so the comparison is unavoidable.
          </p>
          <p>
            Watch the time-in-range figure. A grid is a bet that price stays inside a band, and the
            moment it leaves, the strategy breaks: below the floor you are holding a bag bought all
            the way down, above the ceiling you have sold out and are watching from the sidelines.
            A result that looks great only because price happened to oscillate neatly inside the
            range tells you nothing about the next period.
          </p>
          <p>
            Once a configuration looks promising here, size the spacing properly — a grid tighter
            than twice your trading fee loses money on every completed trade, however busy it looks.{" "}
            <Link href="/tools/grid-calculator" className="font-semibold text-brand-ink hover:underline">
              The grid calculator
            </Link>{" "}
            checks that for you, and the{" "}
            <Link href="/guides/grid-trading-explained" className="font-semibold text-brand-ink hover:underline">
              grid trading guide
            </Link>{" "}
            explains when the strategy fits at all.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-3xl">
        <AdSlot slot="grid-backtest-below" className="my-2" />
      </div>

      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight">Keep going</h2>
        <ul className="mt-4 space-y-2">
          {[
            { href: "/tools/grid-calculator", label: "Grid trading calculator — plan the exact spacing and profit per grid" },
            { href: "/tools/dca-bot-calculator", label: "DCA bot calculator — model a base order plus a safety-order ladder" },
            { href: "/investment-calculator", label: "Investment calculator — backtest a lump sum or regular buy instead" },
            { href: "/guides/best-crypto-grid-trading-bots", label: "Best crypto grid trading bots — where to run one" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-semibold text-brand-ink hover:underline">
                {l.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto mt-12 max-w-3xl">
        <FaqSection faq={FAQ} />
      </div>

      <p className="muted mx-auto mt-12 max-w-3xl rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
        Price history runs through {historyThrough}. This replays one path that already happened and
        is not a forecast or financial advice — a grid that worked over a past period can fail over
        the next one.
      </p>
    </div>
  );
}
