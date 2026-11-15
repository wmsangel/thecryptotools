import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { AdSlot, AffiliateBanner } from "@/components/ads/AdSlot";
import { StakingComparison } from "./StakingComparison";

const PATH = "/ethereum-staking-comparison";
const TITLE = "Ethereum Staking: Solo vs Pooled vs Liquid vs Exchange";
const DESC =
  "Compare the four ways to stake Ethereum — solo, pooled, liquid and exchange — on net yield, fees, custody and risk, with a calculator for your own ETH.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "ethereum staking pool vs solo staking",
    "solo vs pooled staking",
    "ethereum staking calculator",
    "best way to stake ethereum",
    "liquid staking vs solo staking",
    "ethereum staking yield vs l2 yield",
    "exchange staking vs solo staking",
  ],
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: "website",
    url: absoluteUrl(PATH),
    title: TITLE,
    description: DESC,
    images: [ogImage("ethereum-staking-comparison", "Ethereum staking compared")],
  },
};

const FAQ = [
  {
    q: "Is solo or pooled Ethereum staking better?",
    a: "Solo staking keeps 100% of the rewards and full control of your keys, but needs 32 ETH, a reliable always-on node, and you carry the entire slashing risk yourself. Pooled or staking-as-a-service takes a fee (often around 10% of rewards) in exchange for no 32-ETH minimum and no node to run. Solo wins on net yield; pooled wins on convenience and lower capital. The calculator above shows the exact gap for your amount.",
  },
  {
    q: "How much ETH do you need to stake solo?",
    a: "Exactly 32 ETH to run one validator — that is a protocol requirement, not a platform rule. Below 32 ETH you can only stake through a pool, a liquid-staking protocol, a minipool service (Rocket Pool needs ~8–16 ETH) or an exchange, all of which accept any amount.",
  },
  {
    q: "What is liquid staking and how is it different?",
    a: "Liquid staking (stETH, rETH and similar) gives you a token that represents your staked ETH plus its accruing rewards, which you can trade or use in DeFi while it stays staked. It removes the unstake-queue wait at the cost of a protocol fee and the token occasionally trading slightly off peg. Solo and most pooled routes lock the ETH until you exit.",
  },
  {
    q: "Does staking Ethereum on an exchange pay less?",
    a: "Usually, yes. Exchanges are the easiest route — any amount, one click — but take the largest cut, often a quarter or more of the rewards, and they custody your ETH (not your keys). Set the fee row in the calculator to the exchange's published figure to see what you actually keep.",
  },
  {
    q: "Is Ethereum staking yield higher than L2 or DeFi yield?",
    a: "Base-layer ETH staking pays a relatively low, protocol-backed yield (roughly 3% before fees at typical participation) with ETH-denominated risk only. L2 and DeFi yields can be higher but carry extra smart-contract, liquidity and token risk, and are often paid in volatile incentive tokens. Staking is the lower-risk, lower-reward floor; compare any higher yield against the extra risk it takes, not the headline number alone.",
  },
];

