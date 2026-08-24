import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { jurisdictions } from "@/lib/taxreport/jurisdictions";
import { HarvestApp } from "./HarvestApp";
import { GuideAffiliateCTA } from "@/components/guides/GuideAffiliateCTA";
import { harvestAssetMap, pricedAssetCount } from "./assets";

const TITLE = "Crypto Tax Loss Harvesting Tool — Free, 12 Countries";
const DESCRIPTION =
  "Upload your transaction history and see which losing positions are actually worth selling before the tax year closes — the tax each one saves, whether you can buy back, and which losses your country will not let you claim. Free, runs entirely in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto tax loss harvesting",
    "crypto tax loss harvesting tool",
    "tax loss harvesting crypto",
    "harvest crypto losses",
    "crypto unrealized losses tax",
    "crypto wash sale rule",
    "which crypto losses should i sell",
    "crypto tax optimization tool",
  ],
  alternates: { canonical: absoluteUrl("/tax-loss-harvesting") },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "See which crypto losses are worth realising before year end, what each saves, and whether you can buy back — 12 countries, free, in your browser.",
    url: absoluteUrl("/tax-loss-harvesting"),
    images: [ogImage("tax-loss-harvesting", "Crypto Tax Loss Harvesting Tool")],
  },
};

const FAQS = [
  {
    q: "What is crypto tax loss harvesting?",
    a: "Selling a position that is underwater so the loss is realised, which lets it offset gains you have already banked elsewhere and cuts this year's tax bill. The loss never becomes a profit — you recover only your tax rate's worth of each unit lost, so roughly 24 cents in the dollar at a 24% rate. What makes it worth doing is that the saving is cash now while the position was a paper loss either way.",
  },
  {
    q: "Why does this need my whole transaction history and not just my holdings?",
    a: "Because two of the three numbers depend on it. Your cost basis comes from what you paid and how your country matches lots, and the gains available to offset come from what you have already sold this year. A holdings snapshot can tell you a position is down; only the history can tell you whether selling it saves anything.",
  },
  {
    q: "Is my data uploaded anywhere?",
    a: "No, and there is nowhere for it to go — this site is a set of static files with no server and no database. The CSV is read by your browser, the calculation runs in the same tab, and closing it discards everything. The only outbound request is for current coin prices, which asks for tickers and reveals nothing about your amounts.",
  },
  {
    q: "Can I sell at a loss and buy back immediately?",
    a: "It depends entirely on where you file, which is why this tool shows the rule for your country next to the numbers. The US wash-sale rule does not currently reach crypto at all. The UK matches a sale against repurchases the same day and for 30 days after. Canada's superficial-loss window runs 30 days before AND after and counts your spouse's purchases. Spain's is two months either side. Australia has no window and instead cancels wash sales on intent.",
  },
  {
    q: "Why does it say a big loss saves me nothing?",
    a: "Usually because your gains are already reduced to zero — losses can only offset what there is to offset, and everything beyond that carries forward to future years rather than paying you now. Sometimes it is the country: India does not allow crypto losses to be set off at all, and Germany and Portugal make losses on long-held positions non-deductible because the gain would have been exempt.",
  },
  {
    q: "Why can a coin I am down on still be blocked in Germany or Portugal?",
    a: "Both exempt gains once you have held long enough — more than a year in Germany, 365 days or more in Portugal. A position outside the tax charge cannot produce a deductible loss either, so the exemption that would have made a profit tax-free also makes the loss worthless. This tool shows the date each loss expires, because the deadline runs the opposite way to the usual advice about holding longer.",
  },
  {
    q: "Does this replace an accountant?",
    a: "No. It is an estimate built from your file and a set of published rules, it assumes one matching method per country, and it does not know about your other income, your other assets or anything your file leaves out. Use it to find the positions worth asking about, then check the actual filing with someone qualified.",
  },
];

