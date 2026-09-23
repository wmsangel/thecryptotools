import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getStrategyGroups } from "@/lib/dca/build-snapshot";
import { StrategyClient } from "./StrategyClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStrategyGroups().map((g) => ({ strategy: g.slug }));
}

function find(slug: string) {
  return getStrategyGroups().find((g) => g.slug === slug) ?? null;
}

export function generateMetadata({ params }: { params: { strategy: string } }): Metadata {
  const g = find(params.strategy);
  const name = g?.name ?? "DCA strategy";
  const coins = g?.coins ?? 0;
  const title = `${name} — live results across ${coins} coins`;
  const description = g
    ? `${name}: ${g.subtitle}. Live real-market test results across ${coins} coins — ROI, drawdown, the safety-order grid and closed-deal history, updated continuously. Not financial advice.`
    : "Live DCA strategy — real-market test results.";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/dca/${params.strategy}`) },
    openGraph: { title, description, url: absoluteUrl(`/dca/${params.strategy}`), images: [ogImage("dca", name)] },
  };
}

export default function StrategyPage({ params }: { params: { strategy: string } }) {
  const g = find(params.strategy);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "DCA strategy lab", path: "/dca" },
        { name: g?.name ?? "Strategy", path: `/dca/${params.strategy}` },
      ])} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <StrategyClient slug={params.strategy} initial={g} />
      </div>
    </>
  );
}
