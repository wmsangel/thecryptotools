/**
 * Tool categories. Every tool belongs to exactly one category. Categories drive
 * navigation, category landing pages and internal linking for SEO.
 *
 * The `id` is the URL slug (/category/{id}) and the discriminator used in tool
 * configs. Adding a category is a one-line change here.
 */
export interface Category {
  id: CategoryId;
  title: string;
  /** Short plural noun used in nav, e.g. "Trading Calculators". */
  label: string;
  description: string;
  /** Emoji/icon token rendered in nav + cards. Kept as text to avoid an icon dep. */
  icon: string;
  /** Ordering weight for nav (lower = earlier). */
  order: number;
}

export const CATEGORY_IDS = [
  "trading",
  "grid",
  "portfolio",
  "market",
  "ai",
  "dev",
  "converters",
  "defi",
  "mining",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const categories: Record<CategoryId, Category> = {
  trading: {
    id: "trading",
    title: "Trading Calculators",
    label: "Trading",
    description:
      "Profit, ROI, risk/reward, position sizing and liquidation calculators for spot and futures traders.",
    icon: "📈",
    order: 1,
  },
  grid: {
    id: "grid",
    title: "Grid Trading Tools",
    label: "Grid",
    description:
      "Plan grid bots: grid spacing, per-grid profit, order counts and capital allocation.",
    icon: "🔲",
    order: 2,
  },
  portfolio: {
    id: "portfolio",
    title: "Portfolio Tools",
    label: "Portfolio",
    description:
      "Average entry, rebalancing, allocation and portfolio performance utilities.",
    icon: "💼",
    order: 3,
  },
  market: {
    id: "market",
    title: "Market Data Tools",
    label: "Market",
    description:
      "Live-price ready calculators, market cap, dominance and volatility helpers.",
    icon: "🌐",
    order: 4,
  },
  ai: {
    id: "ai",
    title: "AI Tools",
    label: "AI",
    description:
      "AI-assisted crypto utilities: trade analysis, strategy hints and generated tools.",
    icon: "🤖",
    order: 5,
  },
  dev: {
    id: "dev",
    title: "Developer Tools",
    label: "Dev",
    description:
      "JSON, wallet mocks, timestamps, Base64 and random data generators for builders.",
    icon: "🛠️",
    order: 6,
  },
  converters: {
    id: "converters",
    title: "Converters",
    label: "Converters",
    description:
      "Unit, currency, satoshi, gwei and token amount converters.",
    icon: "🔁",
    order: 7,
  },
  defi: {
    id: "defi",
    title: "DeFi Tools",
    label: "DeFi",
    description:
      "Impermanent loss, LP yield, lending APY and DeFi position calculators.",
    icon: "🏦",
    order: 8,
  },
  mining: {
    id: "mining",
    title: "Mining & Staking Tools",
    label: "Mining",
    description:
      "Staking rewards, APY compounding and mining profitability estimators.",
    icon: "⛏️",
    order: 9,
  },
};

export const categoryList: Category[] = Object.values(categories).sort(
  (a, b) => a.order - b.order,
);

export function getCategory(id: string): Category | undefined {
  return categories[id as CategoryId];
}