export default function Page() {
  const assets = harvestAssetMap();
  const buildDate = new Date().toISOString().slice(0, 10);
  const countries = jurisdictions.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "Tax loss harvesting", path: "/tax-loss-harvesting" }])} />
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
          name: "Crypto Tax Loss Harvesting Tool",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: absoluteUrl("/tax-loss-harvesting"),
          description:
            "Find which crypto positions are worth selling at a loss before the tax year closes, how much tax each one saves, and what the repurchase rules are in 12 countries.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Lot-level unrealised loss analysis",
            "Marginal tax saving per parcel",
            "Repurchase and wash-sale rules for 12 countries",
            "Holding-period loss expiry dates",
            "Runs entirely in the browser",
          ],
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Tax loss harvesting</span>
      </nav>

      <header>
        <div className="eyebrow">Tax</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto tax loss harvesting
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          Load the transaction history you already export for tax, and this works out which losing
          positions are actually worth selling before the year closes — what each one saves, which
          ones save nothing, and whether you are allowed to buy them straight back.
        </p>
        <p className="muted mt-3 max-w-2xl text-sm">
          {countries} countries · {pricedAssetCount()} assets priced automatically · nothing leaves
          your browser
        </p>
      </header>

      <HarvestApp assets={assets} buildDate={buildDate} />

      <div className="mt-10 max-w-3xl">
        <GuideAffiliateCTA kind="tax" placement="tool-tax-loss-harvesting" />
      </div>

      <AdSlot slot="harvest-below" className="my-10" />

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Three things most harvesting advice gets wrong
        </h2>

        <h3 className="mt-6 text-lg font-bold">Your total paper loss is not your saving</h3>
        <p className="muted mt-2 leading-relaxed">
          The common version of this calculation is &ldquo;add up everything you are down on, multiply
          by your tax rate&rdquo;. That answer is almost always too big, because a loss can only offset
          gains that exist. If you banked {""}
          <span className="whitespace-nowrap">$5,000</span> of gains this year and you are sitting on{" "}
          <span className="whitespace-nowrap">$30,000</span> of paper losses, the harvest is worth
          your rate on $5,000 — not on $30,000. The rest carries forward, which is worth something,
          but it is not this year&apos;s money and it should not be presented as though it were.
          Every row in the table above is priced at the margin for exactly this reason, so the
          numbers sum to the real total instead of promising the same relief repeatedly.
        </p>

        <h3 className="mt-6 text-lg font-bold">A winning coin can hold a losing parcel</h3>
        <p className="muted mt-2 leading-relaxed">
          If you bought bitcoin twice — once early and cheap, once near a top — the position as a
          whole can be comfortably up while the second purchase is deep underwater. Under a
          first-in-first-out country you can sell into that later lot and realise its loss without
          touching the cheap one. Any tool that shows you one row per coin hides this entirely, which
          is why this page works parcel by parcel. The exception is deliberate: under Canadian ACB
          and the UK Section 104 pool your holding genuinely has one averaged cost, there are no
          individual lots to pick from, and the table collapses to whole positions rather than
          implying a choice you do not have.
        </p>

        <h3 className="mt-6 text-lg font-bold">The repurchase rule decides everything</h3>
        <p className="muted mt-2 leading-relaxed">
          Harvesting only makes sense if you can keep your exposure, and whether you can differs more
          between countries than the tax rates do. In the US the wash-sale rule is written for
          securities and does not currently reach crypto, so a same-day rebuy is fine. In Canada the
          window is 30 days on <em>both</em> sides of the sale and your spouse&apos;s purchases count
          against you. Spain runs two months either side. Australia has no window at all and instead
          cancels the loss if the purpose was to manufacture it. Getting this one wrong does not cost
          you the saving — it costs you the saving after you have already sold.
        </p>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">The deadline is not the same as your filing date</h2>
        <p className="muted mt-2 leading-relaxed">
          Harvesting is one of the few tax moves that cannot be done retroactively: the disposal has
          to happen inside the tax year, and no amount of paperwork in April changes what you owned
          in December. The tax year end differs by country — 31 December across most of Europe, 5
          April in the UK, 30 June in Australia, the end of February in South Africa, 31 March in New
          Zealand — and it is that date, not the filing deadline months later, that this page counts
          down to.
        </p>
        <p className="muted mt-3 leading-relaxed">
          Two more timing traps worth knowing. Exchanges settle at their own pace, and it is the
          disposal date that counts, so leaving it to the last day is a real risk. And in Germany and
          Portugal individual positions have their own private deadline: once a parcel is old enough
          to be exempt, its loss stops being deductible, so a loss you were saving for later can
          expire in the middle of the year.
        </p>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">What this does not do</h2>
        <p className="muted mt-2 leading-relaxed">
          It does not connect to your exchange or your wallet. It does not know your salary, your
          other capital assets, or losses carried in from previous years, all of which change the
          real answer. It applies one matching method per country — the one that country&apos;s rules
          point at — rather than testing whether a different method would suit you better. It does
          not model the US $3,000 annual offset against ordinary income, the French portfolio-wide
          PFU formula, or Dutch Box 3, because approximating those would be worse than leaving them
          out. And it makes no attempt to tell you whether selling is a good investment decision —
          only what it does to your tax.
        </p>
        <p className="muted mt-3 leading-relaxed">
          For the wider picture:{" "}
          <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
            the tax report
          </Link>{" "}
          turns the same file into a full capital-gains position, the{" "}
          <Link href="/guides/crypto-tax-by-country" className="font-semibold text-brand-ink hover:underline">
            country guides
          </Link>{" "}
          carry the primary sources behind every rule used here, and the{" "}
          <Link href="/tools/tax-loss-harvesting-calculator" className="font-semibold text-brand-ink hover:underline">
            single-position calculator
          </Link>{" "}
          answers the same question for one holding without a file.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/crypto-tax-report", title: "Crypto tax report", note: "The full capital-gains position from the same CSV" },
            { href: "/cost-basis-method-calculator", title: "Cost basis methods", note: "FIFO vs LIFO vs HIFO on the same file (US)" },
            { href: "/tools/tax-loss-harvesting-calculator", title: "Harvesting calculator", note: "One position, no file needed" },
            { href: "/guides/crypto-tax-loss-harvesting", title: "Harvesting explained", note: "The rules, country by country, in prose" },
            { href: "/guides/crypto-tax-by-country", title: "Crypto tax by country", note: "The rules behind every figure here" },
            { href: "/calendar", title: "Tax deadline calendar", note: "When each country's year actually closes" },
            { href: "/portfolio", title: "Portfolio analyzer", note: "What the position did before you sell it" },
            { href: "/tools/loss-recovery-calculator", title: "Loss recovery calculator", note: "What it takes to get back to even" },
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
