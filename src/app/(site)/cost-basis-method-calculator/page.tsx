import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/FaqSection";
import { CostBasisApp } from "./CostBasisApp";
import { GuideAffiliateCTA } from "@/components/guides/GuideAffiliateCTA";

const TITLE = "Crypto Cost Basis Method Calculator — FIFO vs LIFO vs HIFO";
const DESCRIPTION =
  "Upload your transaction history and see this year's tax under FIFO, LIFO and HIFO side by side — which one pays least now, and how much of that saving is really just tax deferred to a future year. Free, runs entirely in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crypto cost basis calculator",
    "cost basis method calculator",
    "fifo vs lifo vs hifo crypto",
    "hifo crypto tax",
    "crypto cost basis method",
    "which cost basis method saves the most tax",
    "specific identification crypto",
    "crypto tax fifo lifo hifo",
  ],
  alternates: { canonical: absoluteUrl("/cost-basis-method-calculator") },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "See your crypto tax under FIFO, LIFO and HIFO side by side, and how much of any saving is just deferred. Free, in your browser.",
    url: absoluteUrl("/cost-basis-method-calculator"),
    images: [ogImage("cost-basis-method-calculator", "Crypto Cost Basis Method Calculator")],
  },
};

const FAQS = [
  {
    q: "What do FIFO, LIFO and HIFO actually mean?",
    a: "They are rules for deciding which coins you sold when you own several bought at different prices. FIFO (first in, first out) sells your oldest coins first. LIFO (last in, first out) sells your newest. HIFO (highest in, first out) sells whichever cost you the most, regardless of when you bought it. The coins that leave your account are identical either way — only the cost basis assigned to the sale changes, and with it the gain you report.",
  },
  {
    q: "Which method pays the least crypto tax?",
    a: "Usually HIFO for the current year, because selling your highest-cost coins first leaves the smallest gain — sometimes even a loss. But 'least this year' is not 'least ever'. Selling your dear coins now leaves your cheap ones on the books, and those carry a larger gain when you finally sell them. This tool shows both numbers so you can see the trade rather than just the headline.",
  },
  {
    q: "Does HIFO save tax or just defer it?",
    a: "Mostly defer. Your total cost basis across all your coins is fixed — whatever you do not use against this year's sales stays attached to the coins you keep and is taxed when you sell those. HIFO front-loads the basis, so it lowers this year's bill and raises a later one. That is genuinely valuable if you expect a lower rate later, need cash now, or want to bank a loss — but it is not free money, and any tool that shows only the current-year saving is telling you half the story. The 'cost basis left' column here is the other half.",
  },
  {
    q: "Can I really choose my cost basis method for crypto in the US?",
    a: "Yes, under the IRS specific-identification rules — but only if you can identify the exact units at the time of sale, with records showing the acquisition date, cost, and the date and value at disposal. If you cannot, the IRS default is FIFO. Since 2025 the US also requires per-wallet, per-account basis tracking rather than one universal pool, so a method chosen across everything may not match what your broker reports on Form 1099-DA. Treat this as a planning estimate, then confirm with your records and a professional.",
  },
  {
    q: "Can I use LIFO or HIFO outside the United States?",
    a: "Generally no. Most countries mandate a single method: the UK uses share pooling with same-day and 30-day rules, Canada uses the adjusted cost base (a moving average), Germany, Australia, Ireland and others require FIFO. There is no method to choose, so there is nothing to compare — pick your country in the tool and it will say so and show your single lawful result.",
  },
  {
    q: "Is my transaction data uploaded anywhere?",
    a: "No, and there is nowhere for it to go. This site is static files with no server and no database. Your CSV is read by your browser, every method is computed in the same tab, and closing it discards everything. Nothing about your trades leaves the device.",
  },
  {
    q: "Does this replace tax software or an accountant?",
    a: "No. It is an estimate from your file using published rules. It pools each asset rather than tracking per-wallet basis, it uses the single rate you enter instead of your full bracket, and it does not know your other income, carried-forward losses or anything your file leaves out. Use it to see whether choosing a method is worth pursuing, then file with proper records.",
  },
];

