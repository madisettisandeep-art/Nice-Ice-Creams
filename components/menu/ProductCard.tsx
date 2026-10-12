"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/db/types";
import { useCart } from "@/components/cart/CartContext";
import { Check, Plus } from "lucide-react";

interface CategoryVisualTheme {
  topBar: string;
  cardBg: string;
  cardBorder: string;
  catPill: string;
  priceBadge: string;
  buttonGradient: string;
  signatureBadge: string;
}

export const CATEGORY_VISUAL_THEMES: Record<string, CategoryVisualTheme> = {
  "classic-flavours": {
    topBar: "bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#F2FBF5]",
    cardBorder: "border-[#A7F3D0]/80 hover:border-[#34D399]",
    catPill: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
    priceBadge: "bg-[#ECFDF5] text-[#047857] border-[#6EE7B7]",
    buttonGradient:
      "bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]",
    signatureBadge: "bg-gradient-to-r from-[#059669] to-[#0D9488]",
  },
  "premium-flavours": {
    topBar: "bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#FFF9EB]",
    cardBorder: "border-[#FDE68A]/90 hover:border-[#F59E0B]",
    catPill: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    priceBadge: "bg-[#FEF3C7] text-[#92400E] border-[#FBBF24]",
    buttonGradient:
      "bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309]",
    signatureBadge: "bg-gradient-to-r from-[#D97706] to-[#EA580C]",
  },
  "chocolate-flavours": {
    topBar: "bg-gradient-to-r from-[#9A3412] via-[#7C2D12] to-[#4E2614]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#FDF5EE]",
    cardBorder: "border-[#E6C7B0]/90 hover:border-[#9A3412]",
    catPill: "bg-[#FDF3EB] text-[#7C2D12] border-[#E6B89C]",
    priceBadge: "bg-[#F5E6D8] text-[#5C2C16] border-[#D7B399]",
    buttonGradient:
      "bg-gradient-to-r from-[#7C2D12] to-[#4E2614] hover:from-[#5C2C16] hover:to-[#3B1806]",
    signatureBadge: "bg-gradient-to-r from-[#7C2D12] to-[#B45309]",
  },
  "fruit-seasonal": {
    topBar: "bg-gradient-to-r from-[#FB923C] via-[#F97316] to-[#E11D48]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#FFF4ED]",
    cardBorder: "border-[#FDBA74]/85 hover:border-[#F97316]",
    catPill: "bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]",
    priceBadge: "bg-[#FFEDD5] text-[#C2410C] border-[#FB923C]",
    buttonGradient:
      "bg-gradient-to-r from-[#F97316] to-[#E11D48] hover:from-[#EA580C] hover:to-[#BE123C]",
    signatureBadge: "bg-gradient-to-r from-[#EA580C] to-[#E11D48]",
  },
  "dessert-inspired": {
    topBar: "bg-gradient-to-r from-[#A855F7] via-[#9333EA] to-[#DB2777]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#FAF2FF]",
    cardBorder: "border-[#E9D5FF]/90 hover:border-[#A855F7]",
    catPill: "bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]",
    priceBadge: "bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]",
    buttonGradient:
      "bg-gradient-to-r from-[#9333EA] to-[#DB2777] hover:from-[#7E22CE] hover:to-[#BE185D]",
    signatureBadge: "bg-gradient-to-r from-[#8E24AA] to-[#DB2777]",
  },
  "specials-signature": {
    topBar: "bg-gradient-to-r from-[#F43F5E] via-[#E11D48] to-[#BE185D]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#FFF0F5]",
    cardBorder: "border-[#FECDD3]/90 hover:border-[#E11D48]",
    catPill: "bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]",
    priceBadge: "bg-[#FFE4E6] text-[#BE123C] border-[#FDA4AF]",
    buttonGradient:
      "bg-gradient-to-r from-[#E11D48] to-[#BE185D] hover:from-[#BE123C] hover:to-[#9D174D]",
    signatureBadge: "bg-gradient-to-r from-[#E11D48] to-[#D97706]",
  },
  "premium-shakes": {
    topBar: "bg-gradient-to-r from-[#06B6D4] via-[#0284C7] to-[#6366F1]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#F0F9FF]",
    cardBorder: "border-[#BAE6FD]/90 hover:border-[#0284C7]",
    catPill: "bg-[#ECFEFF] text-[#0E7490] border-[#A5F3FC]",
    priceBadge: "bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]",
    buttonGradient:
      "bg-gradient-to-r from-[#0284C7] to-[#6366F1] hover:from-[#0369A1] hover:to-[#4F46E5]",
    signatureBadge: "bg-gradient-to-r from-[#0284C7] to-[#7C3AED]",
  },
  "ice-cream-sundaes": {
    topBar: "bg-gradient-to-r from-[#E11D48] via-[#D946EF] to-[#6366F1]",
    cardBg: "bg-gradient-to-b from-white via-white to-[#FFF1F5]",
    cardBorder: "border-[#FBCFE8]/90 hover:border-[#DB2777]",
    catPill: "bg-[#FDF2F8] text-[#BE185D] border-[#FBCFE8]",
    priceBadge: "bg-[#FCE7F3] text-[#9D174D] border-[#F472B6]",
    buttonGradient:
      "bg-gradient-to-r from-[#E11D48] via-[#C026D3] to-[#4F46E5] hover:from-[#BE123C] hover:to-[#4338CA]",
    signatureBadge: "bg-gradient-to-r from-[#E11D48] to-[#7C3AED]",
  },
};

