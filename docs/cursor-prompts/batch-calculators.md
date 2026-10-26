ВЫПОЛНЕНО, 26.10.2026 — a18e7ef

# Cursor prompt — 4 новых калькулятора (thecryptotools)

Скопируй всё ниже в Cursor (репо `izn.crypto`).

---

Add **4 new calculators** to this config-driven Next.js static tools site. Follow the EXISTING pattern exactly — do not invent new structure.

## How a tool is added (do this for each of the 4)
1. Create `src/lib/tools/configs/<slug>.ts` exporting `const tool: ToolConfig = {...}; export default tool;`.
   Copy the SHAPE from an existing simple config: `src/lib/tools/configs/gas-fee-calculator.ts` and `src/lib/tools/configs/crypto-tax-calculator.ts`. Match their fields, order and style.
2. Register it in `src/lib/tools/registry.ts`: add ONE import line near the other `import … from "./configs/…"` lines, and add the camelCase name to the `builtinTools: ToolConfig[]` array.
3. No route file is needed — `/tools/[slug]/` renders every registered tool automatically.

## Hard rules
- **Never fabricate data.** No hardcoded live fees, gas prices, exchange rates or APYs. Every such number is a USER INPUT with a sensible editable `default` and a note telling them to set the real value. Formulas only compute from inputs.
- Each config needs: `slug`, `title`, `updatedAt: "2026-10-23"`, `category`, `featured: false`, `popular: false`, `source: "builtin"`, `seo: { keywords: [...], description }`, `inputs: [...]`, `resultLabel`, `resultUnit`, `compute: (i) => ({ value, note, breakdown })`, `relatedSlugs`, `faq` (3 Q&A), `body` (2–3 short paragraphs). Mirror gas-fee-calculator.ts / crypto-tax-calculator.ts for exact field types.
- `compute` returns `{ value: string (formatted), note: string ("… — not financial advice." where relevant), breakdown: [{ label, value, emphasis? }] }`. Use the project's `fmtUsd`/`fmtNumber` helpers from `@/lib/format` like the other configs.
- Input `type` is only `"number" | "text" | "select"`. Categories available: trading, grid, portfolio, market, ai, dev, converters, defi, mining.
- Keep copy honest and concise, matching the site's voice. No emojis in configs.
- When done: run `npm run build` — it MUST pass (tsc + eslint + next build). Fix any error. Touch ONLY the 5 files (4 configs + registry.ts).

## The 4 calculators

### 1. bridge-fee-calculator  (category: defi)
Title: "Crypto Bridge Fee Calculator". Keywords: "crypto bridge fee calculator", "bridge cost calculator", "cross chain bridge fees", "how much does bridging cost".
Inputs: `amount` (Amount to bridge, USD, default 1000), `bridgeFeePct` (Bridge fee %, default 0.1, step 0.01), `networkFee` (Network/gas fee, USD, default 5, optional).
compute:
```
fee = amount * (bridgeFeePct/100) + (networkFee||0)
received = amount - fee
effectivePct = amount>0 ? fee/amount*100 : 0
```
value = fmtUsd(fee) (Total bridging cost). breakdown: Amount received = fmtUsd(received) (emphasis), Effective fee = effectivePct%, Network fee = fmtUsd(networkFee). note: fees differ per bridge — enter the quote your bridge shows.

### 2. nft-mint-cost-calculator  (category: defi)
Title: "NFT Mint Cost Calculator". Keywords: "nft mint cost calculator", "nft minting fees", "how much to mint an nft", "nft gas fee calculator".
Inputs: `mintPrice` (Mint price per NFT, ETH, default 0.05, step 0.001), `quantity` (Quantity, default 1, min 1, step 1), `gasPrice` (Gas price, gwei, default 20, step 1), `gasPerMint` (Gas units per mint, default 150000, step 1000), `ethPrice` (ETH price, USD, default 3000, step 1).
compute:
```
mintEth = mintPrice * quantity
gasEth  = (gasPrice * gasPerMint * quantity) / 1e9
totalEth = mintEth + gasEth
totalUsd = totalEth * ethPrice
```
value = fmtUsd(totalUsd) (Total mint cost). resultUnit "USD". breakdown: Total in ETH = totalEth ETH (emphasis), Mint price portion = mintEth ETH, Gas portion = gasEth ETH. note: gas varies by network congestion; set the current gwei and ETH price.

