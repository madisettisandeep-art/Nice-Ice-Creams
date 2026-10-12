"use client";

import React, { useEffect, useState } from "react";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analytics/tracker";

export default function PrivacyPage() {
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    setConsent(getAnalyticsConsent());
  }, []);

  const handleToggle = (next: boolean) => {
    setConsent(next);
    setAnalyticsConsent(next);
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 space-y-8">
      <div className="space-y-2 border-b border-ivory-300 pb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-blue">
          Data Protection &amp; Transparency
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cinema-900">
          Privacy Policy &amp; Data Retention Notice
        </h1>
        <p className="text-xs text-cinema-800/70">
          NICE ICE CREAMS (Established 1986) • Last updated October 2026
        </p>
      </div>

      <section className="space-y-3 text-sm text-cinema-800/90 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-cinema-900">
          1. Information We Collect
        </h2>
        <p>
          We collect only the minimum information necessary to prepare and coordinate your ice cream orders and party bookings:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Order Checkout:</strong> Customer name, phone number, order type (pickup, delivery, or party enquiry), preferred time, delivery address (only when home delivery is selected), and selected menu items.
          </li>
          <li>
            <strong>Party Bookings:</strong> Host name, phone number, event type, event date, estimated guest count, and desired flavours.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-sm text-cinema-800/90 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-cinema-900">
          2. WhatsApp Order Handoff
        </h2>
        <p>
          When you click &ldquo;Order on WhatsApp&rdquo;, our server validates product pricing and generates an official WhatsApp click-to-chat message. Your order remains labeled <strong>Awaiting WhatsApp confirmation</strong> until you press Send in WhatsApp and our staff confirms your order.
        </p>
      </section>

      <section className="space-y-3 text-sm text-cinema-800/90 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-cinema-900">
          3. Data Retention &amp; Security Policy
        </h2>
        <p>
          Order and booking enquiry records are stored securely with role-based administrative access controls and retained for up to 12 months for order fulfillment, customer support, and accounting purposes, after which personal identifiers are archived or purged. We never sell or rent customer contact information to third parties, and we never log customer PII in browser analytics.
        </p>
      </section>

      <section className="rounded-2xl bg-white border border-ivory-300 p-6 space-y-3 shadow-sm">
        <h2 className="font-display text-lg font-bold text-cinema-900">
          4. Privacy-Conscious Interaction Analytics Preferences
        </h2>
        <p className="text-xs sm:text-sm text-cinema-800/80">
          We record anonymous interaction events (such as viewing the 12-shot hero, sliding through signature creations, or selecting menu categories) without any personal identifiers. You can enable or disable interaction analytics below at any time:
        </p>
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleToggle(!consent)}
            className={`rounded-full px-5 py-2 text-xs font-extrabold transition ${
              consent
                ? "bg-brand-blue text-white"
                : "bg-ivory-200 text-cinema-900"
            }`}
          >
            {consent
              ? "✓ Anonymous Interaction Analytics Enabled"
              : "✕ Anonymous Interaction Analytics Disabled"}
          </button>
        </div>
      </section>
    </article>
  );
}

