import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { ogImage, breadcrumbJsonLd, datasetJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getStrategyGroups } from "@/lib/dca/build-snapshot";
import { strategyTypeFor } from "@/lib/dca/strategy-types";
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
  const tagline = g ? strategyTypeFor(g.name)?.tagline : undefined;
  const title = `${name} — live results across ${coins} coins`;
  const description = g
    ? `${name}: ${g.subtitle}.${tagline ? ` ${tagline}` : ""} Live real-market test results across ${coins} coins — ROI, drawdown, the safety-order grid and closed-deal history, updated continuously. Not financial advice.`
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
      {g && (
        <JsonLd data={datasetJsonLd({
          name: `${g.name} — live DCA strategy results`,
          description: `Live real-market results for the ${g.name} DCA-grid strategy across ${g.coins} coins: ROI, realized and unrealized P&L, win rate, drawdown and closed-deal history, updated continuously.`,
          path: `/dca/${params.strategy}`,
          variableMeasured: "ROI, realized P&L, unrealized P&L, win rate, drawdown, deals",
        })} />
      )}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <StrategyClient slug={params.strategy} initial={g} />
      </div>
    </>
  );
}
