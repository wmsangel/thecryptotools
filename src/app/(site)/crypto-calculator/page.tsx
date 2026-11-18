import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { AdSlot } from "@/components/ads/AdSlot";

const path = "/crypto-calculator";

export const metadata: Metadata = {
  title: "Crypto Calculator — Free Profit, DCA & Interest Tools",
  description:
    "Free crypto calculators in one place — profit & ROI, compound interest, DCA, position size, staking yield and more. No signup, nothing uploaded, runs in your browser.",
  keywords: [
    "crypto calculator",
    "crypto profit calculator",
    "crypto compound interest calculator",
    "crypto interest calculator",
    "cryptocurrency calculator",
    "crypto trading calculator",
    "crypto yield calculator",
  ],
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    type: "website",
    url: absoluteUrl(path),
    title: "Crypto Calculator — free profit, DCA & interest tools",
    description:
      "One place for every crypto calculation — profit, compound interest, DCA, position size and yield. Free, no signup, runs in your browser.",
    images: [ogImage("crypto-calculator", "Crypto calculator hub")],
  },
};

/** Curated picker — the calculators behind the highest-demand "… calculator" queries. */
const GROUPS: { title: string; blurb: string; items: { slug: string; name: string; desc: string }[] }[] = [
  {
    title: "Profit & returns",
    blurb: "What a trade or a holding actually made.",
    items: [
      { slug: "profit-calculator", name: "Profit calculator", desc: "Profit, loss and ROI on a trade, after fees." },
      { slug: "roi-calculator", name: "ROI calculator", desc: "Return on investment as a clean percentage." },
      { slug: "market-cap-calculator", name: "Market cap calculator", desc: "A coin's price at a target market cap." },
    ],
  },
  {
    title: "Growth & yield",
    blurb: "Earning over time — interest, staking and savings.",
    items: [
      { slug: "compound-interest-calculator", name: "Compound interest calculator", desc: "How a balance grows at a rate, compounded." },
      { slug: "apy-calculator", name: "APY calculator", desc: "Turn a rate and compounding into a real annual yield." },
      { slug: "staking-rewards-calculator", name: "Staking rewards calculator", desc: "Project rewards for any coin and APR." },
      { slug: "crypto-savings-goal-calculator", name: "Savings goal calculator", desc: "What it takes to reach a target amount." },
    ],
  },
  {
    title: "Planning & risk",
    blurb: "Sizing a position and planning your buys.",
    items: [
      { slug: "dca-calculator", name: "DCA calculator", desc: "Model a dollar-cost-averaging plan over time." },
      { slug: "position-size-calculator", name: "Position size calculator", desc: "How much to buy for a fixed risk per trade." },
      { slug: "crypto-price-converter", name: "Crypto price converter", desc: "Convert between coins and fiat at live prices." },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

const FAQ = [
  {
    q: "What is a crypto calculator?",
    a: "A crypto calculator turns the numbers you already have — an entry price, a position size, a reward rate — into the one you need, like profit after fees, a real annual yield, or how much to buy for a set risk. Each calculator here does one job and shows the working, not just the answer.",
  },
  {
    q: "Which crypto calculator do I need?",
    a: "Pick by the question you're asking. Figuring out what a trade made → profit or ROI calculator. Planning to earn over time → compound interest, APY or staking. Deciding how much to buy → position size or DCA. Converting a value → the price converter. The groups above sort every calculator by that intent.",
  },
  {
    q: "Are these crypto calculators free?",
    a: "Yes — every calculator on the site is free, with no account and no paywall. There's no usage limit and nothing to sign up for.",
  },
  {
    q: "Do these calculators upload my data?",
    a: "No. Every calculator runs entirely in your browser — the numbers you type are computed on your device and never uploaded, stored or logged. You can use them offline once the page has loaded.",
  },
  {
    q: "What's the difference between compound interest and APY?",
    a: "Compound interest is the growth itself — a balance earning a rate that is added back and then earns more. APY (annual percentage yield) expresses that same compounding as a single effective yearly rate, so two offers with different compounding frequencies can be compared fairly. Use the compound interest calculator to project a balance, and the APY calculator to compare rates.",
  },
];

export default function CryptoCalculatorHubPage() {
  const jsonLd = [
    breadcrumbJsonLd([{ name: "Crypto calculator", path }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Crypto calculators",
      itemListElement: ALL_ITEMS.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: absoluteUrl(`/tools/${it.slug}`),
      })),
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
      <Breadcrumbs trail={[{ name: "Crypto calculator", path }]} />

      <header className="max-w-3xl">
        <div className="eyebrow">Free · no signup · nothing uploaded</div>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto <span className="text-gradient">calculator</span>
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          One place for every crypto calculation. Pick the calculator for the question you&apos;re
          actually asking — what a trade made, how a balance grows, or how much to buy — and get the
          answer with the working shown. Everything runs in your browser: nothing you type is
          uploaded, stored or logged.
        </p>
      </header>

      {GROUPS.map((group) => (
        <section key={group.title} className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">{group.title}</h2>
          <p className="muted mt-1 text-sm">{group.blurb}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((it) => (
              <Link
                key={it.slug}
                href={`/tools/${it.slug}`}
                className="card card-hover flex flex-col p-4"
              >
                <span className="font-semibold text-brand-ink">{it.name} →</span>
                <span className="muted mt-1 text-sm leading-snug">{it.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <AdSlot slot="crypto-calculator-hub" className="mt-10" />

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Looking for something more specific?</h2>
        <p className="muted mt-4 leading-relaxed">
          This hub covers the everyday calculations. For the full set — liquidation and leverage,
          tokenomics, impermanent loss, tax and dozens more — see{" "}
          <Link href="/tools" className="underline hover:text-brand-ink">all tools</Link>. The major
          coins also have their own{" "}
          <Link href="/coins" className="underline hover:text-brand-ink">per-coin calculators</Link>{" "}
          prefilled with live prices, and most tools link to a{" "}
          <Link href="/guides" className="underline hover:text-brand-ink">guide</Link> explaining the
          formula behind the number.
        </p>
      </section>

      <div className="max-w-3xl">
        <FaqSection faq={FAQ} />
      </div>

      <p className="muted mt-10 max-w-3xl text-xs leading-relaxed">
        For general information only, not financial advice. Calculators are simplified estimates —
        confirm the figures that matter before acting on them. Published by {site.name}.
      </p>
    </div>
  );
}
