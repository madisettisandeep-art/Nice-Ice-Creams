import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ScrollProgressBar,
  ScrollRevealSection,
} from "@/components/animations/ScrollRevealSection";
import { FlavourRibbonMarquee } from "@/components/animations/FlavourRibbonMarquee";
import { ShopLocationMap } from "@/components/location/ShopLocationMap";
import { Award, Heart, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story — Crafting Joy Since 1986",
  description:
    "Discover the heritage of NICE ICE CREAMS, established in 1986. Dedicated to crafting ice creams, shakes, fruit salad, and badam milk with pure milk and fresh cream.",
};

export default function AboutPage() {
  return (
    <div className="pt-16">
      <ScrollProgressBar />
      <FlavourRibbonMarquee />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
      <ScrollRevealSection className="text-center max-w-3xl mx-auto space-y-4">
        <img
          src="/brand/nice_ice_cream_logo.png"
          alt="NICE ICE CREAMS Official Logo"
          className="h-24 w-24 mx-auto rounded-3xl bg-white p-1.5 shadow-card border border-ivory-300 object-contain"
        />
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 text-brand-blue px-4 py-1 text-xs font-extrabold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Established 1986 • Eat.. Party.. Ice Creams</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-cinema-900">
          Crafting Joy with Pure Milk &amp; Fresh Cream Since 1986
        </h1>
        <p className="text-base sm:text-lg text-cinema-800/80 leading-relaxed">
          For four decades, NICE ICE CREAMS has stood for a simple, unshakeable culinary promise: real dairy ice cream made from pure milk and rich cream, served with warmth and generosity.
        </p>
      </ScrollRevealSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScrollRevealSection delay={0.05} className="rounded-3xl bg-white border border-ivory-300 p-7 shadow-card space-y-3">
          <Award className="w-8 h-8 text-brand-blue" aria-hidden="true" />
          <h2 className="font-display text-xl font-bold text-cinema-900">
            1986 Heritage
          </h2>
          <p className="text-sm text-cinema-800/80 leading-relaxed">
            Established in 1986, our journey began with classic scoops, fruit salad with ice cream, and chilled badam milk that became cherished traditions across generations of families.
          </p>
        </ScrollRevealSection>

        <ScrollRevealSection delay={0.12} className="rounded-3xl bg-white border border-ivory-300 p-7 shadow-card space-y-3">
          <ShieldCheck
            className="w-8 h-8 text-flavour-pistachio"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl font-bold text-cinema-900">
            Pure Milk &amp; Cream
          </h2>
          <p className="text-sm text-cinema-800/80 leading-relaxed">
            Every batch is churned using pure milk and fresh dairy cream—paired with real seasonal Sitaphal, Natural Mango, Pink Guava, Chikoo, roasted nuts, and Belgian cocoa.
          </p>
        </ScrollRevealSection>

        <ScrollRevealSection delay={0.2} className="rounded-3xl bg-white border border-ivory-300 p-7 shadow-card space-y-3">
          <Heart
            className="w-8 h-8 text-flavour-strawberry"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl font-bold text-cinema-900">
            49 Menu Creations
          </h2>
          <p className="text-sm text-cinema-800/80 leading-relaxed">
            Today our menu spans 8 signature collections—from timeless Classic and Premium scoops to hot Brownie Sizzlers, Death by Chocolate, and 15 indulgent Ice Cream Shakes.
          </p>
        </ScrollRevealSection>
      </div>

      {/* Parlour Map & Location */}
      <ShopLocationMap compact />

      <ScrollRevealSection className="rounded-3xl bg-cinema-950 text-white p-8 sm:p-12 text-center space-y-5 shadow-cinema">
        <h2 className="font-display text-2xl sm:text-4xl font-bold">
          Ready to Taste the 1986 Tradition?
        </h2>
        <p className="text-sm sm:text-base text-ivory-200 max-w-xl mx-auto">
          Explore our full 49-item menu with high-resolution studio photography and multi-item WhatsApp ordering, or book NICE ICE CREAMS for your next celebration.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/menu"
            className="rounded-full bg-brand-cyan hover:bg-brand-blue text-white px-7 py-3.5 text-sm font-extrabold shadow-lg transition"
          >
            Explore All 49 Flavours
          </Link>
          <Link
            href="/party-orders"
            className="rounded-full bg-white/15 hover:bg-white/25 text-white px-7 py-3.5 text-sm font-bold transition"
          >
            Book Party &amp; Bulk Orders
          </Link>
        </div>
      </ScrollRevealSection>
      </div>
    </div>
  );
}

