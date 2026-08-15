"use client";

import { useState } from "react";
import type { DonationAddress } from "@/lib/donate";
import { track } from "@/lib/analytics";

export function DonateCard({ item }: { item: DonationAddress }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(item.address);
      setCopied(true);
      // Copying the address is as close to intent as this page can observe —
      // whether a transfer follows happens on-chain, where we cannot see it.
      // Worth watching before adding more chains than TRON.
      track("donate_address_copy", { chain: item.id });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked on insecure origins and in some mobile browsers —
      // the address is selectable on screen either way, so just leave it be.
    }
  }

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold">{item.network}</h2>
        <span className="chip !px-2.5 !py-0.5 text-xs">{item.tag}</span>
        <span className="muted text-xs">Accepts {item.accepts.join(" · ")}</span>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* The QR keeps a white plate in both themes — inverting it stops most
            scanners from reading the code. */}
        <div className="shrink-0 self-center rounded-xl bg-white p-2 sm:self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.qr}
            alt={`${item.network} donation address QR code`}
            width={148}
            height={148}
            className="h-[148px] w-[148px] [image-rendering:pixelated]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label className="eyebrow" htmlFor={`addr-${item.id}`}>
            Address
          </label>
          <input
            id={`addr-${item.id}`}
            readOnly
            value={item.address}
            onFocus={(e) => e.currentTarget.select()}
            className="input-field mt-2 w-full font-mono text-xs sm:text-sm"
            aria-label={`${item.network} donation address`}
          />
          <button type="button" onClick={copy} className="btn-primary mt-3 w-full sm:w-auto">
            {copied ? "✓ Copied" : "Copy address"}
          </button>

          <p className="mt-4 rounded-xl border-l-4 border-amber-500 bg-[var(--bg-elevated)] px-4 py-3 text-sm">
            <strong>Check the network.</strong> {item.warning}
          </p>
        </div>
      </div>
    </div>
  );
}
