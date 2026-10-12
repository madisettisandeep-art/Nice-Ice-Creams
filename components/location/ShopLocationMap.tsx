"use client";

import React from "react";
import { ScrollRevealSection } from "@/components/animations/ScrollRevealSection";
import { NICE_SHOP_LOCATION } from "@/lib/location/shop-location";
import {
  Clock,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Sparkles,
} from "lucide-react";

export { NICE_SHOP_LOCATION };

export const ShopLocationMap = React.memo(function ShopLocationMap({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      id="parlour-location"
      aria-label="NICE ICE CREAMS Shop Location and Interactive Map"
      className={
        compact
          ? "scroll-mt-16 w-full"
          : "scroll-mt-16 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      }
    >
      {!compact && (
        <ScrollRevealSection className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D1FAE5] via-[#FEF3C7] to-[#FFE4E6] border border-[#6EE7B7] text-[#065F46] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#E11D48]" aria-hidden="true" />
            <span>Visit Our Parlour • Hanamkonda, Warangal</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-cinema-900">
            Find{" "}
            <span className="bg-gradient-to-r from-[#059669] via-[#D97706] to-[#E11D48] bg-clip-text text-transparent">
              NICE ICE CREAMS
            </span>{" "}
            on the Map
          </h2>
          <p className="text-sm sm:text-base text-cinema-800/80 leading-relaxed">
            Drop by our flagship parlour on Subedari – Waddepally Main Road for freshly scooped cones, sizzling brownie platters, fruit salad with ice cream, and chilled badam milk.
          </p>
        </ScrollRevealSection>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Flagship Address & Directions Card */}
        <ScrollRevealSection
          direction="left"
          className="relative overflow-hidden lg:col-span-5 rounded-3xl bg-white/95 border-2 border-[#FDE68A] shadow-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          {/* Top Multi-Flavour Accent Strip */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#E11D48]"
          />

          <div className="space-y-5 pt-1">
            <div className="flex items-center gap-3">
              <img
                src="/brand/nice_ice_cream_logo.png"
                alt="NICE ICE CREAMS Logo"
                width={52}
                height={52}
                loading="lazy"
                decoding="async"
                className="h-13 w-13 rounded-2xl bg-[#FFFBEB] p-1 border border-[#FDE68A] object-contain shrink-0 shadow-sm"
              />
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B45309]">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" aria-hidden="true" />
                  <span>Since 1986</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-cinema-900">
                  NICE ICE CREAMS
                </h3>
                <p className="text-xs font-semibold text-[#9F1239]">
                  {NICE_SHOP_LOCATION.tagline}
                </p>
              </div>
            </div>

            {/* Street Address Block — Strawberry Rose Tint */}
            <div className="rounded-2xl bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6]/70 border border-[#FECDD3] p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#BE123C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#BE123C]">
                    Shop Address
                  </div>
                  <address className="not-italic text-sm font-bold text-cinema-900 leading-relaxed">
                    {NICE_SHOP_LOCATION.streetAddress},<br />
                    {NICE_SHOP_LOCATION.area}, {NICE_SHOP_LOCATION.city},<br />
                    {NICE_SHOP_LOCATION.state} – {NICE_SHOP_LOCATION.postalCode}
                  </address>
                </div>
              </div>
            </div>

            {/* Hours (Mango Gold) & Direct Phone Lines (Berry Violet) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold text-[#92400E]">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
                  <span>Parlour Hours</span>
                </div>
                <p className="text-cinema-900 font-bold">
                  11:00 AM – 11:30 PM
                </p>
                <p className="text-[11px] text-[#047857] font-extrabold">
                  ● Open All 7 Days
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold text-[#6B21A8]">
                  <Phone className="w-3.5 h-3.5 text-[#9333EA]" aria-hidden="true" />
                  <span>Direct Numbers</span>
                </div>
                <a
                  href="tel:+919985422222"
                  className="cursor-pointer block font-extrabold text-[#7E22CE] hover:underline"
                >
                  +91 99854 22222
                </a>
                <a
                  href="tel:+917306142993"
                  className="cursor-pointer block font-extrabold text-[#BE123C] hover:underline"
                >
                  +91 73061 42993
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={NICE_SHOP_LOCATION.googleShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E11D48] to-[#D97706] hover:opacity-95 text-white px-4 py-3 text-xs font-extrabold shadow-md transition hover:-translate-y-0.5"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href={NICE_SHOP_LOCATION.googleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4C1D95] to-[#1E3A8A] hover:opacity-95 text-white px-4 py-3 text-xs font-extrabold shadow-md transition hover:-translate-y-0.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#FDE68A]" aria-hidden="true" />
                <span>Get Directions</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://wa.me/919985422222?text=Hello%20NICE%20ICE%20CREAMS!%20Please%20share%20your%20shop%20location%20and%20menu."
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white px-4 py-3 text-xs font-extrabold shadow-sm transition hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366] shrink-0" aria-hidden="true" />
                <span>Order on WhatsApp</span>
              </a>

              <a
                href={NICE_SHOP_LOCATION.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 text-white px-4 py-3 text-xs font-extrabold shadow-sm transition hover:-translate-y-0.5"
              >
                <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{NICE_SHOP_LOCATION.instagramHandle}</span>
              </a>
            </div>
          </div>
        </ScrollRevealSection>

        {/* Right: Interactive Embedded Google Map */}
        <ScrollRevealSection
          direction="right"
          delay={0.08}
          className="lg:col-span-7 relative rounded-3xl overflow-hidden border-2 border-[#A7F3D0] shadow-card bg-ivory-200 min-h-[380px] sm:min-h-[450px]"
        >
          <iframe
            title="NICE ICE CREAMS Map — Opp. Forest Office, Waddepally Cross Roads, Subedari, Hanamkonda, Warangal"
            src={NICE_SHOP_LOCATION.embedMapUrl}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />

          {/* Floating Bottom Overlay Pill on the Map */}
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 sm:right-auto z-10 rounded-2xl bg-gradient-to-r from-[#3D1229]/95 via-[#2D1646]/95 to-[#13294B]/95 backdrop-blur-md text-white px-4 py-2.5 border border-[#FDA4AF]/40 shadow-lg flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#25D366] animate-ping shrink-0" />
            <div className="text-xs leading-tight">
              <div className="font-extrabold text-[#FDE68A]">
                NICE ICE CREAMS • Subedari, Hanamkonda
              </div>
              <div className="text-[11px] text-ivory-100">
                Opp. Forest Office, Waddepally Cross Roads, Warangal – 506004
              </div>
            </div>
          </div>
        </ScrollRevealSection>
      </div>
    </section>
  );
});

