import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getActiveCategories, tools, getTool } from "@/lib/tools/registry";
import { guides } from "@/lib/guides/registry";
import { staticPages } from "@/lib/pages/registry";
import { sortedCoins } from "@/lib/coins/registry";
import { allCoinToolPages } from "@/lib/coins/pairs";
import { getHistoryMeta, historyThrough } from "@/lib/backtest/history-index";
import { CHECKED_ON } from "@/lib/compare/data";
import { pairSlug, validPairs } from "@/lib/compare/pairs";
import { unlocksAsOf } from "@/lib/unlocks/meta";
import { halvingsComputedAt } from "@/lib/events/halvings";

/**
 * ============================================================================
 * Auto-generated sitemap.
 * ============================================================================
 * Covers home, /tools, every category, tool, guide, coin, coin×tool page and
 * the indexable static pages. Scales as content is added — no manual edits.
 *
 * `lastModified` is the one field here Google actually reads, and it used to
 * be `new Date()` for almost every URL. That meant every rebuild told Google
 * all ~290 pages had just changed, including 67 calculators whose formulas had
 * not been touched in weeks. A lastmod that is obviously the build clock is
 * worse than none: Google learns to discount the signal for the whole site.
 *
 * So each URL now derives its date from the content it renders, and any page
 * we cannot honestly date OMITS lastModified entirely rather than asserting
 * today. `lastmod` is optional in the protocol; a missing one costs nothing,
 * while a wrong one costs trust in every other one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const coins = sortedCoins();

  /** Newest of a set of ISO dates, ignoring the ones that aren't set. */
  const latest = (dates: (string | undefined)[]): Date | undefined => {
    const known = dates.filter((d): d is string => !!d).sort();
    return known.length ? new Date(known[known.length - 1]) : undefined;
  };

  const toolDate = (slug: string) => getTool(slug)?.updatedAt;
  const coinDate = (slug: string) => coins.find((c) => c.slug === slug)?.supplyAsOf;

  const newestTool = latest(tools.map((t) => t.updatedAt));
  const newestGuide = latest(guides.map((g) => g.reviewedAt ?? g.updatedAt));
  const newestCoin = latest(coins.map((c) => c.supplyAsOf));

  // An index page is exactly as fresh as the newest thing it lists.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: latest([
        newestTool?.toISOString(),
        newestGuide?.toISOString(),
        newestCoin?.toISOString(),
      ]),
      changeFrequency: "daily",
      priority: 1,
    },
    { url: absoluteUrl("/tools"), lastModified: newestTool, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/guides"), lastModified: newestGuide, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/coins"), lastModified: newestCoin, changeFrequency: "weekly", priority: 0.8 },
    // Dated by the price history it replays, not by the build — the page's
    // content genuinely changes only when `npm run history` is re-run.
    {
      url: absoluteUrl("/investment-calculator"),
      lastModified: historyThrough ? new Date(historyThrough) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Same reasoning as the investment calculator: these two are computed from
    // the price snapshot, so they change when `npm run history` runs and not
    // when the site is rebuilt.
    {
      url: absoluteUrl("/portfolio"),
      lastModified: historyThrough ? new Date(historyThrough) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/portfolio/correlation"),
      lastModified: historyThrough ? new Date(historyThrough) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // The embed builder. The widgets themselves (/embed/<tool>/) are absent on
    // purpose — they are noindex duplicates of the tool pages, and listing them
    // would ask Google to crawl 67 pages we have told it to ignore.
    { url: absoluteUrl("/widgets"), lastModified: newestTool, changeFrequency: "monthly", priority: 0.6 },
    // Dated by when the platform facts were last checked, not by the build.
    { url: absoluteUrl("/compare"), lastModified: new Date(CHECKED_ON), changeFrequency: "monthly", priority: 0.8 },
    // Dated by the snapshot, not the build — the schedule only moves when
    // `npm run unlocks` is re-run.
    { url: absoluteUrl("/unlocks"), lastModified: new Date(unlocksAsOf), changeFrequency: "weekly", priority: 0.8 },
    // The dates themselves are rules (annual deadlines) or law, so the only
    // thing that actually moves is the halving estimate — date the page from
    // when those block heights were read, not from the build.
    {
      url: absoluteUrl("/calendar"),
      lastModified: latest([halvingsComputedAt, newestGuide?.toISOString()]),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // No content date exists for these four. /prices and the ticker are live
    // data fetched in the browser — the HTML itself does not change — so even
    // "today" would be a claim about the wrong thing.
    { url: absoluteUrl("/exchanges"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/prices"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/crypto-tax-report"), changeFrequency: "weekly", priority: 0.9 },
    // Same reasoning as the tax report: the page is a client-side calculator
    // over the visitor's own file, so its HTML has no content date to claim.
    { url: absoluteUrl("/tax-loss-harvesting"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/cost-basis-method-calculator"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/donate"), changeFrequency: "monthly", priority: 0.4 },
  ];

  const coinRoutes: MetadataRoute.Sitemap = coins.map((c) => ({
    url: absoluteUrl(`/coins/${c.slug}`),
    lastModified: c.supplyAsOf ? new Date(c.supplyAsOf) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // A coin×tool page moves when either half of it moves.
  const coinToolRoutes: MetadataRoute.Sitemap = allCoinToolPages().map(({ coin, spec }) => ({
    url: absoluteUrl(`/coins/${coin.slug}/${spec.slug}`),
    lastModified: latest([coinDate(coin.slug), toolDate(spec.toolSlug)]),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Same filter as the route's generateStaticParams — listing a coin with no
  // price series would point Google at a page that was never generated.
  const backtestRoutes: MetadataRoute.Sitemap = coins
    .filter((c) => getHistoryMeta(c.slug))
    .map((c) => ({
    url: absoluteUrl(`/investment-calculator/${c.slug}`),
    lastModified: (() => {
      const end = getHistoryMeta(c.slug)?.end;
      return end ? new Date(end) : undefined;
    })(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const compareRoutes: MetadataRoute.Sitemap = validPairs().map((pair) => ({
    url: absoluteUrl(`/compare/${pairSlug(pair)}`),
    lastModified: new Date(CHECKED_ON),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const pageRoutes: MetadataRoute.Sitemap = staticPages
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: absoluteUrl(`/${p.slug}`),
      lastModified: new Date(p.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
    url: absoluteUrl(`/guides/${g.slug}`),
    // Re-confirming a tax rate against HMRC makes the page newly useful even
    // when not a word of it changed, so the review date wins when it is later.
    lastModified: latest([g.updatedAt, g.reviewedAt]),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getActiveCategories().map((c) => ({
    url: absoluteUrl(`/category/${c.id}`),
    lastModified: latest(tools.filter((t) => t.category === c.id).map((t) => t.updatedAt)),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => !t.noindex)
    .map((t) => ({
      url: absoluteUrl(`/tools/${t.slug}`),
      lastModified: t.updatedAt ? new Date(t.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: t.featured ? 0.9 : 0.8,
    }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...guideRoutes,
    ...toolRoutes,
    ...coinRoutes,
    ...coinToolRoutes,
    ...backtestRoutes,
    ...compareRoutes,
    ...pageRoutes,
  ];
}
