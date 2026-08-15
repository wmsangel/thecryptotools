import type { CategoryId } from "@/lib/categories";

/**
 * ============================================================================
 * Tool configuration schema — the heart of TheCryptoTools.
 * ============================================================================
 * Every tool on the platform is ONE object matching `ToolConfig`. No tool has
 * bespoke page code — the universal engine renders form, runs the formula,
 * renders results, FAQ and SEO from this object alone.
 *
 * FORMULA IS HYBRID (by design):
 *   - Built-in tools ship a typed `compute` function (fast, type-safe, can do
 *     anything JS can — including generators that return rich text).
 *   - AI-generated / DB-stored tools ship an `expression` string that is
 *     evaluated by our safe parser (lib/tools/formula.ts) — NO eval, NO Function.
 * A tool must provide exactly one of `compute` or `expression`.
 */

export type ToolInputType = "number" | "text" | "select";

export interface ToolInputOption {
  label: string;
  value: string;
}

export interface ToolInput {
  /** Key used in the inputs object passed to the formula. */
  name: string;
  /** Human label shown above the field. Defaults to a prettified `name`. */
  label?: string;
  type: ToolInputType;
  placeholder?: string;
  /** Prefilled value so the tool shows a live result on first paint. */
  default?: number | string;
  /** Small hint rendered under the field. */
  help?: string;
  /** Unit suffix rendered inside the field, e.g. "USD", "%". */
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  /** For type: "select". */
  options?: ToolInputOption[];
  /** Optional inputs don't block computation when empty. */
  optional?: boolean;
  /** Show a "use live price" button that fills this field with a live coin
   *  spot price (BTC/ETH/…). Use only on USD spot-price fields. */
  livePrice?: boolean;
}

export type ToolInputs = Record<string, number | string>;

export interface ToolResultRow {
  label: string;
  value: string | number;
  /** Highlight the primary result row. */
  emphasis?: boolean;
}

/**
 * A formula may return a bare value (number/string) OR a structured result with
 * a headline value plus a breakdown table. The engine normalizes both.
 */
export interface StructuredResult {
  value: number | string;
  unit?: string;
  /** Overrides the tool's default result label for this run. */
  label?: string;
  breakdown?: ToolResultRow[];
  /** Free-form note rendered under the result (e.g. warnings). */
  note?: string;
  /**
   * Raw text offered behind a copy button, in ADDITION to the readable result
   * above it — JSON, CSV, a generated address list.
   *
   * Exists because the generator tools had to choose between the two and chose
   * wrong. Returning a JSON string as `value` renders a wall of braces, which
   * is right for the developer who wanted fixtures and useless to everyone
   * else. Search Console showed the fake-portfolio generator with the best
   * click-through rate on the site, almost entirely from "fake crypto
   * portfolio" — a query that does not belong to a developer. They arrived and
   * were shown JSON.
   *
   * With this field a tool can render the human answer as `value` + `breakdown`
   * and still hand over the machine-readable payload.
   */
  copyText?: string;
  /** Button label for `copyText`. Defaults to "Copy". */
  copyLabel?: string;
  /**
   * How the headline number should read.
   *
   * The default brand gradient is a success colour, and it was being applied to
   * every result regardless of meaning — the grid calculator rendered "this
   * configuration loses money on every trade" as a cheerful green −0.15%. A
   * tool that knows its answer is bad has to be able to say so.
   *
   * Set deliberately by the tool, not inferred from the sign: plenty of tools
   * return legitimately negative numbers that are not warnings.
   */
  tone?: "positive" | "negative" | "neutral";
}

export type ToolComputeResult = number | string | StructuredResult;

export interface ToolFaqItem {
  q: string;
  a: string;
}

export interface ToolSeo {
  keywords: string[];
  description: string;
  /** Optional override for the <title>. Defaults to `${title} | ${site.name}`. */
  title?: string;
}

export interface ToolConfig {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  seo: ToolSeo;
  inputs: ToolInput[];

  /** Built-in path: typed function. Provide this OR `expression`. */
  compute?: (inputs: ToolInputs) => ToolComputeResult;
  /** Serializable path: safe math expression string. Provide this OR `compute`. */
  expression?: string;

  /** Default label + unit for the headline result. */
  resultLabel?: string;
  resultUnit?: string;
  /** Decimal places for numeric results (default 2). */
  precision?: number;

  faq: ToolFaqItem[];

  /** Curation flags used for homepage sections & internal linking. */
  featured?: boolean;
  popular?: boolean;
  /** Explicit related tools; falls back to same-category tools when empty. */
  relatedSlugs?: string[];

  /** Provenance — "builtin" ships in code, "ai" was generated. */
  source?: "builtin" | "ai";
  /** ISO date; used in sitemap lastmod and schema.org. */
  updatedAt?: string;
}

/** Runtime guard: a valid tool must be computable one of the two ways. */
export function isComputable(tool: ToolConfig): boolean {
  return typeof tool.compute === "function" || typeof tool.expression === "string";
}
