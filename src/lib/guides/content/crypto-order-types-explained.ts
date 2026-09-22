import type { Guide } from "../types";

const guide: Guide = {
  slug: "crypto-order-types-explained",
  title: "Crypto Order Types Explained: Market vs Limit vs Stop-Loss",
  description:
    "What every order type on a crypto exchange actually does — market, limit, stop-loss, stop-limit, take-profit, trailing stop and OCO — the fees and slippage behind each, and when to use which.",
  readingMinutes: 10,
  updatedAt: "2026-09-22",
  reviewedAt: "2026-09-22",
  seo: {
    title: "Crypto Order Types Explained — Market vs Limit vs Stop-Loss",
    keywords: [
      "crypto order types",
      "market vs limit order",
      "what is a stop-loss order",
      "stop limit vs stop loss",
      "limit order crypto",
      "trailing stop crypto",
      "oco order",
      "maker vs taker fee",
    ],
    description:
      "A plain-English guide to every crypto order type — market, limit, stop-loss, stop-limit, take-profit, trailing stop and OCO — with the maker/taker fees and slippage behind each, and when to use which.",
  },
  keyTakeaways: [
    "A **market order** fills now at whatever price is available (fast, but pays the **taker** fee and risks **slippage**).",
    "A **limit order** fills only at your price or better (control, usually the cheaper **maker** fee) — but may never fill.",
    "A **stop-loss** is a trigger, not a fill: at your stop it fires a **market** order (stop-limit fires a limit order that can miss in a fast move).",
    "**Take-profit, trailing stops and OCO** automate exits so you don't have to watch the screen.",
    "On **thin altcoins** prefer limit orders — a market order can walk the order book and fill far from the price you saw.",
  ],
  relatedTools: [
    "stop-loss-take-profit-calculator",
    "take-profit-ladder-calculator",
    "position-size-calculator",
    "liquidation-calculator",
    "trading-fee-calculator",
  ],
  body: [
    { type: "p", text: "An order is just an instruction to the exchange: what to buy or sell, how much, and — crucially — under what price conditions. The order type you pick decides the trade-off between three things you cannot maximise at once: speed of execution, control over price, and certainty that it fills at all. Get the type wrong and you either overpay on a market order or miss the move on a limit one. Here is every type that matters, in plain terms." },

    { type: "h2", text: "Market vs limit: the two you start with" },
    { type: "p", text: "A market order executes immediately against whatever orders are resting on the book, taking the best available price and then the next, and the next, until it is filled. It prioritises speed over price. Because it removes liquidity from the book, it pays the taker fee, and on anything but the deepest pairs it suffers slippage — the gap between the price you saw and the average price you actually got." },
    { type: "p", text: "A limit order sets the worst price you will accept: buy at X or lower, sell at Y or higher. It rests on the book until the market reaches it, so it gives you price control and usually earns the cheaper maker fee — at the cost of certainty. If the market never touches your price, it simply never fills." },
    { type: "table",
      headers: ["", "Market order", "Limit order"],
      rows: [
        { cells: ["Fills", "Immediately", "Only at your price or better"] },
        { cells: ["You control", "Speed", "Price"] },
        { cells: ["Might not fill?", "No — always fills", "Yes — may never fill"] },
        { cells: ["Fee side", "Taker (higher)", "Maker (lower), if it rests"] },
        { cells: ["Slippage risk", "Yes, esp. on thin pairs", "None — price is fixed"] },
      ],
      caption: "The core trade-off: a market order buys certainty of execution; a limit order buys certainty of price.",
    },
    { type: "p", text: "The maker/taker split is not a rounding error — over many trades it compounds. Check what each side costs on your exchange before you default to market orders." },
    { type: "tool", slug: "trading-fee-calculator" },

    { type: "h2", text: "Stop-loss: a trigger, not a fill" },
    { type: "p", text: "This is the one most beginners misunderstand. A stop-loss is not itself an order sitting on the book — it is a trigger that submits an order when the price crosses your stop level. A plain stop-loss (stop-market) fires a market order the instant the stop is hit, which guarantees you exit but not the price: in a fast drop or a gap, the market order can fill well below your stop. That is slippage on the exit, and on a volatile alt it can be brutal." },
    { type: "callout", text: "A stop-loss set at $100 does not guarantee you sell at $100. It guarantees an order is sent when the price hits $100 — the fill can be lower (or higher, when selling into a spike) depending on liquidity at that moment." },
    { type: "p", text: "Set the stop level itself against how the coin actually moves, not a round number — and size the position so that being stopped out costs a planned, survivable amount." },
    { type: "tool", slug: "stop-loss-take-profit-calculator" },

    { type: "h2", text: "Stop-limit: control the price, risk the miss" },
    { type: "p", text: "A stop-limit adds a second price. When the stop triggers, it submits a limit order at your limit price instead of a market order — so you cap how bad a fill you will accept. The danger is the mirror image of the plain stop-loss: if the price rockets past your limit before the order fills, it does not fill at all, and you are left holding a position you meant to close. Stop-limit protects you from slippage but exposes you to not exiting. Choose based on which you fear more: a bad fill, or no fill." },

    { type: "h2", text: "Take-profit, trailing stops and OCO" },
    { type: "ul", items: [
      "Take-profit — the inverse of a stop-loss: a trigger that closes the position once price reaches a target in your favour, so a gain is banked automatically instead of round-tripping back.",
      "Trailing stop — a stop that follows the price up (for a long) by a fixed distance or percent, locking in more profit as the move extends and only triggering when price reverses by that amount.",
      "OCO (one-cancels-the-other) — a bracket that places a take-profit and a stop-loss at once; whichever fills first cancels the other. It is the standard way to leave a trade fully managed without watching it.",
    ] },
    { type: "p", text: "Rather than a single take-profit, many traders scale out — selling portions at rising targets so they bank gains without having to call the exact top. A ladder of limit sells does exactly that." },
    { type: "tool", slug: "take-profit-ladder-calculator" },

    { type: "h2", text: "A few advanced flags worth knowing" },
    { type: "ul", items: [
      "Post-only — rejects the order if it would execute immediately, guaranteeing you pay the maker fee (used by fee-sensitive traders).",
      "Reduce-only — on futures, ensures an order can only shrink or close a position, never accidentally flip you to the other side.",
      "Iceberg — shows only a slice of a large order on the book at a time, so a big size does not scare the market.",
      "Time-in-force (GTC / IOC / FOK) — how long the order lives: good-til-cancelled, immediate-or-cancel, or fill-or-kill.",
    ] },

    { type: "h2", text: "Which order type, when" },
    { type: "ul", items: [
      "Entering a liquid pair (BTC, ETH) and you want in now: market order — slippage is minimal.",
      "Entering at a specific price, or on a thin altcoin: limit order — never send a market order into a shallow book.",
      "Protecting a position from a crash: stop-loss (accept slippage to guarantee the exit) or stop-limit (cap the price, accept it might miss).",
      "Banking a target without watching: take-profit, or an OCO to arm both exits at once.",
      "Riding a trend while protecting gains: trailing stop.",
    ] },
    { type: "p", text: "Whatever type you use to exit, the exit levels only make sense relative to your position size and, on leverage, your liquidation price. Work those out before you place the order, not after." },
    { type: "tool", slug: "position-size-calculator" },
    { type: "tool", slug: "liquidation-calculator" },
  ],
  faq: [
    { q: "What is the difference between a market and a limit order?", a: "A market order fills immediately at the best available price but pays the taker fee and can slip on thin pairs. A limit order fills only at your chosen price or better and usually earns the lower maker fee, but may never fill if the market doesn't reach it." },
    { q: "Does a stop-loss guarantee my exit price?", a: "No. A plain stop-loss (stop-market) guarantees an order is sent when your stop level is hit, but it fills at the market price then available — which can be worse than your stop during a fast move or gap. A stop-limit caps the fill price but risks not filling at all." },
    { q: "What is the difference between stop-loss and stop-limit?", a: "Both trigger at your stop price. A stop-loss then sends a market order (guaranteed exit, uncertain price); a stop-limit sends a limit order (capped price, but it may not fill if price runs past your limit)." },
    { q: "What is an OCO order?", a: "One-cancels-the-other: it places a take-profit and a stop-loss simultaneously, and when one executes the other is automatically cancelled. It's the simplest way to leave a trade with both an upside target and a downside exit armed." },
    { q: "What is the difference between maker and taker fees?", a: "You pay the taker fee when your order removes liquidity by filling immediately (a market order, or a limit order that executes on placement). You pay the lower maker fee when your limit order rests on the book and adds liquidity. A post-only flag forces the maker side." },
    { q: "Which order type is best for altcoins?", a: "Usually a limit order. Small-cap altcoins have thin order books, so a market order can walk several price levels and fill far from the quoted price. Setting a limit protects you from that slippage." },
  ],
};

export default guide;
