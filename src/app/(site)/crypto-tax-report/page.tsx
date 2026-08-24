import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { jurisdictions } from "@/lib/taxreport/jurisdictions";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { TaxReportApp } from "./TaxReportApp";
import { GuideAffiliateCTA } from "@/components/guides/GuideAffiliateCTA";

const FAQ = [
  {
    q: "Is my transaction data uploaded anywhere?",
    a: "No. This site is a set of static files with no server and no database — there is nothing to upload to. Your CSV is read by JavaScript in your own browser, the report is computed there, and closing the tab discards it. You can disconnect from the internet after the page loads and it will still work.",
  },
  {
    q: "Which exchanges does it support?",
    a: "Any of them. Rather than hardcoding one format per exchange, it reads your column headers and maps them automatically, then lets you correct the mapping. Anything exporting a CSV with a date, amounts and currencies will work — including a spreadsheet you keep yourself.",
  },
  {
    q: "Which cost-basis method does it use?",
    a: "Whichever your country uses. FIFO for the US, Ireland, Germany, Australia and others; the adjusted cost base for Canada; HMRC's same-day, 30-day and Section 104 pooling rules for the UK; and Poland's annual pooling of costs against revenue.",
  },
  {
    q: "Does it handle crypto-to-crypto swaps?",
    a: "Yes, and correctly for each country. Most treat a swap as a taxable disposal. France and Poland do not tax it at all, and Portugal not only exempts it but carries your original acquisition date through the swap, so rebalancing does not reset the 365-day clock.",
  },
  {
    q: "What if a row cannot be valued?",
    a: "It is flagged and left out of the totals rather than being counted as zero. A crypto-to-crypto swap needs a value in your own currency to be taxed, and if your export lacks one the report says so instead of quietly understating your gain.",
  },
  {
    q: "Can I file my tax return with this?",
    a: "No — treat it as a way to check figures you or your accountant have produced, and to understand which rules apply to you. It deliberately lists what it does not model for each country, such as the UK's rate bands, Canada's superficial loss rule and India's 1% TDS.",
  },
  {
    q: "Does it cover previous tax years?",
    a: "Yes. Load your full history and pick the year. Cost basis is carried in from earlier years, which is what makes the gains right — a report built from one year of data alone will almost always be wrong.",
  },
];

export const metadata: Metadata = {
  title: "Free Crypto Tax Report Generator — 12 Countries, Runs In Your Browser",
  description:
    "Turn an exchange CSV into a capital gains report for 12 countries. FIFO, ACB and UK Section 104 pooling, with relief and allowances applied. Free, and your data never leaves your browser.",
  keywords: [
    "crypto tax report generator",
    "free crypto tax calculator csv",
    "crypto capital gains report",
    "crypto tax software free",
    "calculate crypto tax from csv",
    "crypto cost basis calculator",
    "fifo crypto tax calculator",
  ],
  alternates: { canonical: absoluteUrl("/crypto-tax-report") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/crypto-tax-report"),
    title: `Free Crypto Tax Report Generator | ${site.name}`,
    description:
      "Upload an exchange CSV, get a capital gains report for your country. Runs entirely in your browser — nothing is uploaded.",
    images: [ogImage("tax-report", "Free crypto tax report generator")],
  },
};

function jsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Crypto Tax Report Generator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      url: absoluteUrl("/crypto-tax-report"),
      description:
        "Generate a crypto capital gains report for 12 countries from an exchange CSV. Runs entirely client-side.",
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

