import React from "react";
import Link from "next/link";
import { CinematicHero12Shots } from "@/components/hero/CinematicHero12Shots";
import { CatalogueSection } from "@/components/menu/CatalogueSection";
import { PartyBookingForm } from "@/components/booking/PartyBookingForm";
import {
  ScrollProgressBar,
  ScrollRevealSection,
} from "@/components/animations/ScrollRevealSection";
import { FlavourRibbonMarquee } from "@/components/animations/FlavourRibbonMarquee";
import { ShopLocationMap } from "@/components/location/ShopLocationMap";
import { getCategories, getProducts } from "@/lib/db/store";
import {
  Award,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ includeUnavailable: true }),
  ]);

  return (
    <div>
      {/* Smooth Spring-Driven Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* 1. 12-Shot Scroll-Synchronized Cinematic Hero */}
      <CinematicHero12Shots />

      {/* 2. Heritage & Pure Dairy Promise Strip (Our Story Section) — Berry-Rose, Royal-Violet & Warm-Indigo */}
      <section
        id="our-story-section"
        className="relative overflow-hidden scroll-mt-16 bg-gradient-to-r from-[#831843] via-[#4C1D95] to-[#1E3A8A] text-white py-11 px-4 sm:px-6 lg:px-8 shadow-xl border-b border-white/15"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/4 h-56 w-56 rounded-full bg-[#F59E0B]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full bg-[#FB7185]/20 blur-3xl"
        />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <ScrollRevealSection
            direction="left"
            delay={0}
            className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#FBBF24]/35 p-4 shadow-md"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FDE68A]">
                Crafting Joy Since 1986
              </div>
              <div className="font-display text-lg font-bold text-white">
                Four Decades of Heritage
              </div>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection
            direction="up"
            delay={0.08}
            className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#34D399]/35 p-4 shadow-md"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#A7F3D0]">
                Uncompromised Ingredients
              </div>
              <div className="font-display text-lg font-bold text-white">
                100% Pure Milk &amp; Fresh Cream
              </div>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection
            direction="right"
            delay={0.16}
            className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#FB7185]/35 p-4 shadow-md"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#BE123C] flex items-center justify-center shrink-0 shadow-md">
              <HeartHandshake
                className="w-6 h-6 text-white"
                aria-hidden="true"
              />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FECDD3]">
                Celebrations &amp; Bulk Catering
              </div>
              <div className="font-display text-lg font-bold text-white">
                Eat.. Party.. Ice Creams
              </div>
            </div>
          </ScrollRevealSection>
        </div>
      </section>

      {/* 2B. Continuous Dual-Direction Sliding Flavour Ribbon Marquee */}
      <FlavourRibbonMarquee />

      {/* 3. Complete 8-Category, 49-Product Interactive Menu Catalogue + Signature Slider */}
      <CatalogueSection
        initialCategories={categories}
        initialProducts={products}
      />

      {/* 4. Artisanal Showcase Interlude: Belgian Chocolate, Berry Velvet & Golden Caramel */}
      <section className="relative bg-gradient-to-br from-[#2B130E] via-[#3D1229] to-[#1E1B4B] text-ivory-50 py-20 px-4 sm:px-6 lg:px-8 border-y border-[#F59E0B]/25 overflow-hidden">
        {/* Ambient multi-flavour radial glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#E11D48]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-[#F59E0B]/20 blur-3xl"
        />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollRevealSection direction="left" className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F59E0B]/25 to-[#E11D48]/25 border border-[#FBBF24]/40 text-[#FDE68A] px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" aria-hidden="true" />
              <span>Signature Parlour Creations</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              Every Scoop Is Built{" "}
              <span className="bg-gradient-to-r from-[#FDE68A] via-[#FDA4AF] to-[#C4B5FD] bg-clip-text text-transparent">
                Layer by Delicious Layer
              </span>
            </h2>
            <p className="text-sm sm:text-base text-ivory-100/90 leading-relaxed">
              From our sizzling cast-iron{" "}
              <strong className="text-[#FDE68A]">
                Brownie with Ice Cream Sizzler
              </strong>{" "}
              to our signature{" "}
              <strong className="text-[#FDA4AF]">Death by Chocolate</strong> and{" "}
              <strong className="text-[#6EE7B7]">
                Fruit Salad with Ice Cream
              </strong>
              , every creation combines 100% pure dairy cream, rich chocolate fudge ribbons, fresh seasonal fruits, and roasted nuts.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/menu?category=ice-cream-sundaes"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E11D48] via-[#D97706] to-[#B45309] hover:opacity-95 text-white px-6 py-3.5 text-xs sm:text-sm font-extrabold shadow-lg transition hover:-translate-y-0.5"
              >
                <span>Explore Signature Sundaes</span>
              </Link>
              <Link
                href="/menu?category=specials-signature"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-[#FDE68A]/35 text-[#FEF3C7] px-6 py-3.5 text-xs sm:text-sm font-bold transition hover:-translate-y-0.5"
              >
                <span>View 1986 Signature Specials</span>
              </Link>
            </div>
          </ScrollRevealSection>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                name: "Death by Chocolate",
                price: "₹149",
                img: "/menu/death-by-chocolate.webp?v=4",
                slug: "death-by-chocolate",
                cardBg: "from-[#451A03]/90 to-[#290F02]/90 border-[#F59E0B]/40",
                priceColor: "text-[#FDE68A]",
              },
              {
                name: "Brownie Sizzler",
                price: "₹120",
                img: "/menu/brownie-with-ice-cream-sizzler.webp?v=4",
                slug: "brownie-with-ice-cream-sizzler",
                cardBg: "from-[#4C0519]/90 to-[#2D0612]/90 border-[#FB7185]/40",
                priceColor: "text-[#FDA4AF]",
              },
              {
                name: "Fruit Salad + Scoop",
                price: "₹90 / ₹100",
                img: "/menu/fruit-salad-with-ice-cream.webp?v=4",
                slug: "fruit-salad-with-ice-cream",
                cardBg: "from-[#064E3B]/90 to-[#022C22]/90 border-[#34D399]/40",
                priceColor: "text-[#6EE7B7]",
              },
              {
                name: "Nuts Heaven Sundae",
                price: "₹139",
                img: "/menu/nuts-heaven-sundae.webp?v=4",
                slug: "nuts-heaven-sundae",
                cardBg: "from-[#3B0764]/90 to-[#22043B]/90 border-[#C084FC]/40",
                priceColor: "text-[#E9D5FF]",
              },
              {
                name: "Fresh Sitaphal",
                price: "₹80",
                img: "/menu/fresh-sitaphal.webp?v=4",
                slug: "fresh-sitaphal",
                cardBg: "from-[#14532D]/90 to-[#052E16]/90 border-[#4ADE80]/40",
                priceColor: "text-[#BBF7D0]",
              },
              {
                name: "Ferrero Shake",
                price: "₹189",
                img: "/menu/ferrero-shake.webp?v=4",
                slug: "ferrero-shake",
                cardBg: "from-[#78350F]/90 to-[#451A03]/90 border-[#FBBF24]/40",
                priceColor: "text-[#FDE68A]",
              },
            ].map((card, idx) => (
              <ScrollRevealSection
                key={card.slug}
                direction={idx % 2 === 0 ? "up" : "right"}
                delay={idx * 0.06}
              >
                <Link
                  href={`/menu/${card.slug}`}
                  className={`block group rounded-2xl bg-gradient-to-b ${card.cardBg} border hover:border-white/60 p-3 transition-all duration-300 hover:-translate-y-2 shadow-lg`}
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/30 mb-2.5">
                    <img
                      src={card.img}
                      alt={card.name}
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {card.name}
                  </div>
                  <div className={`text-xs font-extrabold mt-0.5 ${card.priceColor}`}>
                    {card.price}
                  </div>
                </Link>
              </ScrollRevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Party Bookings & Bulk Orders Section — Festive Strawberry-Cream, Mango & Lavender Backdrop */}
      <section
        id="party-orders-section"
        className="relative scroll-mt-16 bg-gradient-to-br from-[#FFF0F5] via-[#FFFBEB] to-[#F3E8FF] border-b border-[#FBCFE8]/70 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 -left-20 h-72 w-72 rounded-full bg-[#FB7185]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 -right-20 h-72 w-72 rounded-full bg-[#C084FC]/15 blur-3xl"
        />
        <div className="relative max-w-6xl mx-auto space-y-10">
          <ScrollRevealSection className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFE4E6] via-[#FEF3C7] to-[#F3E8FF] border border-[#FDA4AF] text-[#BE123C] px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
              <span>Hosting a Party? Call Us for Party Orders</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-cinema-900">
              Celebrate Birthdays, Weddings &amp; Gatherings with{" "}
              <span className="bg-gradient-to-r from-[#E11D48] via-[#9333EA] to-[#0064B5] bg-clip-text text-transparent">
                NICE ICE CREAMS
              </span>
            </h2>
            <p className="text-sm sm:text-base text-cinema-800/85">
              From live Fruit Salad with Ice Cream &amp; Badam Milk counters to bulk family gallons, our team makes every celebration unforgettable. Call{" "}
              <a
                href="tel:+919985422222"
                className="font-extrabold text-[#BE123C] hover:underline"
              >
                +91 99854 22222
              </a>{" "}
              /{" "}
              <a
                href="tel:+917306142993"
                className="font-extrabold text-[#7E22CE] hover:underline"
              >
                +91 73061 42993
              </a>{" "}
              or submit your custom party enquiry below.
            </p>
          </ScrollRevealSection>

          <ScrollRevealSection direction="scale" delay={0.1}>
            <PartyBookingForm />
          </ScrollRevealSection>
        </div>
      </section>

      {/* 6. Flagship Parlour Location & Interactive Google Map — Fresh Pistachio-Mint, Sunlit-Mango & Rose-Cream */}
      <div className="border-t border-[#A7F3D0]/70 bg-gradient-to-br from-[#ECFDF5] via-[#FFFDF9] to-[#FFF1F2]">
        <ShopLocationMap />
      </div>
    </div>
  );
}
