import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ScrollProgressBar,
  ScrollRevealSection,
} from "@/components/animations/ScrollRevealSection";
import { FlavourRibbonMarquee } from "@/components/animations/FlavourRibbonMarquee";
import { ShopLocationMap } from "@/components/location/ShopLocationMap";
import { NICE_SHOP_LOCATION } from "@/lib/location/shop-location";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Shop Location — Hanamkonda, Warangal",
  description:
    "Visit NICE ICE CREAMS (Est. 1986) at Main Road, Opp. Forest Office, Waddepally Cross Roads, Subedari, Hanamkonda, Warangal, Telangana – 506004. Call +91 99854 22222 / +91 73061 42993 or order on WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ScrollProgressBar />
      <FlavourRibbonMarquee />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-14">
        <ScrollRevealSection className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 text-brand-blue px-4 py-1 text-xs font-extrabold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Visit Our Parlour &amp; Get in Touch</span>
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-cinema-900">
            Contact &amp; Shop Map — NICE ICE CREAMS
          </h1>
          <p className="text-sm sm:text-base text-cinema-800/80">
            Visit our flagship parlour at{" "}
            <strong className="text-cinema-900">
              {NICE_SHOP_LOCATION.fullAddress}
            </strong>
            , place a multi-item order on WhatsApp, or call us for party catering.
          </p>
        </ScrollRevealSection>

        {/* Interactive Shop Map & Address Section */}
        <ShopLocationMap compact />

        {/* Direct Phone, WhatsApp & Email Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollRevealSection
            direction="left"
            className="rounded-3xl bg-white border border-ivory-300 p-7 shadow-card space-y-4"
          >
            <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <Phone className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-cinema-900">
              Phone &amp; Party Order Lines
            </h2>
            <p className="text-xs sm:text-sm text-cinema-800/75">
              Call us directly for immediate orders, bulk tub availability, and event catering:
            </p>
            <div className="space-y-2 pt-1">
              <a
                href="tel:+919985422222"
                className="cursor-pointer block text-lg font-extrabold text-brand-blue hover:underline"
              >
                +91 99854 22222
              </a>
              <a
                href="tel:+917306142993"
                className="cursor-pointer block text-lg font-extrabold text-brand-blue hover:underline"
              >
                +91 73061 42993
              </a>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection
            direction="right"
            delay={0.1}
            className="rounded-3xl bg-white border border-ivory-300 p-7 shadow-card space-y-4"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#25D366]/15 text-[#1EBE5B] flex items-center justify-center">
              <MessageCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-cinema-900">
              WhatsApp, Instagram &amp; Email
            </h2>
            <p className="text-xs sm:text-sm text-cinema-800/75">
              Build your cart on our website for an instant itemized WhatsApp message, follow us on Instagram, or write to us by email:
            </p>
            <div className="space-y-2.5 pt-1 text-sm">
              <a
                href="mailto:niceicecreams.warangal@gmail.com"
                className="cursor-pointer flex items-center gap-2 font-bold text-cinema-900 hover:text-brand-blue"
              >
                <Mail className="w-4 h-4 text-brand-blue" aria-hidden="true" />
                <span>niceicecreams.warangal@gmail.com</span>
              </a>
              <a
                href={NICE_SHOP_LOCATION.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex items-center gap-2 font-bold text-[#DD2A7B] hover:underline"
              >
                <Instagram className="w-4 h-4 text-[#DD2A7B]" aria-hidden="true" />
                <span>Instagram: {NICE_SHOP_LOCATION.instagramHandle}</span>
              </a>
            </div>
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-brand-blue text-white px-5 py-2.5 text-xs font-extrabold shadow"
              >
                <span>Build Order in Menu</span>
              </Link>
              <a
                href={NICE_SHOP_LOCATION.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-5 py-2.5 text-xs font-extrabold shadow"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
                <span>Visit Instagram</span>
              </a>
              <Link
                href="/party-orders"
                className="inline-flex items-center gap-2 rounded-full bg-ivory-200 text-cinema-900 px-5 py-2.5 text-xs font-bold"
              >
                <span>Party Booking Form</span>
              </Link>
            </div>
          </ScrollRevealSection>
        </div>
      </div>
    </div>
  );
}
