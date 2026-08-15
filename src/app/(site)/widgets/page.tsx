import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { tools } from "@/lib/tools/registry";
import { categories } from "@/lib/categories";
import { JsonLd } from "@/components/JsonLd";
import { WidgetBuilder } from "./WidgetBuilder";

export const metadata: Metadata = {
  title: "Free Crypto Calculator Widgets — Embed Any Tool On Your Site",
  description:
    "Embed any of our 67 crypto calculators on your own site with one line of HTML. Free, no signup, no tracking inside the widget.",
  keywords: [
    "crypto calculator widget",
    "embed crypto calculator",
    "free crypto widget for website",
    "bitcoin calculator embed",
    "crypto tools iframe",
  ],
  alternates: { canonical: absoluteUrl("/widgets") },
  openGraph: {
    type: "website",
    title: "Free Crypto Calculator Widgets",
    description: "Embed any of 67 crypto calculators on your site with one line of HTML.",
    url: absoluteUrl("/widgets"),
    images: [ogImage("widgets", "Free crypto calculator widgets")],
  },
};

export default function Page() {
  // Sorted by category then title so the picker is navigable at 67 entries.
  const list = [...tools]
    .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
    .map((t) => ({ slug: t.slug, title: t.title, category: categories[t.category].label }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

    <JsonLd data={breadcrumbJsonLd([{ name: "Embeddable widgets", path: "/widgets" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Free Crypto Calculator Widgets",
          url: absoluteUrl("/widgets"),
          description: "Embed any TheCryptoTools calculator on your own site with one line of HTML.",
        }}
      />

      <nav className="mb-5 flex items-center gap-2 text-sm muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-ink">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Widgets</span>
      </nav>

      <header>
        <div className="eyebrow">Embed</div>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Put any of our calculators on your site
        </h1>
        <p className="muted mt-3 max-w-2xl text-lg leading-relaxed">
          All {tools.length} calculators work as embeddable widgets. One line of HTML, no signup, no
          API key, and no tracking inside the frame — pick a tool below and copy the snippet.
        </p>
      </header>

      <WidgetBuilder tools={list} />

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight">The terms, in plain words</h2>

        <h3 className="mt-6 text-lg font-bold">It is free, and it stays free</h3>
        <p className="muted mt-2 leading-relaxed">
          There is no account, no key and no usage limit. The widget is a static page on our domain;
          embedding it costs us close to nothing, so there is nothing to meter.
        </p>

        <h3 className="mt-6 text-lg font-bold">We ask for a credit link, and here is why</h3>
        <p className="muted mt-2 leading-relaxed">
          The snippet includes a visible line crediting the calculator, outside the frame. That
          placement is deliberate and worth understanding: a link inside an iframe is a link from
          our page to our page, and does nothing for us. Only a link in your own HTML does. That
          credit is the entire price of the widget.
        </p>
        <p className="muted mt-2 leading-relaxed">
          If your site&rsquo;s policy is to mark third-party links as{" "}
          <code className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs">nofollow</code> or{" "}
          <code className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs">sponsored</code>,
          add it — we would rather have an honest link than a good one. Search engines discount
          widget links at scale anyway, and a page full of widget credits helps nobody.
        </p>

        <h3 className="mt-6 text-lg font-bold">Nothing is tracked inside the widget</h3>
        <p className="muted mt-2 leading-relaxed">
          The embedded page loads no analytics and no ad tag — which is unusual enough to state
          plainly. Every calculation runs in your visitor&rsquo;s browser and nothing is sent anywhere, so
          embedding one does not make your site a party to anybody&rsquo;s data collection and does not
          need a mention in your cookie banner.
        </p>

        <h3 className="mt-6 text-lg font-bold">It will keep working</h3>
        <p className="muted mt-2 leading-relaxed">
          The widget renders the same calculator as{" "}
          <Link href="/tools" className="font-semibold text-brand-ink hover:underline">
            the page on our site
          </Link>{" "}
          — one implementation, so an embedded copy cannot quietly fall out of date while ours
          improves. If we ever had to retire a widget, the URL would redirect to the tool rather
          than break.
        </p>

        <h3 className="mt-6 text-lg font-bold">Sizing</h3>
        <p className="muted mt-2 leading-relaxed">
          The frame starts at whatever height you choose. The optional script lets the widget report
          its real height as the reader types, which removes the inner scrollbar. It checks the
          message origin before touching anything, so it only ever reacts to our frames.
        </p>
      </section>
    </div>
  );
}
