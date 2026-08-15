import type { Metadata } from "next";
import { tools } from "@/lib/tools/registry";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";
import { ToolsExplorer } from "./ToolsExplorer";
import { MyTools } from "@/components/MyTools";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: `All Crypto Tools — ${tools.length} Free Crypto Calculators`,
  description: `Every crypto tool on ${site.name}: ${tools.length} free crypto calculators and converters for trading, futures, portfolio, market cap, staking and DeFi. No signup.`,
  keywords: [
    "crypto tools",
    "crypto tool",
    "crypto calculators",
    "free crypto tools",
    "crypto money tools",
    "cryptocurrency calculator",
  ],
  alternates: { canonical: absoluteUrl("/tools") },
  // Without this the page inherited the base openGraph wholesale, which meant
  // sharing /tools showed the homepage URL and the generic card.
  openGraph: {
    type: "website",
    url: absoluteUrl("/tools"),
    title: `All Crypto Tools — ${tools.length} Free Crypto Calculators`,
    description: `Every crypto tool on ${site.name}: ${tools.length} free calculators and converters. No signup.`,
    images: [ogImage("tools", "All crypto tools")],
  },
};

export default function AllToolsPage() {
  // Pass only serializable fields to the client explorer.
  const items = tools.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    category: t.category,
    source: t.source ?? "builtin",
    keywords: t.seo.keywords,
  }));

  return (
    <div className="mx-auto max-w-content px-4 py-10">

    <JsonLd data={breadcrumbJsonLd([{ name: "All tools", path: "/tools" }])} />
      <header className="mb-8">
        <div className="eyebrow">Full catalog</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">All crypto tools</h1>
        <p className="muted mt-3 text-lg">
          {tools.length}+ free tools. Filter by category or search by name.
        </p>
      </header>
      <MyTools />
      {/* Names the grid so the outline does not jump h1 → h3 across 67 cards. */}
      <h2 className="sr-only">Every tool</h2>
      <ToolsExplorer items={items} />
    </div>
  );
}
