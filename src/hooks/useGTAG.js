/**
 * useGTAG — GA4 custom event tracking hook
 *
 * Usage:
 *   const { trackEvent, trackPageView } = useGTAG();
 *   trackEvent("listing", "call_click", "Business Name");
 *   trackEvent("listing", "whatsapp_click", "Business Name");
 *   trackEvent("listing", "enquiry_open", "Business Name");
 */

import { GOOGLE_MEASUREMENT_ID } from "@/services/constants";

export function useGTAG() {
  /**
   * Fire a custom GA4 event.
   * @param {string} category  - Event category (e.g., "listing", "jobs", "marketplace")
   * @param {string} action    - Event action (e.g., "call_click", "whatsapp_click")
   * @param {string} label     - Event label (e.g., business name, job title)
   * @param {object} extra     - Optional extra params to pass to gtag
   */
  const trackEvent = (category, action, label = "", extra = {}) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      ...extra,
    });
  };

  /**
   * Track a manual page view (used on route change in _app.js).
   * @param {string} url - The page path/URL to report
   */
  const trackPageView = (url) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }
    window.gtag("config", GOOGLE_MEASUREMENT_ID || "G-XXXXXXXXXX", {
      page_path: url,
    });
  };

  return { trackEvent, trackPageView };
}

// ─── Standalone helper (usable outside React components) ──────────────────────
export function gtagEvent(action, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
}