### 3. hodl-vs-sell-calculator  (category: portfolio)
Title: "HODL vs Sell Calculator". Keywords: "hodl vs sell calculator", "should i sell or hold crypto", "hold vs sell crypto", "sell now or hold calculator".
Inputs: `amount` (Coins held, default 1, step 0.0001), `costBasis` (Your buy price, USD, default 20000, step 1), `currentPrice` (Current price, USD, default 60000, step 1), `targetPrice` (Target/future price, USD, default 100000, step 1), `taxRate` (Tax on gains %, default 20, min 0, max 100, step 0.1, optional).
compute:
```
r = (taxRate||0)/100
sellProceeds = amount*currentPrice
sellGain = amount*(currentPrice-costBasis)
sellTax = sellGain>0 ? sellGain*r : 0
afterSellNow = sellProceeds - sellTax
holdValue = amount*targetPrice
holdGain = amount*(targetPrice-costBasis)
holdTax = holdGain>0 ? holdGain*r : 0
afterHold = holdValue - holdTax
diff = afterHold - afterSellNow
```
value = fmtUsd(diff) ("Extra from holding to target, after tax"). breakdown: After-tax if you sell now = fmtUsd(afterSellNow) (emphasis), After-tax if you hold to target = fmtUsd(afterHold) (emphasis), Difference = fmtUsd(diff). note: assumes the target price is actually reached — it is not a prediction, and not financial advice.

### 4. stablecoin-interest-calculator  (category: defi)
Title: "Stablecoin Interest Calculator". **Differentiation (important):** this must NOT be a clone of compound-interest-calculator. Its angle is *stablecoin passive income*: stablecoin-specific framing (USDC/USDT), a **monthly passive-income** figure, and a **vs-bank-savings** comparison line. Set `relatedSlugs` to ["compound-interest-calculator", "yield-farming-apy-calculator", "crypto-savings-goal-calculator"].
Keywords: "stablecoin interest calculator", "usdc interest calculator", "stablecoin yield calculator", "how much interest on stablecoins", "usdt interest calculator".
Inputs: `principal` (Stablecoins deposited, USD, default 10000, step 1), `apy` (APY %, default 8, step 0.1), `years` (Years, default 1, step 0.25), `frequency` (Compounding, type select, options daily/monthly/yearly, default "monthly"), `bankRate` (Compare to bank savings %, default 0.5, step 0.1, optional).
compute:
```
n = frequency==="daily"?365 : frequency==="yearly"?1 : 12
final = principal * Math.pow(1 + (apy/100)/n, n*years)
interest = final - principal
monthlyIncome = principal * (apy/100) / 12
bankFinal = principal * Math.pow(1 + ((bankRate||0)/100), years)   // annual compounding
vsBank = final - bankFinal
```
value = fmtUsd(interest) ("Interest earned"). breakdown: Final balance = fmtUsd(final) (emphasis), Monthly passive income ≈ fmtUsd(monthlyIncome), Extra vs a bank at bankRate% = fmtUsd(vsBank). note: stablecoin yields are variable and carry smart-contract and de-peg risk — not financial advice.

## FAQ + body
Write 3 honest Q&A and 2–3 short body paragraphs per tool, in the site's voice (see gas-fee-calculator.ts / crypto-tax-calculator.ts). For stablecoin-interest, the body must make the stablecoin/passive-income angle explicit so it does not read as a generic compound-interest page.

After building successfully, stop — the site owner will have the changes reviewed (spot-check + build) before deploy.
