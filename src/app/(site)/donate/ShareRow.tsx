"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

/**
 * Free ways to help that cost nothing and — unlike a tip — actually move the
 * needle: a share and a GitHub star. Links back to the site are the project's
 * single biggest need (search ranking), so this sits on the donate page on
 * purpose: catch the grateful visitor and ask for a link, not just money.
 */
const SHARE_TEXT = "Free crypto calculators & guides — no signup, nothing you type leaves your browser:";
const REPO = "https://github.com/wmsangel/thecryptotools";

export function ShareRow() {
  const [copied, setCopied] = useState(false);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(site.url)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(site.url)}&title=${encodeURIComponent("Free crypto calculators & guides — no signup")}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(site.url);
      setCopied(true);
      track("share_click", { channel: "copy" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the URL is visible in the address bar anyway */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1">Share</span>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost px-3 py-1.5 text-sm"
        onClick={() => track("share_click", { channel: "x" })}
      >
        𝕏 Post
      </a>
      <a
        href={redditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost px-3 py-1.5 text-sm"
        onClick={() => track("share_click", { channel: "reddit" })}
      >
        Reddit
      </a>
      <button type="button" onClick={copyLink} className="btn-ghost px-3 py-1.5 text-sm">
        {copied ? "✓ Link copied" : "Copy link"}
      </button>
      <a
        href={REPO}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost px-3 py-1.5 text-sm"
        onClick={() => track("share_click", { channel: "github" })}
      >
        ★ Star on GitHub
      </a>
    </div>
  );
}
