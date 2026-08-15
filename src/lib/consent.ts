/**
 * ============================================================================
 * Cookie consent — shared contract between the banner, the ad slots and any
 * future analytics.
 * ============================================================================
 * Consent lives in localStorage only; nothing is sent to a server. The banner
 * is the single writer, everything else reads and subscribes.
 */

export interface Consent {
  /** Bumped when the policy materially changes → banner reappears. */
  v: number;
  analytics: boolean;
  ads: boolean;
  /** Epoch ms of the decision, used to re-ask after 12 months. */
  ts: number;
}

export const CONSENT_KEY = "tct-consent";
export const CONSENT_VERSION = 1;
/** Re-ask after a year, which is the ceiling most DPAs consider acceptable. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Fired on window whenever the stored consent changes. */
export const CONSENT_CHANGED_EVENT = "tct:consent-changed";
/** Dispatch on window to reopen the settings panel (footer / policy links). */
export const OPEN_CONSENT_EVENT = "tct:open-consent";

export const DENY_ALL: Consent = { v: CONSENT_VERSION, analytics: false, ads: false, ts: 0 };

/** Reads stored consent, or null when the user has not decided (yet or again). */
export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (typeof parsed.ts !== "number" || Date.now() - parsed.ts > CONSENT_MAX_AGE_MS) return null;
    return {
      v: CONSENT_VERSION,
      analytics: !!parsed.analytics,
      ads: !!parsed.ads,
      ts: parsed.ts,
    };
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; ads: boolean }): Consent {
  const value: Consent = { v: CONSENT_VERSION, ...choice, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* private mode — consent simply won't persist, and we re-ask next visit */
  }
  syncGoogleConsent(value);
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGED_EVENT, { detail: value }));
  return value;
}

/** Opens the settings panel from anywhere (footer button, cookie policy page). */
export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

/**
 * Google Consent Mode v2 — AdSense reads these signals before requesting an ad.
 * Defaults are set to "denied" by the inline script in the document head, so
 * this only ever relaxes them after an explicit opt-in.
 */
export function syncGoogleConsent(c: Consent): void {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", {
    ad_storage: c.ads ? "granted" : "denied",
    ad_user_data: c.ads ? "granted" : "denied",
    ad_personalization: c.ads ? "granted" : "denied",
    analytics_storage: c.analytics ? "granted" : "denied",
  });
}