export default function CryptoTaxReportPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-10">
    <JsonLd data={breadcrumbJsonLd([{ name: "Crypto tax report", path: "/crypto-tax-report" }])} />
      <JsonLd data={jsonLd()} />

      <header className="mb-8 max-w-3xl">
        <div className="eyebrow">Free · no signup · nothing uploaded</div>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Crypto <span className="text-gradient">tax report</span> generator
        </h1>
        <p className="muted mt-4 text-lg leading-relaxed">
          Drop in a CSV from your exchange and get a capital gains report for your country —
          with the right cost-basis method, holding-period relief and allowance already applied.
          It runs entirely in your browser, so your transaction history never leaves your device.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          {jurisdictions.map((j) => (
            <span key={j.id} className="chip !px-2.5 !py-1">{j.flag} {j.name}</span>
          ))}
        </div>
      </header>

      <TaxReportApp />

      <div className="mx-auto mt-10 max-w-3xl">
        <GuideAffiliateCTA kind="tax" placement="tool-crypto-tax-report" />
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight">Why the method matters more than the rate</h2>
        <div className="muted mt-5 space-y-4 leading-relaxed">
          <p>
            Two people with identical trades can owe very different amounts, because countries
            disagree about which coins you sold. Sell one of two Bitcoin you bought at different
            prices and the answer depends entirely on the matching rule: FIFO says you sold the
            older one, Canada averages both into a single cost, and the UK applies same-day and
            30-day rules before falling back to a pooled average.
          </p>
          <p>
            Holding periods matter just as much. Germany exempts a gain entirely once the coin has
            been held more than a year, Portugal at 365 days or more, and Australia halves the
            taxable gain after twelve months. Australia also has an ordering rule worth knowing:
            losses come off your gains <em>before</em> the 50% discount is applied, which is worth
            twice as much as doing it the other way round. This report applies each of those in the
            right order.
          </p>
          <p>
            Then there is the swap question. In most countries trading BTC for ETH is a disposal you
            owe tax on, even though no money reached your bank. In France and Poland it is not taxed
            at all. In Portugal it is not taxed <em>and</em> your original purchase date carries
            through, so rebalancing does not restart your clock toward the exemption. Get this wrong
            and an active year can be off by thousands.
          </p>
          <p>
            The full reasoning for each country — with figures verified against the tax authority
            itself, not copied from other blogs — is in the{" "}
            <Link href="/guides/crypto-tax-by-country" className="font-semibold text-brand-ink hover:underline">
              crypto tax by country
            </Link>{" "}
            comparison.
          </p>
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold tracking-tight">
            Still holding losers? There may be tax to save before the year closes
          </h2>
          <p className="muted mt-2 leading-relaxed">
            This report covers what you have already sold. The other half of the year&apos;s bill is
            what you have <em>not</em> sold: positions sitting at a loss can be realised to offset
            the gains above, but only before your tax year ends, only up to the gains available, and
            only if your country lets you buy back.{" "}
            <Link href="/tax-loss-harvesting" className="font-semibold text-brand-ink hover:underline">
              Run the same file through the harvesting tool →
            </Link>
          </p>
          <p className="muted mt-4 leading-relaxed">
            Filing in the US? The cost-basis method you elect — FIFO, LIFO or HIFO — changes the gain
            above, sometimes by thousands.{" "}
            <Link href="/cost-basis-method-calculator" className="font-semibold text-brand-ink hover:underline">
              Compare all three on the same file →
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-3xl font-extrabold tracking-tight">What your CSV needs</h2>
        <p className="muted mt-4 leading-relaxed">
          A header row and one line per transaction. The column names do not matter — they are
          detected and you can correct the mapping. At minimum you need a date, and the amounts and
          currencies moving in and out.
        </p>
        <ul className="mt-4 space-y-2">
          {[
            "Date — any common format. If your file uses 03/05/2024 style dates the tool asks which way round they are, because it changes your holding periods.",
            "Sent / received amount and currency — one side may be empty for income or a purchase.",
            "Fees, if you have them — acquisition fees are added to your cost basis, disposal fees deducted from the gain.",
            "A value column, if you trade crypto for crypto. Where one leg is your own currency the value is taken from it; a BTC-for-ETH swap cannot be valued without it.",
            "Your whole history, not just the reported year. Cost basis carries in from earlier purchases — that is what makes the numbers right.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-1 text-brand-ink">•</span>
              <span className="text-[var(--text)]/90">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 max-w-3xl">
        <FaqSection faq={FAQ} />
      </div>

      <p className="muted mx-auto mt-12 max-w-3xl rounded-xl border-l-4 border-brand-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
        This is general information and an estimate, not tax advice. Tax rules change and personal
        circumstances differ — check your figures with a qualified professional before filing.
      </p>
    </div>
  );
}
