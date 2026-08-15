import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * ============================================================================
 * robots.txt
 * ============================================================================
 * This file used to be shadowed by Cloudflare's "Managed robots.txt", which
 * prepended its own block and left the served file with two `User-agent: *`
 * groups. That setting is now OFF, so the policy below is the whole policy —
 * if a crawler needs to be allowed or blocked, this is the only place to do it.
 *
 * The position it encodes: **cite us, don't train on us.**
 *
 *  - Crawlers that answer a question and link back send real visitors, so they
 *    are allowed explicitly. OAI-SearchBot (ChatGPT's index), PerplexityBot and
 *    ClaudeBot are separate agents from their companies' training crawlers, and
 *    the *-User agents are fetches a human actually asked for.
 *  - Crawlers that only harvest a training corpus get nothing back and are
 *    disallowed.
 *
 * Two of these cost nothing to block and are easy to misread, so, explicitly:
 * Google-Extended governs Gemini grounding and training ONLY — it has no effect
 * on Google Search ranking or on AI Overviews, both of which use plain
 * Googlebot. Applebot-Extended is likewise Apple Intelligence training, not
 * Spotlight/Siri search, which uses plain Applebot. Neither is blocked here.
 *
 * NOT carried over from the Cloudflare version: the `Content-Signal:` line and
 * its preamble. Next's robots.ts API emits only user-agent groups and the
 * sitemap, with no way to add a free-form directive, and that signal is a
 * declaration of terms rather than something any crawler enforces — the
 * Disallow rules below are what actually does the work. Restoring it would mean
 * dropping this typed route for a hand-written public/robots.txt, and losing
 * the generated sitemap URL with it.
 */

/** Training-only crawlers: they take the corpus and send nothing back. */
const TRAINING_ONLY = [
  "GPTBot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "Google-Extended",
  "Applebot-Extended",
  "Diffbot",
  "Omgilibot",
  "Timpibot",
];

/** AI search + user-initiated fetches: these cite the page and drive traffic. */
const AI_SEARCH = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Applebot",
  "Bingbot",
  "DuckDuckBot",
  "YandexBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_SEARCH.map((userAgent) => ({ userAgent, allow: "/" })),
      ...TRAINING_ONLY.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
