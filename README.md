# TheCryptoTools

Free crypto calculators, tools and guides — **[thecryptotools.com](https://thecryptotools.com)**.

A config-driven, 100% static Next.js site. Every tool, guide and coin is a small
config file; SEO (titles, meta, OG images, JSON-LD), the sitemap and `robots.txt`
are all generated from those configs. No server, no database, no API keys, no
runtime `/api` routes — the build produces a plain `out/` folder served as static files.

## What's inside

- **69 calculators** — trading, futures, portfolio, DeFi, mining, converters, and dev tools
- **60 guides** — long-form articles cross-linked to the relevant tools
- **62 coins** — per-coin profit/staking calculators and hubs
- **Flagships** — investment backtester ("what if I'd invested"), portfolio analyzer +
  correlation matrix, crypto tax report + tax-loss harvesting, token-unlock and events calendars
- **Extras** — live price ticker, embeddable widgets, platform comparisons, shareable tool URLs

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · static export (`output: "export"`).
Node `>=18.17`.

## Local development

```bash
npm install
cp .env.example .env.local   # adjust values as needed
npm run dev                  # http://localhost:3000
```

`.env.local` holds only public `NEXT_PUBLIC_*` values (site URL, AdSense/GA ids, ad toggle).

## Build

```bash
npm run build                # next build + OG cards + llms.txt + 404 → out/
```

The `build` script runs `next build` then generates OG share cards, `llms.txt`, and the
static `404.html`. The result is the deployable `out/` directory.

Useful checks: `npm run typecheck`, `npm run lint`.

## Data refresh (manual, not part of the build)

These hit external APIs and take minutes, so they're run by hand and commit generated data:

```bash
npm run history    # daily price history for the backtester
npm run unlocks    # token unlock schedules (DefiLlama)
npm run halvings   # halving estimates from live chain tips
```

## Adding a tool or guide

Each tool is one config in `src/lib/tools/configs/*.ts`, registered in
`src/lib/tools/registry.ts`; guides live under `src/lib/guides/`. See
[`docs/ADDING_TOOLS.md`](docs/ADDING_TOOLS.md).

## Deployment

The site is hosted on shared hosting behind Cloudflare. `npm run deploy` builds, then
uploads only the changed files and purges the Cloudflare cache — see
[`docs/DEPLOY.md`](docs/DEPLOY.md). Deploy credentials live in `scripts/.deploy.env`
(gitignored); a template is in `scripts/.deploy.env.example`.

> Note: `git push` does **not** deploy. Publishing to production is the separate
> `npm run deploy` step.

## Project layout

```
src/
  app/(site)/     page routes (tools, coins, guides, portfolio, calendar, …)
  app/(embed)/    minimal layout for embeddable widgets
  components/     shared UI (ToolEngine, charts, ads, header/footer)
  lib/            configs + engines: tools, guides, backtest, portfolio, harvest, …
scripts/          build-time generators + the deploy script
public/           static assets, logos, generated data, OG cards
docs/             ADDING_TOOLS.md, DEPLOY.md
```
