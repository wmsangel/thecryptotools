"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  OPEN_CONSENT_EVENT,
  openConsentSettings,
  readConsent,
  writeConsent,
} from "@/lib/consent";
import { track } from "@/lib/analytics";

/**
 * GDPR/ePrivacy cookie banner. Renders nothing until we know the stored state,
 * so it never flashes for returning visitors. "Reject" is as easy to reach as
 * "Accept" — required by the EDPB and by Google's own certified-CMP guidance.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (!stored) {
      setOpen(true);
      return;
    }
    setAnalytics(stored.analytics);
    setAds(stored.ads);
  }, []);

  useEffect(() => {
    const reopen = () => {
      const stored = readConsent();
      setAnalytics(stored?.analytics ?? false);
      setAds(stored?.ads ?? false);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const decide = useCallback((choice: { analytics: boolean; ads: boolean }) => {
    writeConsent(choice);
    setAnalytics(choice.analytics);
    setAds(choice.ads);
    setOpen(false);
    setDetails(false);
    // Sent AFTER writeConsent so Consent Mode has already been updated — an
    // opt-in is then a consented hit rather than a cookieless one. The opt-out
    // case still arrives, cookielessly, which is the whole point: without it we
    // could not tell a rejection apart from a visitor who never saw the banner,
    // and so could not read the acceptance rate that scales every other number
    // in the property.
    track("consent_choice", {
      analytics: choice.analytics,
      ads: choice.ads,
      choice: choice.analytics && choice.ads ? "accept_all" : choice.analytics || choice.ads ? "custom" : "reject_all",
    });
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="card mx-auto max-w-4xl p-5 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="sm:pr-4">
            <h2 id="cookie-consent-title" className="text-base font-bold">
              🍪 We keep cookies to a minimum
            </h2>
            <p className="muted mt-1.5 text-sm leading-relaxed">
              Only strictly necessary storage (your theme and this choice) is used by
              default — your calculations never leave your browser. Analytics and
              advertising cookies load only if you allow them.{" "}
              <Link href="/cookies" className="font-medium text-brand-ink hover:underline">
                Cookie policy
              </Link>
              {" · "}
              <Link href="/privacy" className="font-medium text-brand-ink hover:underline">
                Privacy
              </Link>
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:w-52">
            <button
              type="button"
              onClick={() => decide({ analytics: true, ads: true })}
              className="btn-primary !py-2 text-sm"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => decide({ analytics: false, ads: false })}
              className="btn-ghost !py-2 text-sm"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={() => setDetails((d) => !d)}
              aria-expanded={details}
              className="text-xs font-semibold text-brand-ink hover:underline"
            >
              {details ? "Hide options" : "Customise"}
            </button>
          </div>
        </div>

        {details && (
          <div className="mt-5 space-y-3 border-t border-[var(--border)] pt-4">
            <Toggle
              checked
              disabled
              label="Strictly necessary"
              hint="Theme preference and this consent choice. Cannot be switched off."
              onChange={() => {}}
            />
            <Toggle
              checked={analytics}
              label="Analytics"
              hint="Anonymous, aggregate usage stats so we know which tools to improve."
              onChange={setAnalytics}
            />
            <Toggle
              checked={ads}
              label="Advertising"
              hint="Lets ad partners personalise and measure ads. Decline and you get non-personalised ads only."
              onChange={setAds}
            />
            <button
              type="button"
              onClick={() => decide({ analytics, ads })}
              className="btn-ghost !py-2 text-sm"
            >
              Save my choice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
  disabled?: boolean;
}) {
  return (
    <label className={`flex gap-3 text-sm ${disabled ? "opacity-70" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
      />
      <span>
        <span className="font-semibold">{label}</span>
        <span className="muted block text-xs leading-relaxed">{hint}</span>
      </span>
    </label>
  );
}

/** Footer / cookie-policy button that reopens the panel. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className={className || "muted text-left hover:text-brand-ink"}
    >
      Cookie settings
    </button>
  );
}
