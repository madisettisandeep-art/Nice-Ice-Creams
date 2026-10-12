"use client";

import React, { useState } from "react";
import { trackEvent } from "@/lib/analytics/tracker";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";

const EVENT_TYPES = [
  "Birthday Party",
  "Wedding / Sangeet / Reception",
  "Family Gathering & Get-Together",
  "Corporate / Office Event",
  "Anniversary Celebration",
  "Festival / Community Bulk Order",
];

const POPULAR_PARTY_SELECTIONS = [
  "Vanilla (Bulk Tubs)",
  "Butterscotch (Bulk Tubs)",
  "Belgium Chocolate",
  "Fresh Sitaphal (Seasonal)",
  "Natural Mango (Seasonal)",
  "Malai Kulfi",
  "American Nuts",
  "Pista Nuts",
  "Black Currant",
  "Fruit Salad with Ice Cream Counter",
  "Badam Milk with Ice Cream Live Counter",
  "Cassata Slices",
  "Brownie with Ice Cream Sizzler Counter",
  "Death by Chocolate Sundae Station",
];

export function PartyBookingForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("50");
  const [budget, setBudget] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState<
    "delivery" | "pickup"
  >("delivery");
  const [location, setLocation] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "Fruit Salad with Ice Cream Counter",
    "Butterscotch (Bulk Tubs)",
  ]);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [copied, setCopied] = useState(false);

  const [bookingResult, setBookingResult] = useState<{
    enquiryReference: string;
    status: string;
    eventType: string;
    eventDate: string;
    guestCount: number;
    whatsappUrl: string;
    whatsappMessage: string;
    notice: string;
  } | null>(null);

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const idempotencyKey = `party-${customerPhone.replace(
        /\D/g,
        ""
      )}-${eventDate}-${Math.floor(Date.now() / 30000)}`;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          event_type: eventType,
          event_date: eventDate,
          guest_count: Number(guestCount),
          budget: budget || undefined,
          delivery_preference: deliveryPreference,
          location: deliveryPreference === "delivery" ? location : undefined,
          order_preferences: selectedPreferences,
          notes: notes || undefined,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(
          data?.error || "Please review the highlighted fields below."
        );
        if (data?.issues) {
          setFieldErrors(data.issues);
        }
        setSubmitting(false);
        return;
      }

      setBookingResult({
        enquiryReference: data.booking.enquiry_reference,
        status: data.booking.status,
        eventType: data.booking.event_type,
        eventDate: data.booking.event_date,
        guestCount: data.booking.guest_count,
        whatsappUrl: data.whatsapp.url,
        whatsappMessage: data.whatsapp.message,
        notice: data.whatsapp.notice,
      });

      trackEvent("booking_enquiry_submitted", {
        enquiry_reference: data.booking.enquiry_reference,
        event_type: eventType,
        guest_count: Number(guestCount),
      });
    } catch {
      setErrorMessage(
        "Unable to submit your enquiry right now. Please try again or call +91 99854 22222."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="rounded-3xl bg-white border-2 border-brand-blue/30 p-6 sm:p-10 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-300 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-extrabold">
                Enquiry Status: {bookingResult.status} (Awaiting Confirmation)
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-cinema-900 mt-1">
                Reference: {bookingResult.enquiryReference}
              </h3>
              <p className="text-xs sm:text-sm text-cinema-800/75 mt-0.5">
                {bookingResult.eventType} • {bookingResult.eventDate} •{" "}
                {bookingResult.guestCount} Guests
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 text-xs sm:text-sm text-amber-950 space-y-1.5">
          <div className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" aria-hidden="true" />
            <span>Important: Enquiry is Pending Until Confirmed by NICE ICE CREAMS</span>
          </div>
          <p className="leading-relaxed">{bookingResult.notice}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={bookingResult.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("whatsapp_opened", {
                enquiry_reference: bookingResult.enquiryReference,
              })
            }
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white px-6 py-4 text-sm sm:text-base font-extrabold shadow-lg transition"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            <span>Open WhatsApp to Send Party Enquiry</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(bookingResult.whatsappMessage);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ivory-300 bg-ivory-100 hover:bg-ivory-200 px-5 py-3.5 text-xs font-bold text-cinema-900 transition"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span>{copied ? "Copied Enquiry!" : "Copy Text"}</span>
          </button>
        </div>

        <details className="rounded-2xl bg-ivory-100 border border-ivory-300 p-4 text-xs">
          <summary className="font-bold text-cinema-900 cursor-pointer">
            View Prepared WhatsApp Enquiry Message
          </summary>
          <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] text-cinema-800 bg-white p-3 rounded-xl border border-ivory-200 max-h-60 overflow-y-auto custom-scrollbar">
            {bookingResult.whatsappMessage}
          </pre>
        </details>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setBookingResult(null)}
            className="text-xs font-bold text-brand-blue hover:underline"
          >
            ← Submit Another Event Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md border-2 border-[#FBCFE8] p-6 sm:p-10 shadow-card space-y-6"
    >
      {/* Top Multi-Flavour Celebration Ribbon */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#E11D48] via-[#F59E0B] via-[#10B981] via-[#9333EA] to-[#0064B5]"
      />

      <div className="border-b border-[#FCE7F3] pb-4 space-y-1 pt-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#BE123C]">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
          <span>Bulk &amp; Party Catering Enquiry</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-cinema-900">
          Plan Your Ice Cream &amp; Dessert Counter
        </h3>
        <p className="text-xs sm:text-sm text-cinema-800/75">
          Complete the form below to receive a unique enquiry reference and send your catering requirements directly via WhatsApp (+91 99854 22222 / +91 73061 42993).
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl bg-red-50 border border-red-300 p-4 text-xs sm:text-sm font-semibold text-red-800"
        >
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="booking-name"
            className="block text-xs font-bold text-cinema-900 mb-1.5"
          >
            Host / Contact Name *
          </label>
          <input
            id="booking-name"
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Ananya Reddy"
            className="w-full rounded-xl border border-[#FBCFE8] bg-[#FFF5F7]/60 px-4 py-3 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
          />
          {fieldErrors.customer_name && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.customer_name[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="booking-phone"
            className="block text-xs font-bold text-cinema-900 mb-1.5"
          >
            Phone / WhatsApp Number *
          </label>
          <input
            id="booking-phone"
            type="tel"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="e.g. 99854 22222"
            className="w-full rounded-xl border border-[#FBCFE8] bg-[#FFF5F7]/60 px-4 py-3 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
          />
          {fieldErrors.customer_phone && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.customer_phone[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="booking-event-type"
            className="block text-xs font-bold text-cinema-900 mb-1.5"
          >
            Event Type *
          </label>
          <select
            id="booking-event-type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full rounded-xl border border-[#FDE68A] bg-[#FFFBEB]/70 px-3.5 py-3 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="booking-date"
            className="block text-xs font-bold text-cinema-900 mb-1.5"
          >
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#E11D48]" aria-hidden="true" />
              Event Date *
            </span>
          </label>
          <input
            id="booking-date"
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-xl border border-[#FDE68A] bg-[#FFFBEB]/70 px-3.5 py-2.5 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          />
          {fieldErrors.event_date && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.event_date[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="booking-guests"
            className="block text-xs font-bold text-cinema-900 mb-1.5"
          >
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#7E22CE]" aria-hidden="true" />
              Estimated Guests (Min 10) *
            </span>
          </label>
          <input
            id="booking-guests"
            type="number"
            min={10}
            max={10000}
            required
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full rounded-xl border border-[#E9D5FF] bg-[#FAF5FF]/70 px-3.5 py-2.5 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7E22CE]"
          />
          {fieldErrors.guest_count && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.guest_count[0]}
            </p>
          )}
        </div>
      </div>

      {/* Desired Flavours & Signature Items */}
      <div>
        <label className="block text-xs font-bold text-cinema-900 mb-2">
          Desired Flavours, Sundaes &amp; Live Counters (Select all that apply) *
        </label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_PARTY_SELECTIONS.map((pref, idx) => {
            const active = selectedPreferences.includes(pref);
            const activeStyles = [
              "bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white border-[#E11D48]",
              "bg-gradient-to-r from-[#D97706] to-[#B45309] text-white border-[#D97706]",
              "bg-gradient-to-r from-[#059669] to-[#047857] text-white border-[#059669]",
              "bg-gradient-to-r from-[#7E22CE] to-[#6B21A8] text-white border-[#7E22CE]",
              "bg-gradient-to-r from-[#0064B5] to-[#1E3A8A] text-white border-[#0064B5]",
            ];
            const inactiveStyles = [
              "bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3] hover:border-[#E11D48]",
              "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] hover:border-[#D97706]",
              "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] hover:border-[#059669]",
              "bg-[#FAF5FF] text-[#6B21A8] border-[#E9D5FF] hover:border-[#7E22CE]",
              "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE] hover:border-[#0064B5]",
            ];
            return (
              <button
                key={pref}
                type="button"
                onClick={() => togglePreference(pref)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition shadow-sm ${
                  active
                    ? activeStyles[idx % activeStyles.length]
                    : inactiveStyles[idx % inactiveStyles.length]
                }`}
              >
                {active ? `✓ ${pref}` : `+ ${pref}`}
              </button>
            );
          })}
        </div>
        {fieldErrors.order_preferences && (
          <p className="text-xs text-red-600 mt-1">
            {fieldErrors.order_preferences[0]}
          </p>
        )}
      </div>

      {/* Delivery / Pickup & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-cinema-900 mb-1.5">
            Service Preference *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryPreference("delivery")}
              className={`rounded-xl border py-2.5 px-3 text-xs font-bold transition ${
                deliveryPreference === "delivery"
                  ? "border-[#E11D48] bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-sm"
                  : "border-[#FBCFE8] bg-[#FFF1F2]/60 text-cinema-800"
              }`}
            >
              Venue Delivery / Counter
            </button>
            <button
              type="button"
              onClick={() => setDeliveryPreference("pickup")}
              className={`rounded-xl border py-2.5 px-3 text-xs font-bold transition ${
                deliveryPreference === "pickup"
                  ? "border-[#7E22CE] bg-gradient-to-r from-[#7E22CE] to-[#6B21A8] text-white shadow-sm"
                  : "border-[#E9D5FF] bg-[#FAF5FF]/60 text-cinema-800"
              }`}
            >
              Bulk Store Pickup
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="booking-budget"
            className="block text-xs font-bold text-cinema-900 mb-1.5"
          >
            Estimated Budget (Optional)
          </label>
          <input
            id="booking-budget"
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. ₹5,000 – ₹15,000"
            className="w-full rounded-xl border border-[#A7F3D0] bg-[#ECFDF5]/60 px-4 py-2.5 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
          />
        </div>
      </div>

      {deliveryPreference === "delivery" && (
        <div>
          <label
            htmlFor="booking-location"
            className="block text-xs font-bold text-cinema-900 mb-1.5"
          >
            Event Venue / Location Address *
          </label>
          <input
            id="booking-location"
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Function Hall / Venue Name, Area, Warangal / Hanamkonda..."
            className="w-full rounded-xl border border-[#FBCFE8] bg-[#FFF5F7]/60 px-4 py-3 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
          />
          {fieldErrors.location && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.location[0]}
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="booking-notes"
          className="block text-xs font-bold text-cinema-900 mb-1.5"
        >
          Additional Requirements / Custom Serving Notes (Optional)
        </label>
        <textarea
          id="booking-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tell us about serving timings, live counter needs, custom cups, or special dietary requests..."
          className="w-full rounded-xl border border-[#E9D5FF] bg-[#FAF5FF]/50 px-4 py-2.5 text-sm text-cinema-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7E22CE]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E11D48] via-[#9333EA] to-[#0064B5] hover:opacity-95 text-white px-8 py-4 text-sm sm:text-base font-extrabold shadow-lg transition hover:-translate-y-0.5"
      >
        <MessageCircle className="w-5 h-5" aria-hidden="true" />
        <span>
          {submitting
            ? "Saving Enquiry & Generating Reference..."
            : "Create Party Enquiry & Prepare WhatsApp Message"}
        </span>
      </button>
    </form>
  );
}