const DEFAULT_THEME = CATEGORY_VISUAL_THEMES["specials-signature"];

export const ProductCard = React.memo(function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { addItem, openProductModal } = useCart();
  const [added, setAdded] = useState(false);

  const theme =
    CATEGORY_VISUAL_THEMES[product.category_slug] || DEFAULT_THEME;

  const defaultVariant =
    product.variants?.find((v) => v.available) || product.variants?.[0];
  const displayPrice = defaultVariant ? defaultVariant.price : product.price;
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1;

  const handleQuickAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!product.availability || !defaultVariant) return;
      addItem(product, defaultVariant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    },
    [addItem, defaultVariant, product]
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
        delay: (index % 4) * 0.055,
      }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`scroll-driven-card group relative flex flex-col rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden`}
    >
      {/* Flavour-Coloured Top Ribbon Bar */}
      <div className={`h-1.5 w-full ${theme.topBar}`} />

      {/* High-Resolution Menu Photograph — Clean 16:10 Frame */}
      <div
        onClick={() => openProductModal(product, false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProductModal(product, false);
          }
        }}
        aria-label={`View details for ${product.name}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-ivory-100 cursor-pointer"
      >
        <img
          src={product.image_url}
          alt={`${product.name} — ${product.category_name} at NICE ICE CREAMS`}
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = "/menu/vanilla.webp?v=4";
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Bottom-Right Seasonal / Signature Badge */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
          {product.seasonal ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-0.5 text-[10px] font-extrabold text-white shadow-md">
              🥭 Seasonal
            </span>
          ) : product.featured ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full ${theme.signatureBadge} px-3 py-0.5 text-[10px] font-extrabold text-white shadow-md`}
            >
              ★ Signature
            </span>
          ) : null}
        </div>

        {!product.availability && (
          <div className="absolute inset-0 bg-cinema-950/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="rounded-full bg-red-600 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info & Quick-Order Controls */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3">
        <div>
          <span
            className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1.5 ${theme.catPill}`}
          >
            {product.category_name}
          </span>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-cinema-900 group-hover:text-[#C2185B] transition-colors leading-snug">
              <Link
                href={`/menu/${product.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  openProductModal(product, false);
                }}
              >
                {product.name}
              </Link>
            </h3>
            <div className="text-right shrink-0">
              <span
                className={`inline-block rounded-xl border px-2.5 py-0.5 text-base sm:text-lg font-black ${theme.priceBadge}`}
              >
                ₹{displayPrice}
              </span>
              {hasMultipleVariants && (
                <span className="block text-[10px] font-semibold text-cinema-800/65 mt-0.5">
                  {product.variants.length} sizes
                </span>
              )}
            </div>
          </div>

          <p className="mt-1.5 text-xs sm:text-sm text-cinema-800/75 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-cinema-900/8">
          <button
            type="button"
            onClick={() => openProductModal(product, false)}
            className="text-xs font-bold text-cinema-800 hover:text-[#C2185B] transition py-2"
          >
            {hasMultipleVariants ? "Choose Size / Details" : "View Details"}
          </button>

          <button
            type="button"
            disabled={!product.availability}
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to order`}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all active:scale-95 ${
              !product.availability
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : added
                ? "bg-emerald-600 scale-105"
                : theme.buttonGradient
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
});