export default function Page() {
  const jsonLd = [
    breadcrumbJsonLd([{ name: "Ethereum staking comparison", path: PATH }]),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Ethereum Staking Comparison Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url: absoluteUrl(PATH),
      description: DESC,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: site.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className="mx-auto max-w-content px-4 py-10">
      <JsonLd data={jsonLd} />
      <Breadcrumbs trail={[{ name: "Ethereum staking comparison", path: PATH }]} />

      <header className="max-w-3xl">
        <div className="eyebrow">Compare · with calculator</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Ethereum staking: <span className="text-gradient">solo vs pooled vs liquid</span> vs exchange
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          Four ways to stake the same ETH, and they do not pay the same. The gross yield is similar
          everywhere — what separates them is the provider fee, the minimum, who holds your keys, how
          fast you can get out, and who carries the slashing risk. Run your own numbers below.
        </p>
      </header>

      <div className="mt-8 max-w-4xl">
        <StakingComparison />
      </div>

      <div className="mt-8 max-w-3xl">
        <AffiliateBanner context="spot" placement="ethereum-staking-comparison" />
      </div>

      <AdSlot slot="staking-compare-below" className="my-10" />

      <section className="max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Which one should you pick?</h2>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">Have 32 ETH and want the most yield?</strong> Solo staking keeps every basis point and your keys — if you can run a node reliably and accept the slashing responsibility.</span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">Want to stake any amount without running hardware?</strong> Pooled / staking-as-a-service or a liquid-staking protocol take a fee but remove the 32-ETH floor and the node.</span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">Want to keep the ETH usable?</strong> Liquid staking hands you a tradeable token you can hold, sell or use in DeFi while it stays staked — at a protocol fee and a small peg risk.</span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">Just want it simple?</strong> Exchange staking is one click for any amount — but takes the biggest cut and custodies your ETH. Convenience you pay for in yield and in trust.</span>
          </li>
        </ul>
        <p className="muted mt-5 leading-relaxed">
          The calculator makes the trade concrete: on a small stake the fee gap is a few dollars a year and
          convenience wins easily; on a large stake the same percentage is real money, and solo or the
          cheapest pool starts to earn its extra effort.
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Staking yield vs L2 and DeFi yield</h2>
        <p className="muted mt-4 leading-relaxed">
          Base-layer ETH staking is the floor, not the ceiling. It pays a relatively low,
          protocol-backed yield — roughly 3% before fees at typical participation — and the only
          risk you take is ETH&apos;s own price. Every higher number you see advertised on an L2 or in
          DeFi is buying that extra yield with extra risk, so the honest comparison is never headline
          vs headline — it is <strong>yield per unit of risk</strong>.
        </p>
        <ul className="mt-5 space-y-3">
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">Base staking (~3%)</strong> — protocol-issued, paid in ETH, no smart-contract counterparty. The lowest-risk way to earn on ETH, and the benchmark everything else should beat <em>after</em> accounting for risk.</span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">Liquid staking (stETH, rETH)</strong> — the same staking yield minus a protocol fee, but your position becomes a token you can lend or LP for extra yield. That stacking adds smart-contract risk and a small chance the token trades off its peg. See <Link href="/guides/liquid-staking-explained" className="underline">liquid staking explained</Link> for how the peg and withdrawal queue actually work.</span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">L2 and DeFi yield</strong> — lending, liquidity pools and farms on Arbitrum, Base and the rest can pay far more, but the return often comes in a volatile incentive token, carries impermanent-loss and bridge risk, and can evaporate when the incentive program ends. Treat a 15% farm as a 3% staking yield plus a 12% risk premium you are being paid to take — and decide if you want that risk.</span>
          </li>
          <li className="flex gap-3 leading-relaxed">
            <span className="mt-1 select-none text-brand-ink" aria-hidden>▸</span>
            <span className="muted"><strong className="text-[var(--text)]">Restaking (EigenLayer and similar)</strong> — stacks another reward layer on staked ETH by securing extra services, and with it another layer of slashing conditions. More yield, more ways to lose principal.</span>
          </li>
        </ul>
        <p className="muted mt-5 leading-relaxed">
          A sane way to read any crypto yield: start from the ~3% ETH staking floor, then ask what each
          extra percentage point is compensating you for. If you cannot name the risk, you are not being
          paid a premium — you are mispricing one. Run the staking number first in the{" "}
          <Link href="/tools/staking-rewards-calculator" className="underline">staking rewards calculator</Link>,
          then judge any DeFi offer against it rather than against zero.
        </p>
      </section>

      <div className="max-w-3xl">
        <FaqSection faq={FAQ} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Keep reading</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Related href="/guides/ethereum-staking-guide" title="Ethereum staking guide" desc="How ETH staking works, end to end." />
          <Related href="/guides/liquid-staking-explained" title="Liquid staking explained" desc="stETH, rETH and the peg risk." />
          <Related href="/tools/staking-rewards-calculator" title="Staking rewards calculator" desc="Project rewards for any coin and rate." />
          <Related href="/guides/what-is-crypto-staking" title="What is crypto staking?" desc="The basics, in plain English." />
          <Related href="/glossary/staking" title="Staking — glossary" desc="One-line definition and links." />
          <Related href="/dca" title="Live DCA strategy lab" desc="Automated strategies on the real market." />
        </div>
      </section>

      <p className="muted mt-10 max-w-3xl text-xs leading-relaxed">
        For general information only, not financial advice. Staking yields and fees change constantly and
        vary by provider — confirm the current figures before committing ETH, and understand the slashing,
        custody and liquidity terms of whichever route you choose.
      </p>
    </div>
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
