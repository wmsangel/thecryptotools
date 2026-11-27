import { tools } from "@/lib/tools/registry";

/**
 * Tool-name dictionary for the network beacon (izn.project.stats/beacon/README.md):
 * slug → human name, so the CRM shows names, not slugs. Built from the same
 * registry the pages use, plus the standalone apps that report under their own
 * slug. Static: written to out/izn-tools.json at build time.
 */
export const dynamic = "force-static";

const APPS: Record<string, string> = {
  "portfolio-analyzer": "Portfolio analyzer",
  "investment-calculator": "Investment calculator (backtest)",
  "grid-trading-backtest": "Grid trading backtest",
  "tax-loss-harvesting": "Tax loss harvesting",
  "cost-basis-method-calculator": "Cost basis method (FIFO/LIFO/HIFO)",
  "crypto-tax-report": "Crypto tax report",
};

export function GET() {
  const map: Record<string, { en: string }> = {};
  for (const t of tools) map[t.slug] = { en: t.title };
  for (const [slug, en] of Object.entries(APPS)) map[slug] = { en };
  return Response.json({ site: "thecryptotools.com", tools: map });
}
