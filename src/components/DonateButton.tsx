"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * A small, quiet floating widget in the corner: Support (donate) + Feedback.
 *
 * Deliberately quiet, same as the donate pill it grew from. Everything on this
 * site is free with no account and no paywall; the ask stays small, honest and
 * easy to ignore — a pill in the corner that never covers the answer someone
 * came for and never animates for attention. It only opens on an explicit click
 * (never hover, which is unusable on a phone and for screen readers).
 *
 * Placement rules kept from the original:
 *  - `z-40`, below the cookie banner's `z-50` — a consent banner is never obscured.
 *  - Mounted only in the `(site)` layout, so it can never reach `/embed/`: a widget
 *    is a guest on someone else's page and must not beg their visitors for money.
 *  - On `/donate` the Support item is dropped (it would point at the current page);
 *    feedback stays useful there.
 *
 * Feedback is intentionally backend-free: it opens Telegram or email rather than
 * a form, so nothing is collected or stored by us.
 */
const TELEGRAM = "https://t.me/izagorodnyi";
const EMAIL = "mailto:info@thecryptotools.com?subject=" + encodeURIComponent("Feedback — TheCryptoTools");

export function DonateButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const section = pathname?.split("/").filter(Boolean)[0] ?? "home";
  const onDonate = pathname?.startsWith("/donate");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const itemCls =
    "pointer-events-auto flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]";

  return (
    <aside aria-label="Support and feedback" className="fixed bottom-4 right-4 z-40 print:hidden">
      <div ref={ref} className="pointer-events-none flex flex-col items-end gap-2">
        {open && (
          <div
            role="menu"
            aria-label="Support and feedback"
            className="pointer-events-auto w-60 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5 shadow-xl"
          >
            {!onDonate && (
              <Link
                href="/donate"
                role="menuitem"
                className={itemCls}
                onClick={() => { track("donate_cta_click", { section }); setOpen(false); }}
              >
                <CoffeeCup />
                <span>
                  <span className="block">Support the site</span>
                  <span className="block text-xs font-normal text-[var(--muted)]">It&apos;s free — buy me a coffee</span>
                </span>
              </Link>
            )}
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className={itemCls}
              onClick={() => { track("feedback_click", { section, via: "telegram" }); setOpen(false); }}
            >
              <TelegramIcon />
              <span>
                <span className="block">Feedback on Telegram</span>
                <span className="block text-xs font-normal text-[var(--muted)]">Report a problem or idea</span>
              </span>
            </a>
            <a
              href={EMAIL}
              role="menuitem"
              className={itemCls}
              onClick={() => { track("feedback_click", { section, via: "email" }); setOpen(false); }}
            >
              <MailIcon />
              <span>
                <span className="block">Email us</span>
                <span className="block text-xs font-normal text-[var(--muted)]">info@thecryptotools.com</span>
              </span>
            </a>
          </div>
        )}

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Support and feedback"
          onClick={() => setOpen((o) => !o)}
          className="pointer-events-auto group flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-semibold shadow-lg transition hover:border-brand-500/60 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:px-4"
          title="Support the site or send feedback"
        >
          <ChatHeart />
          <span className="hidden sm:inline">Support &amp; feedback</span>
        </button>
      </div>
    </aside>
  );
}

function CoffeeCup() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-brand-ink">
      <path d="M8 2.5c-.6.8-.6 1.6 0 2.4M12 2.5c-.6.8-.6 1.6 0 2.4" opacity="0.7" />
      <path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" />
      <path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M3 21h15" />
    </svg>
  );
}

function ChatHeart() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-brand-ink">
      <path d="M21 11.5a8 8 0 0 1-11.3 7.3L4 20l1.2-3.6A8 8 0 1 1 21 11.5Z" />
      <path d="M12 14c-2-1.3-3-2.4-3-3.6A1.4 1.4 0 0 1 12 9a1.4 1.4 0 0 1 3 1.4c0 1.2-1 2.3-3 3.6Z" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-brand-ink">
      <path d="M21.5 4.5 2.8 11.8c-.7.3-.7 1.3 0 1.5l4.6 1.5 1.8 5c.2.6 1 .7 1.4.2l2.5-2.7 4.6 3.4c.5.4 1.2.1 1.3-.5L22 5.3c.1-.6-.4-1-1-.8Z" />
      <path d="m8 14 9-6-6.5 7" opacity="0.6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-brand-ink">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}
