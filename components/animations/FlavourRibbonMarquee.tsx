"use client";

import React, { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { INITIAL_PRODUCTS } from "@/lib/db/seed-data";
import { Product } from "@/lib/db/types";
import { Pause, Play, Sparkles } from "lucide-react";

const TOP_SLUGS = [
  "brownie-with-ice-cream-sizzler",
  "death-by-chocolate",
  "fruit-salad-with-ice-cream",
  "fresh-sitaphal",
  "badam-milk-with-ice-cream",
  "ferrero-shake",
  "nuts-heaven-sundae",
  "natural-mango",
];

const BOTTOM_SLUGS = [
  "american-beauty-sundae",
  "cassata",
  "gulab-jamoon",
  "belgium-chocolate",
  "oreo-shake",
  "nutty-death-by-chocolate",
  "forest-fruit-sundae",
  "caramel-nuts",
];

const PILL_PALETTES = [
  {
    bg: "bg-gradient-to-r from-[#FFF0F3] to-[#FFE4EA]",
    border: "border-[#F9A8B8]/70",
    priceText: "text-[#C2185B]",
    hover: "hover:from-[#E84A6F] hover:to-[#C2185B] hover:text-white",
  },
  {
    bg: "bg-gradient-to-r from-[#FFF8E7] to-[#FFECB8]",
    border: "border-[#F5A623]/60",
    priceText: "text-[#B45309]",
    hover: "hover:from-[#F59E0B] hover:to-[#D97706] hover:text-white",
  },
  {
    bg: "bg-gradient-to-r from-[#F1F9EE] to-[#DCFCE7]",
    border: "border-[#7BB661]/60",
    priceText: "text-[#15803D]",
    hover: "hover:from-[#2E7D32] hover:to-[#15803D] hover:text-white",
  },
  {
    bg: "bg-gradient-to-r from-[#F8F0FF] to-[#EDE9FE]",
    border: "border-[#C4B5FD]/70",
    priceText: "text-[#6D28D9]",
    hover: "hover:from-[#7C3AED] hover:to-[#5B21B6] hover:text-white",
  },
  {
    bg: "bg-gradient-to-r from-[#FDF3EB] to-[#FDE6D2]",
    border: "border-[#E6B89C]/70",
    priceText: "text-[#7C2D12]",
    hover: "hover:from-[#7C2D12] hover:to-[#4E2614] hover:text-white",
  },
  {
    bg: "bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]",
    border: "border-[#93C5FD]/70",
    priceText: "text-[#0064B5]",
    hover: "hover:from-[#0064B5] hover:to-[#1E3A8A] hover:text-white",
  },
];

const productBySlug = new Map<string, Product>(
  INITIAL_PRODUCTS.map((p) => [p.slug, p])
);

const TOP_RIBBON_PRODUCTS = TOP_SLUGS.map((s) => productBySlug.get(s)).filter(
  (p): p is Product => Boolean(p)
);

const BOTTOM_RIBBON_PRODUCTS = BOTTOM_SLUGS.map((s) =>
  productBySlug.get(s)
).filter((p): p is Product => Boolean(p));

export const FlavourRibbonMarquee = React.memo(function FlavourRibbonMarquee() {
  const [paused, setPaused] = useState(false);
  const { openProductModal } = useCart();

  const topDoubled = [...TOP_RIBBON_PRODUCTS, ...TOP_RIBBON_PRODUCTS];
  const bottomDoubled = [...BOTTOM_RIBBON_PRODUCTS, ...BOTTOM_RIBBON_PRODUCTS];

  return (
    <section
      aria-label="Sliding Signature Flavour Ribbon"
      className={`marquee-container relative overflow-hidden bg-gradient-to-r from-[#FFF0F5] via-[#FFF9EC] to-[#F0F9FF] border-b border-[#F3D9DF] py-7 select-none ${
        paused ? "marquee-paused" : ""
      }`}
    >
      {/* Left and Right Edge Soft Gradient Masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#FFF0F5] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#F0F9FF] to-transparent"
      />

      {/* Accessible Pause/Play Motion Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3.5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-sm border border-rose-200 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C2185B] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          <span>Live Sliding Flavour Showcase • Est. 1986</span>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={
            paused
              ? "Resume sliding flavour ribbon"
              : "Pause sliding flavour ribbon"
          }
          className="relative z-20 inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-[#C2185B] hover:text-white text-cinema-800 border border-rose-200 px-3.5 py-1 text-[11px] font-bold shadow-sm transition"
        >
          {paused ? (
            <>
              <Play className="w-3 h-3" aria-hidden="true" />
              <span>Play Slide</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" aria-hidden="true" />
              <span>Pause Slide</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Track 1: Slides Smoothly Left */}
        <div className="flex w-max animate-marquee-left gap-3.5 px-2">
          {topDoubled.map((item, idx) => {
            const palette = PILL_PALETTES[idx % PILL_PALETTES.length];
            return (
              <button
                key={`top-${item.slug}-${idx}`}
                type="button"
                onClick={() => openProductModal(item, false)}
                className={`group flex items-center gap-3 rounded-full ${palette.bg} ${palette.border} ${palette.hover} text-cinema-900 border pl-2 pr-4 py-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-left`}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  width={44}
                  height={44}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = "/menu/vanilla.webp?v=4";
                  }}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0 group-hover:scale-105 transition-transform bg-ivory-100"
                />
                <div className="leading-tight">
                  <div className="text-xs font-extrabold whitespace-nowrap">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-semibold text-cinema-800/75 group-hover:text-white/95 whitespace-nowrap">
                    {item.category_name} •{" "}
                    <span
                      className={`font-black ${palette.priceText} group-hover:text-amber-200`}
                    >
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Track 2: Slides Smoothly Right */}
        <div className="flex w-max animate-marquee-right gap-3.5 px-2">
          {bottomDoubled.map((item, idx) => {
            const palette = PILL_PALETTES[(idx + 3) % PILL_PALETTES.length];
            return (
              <button
                key={`bottom-${item.slug}-${idx}`}
                type="button"
                onClick={() => openProductModal(item, false)}
                className={`group flex items-center gap-3 rounded-full ${palette.bg} ${palette.border} ${palette.hover} text-cinema-900 border pl-2 pr-4 py-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-left`}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  width={44}
                  height={44}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = "/menu/vanilla.webp?v=4";
                  }}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0 group-hover:scale-105 transition-transform bg-ivory-100"
                />
                <div className="leading-tight">
                  <div className="text-xs font-extrabold whitespace-nowrap">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-semibold text-cinema-800/75 group-hover:text-white/95 whitespace-nowrap">
                    {item.category_name} •{" "}
                    <span
                      className={`font-black ${palette.priceText} group-hover:text-amber-200`}
                    >
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});
