import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Ordering Conditions",
  description:
    "Terms of service, pricing validation, and WhatsApp ordering terms for NICE ICE CREAMS (Est. 1986).",
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 space-y-8">
      <div className="space-y-2 border-b border-ivory-300 pb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-blue">
          Ordering Terms
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cinema-900">
          Terms of Service
        </h1>
        <p className="text-xs text-cinema-800/70">
          NICE ICE CREAMS (Established 1986)
        </p>
      </div>

      <section className="space-y-3 text-sm text-cinema-800/90 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-cinema-900">
          1. Server-Authoritative Pricing &amp; Availability
        </h2>
        <p>
          All product prices displayed on the NICE ICE CREAMS website are in Indian Rupees (INR) and are validated on the server at checkout. Seasonal items (such as Fresh Sitaphal, Natural Mango, Pink Guava, and Chikoo) are subject to seasonal orchard availability.
        </p>
      </section>

      <section className="space-y-3 text-sm text-cinema-800/90 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-cinema-900">
          2. WhatsApp Order Confirmation
        </h2>
        <p>
          Generating an order draft or opening WhatsApp from our checkout flow does not constitute a confirmed or paid order. Every order starts with the status <strong>Awaiting WhatsApp confirmation</strong> until you send the pre-filled WhatsApp message to our official business number (+91 99854 22222) and receive confirmation from NICE ICE CREAMS.
        </p>
      </section>

      <section className="space-y-3 text-sm text-cinema-800/90 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-cinema-900">
          3. Party Bookings &amp; Bulk Enquiries
        </h2>
        <p>
          Party and event enquiries submitted through the website are recorded as <strong>Pending</strong> until our events team reviews date availability, flavour quantities, and venue logistics and confirms the booking with you directly.
        </p>
      </section>

      <section className="space-y-3 text-sm text-cinema-800/90 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-cinema-900">
          4. Allergen Advisory
        </h2>
        <p>
          Our ice creams, sundaes, shakes, and specials are crafted with pure dairy milk and fresh cream, and many recipes feature tree nuts (almonds, cashews, pistachios, hazelnuts), peanuts, soy, and wheat/gluten. Please review individual product allergen notices and inform our team of any allergies when placing your order.
        </p>
      </section>
    </article>
  );
}

