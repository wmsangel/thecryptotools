import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage } from "@/lib/seo";
import { tools } from "@/lib/tools/registry";
import { guides } from "@/lib/guides/registry";
import { donationAddresses } from "@/lib/donate";
import { DonateCard } from "./DonateCard";

export const metadata: Metadata = {
  title: `Support ${site.name} — Donate Crypto`,
  description: `${site.name} is free, has no accounts and no paywall. If a calculator here saved you time, you can send a tip in crypto.`,
  alternates: { canonical: absoluteUrl("/donate") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/donate"),
    title: `Support ${site.name}`,
    description: "Free crypto tools, no accounts, no paywall. Tips accepted in crypto.",
    images: [ogImage("donate", "Support TheCryptoTools")],
  },
};

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <div className="eyebrow">Support the project</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Buy me a block of coffee
        </h1>
        <p className="muted mt-3 text-lg leading-relaxed">
          {tools.length} calculators and {guides.length} guides, free, with no account, no
          paywall and nothing you type ever leaving your browser. If something here saved you
          time or money, a tip helps keep it that way.
        </p>
      </header>

      <div className="space-y-5">
        {donationAddresses.map((item) => (
          <DonateCard key={item.id} item={item} />
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Where the money goes</h2>
        <ul className="mt-4 space-y-2">
          {[
            "Hosting, the domain and the SSL that keeps the padlock on.",
            "Time spent verifying the tax guides against primary sources — every figure on this site is checked against the actual tax authority, not copied from another blog.",
            "New calculators and keeping the existing ones correct when the rules change.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-1 text-brand-ink">•</span>
              <span className="text-[var(--text)]/90">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Free ways to help</h2>
        <p className="mt-4 leading-relaxed text-[var(--text)]/90">
          A tip is genuinely optional and most people should not send one. If you want to help
          without spending anything, linking to a calculator you found useful is worth more —
          it is the single thing this site needs most.
        </p>
        <p className="mt-4 leading-relaxed text-[var(--text)]/90">
          Spotted a number that looks wrong, or a tax rule that has changed?{" "}
          <Link href="/contact" className="font-semibold text-brand-ink hover:underline">
            Tell me
          </Link>
          . Corrections are the most valuable thing anyone sends.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 text-sm">
        <p className="font-semibold">Before you send anything</p>
        <ul className="muted mt-2 space-y-1.5">
          <li>· Donations are voluntary gifts. Nothing on this site is behind them and nothing is unlocked by them.</li>
          <li>· Crypto transfers cannot be reversed. Double-check the network and the address.</li>
          <li>· Send a small test amount first if you are moving anything meaningful.</li>
          <li>· Depending on where you live, disposing of crypto — including gifting it — can be a taxable event for you. See the <Link href="/guides/crypto-tax-by-country" className="font-semibold text-brand-ink hover:underline">tax guide for your country</Link>.</li>
        </ul>
      </section>
    </div>
  );
}
