"use client";

export type AnalyticsEventName =
  | "hero_completed"
  | "menu_category_selected"
  | "product_viewed"
  | "exploded_scoop_played"
  | "product_added_to_cart"
  | "cart_updated"
  | "checkout_started"
  | "whatsapp_opened"
  | "booking_enquiry_submitted";

export interface AnalyticsEventRecord {
  event: AnalyticsEventName;
  payload: Record<string, string | number | boolean | null | undefined>;
  timestamp: string;
}

const CONSENT_STORAGE_KEY = "nice_analytics_consent";
const SESSION_EVENTS_KEY = "nice_analytics_events";

export function getAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored !== "declined";
}

export function setAnalyticsConsent(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, enabled ? "granted" : "declined");
}

/**
 * Privacy-conscious analytics tracker.
 * Never logs customer PII (names, phone numbers, or addresses).
 * Note: "whatsapp_opened" only records the handoff to WhatsApp, never a confirmed order.
 */
export function trackEvent(
  event: AnalyticsEventName,
  payload: Record<string, string | number | boolean | null | undefined> = {}
): void {
  if (typeof window === "undefined") return;
  if (!getAnalyticsConsent()) return;

  // Strip any accidental PII keys
  const safePayload = { ...payload };
  delete safePayload.customer_name;
  delete safePayload.customer_phone;
  delete safePayload.delivery_address;

  const record: AnalyticsEventRecord = {
    event,
    payload: safePayload,
    timestamp: new Date().toISOString(),
  };

  try {
    const raw = window.sessionStorage.getItem(SESSION_EVENTS_KEY);
    const list: AnalyticsEventRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    window.sessionStorage.setItem(SESSION_EVENTS_KEY, JSON.stringify(list.slice(0, 60)));
    window.dispatchEvent(new CustomEvent("nice:analytics", { detail: record }));
  } catch {
    // Ignore storage quota errors
  }
}

export function getRecentAnalyticsEvents(): AnalyticsEventRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(SESSION_EVENTS_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEventRecord[]) : [];
  } catch {
    return [];
  }
}