export default function Page() {
  const buildDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "Cost basis method calculator", path: "/cost-basis-method-calculator" }])} />
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
          name: "Crypto Cost Basis Method Calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          url: absoluteUrl("/cost-basis-method-calculator"),
          description:
            "Compare this year's crypto capital-gains tax under FIFO, LIFO and HIFO from your own transaction history, and see how much of any saving is deferred to a future year.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "FIFO, LIFO and HIFO from one CSV",
            "This year's tax under each method side by side",
            "Remaining cost basis, so deferral is visible not hidden",
            "Flags countries that mandate a method",
            "Runs entirely in the browser",
          ],
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Cost basis method calculator</span>
      </nav>

      <header>
        <div className="eyebrow">Tax</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto cost basis method calculator
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          FIFO, LIFO or HIFO — the method you pick decides which coins you &ldquo;sold&rdquo; and can
          swing this year&apos;s tax bill by thousands. Load the history you already export and see all
          three at once, including the part most calculators hide: how much of the saving is only
          deferred to a later year.
        </p>
        <p className="muted mt-3 max-w-2xl text-sm">
          US specific-identification · other countries&apos; mandated methods flagged · nothing leaves
          your browser
        </p>
      </header>

      <CostBasisApp buildDate={buildDate} />

      <div className="mt-10 max-w-3xl">
        <GuideAffiliateCTA kind="tax" placement="tool-cost-basis" />
      </div>

      <AdSlot slot="cost-basis-below" className="my-10" />

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">The saving that is really a loan from your future self</h2>
        <p className="muted mt-2 leading-relaxed">
          Say you bought one bitcoin at $20,000 years ago and another at $60,000 last quarter, then sold
          one for $65,000. FIFO sells the cheap coin and reports a $45,000 gain. HIFO sells the dear one
          and reports $5,000. The $40,000 difference looks like money saved — but you still own one
          bitcoin either way, and under HIFO the coin you kept carries the $20,000 basis instead of the
          $60,000 one. Sell it later and that $40,000 comes back as gain. The tax moved; it did not
          vanish. This tool puts the remaining cost basis next to the tax for exactly this reason, so
          you are comparing the whole picture and not just the flattering half.
        </p>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">When deferring is still the right call</h2>
        <p className="muted mt-2 leading-relaxed">
          Deferral is not a trick — it is often the correct move. A dollar of tax paid next year is
          cheaper than one paid now, so all else equal, later is better. HIFO also shines when it turns a
          sale into a <em>loss</em> you can set against other gains this year, or when you expect to be in
          a lower bracket later, or simply need the cash the lower bill frees up. What matters is deciding
          it on purpose. The one case where a method genuinely saves rather than defers is when you never
          sell the remaining lots — you hold them past death for a step-up, donate them, or move somewhere
          they are not taxed. Short of that, treat the current-year number as timing, not magnitude.
        </p>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">You can only choose in the US — and only with records</h2>
        <p className="muted mt-2 leading-relaxed">
          Picking a method is a US specific-identification feature. To use anything other than FIFO the
          IRS expects you to have identified the exact units at the time of each sale, with their
          acquisition dates, costs, and the value on the day you sold. Reconstructing HIFO in April for
          trades you did not document as you went is not what the rule allows. Since 2025 basis is also
          tracked per wallet and per account rather than in one pool, and brokers report it on Form
          1099-DA — so a method applied across your whole history can disagree with what the IRS already
          has. Everywhere else in this tool the country mandates a single method and the comparison
          collapses to one honest number.
        </p>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">What this does not do</h2>
        <p className="muted mt-2 leading-relaxed">
          It pools each asset rather than tracking basis per wallet, so it will not match a per-account
          1099 line for line. It applies the single rate you enter instead of running your full bracket,
          the $3,000 net-loss offset against ordinary income, or state tax. It does not know your other
          income, your carried-forward losses, or any trade missing from the file. And it does not judge
          whether selling is a good investment — only what each method does to the tax. For the complete
          position, run the same file through{" "}
          <Link href="/crypto-tax-report" className="font-semibold text-brand-ink hover:underline">
            the crypto tax report
          </Link>
          , and see the{" "}
          <Link href="/guides/crypto-tax-by-country" className="font-semibold text-brand-ink hover:underline">
            country guides
          </Link>{" "}
          for the rules behind every figure.
        </p>
      </section>

      <FaqSection faq={FAQS} />

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight">Related</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/crypto-tax-report", title: "Crypto tax report", note: "The full capital-gains position from the same CSV" },
            { href: "/tax-loss-harvesting", title: "Tax loss harvesting", note: "Which losing lots are worth selling before year end" },
            { href: "/guides/crypto-tax-by-country", title: "Crypto tax by country", note: "The mandated method and rules for each country" },
            { href: "/guides/crypto-taxes-usa", title: "US crypto taxes", note: "How the IRS treats gains, losses and basis" },
            { href: "/calendar", title: "Tax deadline calendar", note: "When each country's tax year actually closes" },
            { href: "/portfolio", title: "Portfolio analyzer", note: "What your positions did before you sell them" },
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
